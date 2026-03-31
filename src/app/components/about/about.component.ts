import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly router = inject(Router);

  currentVersion = environment.version;
  currentDate = new Date();

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
