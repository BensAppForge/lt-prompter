import { parseLibraryImport, promptFingerprint } from './library-import';

describe('library import', () => {
  const valid = {
    name: 'Vokabelübung',
    content: 'You are an expert…',
    category: 'vocabulary',
    targetLanguage: 'English',
    cefr: 'B1',
  };

  it('accepts the export format and a bare array', () => {
    expect(parseLibraryImport({ prompts: [valid] }).prompts.length).toBe(1);
    expect(parseLibraryImport([valid]).prompts.length).toBe(1);
  });

  it('returns nothing for content that is not a prompt list', () => {
    for (const content of [null, 'text', 42, {}, { prompts: 'nope' }]) {
      expect(parseLibraryImport(content)).toEqual({
        prompts: [],
        invalidCount: 0,
      });
    }
  });

  it('drops entries with missing or unknown required fields', () => {
    const result = parseLibraryImport([
      valid,
      { ...valid, name: '   ' },
      { ...valid, content: 42 },
      { ...valid, category: 'foo' },
      { ...valid, targetLanguage: 'Deutsch' },
      { ...valid, cefr: 'Z9' },
      null,
      'text',
    ]);
    expect(result.prompts.length).toBe(1);
    expect(result.invalidCount).toBe(7);
  });

  it('keeps only string tags and drops ids and timestamps', () => {
    const [prompt] = parseLibraryImport([
      {
        ...valid,
        id: 7,
        createdAt: '2026-01-01T00:00:00.000Z',
        tags: ['alpha', 1, null, '  beta  ', ''],
        description: 42,
        collection: '  Klasse 8b ',
      },
    ]).prompts;
    expect(prompt.tags).toEqual(['alpha', 'beta']);
    expect(prompt.description).toBeUndefined();
    expect(prompt.collection).toBe('Klasse 8b');
    expect(Object.keys(prompt)).not.toContain('id');
    expect(Object.keys(prompt)).not.toContain('createdAt');
  });

  it("keeps an editor snapshot only for the category's own editor", () => {
    const state = { form: { words: ['house'] } };
    const [own, foreign, malformed] = parseLibraryImport([
      { ...valid, editorConfig: { route: '/vocabulary', state } },
      { ...valid, editorConfig: { route: '/nirgendwo', state } },
      { ...valid, editorConfig: { route: '/vocabulary', state: 'abc' } },
    ]).prompts;
    expect(own.editorConfig).toEqual({ route: '/vocabulary', state });
    expect(foreign.editorConfig).toBeUndefined();
    expect(malformed.editorConfig).toBeUndefined();
  });

  it('fingerprints prompts by their identifying fields', () => {
    const [a, b, c] = parseLibraryImport([
      { ...valid, tags: ['x'] },
      { ...valid, description: 'andere Beschreibung' },
      { ...valid, cefr: 'B2' },
    ]).prompts;
    expect(promptFingerprint(a)).toBe(promptFingerprint(b));
    expect(promptFingerprint(a)).not.toBe(promptFingerprint(c));
  });
});
