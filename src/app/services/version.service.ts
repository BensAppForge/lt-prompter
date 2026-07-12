import { Injectable, signal } from '@angular/core';
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
    {
      id: 17,
      versionNumber: '1.5.2',
      releaseDate: new Date('2026-05-07'),
      shortDescription: 'Darstellungsfehler bei Quellen-Symbolen behoben',
      longDescription: `
        • Symbole der Quellenauswahl (Bild, PDF, Word) werden nicht mehr abgeschnitten dargestellt
      `.trim(),
    },
    {
      id: 18,
      versionNumber: '1.5.3',
      releaseDate: new Date('2026-07-10'),
      shortDescription: 'Fehlerbehebungen bei Prompt-Erzeugung und Bibliothek',
      longDescription: `
        • Korrektur-Prompts enthalten jetzt das CEFR-Niveau auch im Abschnitt zur Korrekturstrenge (vorher stand dort ein Platzhalter)
        • Nach dem Bearbeiten eines Prompts zeigt "Prompt generieren" wieder den neu erzeugten Prompt statt der alten bearbeiteten Fassung
        • "Kopieren" und "In Bibliothek speichern" übernehmen im Bearbeitungsmodus jetzt den aktuellen Textstand
        • Vokabelübung: Nach dem Speichern in der Bibliothek kann ein neu generierter Prompt wieder gespeichert werden
        • Vokabelübung: Bei mehreren Übungstypen werden die angekündigten Anweisungen pro Übungstyp jetzt tatsächlich ausgegeben
        • Textverständnis: Hinweis "mindestens 2 Übungstypen" wird jetzt korrekt angezeigt
        • Bibliothek: Filter um Kategorie "Korrektur" sowie Niveaus C1+ und C2 ergänzt; Tooltips der Aktions-Buttons funktionieren wieder
      `.trim(),
    },
    {
      id: 19,
      versionNumber: '1.6.0',
      releaseDate: new Date('2026-07-10'),
      shortDescription:
        'Aufgabenanzahl pro Übungstyp und schriftliches Feedback bei Korrektur',
      longDescription: `
        • Vokabeln & Textverständnis: Neue optionale Einstellung, um die Anzahl der Aufgaben pro ausgewähltem Übungstyp per Schieberegler festzulegen (z.B. 4 Richtig-Falsch-Aussagen, 6 Multiple-Choice-Fragen)
        • Vokabeln: Bei manueller Eingabe richtet sich die Anzahl bei Lückentext, Zuordnung und Kategorisierung weiterhin nach der Wortliste; im Datei-Modus bestimmt der Regler, wie viele Wörter die KI aus dem Anhang verwendet
        • Korrektur: Neue Option für schriftliches Feedback zu Struktur und Inhalt – in der Zielsprache, an das CEFR-Niveau angepasst
        • Korrektur: Optional können Bewertungskriterien oder eine Musterlösung als Anhang (Screenshot, TXT, Word, PDF) angekündigt werden; das Feedback stützt sich dann auf diese Kriterien
      `.trim(),
    },
    {
      id: 20,
      versionNumber: '1.6.1',
      releaseDate: new Date('2026-07-10'),
      shortDescription: 'Hilfeseite aktualisiert',
      longDescription: `
        • Hilfe: Abschnitt zur Korrektur-Funktion ergänzt, inklusive schriftlichem Feedback und Kriterien-Anhang
        • Hilfe: Beschreibung von Textverständnis korrigiert (Richtig/Falsch, Multiple-Choice, Zuordnung, Lückentext-Zusammenfassung) und die neue Aufgabenanzahl-Option dokumentiert
        • Hilfe: Datei-Modus der Vokabelübung dokumentiert
      `.trim(),
    },
    {
      id: 21,
      versionNumber: '1.6.2',
      releaseDate: new Date('2026-07-10'),
      shortDescription:
        'Sprachliche Prompt-Korrekturen, bessere Bedienbarkeit, Aufräumarbeiten',
      longDescription: `
        • Prompts: Zahlreiche sprachliche Korrekturen in allen vier Zielsprachen – Artikel (z.B. "dell'italiano", "del español"), einheitliche Anrede, Tippfehler und vereinheitlichte Regeln (max. ein Loch pro Satz bei Lückentext-Zusammenfassungen)
        • Prompts: Übungstyp-Namen erscheinen als natürliche Begriffe statt technischer Kürzel; Wortfeld-Tabellen haben jetzt eine eindeutige Spaltenstruktur
        • Vokabeln: Die Dialogform gilt bei mehreren Übungstypen nur noch für den Lückentext
        • Design "Systemeinstellung" reagiert sofort auf Änderungen des Betriebssystem-Designs
        • Dashboard ist vollständig per Tastatur bedienbar
        • Grammatik: Enter im Phänomen-Feld fügt das Phänomen hinzu, statt das Formular abzusenden
        • Intern: Nicht genutzte Datenbank-Stores, Dienste und toter Code entfernt
      `.trim(),
    },
    {
      id: 22,
      versionNumber: '1.6.3',
      releaseDate: new Date('2026-07-12'),
      shortDescription: 'Einheitliche Sprachnamen in allen Auswahlfeldern',
      longDescription: `
        • Zielsprachen erscheinen jetzt überall einheitlich als "English, Español, Français, Italiano" – in allen Übungseditoren sowie im Filter und auf den Karten der Bibliothek
      `.trim(),
    },
    {
      id: 23,
      versionNumber: '1.6.4',
      releaseDate: new Date('2026-07-12'),
      shortDescription: 'Aufgeräumte Update-Benachrichtigungen',
      longDescription: `
        • Bei einem Update erscheint nur noch eine Benachrichtigung statt bis zu drei – im einheitlichen Standard-Design (dunkler Hintergrund, magenta Aktion)
        • Nach der Aktualisierung heißt es korrekt "Aktualisiert auf Version X" mit der Aktion "Was ist neu?", die zum Änderungsprotokoll führt
        • Neue Nutzerinnen und Nutzer erhalten beim ersten Besuch keine irreführende Update-Meldung mehr
      `.trim(),
    },
    {
      id: 24,
      versionNumber: '1.6.5',
      releaseDate: new Date('2026-07-12'),
      shortDescription: 'Gewichtung der Übungstypen auf einen Blick',
      longDescription: `
        • Textverständnis: Unter den Aufgabenanzahl-Reglern zeigt eine Zusammenfassung jetzt die Gesamtzahl und das prozentuale Verhältnis der Übungstypen (z.B. "Gesamt: 8 Aufgaben · Verhältnis 25 % : 75 %")
        • Textverständnis & Vokabeln: Neuer Hinweis, dass KI-Modelle sich in der Regel, aber nicht garantiert, exakt an die Anzahl-Vorgaben halten
      `.trim(),
    },
  ];

  constructor() {
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
      // First time user or invalid stored version — store silently, no notice
      localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
    } else if (storedVersionData.id !== latestVersion.id) {
      if (storedVersionData.id > latestVersion.id) {
        // Rollback case: just realign the stored version
        localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
      } else {
        // App was updated since the last visit: let the
        // VersionNotificationComponent point to the changelog
        this.announceUpdate(latestVersion.versionNumber);
        localStorage.setItem(this.VERSION_KEY, latestVersion.versionNumber);
      }
    }
  }

  private announceUpdate(versionNumber: string): void {
    this.hasUpdate.set(true);
    this.updateMessage.set(`Aktualisiert auf Version ${versionNumber}`);
  }

  getAllVersions(): Version[] {
    return [...this.LATEST_VERSIONS].sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }
}
