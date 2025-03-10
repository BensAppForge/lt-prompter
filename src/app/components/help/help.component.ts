import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  currentVersion = environment.version;
  
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}