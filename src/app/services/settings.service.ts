import { Injectable, computed, effect, signal } from '@angular/core';

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

  /** Tracks the OS color-scheme preference reactively. */
  private readonly systemPrefersDark = signal(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  /** Single source of truth for the effective theme. */
  readonly isDarkMode = computed(() => {
    const preference = this.settings().themePreference;
    if (preference === ThemePreference.System) {
      return this.systemPrefersDark();
    }
    return preference === ThemePreference.Dark;
  });

  constructor() {
    // Automatically save settings when they change
    effect(() => {
      this.saveSettings(this.settings());
    });

    // Keep systemPrefersDark in sync with the OS; the service lives for the
    // whole app lifetime, so the listener is never removed.
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));
  }

  private loadSettings(): AppSettings {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed === 'object' &&
          Object.values(ThemePreference).includes(parsed.themePreference)
        ) {
          return parsed;
        }
      } catch {
        // fall through to defaults
      }
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(settings: AppSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  getSettings() {
    return this.settings;
  }

  updateThemePreference(preference: ThemePreference) {
    this.settings.update(current => ({
      ...current,
      themePreference: preference
    }));
  }
}
