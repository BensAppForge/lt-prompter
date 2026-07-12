import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatSliderModule,
    MatSlideToggleModule,
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

  // Optional explicit number of word-field entries
  readonly specifyWordCount = signal(false);
  readonly wordCount = signal(20);

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
    const editorState = this.consumeEditorConfig();
    if (editorState) {
      this.applyEditorState(editorState);
    } else {
      this.applyDefaultPreferences(this.form);
    }
  }

  private captureEditorState(): Record<string, unknown> {
    return {
      form: this.form.getRawValue(),
      specifyWordCount: this.specifyWordCount(),
      wordCount: this.wordCount(),
    };
  }

  private applyEditorState(state: Record<string, unknown>): void {
    this.form.patchValue((state['form'] ?? {}) as Record<string, unknown>);
    this.specifyWordCount.set(!!state['specifyWordCount']);
    if (typeof state['wordCount'] === 'number') {
      this.wordCount.set(state['wordCount']);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: WordfieldPromptConfig = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        sourceType: formValue.sourceType!,
        outputType: formValue.outputType!,
        wordCount: this.specifyWordCount() ? this.wordCount() : undefined,
      };

      this.commitGeneratedPrompt(
        this.promptService.generateWordfieldPrompt(config)
      );
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
      editorConfig: { route: '/wordfield', state: this.captureEditorState() },
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
      name: `Wortfeld - ${this.getSourceTypeTranslation(formValue.sourceType)} (${this.getOutputTypeTranslation(formValue.outputType)})`,
      description: `Wortfeld für ${formValue.targetLanguage} (${formValue.cefr}) basierend auf ${this.getSourceTypeTranslation(formValue.sourceType)}, Ausgabe als ${this.getOutputTypeTranslation(formValue.outputType)}`,
      tags: ['wordfield', formValue.sourceType, formValue.outputType],
    });
  }
}
