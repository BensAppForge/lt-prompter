import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container">
      <h1>Wilkommen bei LtPrompter {{ title }}!</h1>
      <p>Your application is ready to use.</p>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class HomeComponent {
  title = 'LT Prompter';
}
