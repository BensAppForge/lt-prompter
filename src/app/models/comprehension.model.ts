import { Language, CEFRLevel } from './preferences.model';

export type ComprehensionExerciseType =
  | 'true-false'
  | 'multiple-choice'
  | 'matching'
  | 'gapped-summary';

export type ComprehensionSourceType =
  | 'screenshot'
  | 'docx'
  | 'pdf'
  | 'copied-text';

export const COMPREHENSION_EXERCISE_TYPES: ComprehensionExerciseType[] = [
  'true-false',
  'multiple-choice',
  'matching',
  'gapped-summary'
];

export const SOURCE_TYPES: ComprehensionSourceType[] = [
  'screenshot',
  'docx',
  'pdf',
  'copied-text'
];

export interface ComprehensionPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  exercises: ComprehensionExerciseType[];
  sourceType: ComprehensionSourceType;
  situationalContext?: string;
  isDialog?: boolean;
}
