import { Language, CEFRLevel } from './preferences.model';

export interface GrammarPhenomenon {
  description: string;
  hint?: string;
}

export interface GrammarPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  phenomena: GrammarPhenomenon[];
  situationalContext?: string;
  situationalContextIsDialog?: boolean;
}
