import { Injectable } from '@angular/core';
import { Language } from '../models/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageCodes: Record<Language, string> = {
    'English': 'en',
    'español': 'es',
    'français': 'fr',
    'italiano': 'it'
  };

  getLanguageCode(language: Language): string {
    return this.languageCodes[language] || 'en';
  }
}
