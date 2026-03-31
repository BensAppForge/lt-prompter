import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewChild,
  ElementRef,
  effect,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  NonNullableFormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Language, CEFRLevel } from '../../models/preferences.model';
import {
  WordfieldPromptConfig,
  WordfieldSourceType,
  WORDFIELD_SOURCE_TYPES,
  WordfieldOutputType,
  WORDFIELD_OUTPUT_TYPES,
} from '../../models/wordfield.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { LibraryService } from '../../services/library.service';
import { SaveToLibraryDialogComponent } from '../shared/save-to-library-dialog/save-to-library-dialog.component';
import { PromptCategory, LibraryPrompt } from '../../models/library.model';

@Component({
  selector: 'app-wordfield',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './wordfield.component.html',
  styleUrls: ['./wordfield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordfieldComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptTemplateService);
  private readonly clipboardService = inject(ClipboardService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly scrollService = inject(ScrollService);
  private readonly dialog = inject(MatDialog);
  private readonly libraryService = inject(LibraryService);

  form: FormGroup;
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

  readonly sourceTypes = WORDFIELD_SOURCE_TYPES;
  readonly outputTypes = WORDFIELD_OUTPUT_TYPES;
  readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  readonly _isEditMode = signal(false);
  readonly isEditMode = computed(() => this._isEditMode());

  readonly _editedPrompt = signal<string | null>(null);
  readonly editedPrompt = computed(() => this._editedPrompt());
  readonly displayedPrompt = computed(() => this.editedPrompt() || this.generatedPrompt());

  readonly _isSavedToLibrary = signal(false);
  readonly isSavedToLibrary = computed(() => this._isSavedToLibrary());

  editablePrompt: string = '';

  private readonly languageMap: Record<Language, string> = {
    English: 'en-EN',
    français: 'fr-FR',
    español: 'es-ES',
    italiano: 'it-IT',
  } as const;

  getLanguageCode(language: Language | null | undefined): string {
    if (!language) return 'en-EN';
    return this.languageMap[language] || 'en-EN';
  }

  // German translations for source types
  private readonly sourceTypeTranslations: Record<WordfieldSourceType, string> =
    {
      image: 'Bild',
      docx: 'Word-Dokument',
      pdf: 'PDF-Dokument',
      'copied-text': 'Kopierter Text',
    };

  // German translations for output types
  private readonly outputTypeTranslations: Record<WordfieldOutputType, string> =
    {
      table: 'Tabelle',
      markdown: 'Markdown für Mind-Mapping',
    };

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
      outputType: ['', Validators.required],
    });

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

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: WordfieldPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        sourceType: formValue.sourceType!,
        outputType: formValue.outputType!,
      };

      this._generatedPrompt.set(
        this.promptService.generateWordfieldPrompt(config)
      );
      this._isSavedToLibrary.set(false);
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    const success = await this.clipboardService.copy(text);
    this.snackBar.open(
      success ? 'In die Zwischenablage kopiert' : 'Fehler beim Kopieren',
      'OK',
      { duration: 2000 }
    );
  }

  displayLanguage(lang: Language): string {
    return lang === 'English'
      ? lang
      : lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  getSourceTypeTranslation(type: WordfieldSourceType): string {
    return this.sourceTypeTranslations[type] || type;
  }

  getOutputTypeTranslation(type: WordfieldOutputType): string {
    return this.outputTypeTranslations[type] || type;
  }

  toggleEditMode(): void {
    const currentEditMode = this._isEditMode();
    this._isEditMode.set(!currentEditMode);

    if (!currentEditMode) {
      // Entering edit mode - initialize the editable content
      this.editablePrompt = this._editedPrompt() || this._generatedPrompt();
    } else {
      // Exiting edit mode - save the edited content
      this._editedPrompt.set(this.editablePrompt);
    }
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        category: 'wordfield' as PromptCategory,
        targetLanguage: formValue.targetLanguage,
        cefr: formValue.cefr,
        content: this.displayedPrompt(),
        name: `Wortfeld - ${this.getSourceTypeTranslation(
          formValue.sourceType
        )} (${this.getOutputTypeTranslation(formValue.outputType)})`,
        description: `Wortfeld für ${formValue.targetLanguage} (${
          formValue.cefr
        }) basierend auf ${this.getSourceTypeTranslation(
          formValue.sourceType
        )}, Ausgabe als ${this.getOutputTypeTranslation(formValue.outputType)}`,
        tags: ['wordfield', formValue.sourceType, formValue.outputType],
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result) {
          const prompt: Omit<
            LibraryPrompt,
            'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
          > = {
            category: 'wordfield',
            targetLanguage: formValue.targetLanguage!,
            cefr: formValue.cefr!,
            content: this.displayedPrompt(),
            name: result.name,
            description: result.description,
            tags: result.tags || [],
          };

          this.libraryService.addPrompt(prompt).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
              this._isSavedToLibrary.set(true);
              this.snackBar.open(
                'Prompt in Bibliothek gespeichert',
                'Schließen',
                {
                  duration: 3000,
                }
              );
            },
            error: (error) => {
              console.error('Error saving prompt:', error);
              this.snackBar.open(
                'Fehler beim Speichern des Prompts',
                'Schließen',
                {
                  duration: 3000,
                }
              );
            },
          });
        }
      },
    });
  }
}
