import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-version-notification',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule],
  template: '',
  styles: []
})
export class VersionNotificationComponent implements OnInit {
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly versionService = inject(VersionService);

  ngOnInit() {
    // Check for updates and show notification
    if (this.versionService.hasUpdate()) {
      const message = this.versionService.updateMessage();
      
      if (message) {
        const snackBarRef = this.snackBar.open(
          message,
          'Details',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );

        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/changelog']);
        });
      }
    }
  }
}
