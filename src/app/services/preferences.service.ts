import { Injectable, inject, signal } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, from, map, tap } from 'rxjs';
import { Preferences } from '../models/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private readonly STORE_NAME = 'preferences';
  private readonly DEFAULT_ID = 1;
  private readonly dbService = inject(NgxIndexedDBService);
  
  currentPreferences = signal<Preferences>({
    language: 'English',
    level: 'B1',
    theme: 'light'
  });

  constructor() {
    this.loadPreferences();
  }

  private loadPreferences(): void {
    this.getPreferences().subscribe(prefs => {
      if (prefs) {
        this.currentPreferences.set(prefs);
      }
    });
  }

  getPreferences(): Observable<Preferences> {
    return from(this.dbService.getByKey(this.STORE_NAME, this.DEFAULT_ID))
      .pipe(map(prefs => prefs as Preferences));
  }

  savePreferences(preferences: Partial<Preferences>): Observable<Preferences> {
    const updatedPrefs = { ...this.currentPreferences(), ...preferences, id: this.DEFAULT_ID };
    return from(this.dbService.update(this.STORE_NAME, updatedPrefs))
      .pipe(
        map(prefs => prefs as Preferences),
        tap(prefs => this.currentPreferences.set(prefs))
      );
  }

  toggleTheme(): Observable<Preferences> {
    const newTheme = this.currentPreferences().theme === 'light' ? 'dark' : 'light';
    return this.savePreferences({ theme: newTheme });
  }
}
