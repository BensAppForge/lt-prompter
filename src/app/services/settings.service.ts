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
  
  // Store the handler reference so we can properly remove it
  private systemThemeHandler: ((e: MediaQueryListEvent) => void) | null = null;

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

  private applyThemeFromMediaQuery(e: MediaQueryListEvent | MediaQueryList): void {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(e.matches ? 'dark-theme' : 'light-theme');
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Create the handler and store reference for later removal
    this.systemThemeHandler = (e: MediaQueryListEvent) => {
      this.applyThemeFromMediaQuery(e);
    };

    mediaQuery.addEventListener('change', this.systemThemeHandler);
    this.applyThemeFromMediaQuery(mediaQuery); // Initial check
  }

  private removeSystemThemeListener(): void {
    if (this.systemThemeHandler) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.removeEventListener('change', this.systemThemeHandler);
      this.systemThemeHandler = null;
    }
  }

  getSettings() {
    return this.settings;
  }

  updateThemePreference(preference: ThemePreference) {
    // Remove system theme listener if switching away from system preference
    if (this.settings().themePreference === ThemePreference.System) {
      this.removeSystemThemeListener();
    }

    this.settings.update(current => ({
      ...current,
      themePreference: preference
    }));

    // Apply theme based on preference
    switch (preference) {
      case ThemePreference.Light:
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        break;
      case ThemePreference.Dark:
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        break;
      case ThemePreference.System:
        this.setupSystemThemeListener();
        break;
    }
  }
}
