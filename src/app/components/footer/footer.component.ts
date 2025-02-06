import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <footer class="app-footer">
      <a routerLink="/changelog" class="version-link">
        Version {{ versionService.currentVersion()?.versionNumber }} - {{ versionService.currentVersion()?.releaseDate | date : 'dd.MM.yyyy' }}
      </a>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: var(--primary-color);
      color: white;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 16px;
      z-index: 1000;
    }

    .version-link {
      color: white;
      text-decoration: none;
      font-size: 0.9rem;
      opacity: 0.9;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  `]
})
export class FooterComponent {
  versionService = inject(VersionService);
}
