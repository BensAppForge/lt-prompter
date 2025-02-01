import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <span class="toolbar-spacer"></span>
      <span class="app-title">LANGUAGE TEACHER - PROMPTER</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button (click)="toggleTheme()">
        <mat-icon>{{ isDarkTheme() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
    </mat-toolbar>

    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
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

    .app-title {
      font-size: 1.2rem;
      letter-spacing: 1px;
      font-weight: 500;
    }

    .app-content {
      margin-top: 64px;
      min-height: calc(100vh - 64px);
      background-color: var(--background-color);
      transition: background-color 0.3s ease;
      padding: 24px;
    }
  `]
})
export class AppComponent {
  isDarkTheme = signal(false);

  toggleTheme(): void {
    this.isDarkTheme.update(current => !current);
    document.body.classList.toggle('dark-theme', this.isDarkTheme());
  }
}
