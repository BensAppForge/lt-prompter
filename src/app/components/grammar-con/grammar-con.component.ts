import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  NonNullableFormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import {
  GrammarPromptConfig,
  GrammarPhenomenon,
} from '../../models/grammar.model';
import { BaseExerciseComponent } from '../shared/base-exercise.component';
import { Language, CEFRLevel } from '../../models/preferences.model';

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
export class GrammarConComponent extends BaseExerciseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly promptService = inject(PromptTemplateService);

  // Grammar-con uses a copyStatus signal for 3-state visual feedback
  private readonly _copyStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly copyStatus = computed(() => this._copyStatus());

  readonly form: FormGroup;

  constructor() {
    super();
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
      this.commitGeneratedPrompt(prompt);
    }
  }

  // Override copyToClipboard with signal-based 3-state feedback
  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  override async copyToClipboard(text: string): Promise<void> {
    clearTimeout(this.copyFeedbackTimer);
    const success = await this.clipboardService.copy(text);
    this._copyStatus.set(success ? 'success' : 'error');
    this.copyFeedbackTimer = setTimeout(() => this._copyStatus.set('idle'), 2000);
  }

  saveToLibrary(): void {
    const formValue = this.form.getRawValue() as GrammarFormValue;
    const phenomena = formValue.phenomena.map((p) => p.description).join(', ');

    this.openSaveDialog({
      category: 'grammar',
      targetLanguage: formValue.targetLanguage,
      cefr: formValue.cefr,
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
    });
  }
}
