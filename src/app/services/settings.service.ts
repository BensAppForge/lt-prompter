import { Injectable, signal } from '@angular/core';
import { effect } from '@angular/core';

export enum ThemePreference {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

interface AppSettings {
  themePreference: ThemePreference;
}

const DEFAULT_SETTINGS: AppSettings = {
  themePreference: ThemePreference.System
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'lt-prompter-settings';
  private settings = signal<AppSettings>(this.loadSettings());

  constructor() {
    // Automatically save settings when they change
    effect(() => {
      this.saveSettings(this.settings());
    });

    // Listen for system theme changes if using system preference
    if (this.settings().themePreference === ThemePreference.System) {
      this.setupSystemThemeListener();
    }
  }

  private loadSettings(): AppSettings {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(settings: AppSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      document.body.classList.toggle('dark-theme', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery); // Initial check
  }

  getSettings() {
    return this.settings;
  }

  updateThemePreference(preference: ThemePreference) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Remove system theme listener if switching away from system preference
    if (this.settings().themePreference === ThemePreference.System) {
      mediaQuery.removeEventListener('change', () => {});
    }

    this.settings.update(current => ({
      ...current,
      themePreference: preference
    }));

    // Apply theme based on preference
    switch (preference) {
      case ThemePreference.Light:
        document.body.classList.remove('dark-theme');
        break;
      case ThemePreference.Dark:
        document.body.classList.add('dark-theme');
        break;
      case ThemePreference.System:
        this.setupSystemThemeListener();
        break;
    }
  }
}
