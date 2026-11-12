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
import {
  isOutputFormat,
  OutputFormat,
} from '../../models/output-format.model';
import { appendOutputFormat } from '../../templates/output-format-prompts';
import {
  EditorConfig,
  LibraryPrompt,
  PromptCategory,
} from '../../models/library.model';
import { ClipboardService } from '../../services/clipboard.service';
import { LibraryService } from '../../services/library.service';
import { LanguageService } from '../../services/language.service';
import { SettingsService } from '../../services/settings.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { SaveToLibraryDialogComponent } from './save-to-library-dialog/save-to-library-dialog.component';

/** Library metadata for a generated prompt. */
export interface SaveToLibraryData {
  category: PromptCategory;
  targetLanguage: Language;
  cefr: CEFRLevel;
  name: string;
  description: string;
  tags: string[];
  editorConfig?: EditorConfig;
}

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
  protected readonly settingsService = inject(SettingsService);
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

  /**
   * Whether this editor shows the "Ausgabe als Datei" control. Editors whose
   * prompt has its own output (Korrektur page, persona chat) turn it off.
   */
  protected readonly offersFileOutput: boolean = true;

  /** File format the prompt should ask the AI tool for ("Ausgabe als Datei"). */
  readonly outputFormat = signal<OutputFormat>(
    this.settingsService.getSettings()().defaultOutputFormat
  );

  /** Library metadata captured when the displayed prompt was generated. */
  private saveData: SaveToLibraryData | null = null;

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

  /**
   * Editor state passed along when a saved prompt is opened from the library
   * ("Im Editor öffnen"). Returns null on a normal navigation.
   */
  protected consumeEditorConfig(): Record<string, unknown> | null {
    const navState =
      this.router.getCurrentNavigation()?.extras?.state ?? history.state;
    const config = (navState as Record<string, unknown> | undefined)?.[
      'editorConfig'
    ] as EditorConfig | undefined;
    const state = config?.state ?? null;
    if (state) {
      // Prompts saved before the option existed were generated without it
      const saved = state['outputFormat'];
      this.outputFormat.set(isOutputFormat(saved) ? saved : 'chat');
    }
    return state;
  }

  /**
   * The output format that applies to the prompt being generated. Override
   * where a file only makes sense for some settings.
   */
  protected effectiveOutputFormat(): OutputFormat {
    return this.offersFileOutput ? this.outputFormat() : 'chat';
  }

  /**
   * Prefill the form's targetLanguage/cefr controls with the defaults from
   * the settings page. Call once after building the form.
   */
  protected applyDefaultPreferences(form: {
    patchValue(value: Record<string, unknown>): void;
  }): void {
    const settings = this.settingsService.getSettings()();
    const patch: Record<string, unknown> = {};
    if (settings.defaultTargetLanguage) {
      patch['targetLanguage'] = settings.defaultTargetLanguage;
    }
    if (settings.defaultCefr) {
      patch['cefr'] = settings.defaultCefr;
    }
    if (Object.keys(patch).length) {
      form.patchValue(patch);
    }
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
   *
   * `saveData` is the library metadata for exactly this prompt. It is
   * captured here rather than read from the form when saving, because the
   * form can be changed afterwards without regenerating — the saved entry
   * would then describe settings the prompt was never generated with.
   *
   * The file-output instruction ("Ausgabe als Datei") is appended here, so
   * every editor that offers the control gets it without further wiring.
   */
  protected commitGeneratedPrompt(
    prompt: string,
    saveData: SaveToLibraryData
  ): void {
    const editorConfig =
      saveData.editorConfig && this.offersFileOutput
        ? {
            ...saveData.editorConfig,
            state: {
              ...saveData.editorConfig.state,
              outputFormat: this.outputFormat(),
            },
          }
        : saveData.editorConfig;
    this.saveData = { ...saveData, editorConfig };
    this._generatedPrompt.set(
      appendOutputFormat(
        prompt,
        saveData.targetLanguage,
        this.effectiveOutputFormat()
      )
    );
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
  saveToLibrary(): void {
    const data = this.saveData;
    if (!data) return;
    this.libraryService
      .getCollections()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((collections) => this.openSaveDialogWith(data, collections));
  }

  private openSaveDialogWith(
    data: SaveToLibraryData,
    collections: string[]
  ): void {
    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        ...data,
        // The dialog edits its tag list in place — hand it a copy so a
        // cancelled dialog leaves the captured metadata untouched.
        tags: [...data.tags],
        content: this.currentPromptText(),
        collections,
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
              collection: result.collection,
              editorConfig: data.editorConfig,
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
