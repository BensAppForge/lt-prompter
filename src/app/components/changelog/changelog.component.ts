import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Version } from '../../models/version.model';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="changelog-container">
      <button mat-button routerLink="/dashboard" class="back-button">
        <mat-icon>arrow_back</mat-icon>
        Zurück zum Dashboard
      </button>

      <h2>Versionshistorie</h2>
      
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Lade Versionshistorie...</p>
        </div>
      } @else if (versions().length === 0) {
        <p class="no-versions">Keine Versionen gefunden.</p>
      } @else {
        <div class="version-list">
          @for (version of versions(); track version.id) {
            <mat-card class="version-card" [class.latest-version]="isLatestVersion(version)">
              @if (isLatestVersion(version)) {
                <div class="latest-badge">Neueste Version</div>
              }
              <mat-card-header>
                <mat-card-title>
                  Version {{ version.versionNumber }}
                  <span class="version-date">
                    {{ version.releaseDate | date:'dd.MM.yyyy' }}
                  </span>
                </mat-card-title>
                <mat-card-subtitle>
                  {{ version.shortDescription }}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="version-details">
                  <pre>{{ version.longDescription }}</pre>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .changelog-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .back-button {
      margin-bottom: 1rem;
    }

    h2 {
      margin: 2rem 0;
      color: #333;
      font-size: 1.8rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin: 3rem 0;
    }

    .no-versions {
      text-align: center;
      color: #666;
      margin: 3rem 0;
    }

    .version-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .version-card {
      border-radius: 8px;
      transition: transform 0.2s ease-in-out;
      position: relative;
      overflow: visible;
    }

    .version-card:hover {
      transform: translateY(-2px);
    }

    .latest-version {
      border: 2px solid #1976d2;
    }

    .latest-badge {
      position: absolute;
      top: -12px;
      right: -12px;
      background: #1976d2;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .version-date {
      font-size: 0.9rem;
      color: #666;
      margin-left: 1rem;
    }

    .version-details {
      margin-top: 1rem;
      white-space: pre-wrap;
    }

    pre {
      font-family: inherit;
      margin: 0;
      white-space: pre-wrap;
    }

    mat-card-content {
      margin-top: 1rem;
      padding: 0 1rem;
    }
  `]
})
export class ChangelogComponent implements OnInit {
  readonly versions = signal<Version[]>([]);
  readonly isLoading = signal<boolean>(true);
  
  constructor(private versionService: VersionService) {}

  isLatestVersion(version: Version): boolean {
    const allVersions = this.versions();
    if (!allVersions.length) return false;
    return version.id === allVersions[0].id;
  }
  
  ngOnInit(): void {
    this.versionService.getAllVersions().subscribe({
      next: (versions) => {
        console.log('Changelog received versions:', versions);
        this.versions.set(versions);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading versions:', error);
        this.isLoading.set(false);
      }
    });
  }
}
