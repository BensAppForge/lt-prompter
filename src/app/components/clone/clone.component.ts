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
import { CloneSourceType, ClonePromptConfig } from '../../models/clone.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { BaseExerciseComponent } from '../shared/base-exercise.component';

@Component({
  selector: 'app-clone',
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
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloneComponent extends BaseExerciseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly promptService = inject(PromptTemplateService);

  form: FormGroup;

  constructor() {
    super();
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      sourceType: ['', Validators.required],
      itemCount: [null, [Validators.min(1), Validators.max(50)]],
      newContext: [''],
      situationalContext: [''],
      situationalContextIsDialog: [false],
    });
    const editorState = this.consumeEditorConfig();
    if (editorState) {
      this.applyEditorState(editorState);
    } else {
      this.applyDefaultPreferences(this.form);
    }
  }

  private captureEditorState(): Record<string, unknown> {
    return { form: this.form.getRawValue() };
  }

  private applyEditorState(state: Record<string, unknown>): void {
    this.form.patchValue((state['form'] ?? {}) as Record<string, unknown>);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const config: ClonePromptConfig & { newContext?: string } = {
        targetLanguage: formValue.targetLanguage!,
        cefr: formValue.cefr!,
        sourceType: formValue.sourceType!,
        situationalContext: formValue.situationalContext,
        isDialog: formValue.situationalContextIsDialog,
        newContext: formValue.newContext,
        itemCount: formValue.itemCount
          ? Number(formValue.itemCount)
          : undefined,
      };

      this.commitGeneratedPrompt(this.promptService.generateClonePrompt(config));
    }
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue();
    this.openSaveDialog({
      category: 'clone',
      editorConfig: { route: '/clone', state: this.captureEditorState() },
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
      name: `Klonübung - ${formValue.sourceType}`,
      description: `Klonübung für ${formValue.targetLanguage} (${formValue.cefr}) basierend auf ${formValue.sourceType}${formValue.newContext ? ' mit neuem Kontext' : ''}`,
      tags: ['clone', formValue.sourceType],
    });
  }
}
