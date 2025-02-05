import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  constructor(private snackBar: MatSnackBar) {}

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.snackBar.open('In die Zwischenablage kopiert', 'OK', {
          duration: 2000,
        });
      },
      (err) => {
        console.error('Fehler beim Kopieren:', err);
        this.snackBar.open('Fehler beim Kopieren', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
