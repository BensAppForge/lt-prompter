import { Language, CEFRLevel } from './preferences.model';

export type PromptCategory =
  | 'vocabulary'
  | 'grammar'
  | 'comprehension'
  | 'clone'
  | 'wordfield';

export interface LibraryPrompt {
  id: string;
  name: string;
  description?: string;
  category: PromptCategory;
  targetLanguage: Language;
  cefr: CEFRLevel;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date;
  tags?: string[];
}
