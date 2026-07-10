import { ChangeDetectionStrategy, Component, inject, effect } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VersionNotificationComponent } from './components/version-notification/version-notification.component';
import { FooterComponent } from './components/footer/footer.component';
import { SettingsService, ThemePreference } from './services/settings.service';
import { PwaUpdateService } from './services/pwa-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    VersionNotificationComponent,
    FooterComponent
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <span class="toolbar-spacer"></span>
      <span class="app-title">LANGUAGE TEACHER - PROMPTER</span>
      <span class="toolbar-spacer"></span>
      <button 
        mat-icon-button 
        (click)="toggleTheme()" 
        [attr.aria-label]="isDarkMode() ? 'Zum hellen Design wechseln' : 'Zum dunklen Design wechseln'"
      >
        <mat-icon>{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
    </mat-toolbar>

    <main class="app-content">
      <app-version-notification></app-version-notification>
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .app-toolbar {
      background-color: var(--primary-color);
      color: white;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
      display: flex;
      align-items: center;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .app-content {
      padding-top: 64px;
      min-height: calc(100vh - 64px - 40px); /* viewport height minus toolbar and footer */
      box-sizing: border-box;
    }

    .app-title {
      font-size: 1.2rem;
      font-weight: 500;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private settingsService = inject(SettingsService);
  private pwaUpdateService = inject(PwaUpdateService);

  // Reactive to both the stored preference and OS theme changes
  readonly isDarkMode = this.settingsService.isDarkMode;

  constructor() {
    // Single writer of the theme class; runs on startup and on every change
    effect(() => {
      document.body.classList.toggle('dark-theme', this.isDarkMode());
    });

    // Initialize PWA update monitoring
    this.pwaUpdateService.initialize();
  }

  toggleTheme() {
    // Toggling from the toolbar pins an explicit light/dark preference;
    // "System" can be restored on the settings page
    const newPreference = this.isDarkMode() ? ThemePreference.Light : ThemePreference.Dark;
    this.settingsService.updateThemePreference(newPreference);
  }
}
