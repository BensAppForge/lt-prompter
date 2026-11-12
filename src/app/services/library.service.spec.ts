import { TestBed } from '@angular/core/testing';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LibraryService } from './library.service';
import { LibraryPrompt } from '../models/library.model';

describe('LibraryService', () => {
  let service: LibraryService;

  const prompt = (overrides: Partial<LibraryPrompt>): LibraryPrompt => ({
    id: '1',
    name: 'Vokabelübung',
    category: 'vocabulary',
    targetLanguage: 'English',
    cefr: 'B1',
    content: 'content',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUsed: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: NgxIndexedDBService, useValue: {} }],
    });
    service = TestBed.inject(LibraryService);
  });

  it('filters by category, language, level and collection', () => {
    const prompts = [
      prompt({ id: '1' }),
      prompt({ id: '2', category: 'grammar' }),
      prompt({ id: '3', targetLanguage: 'français' }),
      prompt({ id: '4', cefr: 'C1' }),
      prompt({ id: '5', collection: 'Klasse 8b' }),
    ];
    const ids = (query: Parameters<LibraryService['filterPrompts']>[1]) =>
      service.filterPrompts(prompts, query).map((p) => p.id);

    expect(ids({})).toEqual(['1', '2', '3', '4', '5']);
    expect(ids({ category: 'grammar' })).toEqual(['2']);
    expect(ids({ targetLanguage: 'français' })).toEqual(['3']);
    expect(ids({ cefr: 'C1' })).toEqual(['4']);
    expect(ids({ collection: 'Klasse 8b' })).toEqual(['5']);
    expect(ids({ category: 'grammar', cefr: 'C1' })).toEqual([]);
  });

  it('searches name, description and tags case-insensitively', () => {
    const prompts = [
      prompt({ id: '1', name: 'Zoo-Vokabeln' }),
      prompt({ id: '2', description: 'Ein Tag im ZOO' }),
      prompt({ id: '3', tags: ['tiere', 'zoo'] }),
      prompt({ id: '4' }),
    ];
    expect(
      service.filterPrompts(prompts, { searchTerm: 'zoo' }).map((p) => p.id)
    ).toEqual(['1', '2', '3']);
  });

  it('does not fail on entries with malformed fields', () => {
    const malformed = prompt({
      id: '2',
      tags: [1, null] as unknown as string[],
      description: 42 as unknown as string,
    });
    const prompts = [prompt({ id: '1', tags: ['alpha'] }), malformed];
    expect(
      service.filterPrompts(prompts, { searchTerm: 'alpha' }).map((p) => p.id)
    ).toEqual(['1']);
  });
});
