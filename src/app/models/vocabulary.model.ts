import { CEFRLevel } from './preferences.model';

export type Language = 'English' | 'Français' | 'Español' | 'Italiano';
export type CefrLevel = CEFRLevel;

export interface VocabularyWord {
  word: string;
}

export interface VocabularyPromptConfig {
  targetLanguage: Language;
  cefr: CefrLevel;
  words?: VocabularyWord[];
  situationalContext?: string;
  situationalContextIsDialog?: boolean;
}
