import {
  Component,
  inject,
  ElementRef,
  ViewChild,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { signal } from '@angular/core';
import { Language, CEFRLevel } from '../../models/preferences.model';
import { VocabularyPromptConfig } from '../../models/vocabulary.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { ScrollService } from '../../shared/services/scroll.service';
import { LibraryService } from '../../services/library.service';
import { SaveToLibraryDialogComponent } from '../shared/save-to-library-dialog/save-to-library-dialog.component';
import { PromptCategory } from '../../models/library.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { LibraryPrompt } from '../../models/library.model';

interface VocabularyForm {
  targetLanguage: Language;
  cefr: CEFRLevel;
  words: string[];
  situationalContext: string;
  situationalContextIsDialog: boolean;
}

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
    AutoAnimateDirective,
  ],
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss'],
})
export class VocabularyComponent implements OnInit {
  private readonly promptTemplateService = inject(PromptTemplateService);
  private readonly scrollService = inject(ScrollService);
  private readonly parent = inject(ElementRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly libraryService = inject(LibraryService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

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

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly form = this.fb.group({
    targetLanguage: this.fb.control<Language | null>(null, Validators.required),
    cefr: this.fb.control<CEFRLevel | null>(null, Validators.required),
    words: this.fb.array<string>(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
    situationalContext: this.fb.control(''),
    situationalContextIsDialog: this.fb.control(false),
  });

  readonly languages: Language[] = [
    'English',
    'español',
    'français',
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

  readonly generatedPrompt = signal<string>('');
  readonly copySuccess = signal(false);
  readonly copyError = signal(false);
  readonly isEditMode = signal(false);
  readonly editedPrompt = signal<string | null>(null);
  readonly isSavedToLibrary = signal(false);
  editablePrompt: string = '';

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  get words(): FormArray<FormControl<string>> {
    return this.form.get('words') as FormArray<FormControl<string>>;
  }

  addWordFromInput(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.words.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }

  removeWord(index: number): void {
    this.words.removeAt(index);
  }

  constructor() {
    // Create an effect to handle scrolling when prompt changes
    effect(() => {
      // Only run the effect when there's a prompt
      if (this.generatedPrompt()) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
          if (this.promptContainer?.nativeElement) {
            this.scrollService.scrollToBottom(
              this.promptContainer.nativeElement,
              20
            );
          }
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    // Remove the form value changes subscription
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: VocabularyPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        numberOfWords: formValue.words.length,
        exerciseType: 'vocabulary',
        wordList: formValue.words.map((word) => ({ word })),
        situationalContext: formValue.situationalContext,
        isDialog: formValue.situationalContextIsDialog,
      };

      this.generatedPrompt.set(
        this.promptTemplateService.generateVocabularyPrompt(config)
      );
    }
  }

  navigateToDashboard(): void {
    window.location.href = '/dashboard';
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

  toggleEditMode(): void {
    this.isEditMode.update((current) => !current);

    if (this.isEditMode()) {
      this.editablePrompt = this.editedPrompt() || this.generatedPrompt() || '';
    } else {
      this.editedPrompt.set(this.editablePrompt);
      this.resetSavedState();
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

  generatePrompt(): void {
    const {
      targetLanguage,
      cefr,
      words,
      situationalContext,
      situationalContextIsDialog,
    } = this.form.value;
    if (!words || !Array.isArray(words)) {
      return;
    }
    const config: VocabularyPromptConfig = {
      targetLanguage: targetLanguage!,
      cefr: cefr!,
      numberOfWords: words.length,
      exerciseType: 'vocabulary',
      wordList: words.map((word) => ({ word })),
      situationalContext: situationalContext,
      isDialog: situationalContextIsDialog,
    };

    this.generatedPrompt.set(
      this.promptTemplateService.generateVocabularyPrompt(config)
    );
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        category: 'vocabulary' as PromptCategory,
        targetLanguage: formValue.targetLanguage,
        cefr: formValue.cefr,
        content: this.editedPrompt() || this.generatedPrompt(),
        name: `Vokabelübung - ${formValue.words.join(', ')}`,
        description: `Vokabelübung für ${formValue.targetLanguage} (${
          formValue.cefr
        }) mit den Wörtern: ${formValue.words.join(', ')}`,
        tags: formValue.words,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          // Ensure all required fields are set
          const prompt: Omit<
            LibraryPrompt,
            'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
          > = {
            category: 'vocabulary',
            targetLanguage: formValue.targetLanguage!,
            cefr: formValue.cefr!,
            content: this.editedPrompt() || this.generatedPrompt(),
            name: result.name || `Vokabelübung - ${formValue.words.join(', ')}`,
            description:
              result.description ||
              `Vokabelübung für ${formValue.targetLanguage} (${
                formValue.cefr
              }) mit den Wörtern: ${formValue.words.join(', ')}`,
            tags: result.tags || formValue.words,
          };

          this.libraryService.addPrompt(prompt).subscribe({
            next: () => {
              this.isSavedToLibrary.set(true);
              this.snackBar.open(
                'Prompt in Bibliothek gespeichert',
                'Schließen',
                {
                  duration: 3000,
                }
              );
            },
            error: (error: Error) => {
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

  private resetSavedState(): void {
    this.isSavedToLibrary.set(false);
  }
}
