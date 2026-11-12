import {
  EDITOR_ROUTES,
  EditorConfig,
  LibraryPrompt,
  PROMPT_CATEGORIES,
  PromptCategory,
} from '../models/library.model';
import {
  CEFR_LEVELS,
  CEFRLevel,
  LANGUAGES,
  Language,
} from '../models/preferences.model';

/** A library entry as it is written to the DB (id and timestamps are added
 * on insert). */
export type ImportablePrompt = Omit<
  LibraryPrompt,
  'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
>;

export interface LibraryImportResult {
  prompts: ImportablePrompt[];
  /** Entries dropped because required fields were missing or invalid. */
  invalidCount: number;
}

/**
 * Validates the parsed content of an import file. Accepts the export format
 * (`{ prompts: [...] }`) as well as a bare array. Import files come from
 * outside the app (backups, colleagues), so every field is checked: an entry
 * with an unknown category or non-string tags would otherwise end up in the
 * DB and break the library views.
 */
export function parseLibraryImport(parsed: unknown): LibraryImportResult {
  const rawPrompts = Array.isArray(parsed)
    ? parsed
    : (parsed as { prompts?: unknown } | null)?.prompts;
  const candidates: unknown[] = Array.isArray(rawPrompts) ? rawPrompts : [];
  const prompts = candidates
    .map(sanitizePrompt)
    .filter((p): p is ImportablePrompt => p !== null);
  return { prompts, invalidCount: candidates.length - prompts.length };
}

/** Identity of a prompt for duplicate detection on import. */
export function promptFingerprint(
  prompt: Pick<
    LibraryPrompt,
    'name' | 'category' | 'targetLanguage' | 'cefr' | 'content'
  >
): string {
  return [
    prompt.name,
    prompt.category,
    prompt.targetLanguage,
    prompt.cefr,
    prompt.content,
  ].join('\u0000');
}

function sanitizePrompt(raw: unknown): ImportablePrompt | null {
  if (!isRecord(raw)) return null;

  const name = typeof raw['name'] === 'string' ? raw['name'].trim() : '';
  const content = typeof raw['content'] === 'string' ? raw['content'] : '';
  const category = raw['category'] as PromptCategory;
  const targetLanguage = raw['targetLanguage'] as Language;
  const cefr = raw['cefr'] as CEFRLevel;
  if (
    !name ||
    !content.trim() ||
    !PROMPT_CATEGORIES.includes(category) ||
    !LANGUAGES.includes(targetLanguage) ||
    !CEFR_LEVELS.includes(cefr)
  ) {
    return null;
  }

  return {
    name,
    content,
    category,
    targetLanguage,
    cefr,
    description: optionalString(raw['description']),
    collection: optionalString(raw['collection']),
    tags: Array.isArray(raw['tags'])
      ? raw['tags']
          .filter((tag): tag is string => typeof tag === 'string')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    editorConfig: sanitizeEditorConfig(raw['editorConfig'], category),
  };
}

/** Keeps the editor snapshot only if it points to the category's own editor;
 * otherwise the prompt is imported without "Im Editor öffnen". */
function sanitizeEditorConfig(
  raw: unknown,
  category: PromptCategory
): EditorConfig | undefined {
  if (
    !isRecord(raw) ||
    raw['route'] !== EDITOR_ROUTES[category] ||
    !isRecord(raw['state'])
  ) {
    return undefined;
  }
  return { route: EDITOR_ROUTES[category], state: raw['state'] };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
