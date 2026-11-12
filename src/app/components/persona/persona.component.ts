import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Language } from '../../models/preferences.model';
import {
  PERSONA_CONVERSATION_STYLES,
  PERSONA_ERROR_HANDLING,
  PERSONA_LITERARY_TENSE,
  PERSONA_SENTENCE_LIMITS,
  PERSONA_TURN_LIMITS,
  PERSONA_TYPES,
  PersonaConversationStyle,
  PersonaPromptConfig,
  PersonaType,
} from '../../models/persona.model';
import { PromptTemplateService } from '../../services/prompt-template.service';
import { personaPromptTemplates } from '../../templates/persona-prompts';
import {
  BaseExerciseComponent,
  SaveToLibraryData,
} from '../shared/base-exercise.component';

/** Text fields of the form that are restored as plain strings. */
const TEXT_FIELDS = [
  'persona',
  'personaDescription',
  'topics',
  'researchGoal',
  'languageNotes',
  'extraRules',
] as const;

/** Toggles of the form that are restored as booleans. */
const TOGGLE_FIELDS = [
  'avoidLiteraryTense',
  'closingSummary',
  'closingFeedback',
] as const;

function notBlank(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim()
    ? null
    : { required: true };
}

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonaComponent extends BaseExerciseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly promptService = inject(PromptTemplateService);

  // The result is a conversation, not a worksheet
  protected override readonly offersFileOutput = false;

  readonly personaTypes = PERSONA_TYPES;
  readonly conversationStyles = PERSONA_CONVERSATION_STYLES;
  readonly errorHandlingOptions = PERSONA_ERROR_HANDLING;
  readonly sentenceLimits = PERSONA_SENTENCE_LIMITS;
  readonly turnLimits = PERSONA_TURN_LIMITS;

  form: FormGroup;

  /** Longest answer the persona may give, in sentences. */
  readonly maxSentences = signal<number>(PERSONA_SENTENCE_LIMITS.default);

  /** Optional cap on the number of learner messages. */
  readonly limitTurns = signal(false);
  readonly turnLimit = signal<number>(PERSONA_TURN_LIMITS.default);

  constructor() {
    super();
    this.form = this.fb.group({
      targetLanguage: ['', Validators.required],
      cefr: ['', Validators.required],
      personaType: ['historical' as PersonaType, Validators.required],
      persona: ['', notBlank],
      personaDescription: [''],
      topics: [''],
      researchGoal: [''],
      conversationStyle: ['interview' as PersonaConversationStyle],
      errorHandling: ['recast'],
      avoidLiteraryTense: [true],
      languageNotes: [''],
      closingSummary: [true],
      closingFeedback: [false],
      extraRules: [''],
    });
    const editorState = this.consumeEditorConfig();
    if (editorState) {
      this.applyEditorState(editorState);
    } else {
      this.applyDefaultPreferences(this.form);
    }
  }

  // --- Template helpers ---

  private get selectedType() {
    const type = this.form.getRawValue().personaType;
    return this.personaTypes.find((t) => t.value === type) ?? PERSONA_TYPES[0];
  }

  personaExample(): string {
    return this.selectedType.example;
  }

  descriptionExample(): string {
    return this.selectedType.descriptionExample;
  }

  conversationStyleHint(): string {
    const style = this.form.getRawValue().conversationStyle;
    return this.conversationStyles.find((s) => s.value === style)?.hint ?? '';
  }

  /** Passato remoto / passé simple, or null for the other languages. */
  literaryTense(): { tense: string; instead: string } | null {
    const language = this.form.getRawValue().targetLanguage as Language | '';
    return (language && PERSONA_LITERARY_TENSE[language]) || null;
  }

  hasClosing(): boolean {
    const { closingSummary, closingFeedback } = this.form.getRawValue();
    return !!closingSummary || !!closingFeedback;
  }

  /** Word the learners type to end the conversation, once a language is set. */
  stopWord(): string | null {
    const language = this.form.getRawValue().targetLanguage as Language | '';
    return language ? personaPromptTemplates[language].stopWord : null;
  }

  // --- Library round trip ---

  private captureEditorState(): Record<string, unknown> {
    return {
      form: this.form.getRawValue(),
      maxSentences: this.maxSentences(),
      limitTurns: this.limitTurns(),
      turnLimit: this.turnLimit(),
    };
  }

  private applyEditorState(state: Record<string, unknown>): void {
    // The state may come from an imported file, so don't trust its shape
    const raw = state['form'];
    const saved = (
      raw && typeof raw === 'object' ? raw : {}
    ) as Record<string, unknown>;
    const patch: Record<string, unknown> = {};

    if (this.languages.includes(saved['targetLanguage'] as never)) {
      patch['targetLanguage'] = saved['targetLanguage'];
    }
    if (this.cefrLevels.includes(saved['cefr'] as never)) {
      patch['cefr'] = saved['cefr'];
    }
    const oneOf = (key: string, options: readonly { value: string }[]) => {
      if (options.some((option) => option.value === saved[key])) {
        patch[key] = saved[key];
      }
    };
    oneOf('personaType', this.personaTypes);
    oneOf('conversationStyle', this.conversationStyles);
    oneOf('errorHandling', this.errorHandlingOptions);
    for (const key of TEXT_FIELDS) {
      if (typeof saved[key] === 'string') patch[key] = saved[key];
    }
    for (const key of TOGGLE_FIELDS) {
      if (typeof saved[key] === 'boolean') patch[key] = saved[key];
    }
    this.form.patchValue(patch);

    const within = (
      value: unknown,
      limits: { min: number; max: number }
    ): value is number =>
      typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= limits.min &&
      value <= limits.max;
    if (within(state['maxSentences'], PERSONA_SENTENCE_LIMITS)) {
      this.maxSentences.set(state['maxSentences']);
    }
    this.limitTurns.set(state['limitTurns'] === true);
    if (within(state['turnLimit'], PERSONA_TURN_LIMITS)) {
      this.turnLimit.set(state['turnLimit']);
    }
  }

  // --- Generate ---

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const config: PersonaPromptConfig = {
      targetLanguage: value.targetLanguage,
      cefr: value.cefr,
      personaType: value.personaType,
      persona: value.persona,
      personaDescription: value.personaDescription,
      topics: value.topics,
      researchGoal: value.researchGoal,
      conversationStyle: value.conversationStyle,
      maxSentences: this.maxSentences(),
      errorHandling: value.errorHandling,
      avoidLiteraryTense: value.avoidLiteraryTense,
      languageNotes: value.languageNotes,
      turnLimit: this.limitTurns() ? this.turnLimit() : undefined,
      closingSummary: value.closingSummary,
      closingFeedback: value.closingFeedback,
      extraRules: value.extraRules,
    };

    this.commitGeneratedPrompt(
      this.promptService.generatePersonaPrompt(config),
      this.buildSaveData()
    );
  }

  private buildSaveData(): SaveToLibraryData {
    const value = this.form.getRawValue();
    const persona = (value.persona as string).replace(/\s+/g, ' ').trim();
    const style =
      this.conversationStyles.find((s) => s.value === value.conversationStyle)
        ?.label ?? '';
    return {
      category: 'persona',
      editorConfig: { route: '/persona', state: this.captureEditorState() },
      targetLanguage: value.targetLanguage,
      cefr: value.cefr,
      name: `Persona-Chat - ${persona}`,
      description: `Rollenspiel mit ${persona} für ${this.displayLanguage(value.targetLanguage)} (${value.cefr}), Gesprächsform: ${style}`,
      tags: ['Persona-Chat', persona],
    };
  }
}
