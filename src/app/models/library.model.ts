import { Language, CEFRLevel } from './preferences.model';

export type PromptCategory =
  | 'vocabulary'
  | 'grammar'
  | 'comprehension'
  | 'clone'
  | 'wordfield'
  | 'korrektur'
  | 'persona';

/** Each category's editor route — the only routes an `EditorConfig` may
 * point to. */
export const EDITOR_ROUTES: Readonly<Record<PromptCategory, string>> = {
  vocabulary: '/vocabulary',
  grammar: '/grammar',
  comprehension: '/comprehension',
  clone: '/clone',
  wordfield: '/wordfield',
  korrektur: '/korrektur',
  persona: '/persona',
};

export const PROMPT_CATEGORIES = Object.keys(
  EDITOR_ROUTES
) as readonly PromptCategory[];

/** German display names of the categories (library filter, save dialog). */
export const PROMPT_CATEGORY_LABELS: Readonly<Record<PromptCategory, string>> =
  {
    vocabulary: 'Vokabeln',
    grammar: 'Grammatik',
    comprehension: 'Textverständnis',
    clone: 'Klon',
    wordfield: 'Wortfeld',
    korrektur: 'Korrektur',
    persona: 'Persona-Chat',
  };

/** Snapshot of an editor's form state so a saved prompt can be reopened
 * and regenerated with adjusted settings. */
export interface EditorConfig {
  /** Route of the editor that produced the prompt, e.g. '/vocabulary'. */
  route: string;
  /** Editor-specific form/signal snapshot. */
  state: Record<string, unknown>;
}

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
  /** Free-form collection name ("Klasse 8b", "Unit 3", …). */
  collection?: string;
  editorConfig?: EditorConfig;
}
