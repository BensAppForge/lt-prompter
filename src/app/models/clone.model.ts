import { Language, CEFRLevel } from './preferences.model';

export type CloneSourceType = 'screenshot' | 'docx' | 'pdf' | 'copied-text';

export interface ClonePromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  sourceType: CloneSourceType;
  situationalContext?: string;
  isDialog?: boolean;
}
