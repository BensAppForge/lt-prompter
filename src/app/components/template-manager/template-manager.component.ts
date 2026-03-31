import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [],
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateManagerComponent {}
