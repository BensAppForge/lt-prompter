import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
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
  VocabularyInputMode,
  VocabularySourceType,
  VOCABULARY_EXERCISE_TYPES,
  VOCABULARY_SOURCE_TYPES,
} from '../../models/vocabulary.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { AutoAnimateDirective } from '../../shared/directives/auto-animate.directive';
import { BaseExerciseComponent } from '../shared/base-exercise.component';

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
    MatSliderModule,
    MatButtonModule,
    MatButtonToggleModule,
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
export class VocabularyComponent extends BaseExerciseComponent {
  private readonly promptTemplateService = inject(PromptTemplateService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly copySuccess = signal(false);
  readonly copyError = signal(false);

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  readonly form = this.fb.group({
    targetLanguage: this.fb.control<Language | null>(null, Validators.required),
    cefr: this.fb.control<CEFRLevel | null>(null, Validators.required),
    exerciseTypes: this.fb.control<VocabularyExerciseType[]>([], [
      Validators.required,
      Validators.minLength(1),
    ]),
    words: this.fb.array<string>(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
    situationalContext: this.fb.control(''),
    situationalContextIsDialog: this.fb.control(false),
  });

  readonly exerciseTypes = VOCABULARY_EXERCISE_TYPES;
  readonly sourceTypes = VOCABULARY_SOURCE_TYPES;

  constructor() {
    super();
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
      inputMode: this.inputMode(),
      sourceType: this.sourceType(),
      specifyCounts: this.specifyCounts(),
      itemCounts: this.itemCounts(),
    };
  }

  private applyEditorState(state: Record<string, unknown>): void {
    if (state['inputMode']) {
      this.onInputModeChange(state['inputMode'] as VocabularyInputMode);
    }
    if (state['sourceType']) {
      this.sourceType.set(state['sourceType'] as VocabularySourceType);
    }
    const f = (state['form'] ?? {}) as Record<string, unknown>;
    this.words.clear();
    ((f['words'] as string[]) ?? []).forEach((word) =>
      this.words.push(this.fb.control(word))
    );
    this.form.patchValue({
      targetLanguage: (f['targetLanguage'] as Language) ?? null,
      cefr: (f['cefr'] as CEFRLevel) ?? null,
      exerciseTypes: (f['exerciseTypes'] as VocabularyExerciseType[]) ?? [],
      situationalContext: (f['situationalContext'] as string) ?? '',
      situationalContextIsDialog: !!f['situationalContextIsDialog'],
    });
    this.specifyCounts.set(!!state['specifyCounts']);
    this.itemCounts.set(
      (state['itemCounts'] as Partial<
        Record<VocabularyExerciseType, number>
      >) ?? {}
    );
  }

  readonly inputMode = signal<VocabularyInputMode>('manual');
  readonly sourceType = signal<VocabularySourceType | null>(null);

  // Optional per-exercise-type item counts
  readonly DEFAULT_ITEM_COUNT = 4;
  readonly specifyCounts = signal(false);
  readonly itemCounts = signal<Partial<Record<VocabularyExerciseType, number>>>({});

  /** Selected types that can take an explicit count: all in file mode; in
   * manual mode only those whose count isn't dictated by the word list. */
  countableSelectedTypes(): typeof VOCABULARY_EXERCISE_TYPES {
    const selected = this.selectedExerciseTypes;
    return this.exerciseTypes.filter(
      (t) =>
        selected.includes(t.value) &&
        (this.inputMode() === 'file' || !t.countBoundToWords)
    );
  }

  /** True when the hint about word-list-bound types should be shown. */
  hasWordBoundSelection(): boolean {
    return (
      this.inputMode() === 'manual' &&
      this.exerciseTypes.some(
        (t) => t.countBoundToWords && this.selectedExerciseTypes.includes(t.value)
      )
    );
  }

  getCount(type: VocabularyExerciseType): number {
    return this.itemCounts()[type] ?? this.DEFAULT_ITEM_COUNT;
  }

  onCountChange(type: VocabularyExerciseType, value: number): void {
    this.itemCounts.update((counts) => ({ ...counts, [type]: value }));
  }

  /** True when every selected type has a slider, so the total/ratio summary
   * is meaningful (file mode, or manual mode without word-bound types). */
  allSelectedTypesCountable(): boolean {
    const selectedCount = this.selectedExerciseTypes.length;
    return (
      selectedCount > 0 &&
      this.countableSelectedTypes().length === selectedCount
    );
  }

  /** Live summary like "Gesamt: 8 Aufgaben · Verhältnis 25 % : 75 %". */
  countSummary(): string {
    const types = this.countableSelectedTypes();
    const total = types.reduce((sum, t) => sum + this.getCount(t.value), 0);
    if (types.length < 2) {
      return `Gesamt: ${total} Aufgaben`;
    }
    const ratio = types
      .map((t) => `${Math.round((this.getCount(t.value) / total) * 100)} %`)
      .join(' : ');
    return `Gesamt: ${total} Aufgaben · Verhältnis ${ratio}`;
  }

  canSubmit(): boolean {
    if (this.inputMode() === 'manual') {
      return this.form.valid;
    }
    return (
      this.form.get('targetLanguage')!.valid &&
      this.form.get('cefr')!.valid &&
      this.form.get('exerciseTypes')!.valid &&
      this.sourceType() !== null
    );
  }

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

  /** Pasted word lists (comma-, semicolon-, tab- or newline-separated, e.g.
   * from a textbook PDF or spreadsheet) are split into individual chips. */
  onWordsPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    if (!/[,;\t\n]/.test(text)) {
      return; // single word: keep default paste behaviour
    }
    event.preventDefault();
    text
      .split(/[,;\t\n]+/)
      .map((word) => word.trim())
      .filter(Boolean)
      .forEach((word) => this.words.push(this.fb.control(word)));
    (event.target as HTMLInputElement).value = '';
  }

