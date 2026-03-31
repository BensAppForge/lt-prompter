import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { Version } from '../../models/version.model';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    RouterLink
  ],
  template: `
    <div class="changelog-container">
      <div class="back-button-container">
        <button mat-icon-button routerLink="/dashboard" aria-label="Zurück zum Dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

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
          <!-- Release versions (1.0.0 and above) -->
          @for (version of releaseVersions(); track version.id) {
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
          
          <!-- Beta versions (below 1.0.0) -->
          @if (betaVersions().length > 0) {
            <mat-expansion-panel class="beta-versions-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  Beta-Versionen
                </mat-panel-title>
                <mat-panel-description>
                  Frühere Entwicklungsversionen
                </mat-panel-description>
              </mat-expansion-panel-header>
              
              @for (version of betaVersions(); track version.id) {
                <mat-card class="version-card beta-version-card">
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
            </mat-expansion-panel>
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

    .back-button-container {
      margin-bottom: 1rem;
    }

    h2 {
      margin: 2rem 0;
      color: var(--text-color);
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
      margin-bottom: 1.5rem;
    }
    
    .beta-version-card {
      margin-top: 1rem;
    }
    
    .beta-versions-panel {
      margin-top: 1.5rem;
      background-color: var(--surface-color) !important;
      color: var(--text-color);
      
      ::ng-deep .mat-expansion-panel-header {
        background-color: var(--surface-color) !important;
      }
      
      ::ng-deep .mat-expansion-panel-header-title,
      ::ng-deep .mat-expansion-panel-header-description {
        color: var(--text-color) !important;
      }
      
      ::ng-deep .mat-expansion-indicator::after {
        color: var(--text-color) !important;
      }
      
      ::ng-deep .mat-expansion-panel-header.mat-expanded,
      ::ng-deep .mat-expansion-panel-header.mat-expanded:hover,
      ::ng-deep .mat-expansion-panel-header.mat-expanded:focus {
        background-color: var(--surface-color) !important;
      }
      
      ::ng-deep .mat-expansion-panel-body {
        background-color: var(--surface-color) !important;
        color: var(--text-color) !important;
      }
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
      color: var(--text-secondary);
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogComponent implements OnInit {
  readonly versions = signal<Version[]>([]);
  readonly releaseVersions = signal<Version[]>([]);
  readonly betaVersions = signal<Version[]>([]);
  readonly isLoading = signal<boolean>(true);
  
  constructor(private versionService: VersionService) {}

  isLatestVersion(version: Version): boolean {
    const allVersions = this.versions();
    if (!allVersions.length) return false;
    return version.id === allVersions[0].id;
  }
  
  private isBetaVersion(version: Version): boolean {
    // Check if version number is less than 1.0.0
    return parseFloat(version.versionNumber) < 1.0;
  }
  
  ngOnInit(): void {
    const versions = this.versionService.getAllVersions();
    this.versions.set(versions);
    
    // Split versions into release and beta
    this.releaseVersions.set(versions.filter(v => !this.isBetaVersion(v)));
    this.betaVersions.set(versions.filter(v => this.isBetaVersion(v)));
    
    this.isLoading.set(false);
  }
}
