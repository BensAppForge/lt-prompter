import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CEFRLevel, Language } from '../../models/preferences.model';
import { LibraryPrompt, PromptCategory } from '../../models/library.model';
import { ClipboardService } from '../../services/clipboard.service';
import { LibraryService } from '../../services/library.service';
import { LanguageService } from '../../services/language.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { SaveToLibraryDialogComponent } from './save-to-library-dialog/save-to-library-dialog.component';

/**
 * Base class for all exercise prompt-generator components.
 * Provides shared state, clipboard, edit mode, scroll, and save-to-library logic.
 *
 * Usage: extend this in each exercise component and use @Directive
 * (Angular requires the decorator for DI in base classes).
 */
@Directive()
export abstract class BaseExerciseComponent {
  // --- Injected services ---
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly router = inject(Router);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly libraryService = inject(LibraryService);
  protected readonly languageService = inject(LanguageService);
  protected readonly scrollService = inject(ScrollService);

  // --- Shared state ---
  readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  readonly _isEditMode = signal(false);
  readonly isEditMode = computed(() => this._isEditMode());

  readonly _editedPrompt = signal<string | null>(null);
  readonly editedPrompt = computed(() => this._editedPrompt());
  readonly displayedPrompt = computed(
    () => this.editedPrompt() || this.generatedPrompt()
  );

  readonly _isSavedToLibrary = signal(false);
  readonly isSavedToLibrary = computed(() => this._isSavedToLibrary());

  editablePrompt = '';

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  // --- Constants ---
  readonly languages: Language[] = [
    'English',
    'español',
    'français',
    'italiano',
  ];

  readonly cefrLevels: CEFRLevel[] = [
    'A1', 'A1+', 'A2', 'A2+',
    'B1', 'B1+', 'B2', 'B2+',
    'C1', 'C1+', 'C2',
  ];

  constructor() {
    // Scroll to prompt container when a new prompt is generated
    effect((onCleanup) => {
      if (this._generatedPrompt()) {
        const timer = setTimeout(() => {
          if (this.promptContainer?.nativeElement) {
            this.scrollService.scrollToBottom(
              this.promptContainer.nativeElement,
              20
            );
          }
        }, 100);
        onCleanup(() => clearTimeout(timer));
      }
    });
  }

  // --- Navigation ---
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // --- Language ---
  getLanguageCode(language: Language | null | undefined): string {
    return this.languageService.getSpellcheckCode(language);
  }

  displayLanguage(lang: Language): string {
    return this.languageService.displayLanguage(lang);
  }

  // --- Clipboard ---
  async copyToClipboard(text: string): Promise<void> {
    const success = await this.clipboardService.copy(text);
    this.snackBar.open(
      success ? 'In die Zwischenablage kopiert' : 'Fehler beim Kopieren',
      'OK',
      { duration: 2000 }
    );
  }

  /**
   * Commit a freshly generated prompt: discards any previous edit and
   * re-enables saving, so regeneration never shows stale edited text.
   */
  protected commitGeneratedPrompt(prompt: string): void {
    this._generatedPrompt.set(prompt);
    this._editedPrompt.set(null);
    this.editablePrompt = '';
    this._isEditMode.set(false);
    this._isSavedToLibrary.set(false);
  }

  /**
   * The prompt text as the user currently sees it — including uncommitted
   * textarea changes while edit mode is active.
   */
  currentPromptText(): string {
    return this.isEditMode() ? this.editablePrompt : this.displayedPrompt();
  }

  // --- Edit mode ---
  toggleEditMode(): void {
    const currentEditMode = this._isEditMode();
    this._isEditMode.set(!currentEditMode);

    if (!currentEditMode) {
      this.editablePrompt = this._editedPrompt() || this._generatedPrompt();
    } else {
      this._editedPrompt.set(this.editablePrompt);
      this._isSavedToLibrary.set(false);
    }
  }

  // --- Save to library ---
  protected openSaveDialog(data: {
    category: PromptCategory;
    targetLanguage: Language;
    cefr: CEFRLevel;
    name: string;
    description: string;
    tags: string[];
  }): void {
    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        ...data,
        content: this.currentPromptText(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            const prompt: Omit<
              LibraryPrompt,
              'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
            > = {
              category: data.category,
              targetLanguage: data.targetLanguage,
              cefr: data.cefr,
              content: this.currentPromptText(),
              name: result.name,
              description: result.description,
              tags: result.tags || [],
            };

            this.libraryService
              .addPrompt(prompt)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: () => {
                  this._isSavedToLibrary.set(true);
                  this.snackBar.open(
                    'Prompt in Bibliothek gespeichert',
                    'Schließen',
                    { duration: 3000 }
                  );
                },
                error: (error: unknown) => {
                  console.error('Error saving prompt:', error);
                  this.snackBar.open(
                    'Fehler beim Speichern des Prompts',
                    'Schließen',
                    { duration: 3000 }
                  );
                },
              });
          }
        },
      });
  }
}
