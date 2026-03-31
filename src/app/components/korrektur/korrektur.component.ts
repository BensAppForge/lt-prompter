import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  computed,
  effect,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  NonNullableFormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Language, CEFRLevel } from '../../models/preferences.model';
import {
  KorrekturSourceType,
  KorrekturPromptConfig,
} from '../../models/korrektur.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { ClipboardService } from '../../services/clipboard.service';
import { LanguageService } from '../../services/language.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { LibraryService } from '../../services/library.service';
import { SaveToLibraryDialogComponent } from '../shared/save-to-library-dialog/save-to-library-dialog.component';
import { PromptCategory, LibraryPrompt } from '../../models/library.model';

@Component({
  selector: 'app-korrektur',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './korrektur.component.html',
  styleUrls: ['./korrektur.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KorrekturComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptTemplateService);
  private readonly scrollService = inject(ScrollService);
  private readonly clipboardService = inject(ClipboardService);
  private readonly languageService = inject(LanguageService);
  private readonly dialog = inject(MatDialog);
  private readonly libraryService = inject(LibraryService);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup;
  readonly sourceTypes: KorrekturSourceType[] = [
    'copied-text',
    'pdf',
    'screenshot',
  ];
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
    'C1+',
    'C2',
  ];
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

  @ViewChild('promptContainer') promptContainer?: ElementRef;

  constructor() {
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
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

  getLanguageCode(language: Language): string {
    return this.languageService.getLanguageCode(language);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
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
      this.editablePrompt = this._editedPrompt() || this._generatedPrompt();
    } else {
      this._editedPrompt.set(this.editablePrompt);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: KorrekturPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        sourceType: formValue.sourceType!,
      };

      this._generatedPrompt.set(
        this.promptService.generateKorrekturPrompt(config)
      );
      this._isSavedToLibrary.set(false);
    }
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    const dialogRef = this.dialog.open(SaveToLibraryDialogComponent, {
      width: '600px',
      data: {
        category: 'korrektur' as PromptCategory,
        targetLanguage: formValue.targetLanguage,
        cefr: formValue.cefr,
        content: this.displayedPrompt(),
        name: `Korrektur - ${formValue.cefr}`,
        description: `Korrekturprompt für ${formValue.targetLanguage} (${formValue.cefr}) basierend auf ${formValue.sourceType}`,
        tags: ['korrektur', formValue.sourceType],
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result) {
          const prompt: Omit<
            LibraryPrompt,
            'id' | 'createdAt' | 'updatedAt' | 'lastUsed'
          > = {
            category: 'korrektur' as PromptCategory,
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
