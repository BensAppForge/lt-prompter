import { ChangeDetectionStrategy, Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
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
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClipboardService } from '../../services/clipboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LibraryService } from '../../services/library.service';
import { LibraryPrompt, PromptCategory } from '../../models/library.model';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly libraryService = inject(LibraryService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboardService = inject(ClipboardService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    this.libraryService.getAllPrompts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (prompts: LibraryPrompt[]) => {
          this.prompts = prompts;
          this.filteredPrompts.set(prompts);
        },
        error: (error: unknown) => {
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (prompts) => {
          this.prompts = prompts;
          this.filteredPrompts.set(prompts);
        },
        error: (error: unknown) => {
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

      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
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

  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  async copyToClipboard(text: string): Promise<void> {
    clearTimeout(this.copyFeedbackTimer);
    const success = await this.clipboardService.copy(text);
    if (success) {
      this.copySuccess.set(true);
      this.copyFeedbackTimer = setTimeout(() => this.copySuccess.set(false), 2000);
    } else {
      this.copyError.set(true);
      this.copyFeedbackTimer = setTimeout(() => this.copyError.set(false), 2000);
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

    this.libraryService.updatePrompt(updatedPrompt)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Prompt aktualisiert', 'Schließen', {
            duration: 3000,
          });
          this.loadPrompts();
          this.editedPrompt.set(this.editablePrompt);
        },
        error: (error: unknown) => {
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

  async copyPrompt(prompt: LibraryPrompt): Promise<void> {
    const success = await this.clipboardService.copy(prompt.content);
    this.snackBar.open(
      success ? 'Prompt in die Zwischenablage kopiert' : 'Fehler beim Kopieren',
      'Schließen',
      { duration: 3000 }
    );
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

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.libraryService.deletePrompt(prompt.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.loadPrompts();
                if (this.selectedPrompt()?.id === prompt.id) {
                  this.closePrompt();
                }
                this.snackBar.open('Prompt gelöscht', 'Schließen', {
                  duration: 3000,
                });
              },
              error: (error: unknown) => {
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
