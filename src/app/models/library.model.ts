import { Language, CEFRLevel } from './preferences.model';

export type PromptCategory =
  | 'vocabulary'
  | 'grammar'
  | 'comprehension'
  | 'clone'
  | 'wordfield'
  | 'korrektur';

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
