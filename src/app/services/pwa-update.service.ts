import { Injectable, DestroyRef, inject, ApplicationRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, first, interval, concat } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaUpdateService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly swUpdate = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);
  private readonly appRef = inject(ApplicationRef);

  /**
   * Initialisiert die PWA-Update-Überwachung.
   * Sollte einmal beim App-Start aufgerufen werden.
   */
  initialize(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker ist nicht aktiviert');
      return;
    }

    this.listenForUpdates();
    this.scheduleUpdateChecks();
  }

  /**
   * Überwacht verfügbare Updates und benachrichtigt den Benutzer.
   */
  private listenForUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        console.log('Neue Version verfügbar:', event.latestVersion);
        this.promptUserToUpdate();
      });

    // Behandle unrecoverable states (z.B. nach fehlgeschlagenen Updates)
    this.swUpdate.unrecoverable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      console.error('Service Worker unrecoverable state:', event.reason);
      this.showUnrecoverableMessage();
    });
  }

  /**
   * Plant regelmäßige Update-Checks.
   * Wartet bis die App stabil ist, dann prüft alle 30 Minuten.
   */
  private scheduleUpdateChecks(): void {
    // Warte bis die App stabil ist, dann prüfe regelmäßig
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable));
    const everyThirtyMinutes$ = interval(30 * 60 * 1000);

    concat(appIsStable$, everyThirtyMinutes$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.checkForUpdate();
    });
  }

  /**
   * Prüft manuell auf verfügbare Updates.
   */
  async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      return false;
    }

    try {
      const updateFound = await this.swUpdate.checkForUpdate();
      console.log('Update-Check durchgeführt, Update gefunden:', updateFound);
      return updateFound;
    } catch (error) {
      console.error('Fehler beim Update-Check:', error);
      return false;
    }
  }

  /**
   * Zeigt dem Benutzer eine Benachrichtigung über das verfügbare Update.
   */
  private promptUserToUpdate(): void {
    const snackBarRef = this.snackBar.open(
      'Eine neue Version der App ist verfügbar!',
      'Jetzt aktualisieren',
      {
        duration: 0, // Bleibt offen bis der Benutzer reagiert
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['pwa-update-snackbar'],
      }
    );

    snackBarRef.onAction().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.activateUpdate();
    });
  }

  /**
   * Aktiviert das Update und lädt die Seite neu.
   */
  async activateUpdate(): Promise<void> {
    try {
      await this.swUpdate.activateUpdate();
      // Seite neu laden um die neue Version zu aktivieren
      document.location.reload();
    } catch (error) {
      console.error('Fehler beim Aktivieren des Updates:', error);
      // Fallback: Seite trotzdem neu laden
      document.location.reload();
    }
  }

  /**
   * Zeigt eine Nachricht wenn der Service Worker in einem nicht wiederherstellbaren Zustand ist.
   */
  private showUnrecoverableMessage(): void {
    const snackBarRef = this.snackBar.open(
      'Die App konnte nicht aktualisiert werden. Bitte Seite neu laden.',
      'Neu laden',
      {
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );

    snackBarRef.onAction().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      document.location.reload();
    });
  }
}
