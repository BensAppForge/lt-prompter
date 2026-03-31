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

  constructor() {
    super();
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
    });
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
    this.openSaveDialog({
      category: 'korrektur',
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
      name: `Korrektur - ${formValue.cefr}`,
      description: `Korrekturprompt für ${formValue.targetLanguage} (${formValue.cefr}) basierend auf ${formValue.sourceType}`,
      tags: ['korrektur', formValue.sourceType],
    });
  }
}
