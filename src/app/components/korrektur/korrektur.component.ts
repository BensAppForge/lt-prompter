import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  NonNullableFormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
  KorrekturSourceType,
  KorrekturPromptConfig,
  KORREKTUR_CRITERIA_SOURCE_TYPES,
} from '../../models/korrektur.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { BaseExerciseComponent } from '../shared/base-exercise.component';

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
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './korrektur.component.html',
  styleUrls: ['./korrektur.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KorrekturComponent extends BaseExerciseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly promptService = inject(PromptTemplateService);

  form: FormGroup;
  readonly sourceTypes: KorrekturSourceType[] = [
    'copied-text',
    'pdf',
    'screenshot',
  ];
  readonly criteriaSourceTypes = KORREKTUR_CRITERIA_SOURCE_TYPES;

  private readonly sourceTypeLabels: Record<KorrekturSourceType, string> = {
    'copied-text': 'Kopierter Text',
    pdf: 'PDF',
    screenshot: 'Screenshot',
  };

  constructor() {
    super();
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
      includeFeedback: [false],
      providesCriteria: [false],
      criteriaSourceType: [''],
    });
  }

  canSubmit(): boolean {
    const { includeFeedback, providesCriteria, criteriaSourceType } =
      this.form.getRawValue();
    return (
      this.form.valid &&
      (!includeFeedback || !providesCriteria || !!criteriaSourceType)
    );
  }

  onSubmit(): void {
    if (this.canSubmit()) {
      const formValue = this.form.getRawValue();
      const config: KorrekturPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        sourceType: formValue.sourceType!,
        includeFeedback: formValue.includeFeedback,
        criteriaSourceType:
          formValue.includeFeedback && formValue.providesCriteria
            ? formValue.criteriaSourceType || undefined
            : undefined,
      };

      this.commitGeneratedPrompt(
        this.promptService.generateKorrekturPrompt(config)
      );
    }
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    const sourceLabel =
      this.sourceTypeLabels[formValue.sourceType as KorrekturSourceType] ??
      formValue.sourceType;
    const feedbackSuffix = formValue.includeFeedback
      ? ' mit schriftlichem Feedback zu Struktur und Inhalt'
      : '';
    this.openSaveDialog({
      category: 'korrektur',
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
      name: `Korrektur - ${formValue.cefr}`,
      description: `Korrekturprompt für ${formValue.targetLanguage} (${formValue.cefr}) basierend auf ${sourceLabel}${feedbackSuffix}`,
      tags: ['korrektur', formValue.sourceType],
    });
  }
}
