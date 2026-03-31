import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VersionService } from '../../services/version.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule],
  template: `
    <footer class="app-footer">
      <div class="footer-links">
        <a href="mailto:a.bentivoglio@akg-schwabach.de?subject=LT-Prompter%20Supportanfrage" class="support-link">
          <mat-icon class="footer-icon">support</mat-icon>
          Support
        </a>
        <a routerLink="/changelog" class="version-link">
          <mat-icon class="footer-icon">update</mat-icon>
          Version {{ versionService.currentVersion()?.versionNumber }} - {{ versionService.currentVersion()?.releaseDate | date : 'dd.MM.yyyy' }}
        </a>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: var(--surface-color);
      border-top: 1px solid var(--border-color);
      color: var(--text-color);
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

    .footer-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .version-link,
    .support-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease;

      &:hover {
        color: var(--primary-color);
      }
    }

    .footer-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.9;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  versionService = inject(VersionService);
}
