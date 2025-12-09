import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { LibraryService } from '../../services/library.service';
import { LibraryPrompt, PromptCategory } from '../../models/library.model';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { SaveToLibraryDialogComponent } from '../shared/save-to-library-dialog/save-to-library-dialog.component';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { signal } from '@angular/core';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    AutoAnimateDirective,
  ],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly libraryService = inject(LibraryService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);
  private readonly router = inject(Router);

  searchForm = this.fb.group({
    category: [null],
    targetLanguage: [null],
    cefr: [null],
    searchTerm: [''],
  });
  prompts: LibraryPrompt[] = [];
  categories: PromptCategory[] = [
    'vocabulary',
    'grammar',
    'comprehension',
    'clone',
    'wordfield',
  ];
  languages: Language[] = ['English', 'español', 'français', 'italiano'];
  cefrLevels: CEFRLevel[] = [
    'A1',
    'A1+',
    'A2',
    'A2+',
    'B1',
    'B1+',
    'B2',
    'B2+',
    'C1',
  ];
  readonly selectedPrompt = signal<LibraryPrompt | null>(null);
  readonly isEditMode = signal(false);
  readonly editedPrompt = signal<string | null>(null);
  readonly copySuccess = signal(false);
  readonly copyError = signal(false);
  readonly filteredPrompts = signal<LibraryPrompt[]>([]);
  editablePrompt: string = '';

  constructor() {
    this.searchForm = this.fb.group({
      category: [null],
      targetLanguage: [null],
      cefr: [null],
      searchTerm: [''],
    });
  }

  ngOnInit(): void {
    this.loadPrompts();
  }

  private loadPrompts(): void {
    this.libraryService.getAllPrompts().subscribe({
      next: (prompts: LibraryPrompt[]) => {
        this.prompts = prompts;
        this.filteredPrompts.set(prompts);
      },
      error: (error: Error) => {
        console.error('Error loading prompts:', error);
        this.snackBar.open('Fehler beim Laden der Prompts', 'Schließen', {
          duration: 3000,
        });
      },
    });
  }

  onSearch(): void {
    const { category, targetLanguage, cefr, searchTerm } =
      this.searchForm.value;
    this.libraryService
      .searchPrompts({
        category: category || undefined,
        targetLanguage: targetLanguage || undefined,
        cefr: cefr || undefined,
        searchTerm: searchTerm || undefined,
      })
      .subscribe({
        next: (prompts) => {
          this.prompts = prompts;
          this.filteredPrompts.set(prompts);
        },
        error: (error) => {
          console.error('Error searching prompts:', error);
          this.snackBar.open('Fehler beim Suchen der Prompts', 'Schließen', {
            duration: 3000,
          });
        },
      });
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.loadPrompts();
  }

  viewPrompt(prompt: LibraryPrompt): void {
    this.selectedPrompt.set(prompt);
    this.editedPrompt.set(null);
    this.isEditMode.set(false);
  }

  closePrompt(): void {
    this.selectedPrompt.set(null);
    this.editedPrompt.set(null);
    this.isEditMode.set(false);
  }

  toggleEditMode(): void {
    if (
      this.isEditMode() &&
      this.editablePrompt !==
        (this.editedPrompt() || this.selectedPrompt()?.content)
    ) {
      // Show confirm dialog when exiting edit mode with changes
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Änderungen speichern?',
          message: 'Möchten Sie die Änderungen am Prompt speichern?',
          confirmText: 'Speichern',
          cancelText: 'Verwerfen',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.saveEditedPrompt();
        }
        this.isEditMode.set(false);
        this.editedPrompt.set(result ? this.editablePrompt : null);
      });
    } else {
      this.isEditMode.update((current) => !current);
      if (this.isEditMode()) {
        this.editablePrompt =
          this.editedPrompt() || this.selectedPrompt()?.content || '';
      }
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.showCopyFeedback(true);
      } else {
        await this.fallbackCopyToClipboard(text);
        this.showCopyFeedback(true);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.showCopyFeedback(false);
    }
  }

  private async fallbackCopyToClipboard(text: string): Promise<void> {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      console.error('Fallback copy failed:', err);
      textArea.remove();
      throw new Error('Copy failed');
    }
  }

  private showCopyFeedback(success: boolean): void {
    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } else {
      this.copyError.set(true);
      setTimeout(() => this.copyError.set(false), 2000);
    }
  }

  getLanguageCode(language: Language | null | undefined): string {
    const languageMap: Record<Language, string> = {
      English: 'en-EN',
      français: 'fr-FR',
      español: 'es-ES',
      italiano: 'it-IT',
    };
    if (!language) return 'en-EN';
    return languageMap[language] || 'en-EN';
  }

  editPrompt(prompt: LibraryPrompt): void {
    this.selectedPrompt.set(prompt);
    this.editedPrompt.set(null);
    this.isEditMode.set(true);
  }

  saveEditedPrompt(): void {
    const currentPrompt = this.selectedPrompt();
    if (!currentPrompt || !this.editablePrompt) return;

    const updatedPrompt: LibraryPrompt = {
      ...currentPrompt,
      content: this.editablePrompt,
      updatedAt: new Date(),
    };

    this.libraryService.updatePrompt(updatedPrompt).subscribe({
      next: () => {
        this.snackBar.open('Prompt aktualisiert', 'Schließen', {
          duration: 3000,
        });
        this.loadPrompts();
        this.editedPrompt.set(this.editablePrompt);
      },
      error: (error) => {
        console.error('Error updating prompt:', error);
        this.snackBar.open(
          'Fehler beim Aktualisieren des Prompts',
          'Schließen',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  copyPrompt(prompt: LibraryPrompt): void {
    this.clipboard.copy(prompt.content);
    this.snackBar.open('Prompt in die Zwischenablage kopiert', 'Schließen', {
      duration: 3000,
    });
  }

  deletePrompt(prompt: LibraryPrompt): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Prompt löschen',
        message: 'Möchten Sie diesen Prompt wirklich löschen?',
        confirmText: 'Löschen',
        cancelText: 'Abbrechen',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.libraryService.deletePrompt(prompt.id).subscribe({
          next: () => {
            this.loadPrompts();
            if (this.selectedPrompt()?.id === prompt.id) {
              this.closePrompt();
            }
            this.snackBar.open('Prompt gelöscht', 'Schließen', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Error deleting prompt:', error);
            this.snackBar.open('Fehler beim Löschen des Prompts', 'Schließen', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  getCategoryLabel(category: PromptCategory | undefined): string {
    if (!category) return 'Unbekannt';
    const labels: Record<PromptCategory, string> = {
      vocabulary: 'Vokabeln',
      grammar: 'Grammatik',
      comprehension: 'Textverständnis',
      clone: 'Klon',
      wordfield: 'Wortfeld',
      korrektur: 'Korrektur',
    };
    return labels[category];
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
