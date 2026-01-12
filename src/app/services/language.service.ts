import { Injectable } from '@angular/core';
import { Language } from '../models/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly languageCodes: Record<Language, string> = {
    'English': 'en',
    'español': 'es',
    'français': 'fr',
    'italiano': 'it'
  };

  private readonly spellcheckCodes: Record<Language, string> = {
    'English': 'en-EN',
    'français': 'fr-FR',
    'español': 'es-ES',
    'italiano': 'it-IT'
  };

  getLanguageCode(language: Language): string {
    return this.languageCodes[language] || 'en';
  }

  getSpellcheckCode(language: Language | null | undefined): string {
    if (!language) return 'en-EN';
    return this.spellcheckCodes[language] || 'en-EN';
  }

  displayLanguage(language: Language): string {
    return language === 'English' 
      ? language 
      : language.charAt(0).toUpperCase() + language.slice(1);
  }
}
