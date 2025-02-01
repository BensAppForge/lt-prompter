import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preferences-container">
      <h1>Einstellungen</h1>
      <div class="preferences-content">
        <p>Hier können Sie Ihre Einstellungen anpassen.</p>
      </div>
    </div>
  `,
  styles: [`
    .preferences-container {
      padding: 24px;
    }

    .preferences-content {
      margin-top: 24px;
    }

    h1 {
      color: #1976d2;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  `]
})
export class PreferencesComponent {}
