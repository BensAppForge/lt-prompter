import { Language, CEFRLevel } from './preferences.model';

export type KorrekturSourceType = 'screenshot' | 'pdf' | 'copied-text';

export interface KorrekturPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  sourceType: KorrekturSourceType;
}
