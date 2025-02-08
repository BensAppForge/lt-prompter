import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Version } from '../models/version.model';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly VERSION_KEY = 'lt-prompter-version';
  readonly currentVersion = signal<Version | undefined>(undefined);
  readonly hasUpdate = signal(false);
  readonly updateMessage = signal('');

  private readonly LATEST_VERSIONS: Version[] = [
    {
      id: 1,
      versionNumber: '0.5.0 - beta',
      releaseDate: new Date('2025-01-30'),
      shortDescription: 'Erste Version',
      longDescription: `
        • Erste Version der Anwendung
        • Grundlegende Funktionalität implementiert
      `.trim(),
    },
    {
      id: 2,
      versionNumber: '0.6.0 - beta',
      releaseDate: new Date('2025-01-31'),
      shortDescription: 'Updateinfo und Versionslog',
      longDescription: `
        • Benachrichtigung über neue Versionen
        • Versionshistorie hinzugefügt
        • Verbesserungen der Benutzeroberfläche
      `.trim(),
    },
    // {
    //   id: 3,
    //   versionNumber: '0.7.0 - beta',
    //   releaseDate: new Date('2025-02-08'),
    //   shortDescription: 'Fehlerbehebung, Neue Features',
    //   longDescription: `
    //     • Fehler bei der Rechtschreibprüfung in Eingabefeldern
    //     • Informationen zu Datenschutz und Impressum hinzugefügt
    //     • Verbesserungen der Benutzeroberfläche: Light- und Darkmode Schalter
    //   `.trim(),
    // },
  ];

  constructor(private snackBar: MatSnackBar) {
    this.initializeVersion();
  }

  private initializeVersion(): void {
    const latestVersion = this.LATEST_VERSIONS[this.LATEST_VERSIONS.length - 1];
    this.currentVersion.set(latestVersion);

    const storedVersion = localStorage.getItem(this.VERSION_KEY);

    if (!storedVersion) {
      // First time user
      this.showUpdateNotification();
      localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
    } else if (storedVersion !== latestVersion.versionNumber) {
      // User has an older version
      this.showUpdateNotification();
      localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
    }
  }

  private showUpdateNotification(): void {
    this.hasUpdate.set(true);
    const latestVersion = this.LATEST_VERSIONS[this.LATEST_VERSIONS.length - 1];
    this.updateMessage.set(
      `Eine neue Version ist verfügbar: ${latestVersion.versionNumber}`
    );
    setTimeout(() => {
      this.snackBar.open(this.updateMessage(), 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
  }

  getAllVersions(): Version[] {
    return [...this.LATEST_VERSIONS].sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }
}