  removeWord(index: number): void {
    this.words.removeAt(index);
  }

  onInputModeChange(mode: VocabularyInputMode): void {
    this.inputMode.set(mode);
    if (mode === 'manual') {
      this.sourceType.set(null);
      this.words.setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      this.words.clearValidators();
    }
    this.words.updateValueAndValidity();
  }

  onSourceTypeChange(type: VocabularySourceType): void {
    this.sourceType.set(type);
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;

    const formValue = this.form.getRawValue();
    const mode = this.inputMode();

    const config: VocabularyPromptConfig = {
      targetLanguage: formValue.targetLanguage!,
      cefr: formValue.cefr!,
      numberOfWords: mode === 'manual' ? formValue.words.length : 0,
      exerciseTypes: formValue.exerciseTypes!,
      wordList: mode === 'manual'
        ? formValue.words.map((word) => ({ word }))
        : [],
      situationalContext: formValue.situationalContext,
      isDialog: formValue.situationalContextIsDialog,
      inputMode: mode,
      sourceType: mode === 'file' ? this.sourceType() ?? undefined : undefined,
      itemCounts: this.specifyCounts()
        ? Object.fromEntries(
            this.countableSelectedTypes().map((t) => [
              t.value,
              this.getCount(t.value),
            ])
          )
        : undefined,
    };

    this.commitGeneratedPrompt(
      this.promptTemplateService.generateVocabularyPrompt(config)
    );
  }

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
    const mode = this.inputMode();
    const sourceLabel = mode === 'manual'
      ? formValue.words.join(', ')
      : this.sourceTypes.find(s => s.value === this.sourceType())?.label ?? 'Datei';

    const tags = mode === 'manual'
      ? formValue.words
      : [this.sourceType() ?? 'file'];

    const description = mode === 'manual'
      ? `Vokabelübung für ${formValue.targetLanguage} (${formValue.cefr}) mit ${
          formValue.exerciseTypes?.length || 1
        } Übungstyp(en) und den Wörtern: ${formValue.words.join(', ')}`
      : `Vokabelübung für ${formValue.targetLanguage} (${formValue.cefr}) mit ${
          formValue.exerciseTypes?.length || 1
        } Übungstyp(en) – Quelle: ${sourceLabel}`;

    this.openSaveDialog({
      category: 'vocabulary',
      editorConfig: { route: '/vocabulary', state: this.captureEditorState() },
      targetLanguage: formValue.targetLanguage!,
      cefr: formValue.cefr!,
      name: `Vokabelübung - ${sourceLabel}`,
      description,
      tags,
    });
  }
}
