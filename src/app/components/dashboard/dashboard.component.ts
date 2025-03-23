import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

interface DashboardCard {
  title: string;
  icon: string;
  route: string;
  description: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  template: `
    <div class="dashboard-container">
      <div class="cards-grid">
        <ng-container *ngFor="let card of cards">
          <mat-card
            [routerLink]="card.disabled ? null : card.route"
            [class.disabled]="card.disabled"
          >
            <mat-card-header>
              <mat-icon mat-card-avatar class="card-icon">{{ card.icon }}</mat-icon>
              <mat-card-title>{{ card.title }}</mat-card-title>
              <mat-card-subtitle>{{ card.description }}</mat-card-subtitle>
            </mat-card-header>
          </mat-card>
        </ng-container>
      </div>
      <div class="footer-space"></div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
        margin-bottom: 60px;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin: 0 auto;
        max-width: 1200px;
      }

      mat-card {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        background-color: var(--surface-color);

        &:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: var(--elevation-z4);
        }

        &.disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .footer-space {
        height: 40px;
      }

      mat-card-header {
        margin-bottom: 16px;
      }

      .card-icon.mat-mdc-card-avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        color: var(--text-secondary);
        width: 40px;
        height: 40px;
        font-size: 24px;
        overflow: visible;
      }
    `,
  ],
})
export class DashboardComponent {
  cards: DashboardCard[] = [
    {
      title: 'Vokabelübung',
      icon: 'school',
      route: '/vocabulary',
      description: 'Erstellen Sie eine Lückentextübung mit Vokabeln',
    },
    {
      title: 'Grammatikübung',
      icon: 'rule',
      route: '/grammar',
      description: 'Erstellen Sie eine Übung zu grammatischen Phänomenen',
    },
    {
      title: 'Textverständnis',
      icon: 'menu_book',
      route: '/comprehension',
      description: 'Erstellen Sie eine Übung zum Textverständnis',
    },
    {
      title: 'Übung klonen',
      icon: 'content_copy',
      route: '/clone',
      description: 'Bestehende Übungen als Vorlage verwenden',
    },
    {
      title: 'Wortfelder',
      icon: 'format_list_bulleted',
      route: '/wordfield',
      description:
        'Erstellen Sie thematische Wortfelder basierend auf Bildern und Texten',
    },
    {
      title: 'Einstellungen',
      icon: 'settings',
      route: '/settings',
      description: 'Passen Sie das Erscheinungsbild und weitere Optionen an',
    },
    {
      title: 'Hilfe',
      icon: 'help',
      route: '/help',
      description: 'Informationen zur Nutzung der App',
    },
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
      description: 'Rechtliche Informationen und Kontakt',
    },
  ];
}
