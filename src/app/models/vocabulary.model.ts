import { CEFRLevel, Language } from './preferences.model';

export type VocabularyExerciseType =
  | 'gap-filling'
  | 'matching'
  | 'multiple-choice'
  | 'word-formation'
  | 'categorization'
  | 'odd-one-out';

export const VOCABULARY_EXERCISE_TYPES: {
  value: VocabularyExerciseType;
  label: string;
  description: string;
  supportsContext: boolean;
  supportsDialog: boolean;
  /** True when the item count is determined by the word list in manual mode
   * (e.g. one gap per word) — no count slider is offered there. */
  countBoundToWords: boolean;
}[] = [
  {
    value: 'gap-filling',
    label: 'Lückentext',
    description: 'Text mit Lücken, die mit den vorgegebenen Wörtern gefüllt werden',
    supportsContext: true,
    supportsDialog: true,
    countBoundToWords: true,
  },
  {
    value: 'matching',
    label: 'Zuordnung',
    description: 'Wörter mit Definitionen, Synonymen oder Übersetzungen verbinden',
    supportsContext: false,
    supportsDialog: false,
    countBoundToWords: true,
  },
  {
    value: 'multiple-choice',
    label: 'Multiple Choice',
    description: 'Das richtige Wort aus mehreren Optionen auswählen',
    supportsContext: true,
    supportsDialog: false,
    countBoundToWords: false,
  },
  {
    value: 'word-formation',
    label: 'Wortbildung',
    description: 'Wörter in andere Wortarten umwandeln (z.B. Verb → Nomen)',
    supportsContext: true,
    supportsDialog: false,
    countBoundToWords: false,
  },
  {
    value: 'categorization',
    label: 'Kategorisierung',
    description: 'Wörter in thematische Kategorien einordnen',
    supportsContext: false,
    supportsDialog: false,
    countBoundToWords: true,
  },
  {
    value: 'odd-one-out',
    label: 'Welches Wort passt nicht?',
    description: 'Das Wort identifizieren, das nicht zur Gruppe gehört',
    supportsContext: false,
    supportsDialog: false,
    countBoundToWords: false,
  },
];

export interface VocabularyWord {
  word: string;
}

export type VocabularyInputMode = 'manual' | 'file';

export type VocabularySourceType = 'image' | 'pdf' | 'docx';

export const VOCABULARY_SOURCE_TYPES: {
  value: VocabularySourceType;
  label: string;
  description: string;
}[] = [
  {
    value: 'image',
    label: 'Screenshot / Bild',
    description: 'Sie hängen das Bild im KI-Tool an die Nachricht an',
  },
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Sie hängen die PDF-Datei im KI-Tool an die Nachricht an',
  },
  {
    value: 'docx',
    label: 'Word-Dokument',
    description: 'Sie hängen das Word-Dokument im KI-Tool an die Nachricht an',
  },
];

export interface VocabularyPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  numberOfWords: number;
  exerciseTypes: VocabularyExerciseType[];
  wordList: VocabularyWord[];
  situationalContext?: string;
  isDialog?: boolean;
  inputMode?: VocabularyInputMode;
  sourceType?: VocabularySourceType;
  /** Optional per-exercise-type item counts; only present for types the user
   * explicitly set via the count sliders. */
  itemCounts?: Partial<Record<VocabularyExerciseType, number>>;
}
