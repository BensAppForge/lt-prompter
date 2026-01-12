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
}[] = [
  {
    value: 'gap-filling',
    label: 'Lückentext',
    description: 'Text mit Lücken, die mit den vorgegebenen Wörtern gefüllt werden',
    supportsContext: true,
    supportsDialog: true,
  },
  {
    value: 'matching',
    label: 'Zuordnung',
    description: 'Wörter mit Definitionen, Synonymen oder Übersetzungen verbinden',
    supportsContext: false,
    supportsDialog: false,
  },
  {
    value: 'multiple-choice',
    label: 'Multiple Choice',
    description: 'Das richtige Wort aus mehreren Optionen auswählen',
    supportsContext: true,
    supportsDialog: false,
  },
  {
    value: 'word-formation',
    label: 'Wortbildung',
    description: 'Wörter in andere Wortarten umwandeln (z.B. Verb → Nomen)',
    supportsContext: true,
    supportsDialog: false,
  },
  {
    value: 'categorization',
    label: 'Kategorisierung',
    description: 'Wörter in thematische Kategorien einordnen',
    supportsContext: false,
    supportsDialog: false,
  },
  {
    value: 'odd-one-out',
    label: 'Welches Wort passt nicht?',
    description: 'Das Wort identifizieren, das nicht zur Gruppe gehört',
    supportsContext: false,
    supportsDialog: false,
  },
];

export interface VocabularyWord {
  word: string;
}

export interface VocabularyPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  numberOfWords: number;
  exerciseTypes: VocabularyExerciseType[];
  wordList: VocabularyWord[];
  situationalContext?: string;
  isDialog?: boolean;
}
