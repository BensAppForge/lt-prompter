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
    {
      id: 3,
      versionNumber: '0.7.0 - beta',
      releaseDate: new Date('2025-02-08'),
      shortDescription: 'Fehlerbehebung, Neue Features',
      longDescription: `
        • Neuer Editor zum Klonen bestehender Übungen
        • Fehlerbehebung bei der Rechtschreibprüfung in Eingabefeldern
        • Informationen zu Datenschutz und Impressum hinzugefügt
        • App icon hinzugefügt
        • Verbesserungen der Benutzeroberfläche: Light- und Darkmode Schalter
      `.trim(),
    },
    {
      id: 4,
      versionNumber: '0.7.1 - beta',
      releaseDate: new Date('2025-02-09'),
      shortDescription: 'Detailanpassungen',
      longDescription: `
        • Verbesserungen der Requirements für Prompts zum Klonen
      `.trim(),
    },
    {
      id: 5,
      versionNumber: '0.7.2 - beta',
      releaseDate: new Date('2025-02-22'),
      shortDescription: 'Fehlerbehebungen bei Prompts und UI',
      longDescription: `
        • Angabe der Textquellen wird nun in der Zielsprache angezeigt
        • Verbesserung der Benutzeroberfläche für mobile Geräte
      `.trim(),
    },
    {
      id: 6,
      versionNumber: '0.8 - beta',
      releaseDate: new Date('2025-02-23'),
      shortDescription: 'Bildschirm für Einstellungen und UI Verbesserungen',
      longDescription: `
        •Bildschirm für Einstellungen hinzugefügt
        • Verbesserung der Benutzeroberfläche für hell und dunkel Modus
      `.trim(),
    },
    {
      id: 7,
      versionNumber: '0.9 - beta',
      releaseDate: new Date('2025-02-24'),
      shortDescription: 'Wortfelder und Verbesserungen',
      longDescription: `
        • Neuer Promptgenerator für Wortfelder
        • Diverse Verbesserungen der Benutzeroberfläche
      `.trim(),
    },
    {
      id: 8,
      versionNumber: '1.0.0',
      releaseDate: new Date('2025-03-10'),
      shortDescription:
        'Fehlerbehebungen und Verbesserungen in der Nutzeroberfläche',
      longDescription: `
        • Erster Release
        • Fehlerbehebungen bei Hell- und Dunkelmodus
        • Kleinere Fehler bei der Prompterzeugung behoben
      `.trim(),
    },
    {
      id: 9,
      versionNumber: '1.0.1',
      releaseDate: new Date('2025-03-14'),
      shortDescription: 'Fehlerbehebungen in der Nutzeroberfläche',
      longDescription: `
        • Darstellung der Icons korrigiert
        • Fehlerbehebungen bei Hell- und Dunkelmodus
        • Kleinere Fehler bei der Prompterzeugung behoben
        • Bessere Anzeige des Prompts auf mobilen Geräten
      `.trim(),
    },
    {
      id: 10,
      versionNumber: '1.1.0',
      releaseDate: new Date('2025-03-24'),
      shortDescription: 'Neue Features und Verbesserungen',
      longDescription: `
        • Erzeugte Prompts können nun direkt im Editor bearbeitet werden
        • Prompts können in einer Bibliothek gespeichert und wiederverwendet werden
      `.trim(),
    },
    {
      id: 11,
      versionNumber: '1.2.0',
      releaseDate: new Date('2025-12-09'),
      shortDescription: 'Neuer Korrektur-Promptgenerator',
      longDescription: `
        • Neuer Promptgenerator für Textkorrektur mit Gemini Canvas
        • Visualisierung von Sprachfehlern (rot = Streichung, grün = Korrektur)
        • Kategorisierung nach Fehlertyp (Rechtschreibung, Grammatik, Vokabular, Zeichensetzung)
        • Anpassbare Korrekturstrenge basierend auf CEFR-Niveau
        • Druckoptimierte Ausgabe mit A4-Layout
        • Umschaltbare Ansicht: inline oder nebeneinander
      `.trim(),
    },
    {
      id: 12,
      versionNumber: '1.3.0',
      releaseDate: new Date('2025-12-10'),
      shortDescription: 'Verschiedene Vokabelübungstypen',
      longDescription: `
        • Neue Übungstypen für Vokabelübungen: Lückentext, Zuordnung, Multiple Choice, Wortbildung, Kategorisierung, Welches Wort passt nicht?
        • Kontextfeld wird nur bei passenden Übungstypen angezeigt
        • Dialogoption nur für Lückentext-Übungen verfügbar
        • Verbesserte Benutzerführung durch dynamische Beschreibungen
      `.trim(),
    },
    {
      id: 13,
      versionNumber: '1.3.1',
      releaseDate: new Date('2026-02-23'),
      shortDescription: 'Fehlerbehebung bei Übersetzungen in Vokabelübungen',
      longDescription: `
        • Fehlerbehebung: Deutsche Übungstyp-Bezeichnungen (z.B. "Lückentext", "Zuordnung") wurden in fremdsprachige Prompts eingefügt
        • Übungstyp-Bezeichnungen werden nun korrekt in der jeweiligen Zielsprache angezeigt
      `.trim(),
    },
    {
      id: 14,
      versionNumber: '1.4.0',
      releaseDate: new Date('2026-03-31'),
      shortDescription: 'Codequalität und Modernisierung',
      longDescription: `
        • Migration auf Angular 18 Built-in Control Flow (@if, @for)
        • OnPush Change Detection für alle Komponenten
        • Einheitliches Formular-Erscheinungsbild (Outline)
        • Verbesserte Zwischenablage-Funktionalität
        • Bereinigung ungenutzter Importe und toter Code
        • Fehlerbehebungen bei CSS-Variablen und Barrierefreiheit
      `.trim(),
    },
    {
      id: 15,
      versionNumber: '1.5.0',
      releaseDate: new Date('2026-05-04'),
      shortDescription: 'Vokabeln aus Datei extrahieren',
      longDescription: `
        • Vokabelübungen können nun auch aus einer Datei generiert werden
        • Unterstützte Formate: Screenshot/Bild, PDF, Word-Dokument
        • Text aus PDF und Word-Dokumenten wird direkt im Browser extrahiert und in den Prompt eingebettet
        • Bei Bildern wird die KI angewiesen, die Wörter aus dem angehängten Bild zu extrahieren
        • Neuer Umschalter zwischen manueller Eingabe und Datei-Upload
      `.trim(),
    },
    {
      id: 16,
      versionNumber: '1.5.1',
      releaseDate: new Date('2026-05-05'),
      shortDescription: 'Vokabeln aus Datei: vereinfachter Ablauf',
      longDescription: `
        • Datei-Upload in der App entfernt – die Datei wird wie bei den anderen Editoren direkt im KI-Tool an die Nachricht angehängt
        • Auswahl der Quelle (Screenshot, PDF, Word-Dokument) genügt; der generierte Prompt weist die KI an, die Vokabeln aus der angehängten Datei zu extrahieren
        • Schlankere App ohne lokale PDF-/DOCX-Textextraktion
      `.trim(),
    },
  ];

  constructor(private snackBar: MatSnackBar) {
    this.initializeVersion();
  }

  private initializeVersion(): void {
    const latestVersion = this.LATEST_VERSIONS[this.LATEST_VERSIONS.length - 1];
    this.currentVersion.set(latestVersion);

    const storedVersion = localStorage.getItem(this.VERSION_KEY);
    const storedVersionData = this.LATEST_VERSIONS.find(
      (v) => v.versionNumber === storedVersion
    );

    if (!storedVersion || !storedVersionData) {
      // First time user or invalid stored version
      this.showUpdateNotification();
      localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
    } else {
      // Compare version IDs instead of strings
      if (storedVersionData.id !== latestVersion.id) {
        // Clear stored version if it's higher than latest (rollback case)
        if (storedVersionData.id > latestVersion.id) {
          localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
        } else {
          // Normal update case
          this.showUpdateNotification();
          localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
        }
      }
    }
  }

  private showUpdateNotification(): void {
    try {
      this.hasUpdate.set(true);
      const latestVersion =
        this.LATEST_VERSIONS[this.LATEST_VERSIONS.length - 1];
      if (!latestVersion) return;

      const message = `Eine neue Version ist verfügbar: ${latestVersion.versionNumber}`;
      this.updateMessage.set(message);

      // Wrap in try-catch to handle any timing issues
      setTimeout(() => {
        try {
          this.snackBar.open(message, 'OK', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } catch (error) {
          console.error('Error showing snackbar:', error);
        }
      });
    } catch (error) {
      console.error('Error in showUpdateNotification:', error);
    }
  }

  getAllVersions(): Version[] {
    return [...this.LATEST_VERSIONS].sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }
}
