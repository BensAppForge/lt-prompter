import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {
  NonNullableFormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Language } from '../../models/preferences.model';
import {
  ComprehensionExerciseType,
  ComprehensionSourceType,
  COMPREHENSION_EXERCISE_TYPES,
  SOURCE_TYPES,
  ComprehensionPromptConfig,
} from '../../models/comprehension.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { BaseExerciseComponent } from '../shared/base-exercise.component';

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
export class ComprehensionComponent extends BaseExerciseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly promptService = inject(PromptTemplateService);

  form: FormGroup;

  readonly exerciseTypes = COMPREHENSION_EXERCISE_TYPES;
  readonly sourceTypes = SOURCE_TYPES;

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

  constructor() {
    super();
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      exercises: [[], [Validators.required, Validators.minLength(2)]],
      sourceType: ['', Validators.required],
      situationalContext: [''],
      situationalContextIsDialog: [false],
    });
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

      this.commitGeneratedPrompt(
        this.promptService.generateComprehensionPrompt(config)
      );
    }
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

    this.openSaveDialog({
      category: 'comprehension',
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
      name: `Textverständnis - ${this.getSourceTypeTranslation(formValue.sourceType)}`,
      description: `Textverständnisübung für ${formValue.targetLanguage} (${formValue.cefr}) mit ${exercises}. Quelle: ${this.getSourceTypeTranslation(formValue.sourceType)}${formValue.situationalContext ? `. Kontext: ${formValue.situationalContext}` : ''}`,
      tags: ['comprehension', formValue.sourceType, ...formValue.exercises],
    });
  }
}
