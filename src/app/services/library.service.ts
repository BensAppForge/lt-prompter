import { Injectable, inject } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, from, EMPTY } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LibraryPrompt, PromptCategory } from '../models/library.model';
import { Language, CEFRLevel } from '../models/preferences.model';

export interface SearchQuery {
  category?: PromptCategory | null;
  targetLanguage?: Language | null;
  cefr?: CEFRLevel | null;
  collection?: string | null;
  searchTerm?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private readonly db = inject(NgxIndexedDBService);
  private readonly storeName = 'library';

  addPrompt(
    prompt: Omit<LibraryPrompt, 'id' | 'createdAt' | 'updatedAt' | 'lastUsed'>
  ): Observable<LibraryPrompt> {
    const newPrompt: Omit<LibraryPrompt, 'id'> = {
      ...prompt,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsed: new Date(),
    };

    return from(this.db.add(this.storeName, newPrompt)).pipe(
      map((id) => ({ ...newPrompt, id: id.toString() } as LibraryPrompt))
    );
  }

  updatePrompt(prompt: LibraryPrompt): Observable<LibraryPrompt> {
    const updatedPrompt = {
      ...prompt,
      updatedAt: new Date(),
    };

    return from(this.db.update(this.storeName, updatedPrompt)).pipe(
      map(() => updatedPrompt)
    );
  }

  deletePrompt(id: string): Observable<void> {
    return from(this.db.delete(this.storeName, id)).pipe(map(() => undefined));
  }

  getPrompt(id: string): Observable<LibraryPrompt | null> {
    return from(this.db.getByKey(this.storeName, id)).pipe(
      switchMap((prompt) => {
        if (prompt) {
          return this.updateLastUsed(id).pipe(
            map(() => prompt as LibraryPrompt)
          );
        }
        return from([null]);
      })
    );
  }

  getAllPrompts(): Observable<LibraryPrompt[]> {
    return from(this.db.getAll(this.storeName)).pipe(
      map((prompts) => prompts as LibraryPrompt[])
    );
  }

  /** Distinct collection names across all saved prompts, sorted. */
  getCollections(): Observable<string[]> {
    return this.getAllPrompts().pipe(
      map((prompts) =>
        [...new Set(
          prompts
            .map((p) => p.collection)
            .filter((c): c is string => !!c)
        )].sort((a, b) => a.localeCompare(b, 'de'))
      )
    );
  }

  searchPrompts(query: SearchQuery): Observable<LibraryPrompt[]> {
    return this.getAllPrompts().pipe(
      map((prompts) => this.filterPrompts(prompts, query))
    );
  }

  /** Applies a search query to an already loaded list of prompts. */
  filterPrompts(prompts: LibraryPrompt[], query: SearchQuery): LibraryPrompt[] {
    return prompts.filter((prompt) => {
      const matchesCategory =
        !query.category || prompt.category === query.category;
      const matchesLanguage =
        !query.targetLanguage ||
        prompt.targetLanguage === query.targetLanguage;
      const matchesCefr = !query.cefr || prompt.cefr === query.cefr;
      const matchesCollection =
        !query.collection || prompt.collection === query.collection;
      const matchesSearch =
        !query.searchTerm || this.matchesSearchTerm(prompt, query.searchTerm);

      return (
        matchesCategory &&
        matchesLanguage &&
        matchesCefr &&
        matchesCollection &&
        matchesSearch
      );
    });
  }

  private updateLastUsed(id: string): Observable<void> {
    return from(this.db.getByKey(this.storeName, id)).pipe(
      switchMap((prompt) => {
        if (prompt) {
          const updatedPrompt = {
            ...prompt,
            lastUsed: new Date(),
          };
          return from(this.db.update(this.storeName, updatedPrompt)).pipe(
            map(() => undefined)
          );
        }
        return from([undefined]);
      }),
      catchError(() => EMPTY)
    );
  }

  private matchesSearchTerm(
    prompt: LibraryPrompt,
    searchTerm: string
  ): boolean {
    // Entries imported by older versions were not validated, so a field may
    // hold something other than a string — never let that break the search.
    const searchLower = searchTerm.toLowerCase();
    const contains = (value: unknown): boolean =>
      typeof value === 'string' && value.toLowerCase().includes(searchLower);
    return (
      contains(prompt.name) ||
      contains(prompt.description) ||
      (Array.isArray(prompt.tags) && prompt.tags.some(contains))
    );
  }
}
