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
  ComprehensionExerciseType,
  ComprehensionSourceType,
  COMPREHENSION_EXERCISE_TYPES,
  SOURCE_TYPES,
  ComprehensionPromptConfig,
} from '../../models/comprehension.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { LibraryService } from '../../services/library.service';
import { SaveToLibraryDialogComponent } from '../shared/save-to-library-dialog/save-to-library-dialog.component';
import { PromptCategory, LibraryPrompt } from '../../models/library.model';

@Component({
  selector: 'app-comprehension',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComprehensionComponent {
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

  readonly exerciseTypes = COMPREHENSION_EXERCISE_TYPES;
  readonly sourceTypes = SOURCE_TYPES;
  readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  readonly _isEditMode = signal(false);
  readonly isEditMode = computed(() => this._isEditMode());

  readonly _editedPrompt = signal<string | null>(null);
  readonly editedPrompt = computed(() => this._editedPrompt());
  readonly displayedPrompt = computed(() => this.editedPrompt() || this.generatedPrompt());

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

  // German translations for exercise types
  private readonly exerciseTypeTranslations: Record<
    ComprehensionExerciseType,
    string
  > = {
    'true-false': 'Richtig-Falsch-Aufgaben',
    'multiple-choice': 'Multiple-Choice-Fragen',
    matching: 'Zuordnungsaufgaben',
    'gapped-summary': 'Lückentext-Zusammenfassung',
  };

  // German translations for source types
  private readonly sourceTypeTranslations: Record<
    ComprehensionSourceType,
    string
  > = {
    docx: 'Word-Dokument',
    pdf: 'PDF-Dokument',
    screenshot: 'Screenshot',
    'copied-text': 'Kopierter Text',
  };

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  private readonly _isSavedToLibrary = signal(false);
  readonly isSavedToLibrary = computed(() => this._isSavedToLibrary());

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      exercises: [[], [Validators.required, Validators.minLength(2)]],
      sourceType: ['', Validators.required],
      situationalContext: [''],
      situationalContextIsDialog: [false],
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

  isExerciseTypeSelected(type: ComprehensionExerciseType): boolean {
    const exercises = this.form.get('exercises')
      ?.value as ComprehensionExerciseType[];
    return exercises?.includes(type) ?? false;
  }

  onExerciseTypeChange(
    event: { checked: boolean },
    type: ComprehensionExerciseType
  ): void {
    const exercises =
      (this.form.get('exercises')?.value as ComprehensionExerciseType[]) || [];

    if (event.checked && !exercises.includes(type)) {
      this.form.patchValue({
        exercises: [...exercises, type],
      });
    } else if (!event.checked && exercises.includes(type)) {
      this.form.patchValue({
        exercises: exercises.filter((t) => t !== type),
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: ComprehensionPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        exercises: formValue.exercises!,
        sourceType: formValue.sourceType!,
        situationalContext: formValue.situationalContext,
        isDialog: formValue.situationalContextIsDialog,
      };

      this._generatedPrompt.set(
        this.promptService.generateComprehensionPrompt(config)
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

  displayLanguage(lang: Language): string {
    return lang === 'English'
      ? lang
      : lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  getSourceTypeTranslation(type: ComprehensionSourceType): string {
    return this.sourceTypeTranslations[type] || type;
  }

  getExerciseTypeTranslation(type: ComprehensionExerciseType): string {
    return this.exerciseTypeTranslations[type] || type;
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    const exercises = formValue.exercises
      .map((ex: ComprehensionExerciseType) =>
        this.getExerciseTypeTranslation(ex)
      )
      .join(', ');

    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        category: 'comprehension' as PromptCategory,
        targetLanguage: formValue.targetLanguage,
        cefr: formValue.cefr,
        content: this.displayedPrompt(),
        name: `Textverständnis - ${this.getSourceTypeTranslation(
          formValue.sourceType
        )}`,
        description: `Textverständnisübung für ${formValue.targetLanguage} (${
          formValue.cefr
        }) mit ${exercises}. Quelle: ${this.getSourceTypeTranslation(
          formValue.sourceType
        )}${
          formValue.situationalContext
            ? `. Kontext: ${formValue.situationalContext}`
            : ''
        }`,
        tags: ['comprehension', formValue.sourceType, ...formValue.exercises],
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result) {
          const prompt: Omit<
            LibraryPrompt,
            'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
          > = {
            category: 'comprehension',
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
