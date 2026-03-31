import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClipboardService } from '../../services/clipboard.service';
import {
  NonNullableFormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { ScrollService } from '../../shared/services/scroll.service';
import {
  GrammarPromptConfig,
  GrammarPhenomenon,
} from '../../models/grammar.model';
import { LibraryService } from '../../services/library.service';
import { SaveToLibraryDialogComponent } from '../shared/save-to-library-dialog/save-to-library-dialog.component';
import { PromptCategory, LibraryPrompt } from '../../models/library.model';

interface GrammarFormValue {
  targetLanguage: Language;
  cefr: CEFRLevel;
  phenomena: PhenomenonForm[];
  situationalContext: string;
  situationalContextIsDialog: boolean;
}

interface PhenomenonForm {
  description: string;
  hint: string;
}

@Component({
  selector: 'app-grammar-con',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    AutoAnimateDirective,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './grammar-con.component.html',
  styleUrls: ['./grammar-con.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarConComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptTemplateService);
  private readonly clipboardService = inject(ClipboardService);
  private readonly scrollService = inject(ScrollService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly libraryService = inject(LibraryService);

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

  readonly form: FormGroup;
  readonly languages: Language[] = [
    'English',
    'français',
    'español',
    'italiano',
  ];
  readonly cefrLevels: CEFRLevel[] = [
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

  private readonly _generatedPrompt = signal<string>('');
  readonly generatedPrompt = computed(() => this._generatedPrompt());

  private readonly _copyStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly copyStatus = computed(() => this._copyStatus());

  private readonly _isEditMode = signal(false);
  readonly isEditMode = computed(() => this._isEditMode());

  private readonly _editedPrompt = signal<string | null>(null);
  readonly editedPrompt = computed(() => this._editedPrompt());
  readonly displayedPrompt = computed(() => this.editedPrompt() || this.generatedPrompt());

  editablePrompt: string = '';

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  private readonly _isSavedToLibrary = signal(false);
  readonly isSavedToLibrary = computed(() => this._isSavedToLibrary());

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      phenomena: this.fb.array<PhenomenonForm>(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
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

  get phenomena(): FormArray {
    return this.form.get('phenomena') as FormArray;
  }

  addPhenomenon(description: string, hint: string = ''): void {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) return;

    this.phenomena.push(
      this.fb.group({
        description: [trimmedDescription, Validators.required],
        hint: [hint.trim()],
      })
    );
  }

  removePhenomenon(index: number): void {
    this.phenomena.removeAt(index);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue() as GrammarFormValue;
      const config: GrammarPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        phenomena: formValue.phenomena.map((p: PhenomenonForm) => ({
          description: p.description,
          hint: p.hint || undefined,
        })),
        situationalContext: formValue.situationalContext,
        situationalContextIsDialog: formValue.situationalContextIsDialog,
      };

      const prompt = this.promptService.generateGrammarPrompt(
        config,
        formValue.targetLanguage
      );
      this._generatedPrompt.set(prompt);
      this._isSavedToLibrary.set(false);
    }
  }

  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  async copyToClipboard(text: string): Promise<void> {
    clearTimeout(this.copyFeedbackTimer);
    const success = await this.clipboardService.copy(text);
    this._copyStatus.set(success ? 'success' : 'error');
    this.copyFeedbackTimer = setTimeout(() => this._copyStatus.set('idle'), 2000);
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
    const formValue = this.form.getRawValue() as GrammarFormValue;
    const phenomena = formValue.phenomena.map((p) => p.description).join(', ');

    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        category: 'grammar' as PromptCategory,
        targetLanguage: formValue.targetLanguage,
        cefr: formValue.cefr,
        content: this.displayedPrompt(),
        name: `Grammatik - ${phenomena}`,
        description: `Grammatikübung für ${formValue.targetLanguage} (${
          formValue.cefr
        }) mit Fokus auf: ${phenomena}${
          formValue.situationalContext
            ? `. Kontext: ${formValue.situationalContext}`
            : ''
        }`,
        tags: [
          'grammar',
          ...formValue.phenomena.map((p) => p.description.toLowerCase()),
        ],
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result) {
          const prompt: Omit<
            LibraryPrompt,
            'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
          > = {
            category: 'grammar',
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
