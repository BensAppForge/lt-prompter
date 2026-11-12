import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClipboardService } from '../../services/clipboard.service';
import { LanguageService } from '../../services/language.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LibraryService } from '../../services/library.service';
import {
  ImportablePrompt,
  parseLibraryImport,
  promptFingerprint,
} from '../../services/library-import';
import {
  LibraryPrompt,
  PROMPT_CATEGORIES,
  PROMPT_CATEGORY_LABELS,
  PromptCategory,
} from '../../models/library.model';
import {
  CEFR_LEVELS,
  CEFRLevel,
  LANGUAGES,
  Language,
} from '../../models/preferences.model';
import { ScrollService } from '../../shared/services/scroll.service';
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
    MatTooltipModule,
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
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  /** Fixed toolbar height plus some breathing room, so the viewer is not
   * scrolled underneath the toolbar. */
  private readonly VIEWER_SCROLL_OFFSET = 80;

  @ViewChild('promptViewer', { read: ElementRef })
  promptViewer?: ElementRef<HTMLElement>;

  searchForm = this.fb.group({
    category: this.fb.control<PromptCategory | null>(null),
    targetLanguage: this.fb.control<Language | null>(null),
    cefr: this.fb.control<CEFRLevel | null>(null),
    collection: this.fb.control<string | null>(null),
    searchTerm: this.fb.control(''),
  });
  readonly categories = PROMPT_CATEGORIES;
  readonly languages = LANGUAGES;
  readonly cefrLevels = CEFR_LEVELS;
  readonly selectedPrompt = signal<LibraryPrompt | null>(null);
  readonly isEditMode = signal(false);
  readonly editedPrompt = signal<string | null>(null);
  readonly copySuccess = signal(false);
  readonly copyError = signal(false);
  readonly filteredPrompts = signal<LibraryPrompt[]>([]);
  readonly collections = signal<string[]>([]);
  editablePrompt: string = '';

  ngOnInit(): void {
    this.refresh();
  }

  /**
   * Reloads the library and re-applies the filters currently set in the
   * search form, so the list stays filtered after deleting, editing or
   * importing prompts.
   */
  private refresh(): void {
    this.libraryService
      .getAllPrompts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (prompts: LibraryPrompt[]) => {
          const collections = [
            ...new Set(
              prompts.map((p) => p.collection).filter((c): c is string => !!c)
            ),
          ].sort((a, b) => a.localeCompare(b, 'de'));
          this.collections.set(collections);

          // A collection disappears with its last prompt; a filter on it
          // would otherwise hide everything with no way to clear it.
          const collectionFilter = this.searchForm.controls.collection;
          if (
            collectionFilter.value &&
            !collections.includes(collectionFilter.value)
          ) {
            collectionFilter.reset();
          }

          const { category, targetLanguage, cefr, collection, searchTerm } =
            this.searchForm.getRawValue();
          this.filteredPrompts.set(
            this.libraryService.filterPrompts(prompts, {
              category,
              targetLanguage,
              cefr,
              collection,
              searchTerm: searchTerm.trim(),
            })
          );
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
    this.refresh();
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.refresh();
  }

  viewPrompt(prompt: LibraryPrompt): void {
    this.selectedPrompt.set(prompt);
    this.editedPrompt.set(null);
    this.isEditMode.set(false);
    this.scrollToViewer();
  }

  /** The viewer sits below the prompt grid, so bring it into view. */
  private scrollToViewer(): void {
    // Deferred: the viewer card is only rendered by the change detection
    // that follows this event handler.
    setTimeout(() => {
      const viewer = this.promptViewer?.nativeElement;
      if (viewer) {
        this.scrollService.scrollToBottom(viewer, this.VIEWER_SCROLL_OFFSET);
      }
    });
  }

  /** Download the whole library as a JSON backup file. */
  exportLibrary(): void {
    this.libraryService
      .getAllPrompts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((prompts) => {
        if (!prompts.length) {
          this.snackBar.open('Keine Prompts zum Exportieren vorhanden', 'Schließen', {
            duration: 3000,
          });
          return;
        }
        const payload = {
          app: 'lt-prompter',
          type: 'library-export',
          version: 1,
          exportedAt: new Date().toISOString(),
          prompts,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `lt-prompter-bibliothek-${new Date()
          .toISOString()
          .slice(0, 10)}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        this.snackBar.open(
          `${prompts.length} Prompts exportiert`,
          'Schließen',
          { duration: 3000 }
        );
      });
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    file
      .text()
      .then((text) => this.importLibrary(text))
      .catch(() => {
        this.snackBar.open('Die Datei konnte nicht gelesen werden', 'Schließen', {
          duration: 3000,
        });
      });
  }

  private importLibrary(text: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      this.snackBar.open('Ungültige Datei: kein gültiges JSON', 'Schließen', {
        duration: 3000,
      });
      return;
    }
    const { prompts: candidates, invalidCount } = parseLibraryImport(parsed);
    if (!candidates.length) {
      this.snackBar.open(
        'Keine gültigen Prompts in der Datei gefunden',
        'Schließen',
        { duration: 3000 }
      );
      return;
    }

    // Skip prompts that are already in the library (and repeats within the
    // file), so re-importing a backup does not duplicate everything.
    this.libraryService
      .getAllPrompts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (existing) => {
          const known = new Set(existing.map(promptFingerprint));
          const fresh = candidates.filter((prompt) => {
            const fingerprint = promptFingerprint(prompt);
            if (known.has(fingerprint)) return false;
            known.add(fingerprint);
            return true;
          });
          const duplicateCount = candidates.length - fresh.length;

          if (!fresh.length) {
            this.snackBar.open(
              'Alle Prompts aus der Datei sind bereits in Ihrer Bibliothek vorhanden',
              'Schließen',
              { duration: 4000 }
            );
            return;
          }
          this.confirmImport(fresh, duplicateCount, invalidCount);
        },
        error: (error: unknown) => this.reportImportError(error),
      });
  }

  private confirmImport(
    prompts: ImportablePrompt[],
    duplicateCount: number,
    invalidCount: number
  ): void {
    const skipped = [
      duplicateCount ? `${duplicateCount} bereits vorhanden` : '',
      invalidCount ? `${invalidCount} ungültig` : '',
    ].filter(Boolean);
    const skippedNote = skipped.length
      ? ` Übersprungen: ${skipped.join(', ')}.`
      : '';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Bibliothek importieren?',
        message: `${prompts.length} neue Prompt(s) gefunden. Sie werden zusätzlich zu Ihrer bestehenden Bibliothek angelegt.${skippedNote}`,
        confirmText: 'Importieren',
        cancelText: 'Abbrechen',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) return;
        forkJoin(prompts.map((p) => this.libraryService.addPrompt(p)))
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open(
                `${prompts.length} Prompts importiert`,
                'Schließen',
                { duration: 3000 }
              );
              this.refresh();
            },
            error: (error: unknown) => {
              this.reportImportError(error);
              // Some prompts may have been written before the failure
              this.refresh();
            },
          });
      });
  }

  private reportImportError(error: unknown): void {
    console.error('Error importing prompts:', error);
    this.snackBar.open('Fehler beim Importieren der Prompts', 'Schließen', {
      duration: 3000,
    });
  }

  /** Reopen the prompt's saved editor configuration for regeneration. */
  openInEditor(prompt: LibraryPrompt): void {
    if (!prompt.editorConfig) return;
    this.router.navigate([prompt.editorConfig.route], {
      state: { editorConfig: prompt.editorConfig },
    });
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

  /** Prompt text as currently visible, including uncommitted edits. */
  currentPromptText(): string {
    if (this.isEditMode()) return this.editablePrompt;
    return this.editedPrompt() || this.selectedPrompt()?.content || '';
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
    return this.languageService.getSpellcheckCode(language);
  }

  displayLanguage(language: Language): string {
    return this.languageService.displayLanguage(language);
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
          this.refresh();
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
                this.refresh();
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
    // Entries stored by older versions may carry an unknown category
    return PROMPT_CATEGORY_LABELS[category] ?? 'Unbekannt';
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
