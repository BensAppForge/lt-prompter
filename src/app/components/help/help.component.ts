import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent {
  private readonly router = inject(Router);

  currentVersion = environment.version;

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}