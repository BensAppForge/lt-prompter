import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';

import {
  FormArray,
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Language, CEFRLevel } from '../../models/preferences.model';
import {
  VocabularyPromptConfig,
  VocabularyExerciseType,
  VOCABULARY_EXERCISE_TYPES,
} from '../../models/vocabulary.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { BaseExerciseComponent } from '../shared/base-exercise.component';

interface VocabularyForm {
  targetLanguage: Language;
  cefr: CEFRLevel;
  exerciseTypes: VocabularyExerciseType[];
  words: string[];
  situationalContext: string;
  situationalContextIsDialog: boolean;
}

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [
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
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
    AutoAnimateDirective,
  ],
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabularyComponent extends BaseExerciseComponent implements OnInit {
  private readonly promptTemplateService = inject(PromptTemplateService);
  private readonly fb = inject(NonNullableFormBuilder);

  // Vocabulary uses separate success/error signals for visual feedback
  readonly copySuccess = signal(false);
  readonly copyError = signal(false);

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly form = this.fb.group({
    targetLanguage: this.fb.control<Language | null>(null, Validators.required),
    cefr: this.fb.control<CEFRLevel | null>(null, Validators.required),
    exerciseTypes: this.fb.control<VocabularyExerciseType[]>([], [
      Validators.required,
      Validators.minLength(1)
    ]),
    words: this.fb.array<string>(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
    situationalContext: this.fb.control(''),
    situationalContextIsDialog: this.fb.control(false),
  });

  readonly exerciseTypes = VOCABULARY_EXERCISE_TYPES;

  get selectedExerciseTypes(): VocabularyExerciseType[] {
    return this.form.get('exerciseTypes')?.value || [];
  }

  get hasGapFillingSelected(): boolean {
    return this.selectedExerciseTypes.includes('gap-filling');
  }

  isExerciseTypeSelected(type: VocabularyExerciseType): boolean {
    return this.selectedExerciseTypes.includes(type);
  }

  onExerciseTypeChange(event: { checked: boolean }, type: VocabularyExerciseType): void {
    const currentTypes = this.selectedExerciseTypes;
    if (event.checked && !currentTypes.includes(type)) {
      this.form.patchValue({
        exerciseTypes: [...currentTypes, type],
      });
    } else if (!event.checked && currentTypes.includes(type)) {
      this.form.patchValue({
        exerciseTypes: currentTypes.filter(t => t !== type),
      });
      if (type === 'gap-filling') {
        this.form.patchValue({ situationalContextIsDialog: false });
      }
    }
  }

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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: VocabularyPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        numberOfWords: formValue.words.length,
        exerciseTypes: formValue.exerciseTypes!,
        wordList: formValue.words.map((word) => ({ word })),
        situationalContext: formValue.situationalContext,
        isDialog: formValue.situationalContextIsDialog,
      };

      this._generatedPrompt.set(
        this.promptTemplateService.generateVocabularyPrompt(config)
      );
    }
  }

  // Override copyToClipboard with signal-based feedback (copySuccess/copyError)
  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  override async copyToClipboard(text: string): Promise<void> {
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

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    this.openSaveDialog({
      category: 'vocabulary',
      targetLanguage: formValue.targetLanguage!,
      cefr: formValue.cefr!,
      name: `Vokabelübung - ${formValue.words.join(', ')}`,
      description: `Vokabelübung für ${formValue.targetLanguage} (${
        formValue.cefr
      }) mit ${formValue.exerciseTypes?.length || 1} Übungstyp(en) und den Wörtern: ${formValue.words.join(', ')}`,
      tags: formValue.words,
    });
  }
}
