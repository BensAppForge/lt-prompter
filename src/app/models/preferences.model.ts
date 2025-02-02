export interface Preferences {
  id?: number;
  language: Language;
  level: CEFRLevel;
  theme: 'light' | 'dark';
  lastExerciseType?: ExerciseType;
}

export type CEFRLevel =
  | 'A1'
  | 'A1+'
  | 'A2'
  | 'A2+'
  | 'B1'
  | 'B1+'
  | 'B2'
  | 'B2+'
  | 'C1'
  | 'C1+'
  | 'C2';

export type Language =
  | 'Deutsch'
  | 'English'
  | 'Español'
  | 'Français'
  | 'Italiano';

export type ExerciseCategory =
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'reading';

export type VocabularyExerciseType =
  | 'gap-filling'
  | 'matching'
  | 'multiple-choice';

export type ExerciseType = VocabularyExerciseType; // Will be extended with other exercise types
