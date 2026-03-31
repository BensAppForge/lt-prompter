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
  WordfieldPromptConfig,
  WordfieldSourceType,
  WORDFIELD_SOURCE_TYPES,
  WordfieldOutputType,
  WORDFIELD_OUTPUT_TYPES,
} from '../../models/wordfield.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { BaseExerciseComponent } from '../shared/base-exercise.component';

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
export class WordfieldComponent extends BaseExerciseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly promptService = inject(PromptTemplateService);

  form: FormGroup;

  readonly sourceTypes = WORDFIELD_SOURCE_TYPES;
  readonly outputTypes = WORDFIELD_OUTPUT_TYPES;

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

  constructor() {
    super();
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
      outputType: ['', Validators.required],
    });
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


  getSourceTypeTranslation(type: WordfieldSourceType): string {
    return this.sourceTypeTranslations[type] || type;
  }

  getOutputTypeTranslation(type: WordfieldOutputType): string {
    return this.outputTypeTranslations[type] || type;
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    this.openSaveDialog({
      category: 'wordfield',
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
      name: `Wortfeld - ${this.getSourceTypeTranslation(formValue.sourceType)} (${this.getOutputTypeTranslation(formValue.outputType)})`,
      description: `Wortfeld für ${formValue.targetLanguage} (${formValue.cefr}) basierend auf ${this.getSourceTypeTranslation(formValue.sourceType)}, Ausgabe als ${this.getOutputTypeTranslation(formValue.outputType)}`,
      tags: ['wordfield', formValue.sourceType, formValue.outputType],
    });
  }
}
