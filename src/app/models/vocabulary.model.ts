import { CEFRLevel, Language } from './preferences.model';

export type CefrLevel = CEFRLevel;

export interface VocabularyWord {
  word: string;
}

export interface VocabularyPromptConfig {
  targetLanguage: Language;
  cefr: CefrLevel;
  numberOfWords: number;
  exerciseType: string;
  wordList: VocabularyWord[];
  situationalContext?: string;
  isDialog?: boolean;
}
