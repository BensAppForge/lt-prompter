import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingsService, ThemePreference } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    RouterModule
  ],
  template: `
    <div class="page-container">
      <div class="back-button-container">
        <button mat-icon-button routerLink="/dashboard" aria-label="Zurück zum Dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <mat-card class="settings-container">
        <mat-card-header>
          <mat-card-title>Einstellungen</mat-card-title>
          <mat-card-subtitle>Passen Sie das Erscheinungsbild und weitere Optionen an</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <section class="settings-section">
            <h2>Erscheinungsbild</h2>
            <div class="theme-options">
              <mat-radio-group
                [value]="settingsService.getSettings()().themePreference"
                (change)="onThemeChange($event.value)"
                class="theme-radio-group"
              >
                <mat-radio-button [value]="ThemePreference.Light" class="theme-option">
                  <div class="theme-option-content">
                    <mat-icon>light_mode</mat-icon>
                    <div class="theme-option-text">
                      <div class="theme-option-title">Hell</div>
                      <div class="theme-option-description">Helles Design für gute Lesbarkeit bei Tageslicht</div>
                    </div>
                  </div>
                </mat-radio-button>

                <mat-radio-button [value]="ThemePreference.Dark" class="theme-option">
                  <div class="theme-option-content">
                    <mat-icon>dark_mode</mat-icon>
                    <div class="theme-option-text">
                      <div class="theme-option-title">Dunkel</div>
                      <div class="theme-option-description">Dunkles Design für ermüdungsfreies Arbeiten</div>
                    </div>
                  </div>
                </mat-radio-button>

                <mat-radio-button [value]="ThemePreference.System" class="theme-option">
                  <div class="theme-option-content">
                    <mat-icon>settings_suggest</mat-icon>
                    <div class="theme-option-text">
                      <div class="theme-option-title">Systemeinstellung</div>
                      <div class="theme-option-description">Folgt automatisch der Einstellung Ihres Betriebssystems</div>
                    </div>
                  </div>
                </mat-radio-button>
              </mat-radio-group>
            </div>
          </section>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      margin-bottom: 60px;
    }

    .back-button-container {
      margin-bottom: 20px;
    }

    .settings-container {
      background-color: var(--surface-color);
    }

    .settings-section {
      margin: 24px 0;

      h2 {
        color: var(--text-color);
        font-size: 1.1rem;
        margin-bottom: 16px;
      }
    }

    .theme-radio-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .theme-option {
      margin: 0;
      
      ::ng-deep .mdc-form-field {
        width: 100%;
      }
    }

    .theme-option-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      
      .mat-icon {
        color: var(--text-secondary);
      }
    }

    .theme-option-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .theme-option-title {
      color: var(--text-color);
      font-weight: 500;
    }

    .theme-option-description {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  settingsService = inject(SettingsService);
  ThemePreference = ThemePreference;

  onThemeChange(preference: ThemePreference) {
    this.settingsService.updateThemePreference(preference);
  }
}
