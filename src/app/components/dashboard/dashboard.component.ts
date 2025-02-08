import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterLink } from '@angular/router';
import { VersionService } from '../../services/version.service';
import { environment } from '../../../environments/environment';

interface DashboardCard {
  title: string;
  icon: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    RouterLink,
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-grid">
        <ng-container *ngFor="let card of cards; trackBy: trackCard">
          <mat-card class="dashboard-card" [routerLink]="card.route">
            <mat-card-header>
              <mat-icon mat-card-avatar>{{ card.icon }}</mat-icon>
              <mat-card-title>{{ card.title }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ card.description }}</p>
            </mat-card-content>
          </mat-card>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      .dashboard-card {
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid var(--border-color);
        background-color: var(--card-background);
        color: var(--text-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-color: var(--primary-color);
        }

        mat-card-header {
          margin-bottom: 16px;
          padding: 16px 16px 0;

          mat-card-title {
            font-size: 1.2rem;
            margin-bottom: 8px;
            color: var(--primary-color);
          }
        }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: var(--primary-color);
        }

        mat-card-content {
          padding: 0 16px 16px;

          p {
            margin: 0;
            color: var(--text-secondary);
          }
        }
      }

      @media (max-width: 599px) {
        .dashboard-container {
          padding: 16px;
        }

        .dashboard-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .dashboard-card {
          mat-card-header {
            padding: 12px 12px 0;
          }

          mat-card-content {
            padding: 0 12px 12px;
          }
        }
      }
    `,
  ],
})
export class DashboardComponent {
  cards: DashboardCard[] = [
    {
      title: 'Vokabelübungen mit Lückentexten',
      icon: 'book',
      route: '/vocabulary',
      description: 'Prompts für Vokabelübungen als Lückentext erstellen',
    },
    {
      title: 'Grammatikübungen aus Kontext',
      icon: 'rule',
      route: '/grammar',
      description:
        'Prompts für Grammatikübungen erstellen, die für einen bestimmten Kontext geeignet sind.',
    },
    // {
    //   title: 'Hörverstehen',
    //   icon: 'headphones',
    //   route: '/listening',
    //   description: 'Prompts für Hörverstehen erstellen',
    // },
    {
      title: 'Textverstehen',
      icon: 'auto_stories',
      route: '/comprehension',
      description: 'Prompts für Lese- Hör- und Hör/Sehverstehen erstellen',
    },
    // {
    //   title: 'Promptvorlagen',
    //   icon: 'description',
    //   route: '/templates',
    //   description: 'Verwalten Sie Ihre Übungsvorlagen',
    // },
    // {
    //   title: 'Einstellungen',
    //   icon: 'settings',
    //   route: '/settings',
    //   description: 'Passen Sie die Anwendung an Ihre Bedürfnisse an',
    // },
    {
      title: 'Datenschutz',
      icon: 'security',
      route: '/privacy',
      description: 'Informationen zum Datenschutz',
    },
    {
      title: 'Impressum',
      icon: 'info',
      route: '/about',
      description: 'Rechtliche Informationen',
    },
  ];

  currentVersion = environment.version;
  currentDate = new Date();

  trackCard(index: number, card: DashboardCard): string {
    return card.title;
  }
}
