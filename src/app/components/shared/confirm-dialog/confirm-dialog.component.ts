import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelText }}
      </button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        {{ data.confirmText }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
      }

      h2 {
        margin: 0 0 16px 0;
        color: var(--text-color);
      }

      p {
        margin: 0;
        color: var(--text-color);
      }

      mat-dialog-actions {
        margin: 24px -16px -16px;
        padding: 16px;
        border-top: 1px solid var(--border-color);
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}
}
