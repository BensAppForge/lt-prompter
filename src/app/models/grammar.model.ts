import { Language, CefrLevel } from './vocabulary.model';

export interface GrammarPhenomenon {
  description: string;
  hint?: string;
}

export interface GrammarPromptConfig {
  targetLanguage: Language;
  cefr: CefrLevel;
  phenomena: GrammarPhenomenon[];
  situationalContext?: string;
  situationalContextIsDialog?: boolean;
}
