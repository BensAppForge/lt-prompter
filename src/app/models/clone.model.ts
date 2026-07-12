import { Language, CEFRLevel } from './preferences.model';

export type CloneSourceType = 'screenshot' | 'docx' | 'pdf' | 'copied-text';

export interface ClonePromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  sourceType: CloneSourceType;
  situationalContext?: string;
  isDialog?: boolean;
  /** Exact number of items for the new exercise; unset = same length as source. */
  itemCount?: number;
}
