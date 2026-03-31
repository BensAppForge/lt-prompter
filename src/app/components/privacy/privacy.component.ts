import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {
  private readonly router = inject(Router);

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
