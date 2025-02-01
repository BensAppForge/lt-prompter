import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-container">
      <h1>Vorlagen</h1>
      <div class="template-content">
        <p>Hier können Sie Ihre Vorlagen verwalten.</p>
      </div>
    </div>
  `,
  styles: [`
    .template-container {
      padding: 24px;
    }

    .template-content {
      margin-top: 24px;
    }

    h1 {
      color: #1976d2;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  `]
})
export class TemplateManagerComponent {}
