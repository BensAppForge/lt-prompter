import { Language, CEFRLevel } from './preferences.model';

export type WordfieldSourceType = 'image' | 'docx' | 'pdf' | 'copied-text';

export const WORDFIELD_SOURCE_TYPES: WordfieldSourceType[] = [
  'image',
  'docx',
  'pdf',
  'copied-text',
];
export type WordfieldOutputType = 'table' | 'markdown';

export const WORDFIELD_OUTPUT_TYPES: WordfieldOutputType[] = [
  'table',
  'markdown',
];

export interface WordfieldPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  sourceType: WordfieldSourceType;
  outputType: WordfieldOutputType;
  /** Exact number of entries for the word field; unset = AI decides. */
  wordCount?: number;
}
