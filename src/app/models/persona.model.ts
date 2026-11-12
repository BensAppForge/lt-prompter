import { CEFRLevel, Language } from './preferences.model';

/** What kind of character the AI plays — decides how it handles facts. */
export type PersonaType = 'historical' | 'fictional' | 'everyday';

export const PERSONA_TYPES: readonly {
  value: PersonaType;
  label: string;
  /** Example shown as placeholder in the "Persona" field. */
  example: string;
  /** Example for the "Kurzbeschreibung" field. */
  descriptionExample: string;
}[] = [
  {
    value: 'historical',
    label: 'Reale Persönlichkeit',
    example: 'z. B. Dante Alighieri, Frida Kahlo, Marie Curie',
    descriptionExample: 'z. B. il famoso poeta italiano del Trecento',
  },
  {
    value: 'fictional',
    label: 'Literarische oder fiktive Figur',
    example: 'z. B. Sherlock Holmes, Don Quijote, Le Petit Prince',
    descriptionExample: 'z. B. the detective from the stories by Arthur Conan Doyle',
  },
  {
    value: 'everyday',
    label: 'Erfundene Alltagsperson',
    example: 'z. B. Camille, boulangère à Lyon',
    descriptionExample: 'z. B. 45 ans, tient la boulangerie de ses parents',
  },
];

/** Who drives the conversation. */
export type PersonaConversationStyle = 'interview' | 'dialogue';

export const PERSONA_CONVERSATION_STYLES: readonly {
  value: PersonaConversationStyle;
  label: string;
  hint: string;
}[] = [
  {
    value: 'interview',
    label: 'Interview',
    hint: 'Die Lernenden fragen, die Persona antwortet und lädt zur nächsten Frage ein.',
  },
  {
    value: 'dialogue',
    label: 'Dialog',
    hint: 'Die Persona stellt nach jeder Antwort selbst eine einfache Gegenfrage – mehr Schreibanlässe.',
  },
];

/** How the persona reacts to language mistakes in the learners' messages. */
export type PersonaErrorHandling = 'none' | 'recast' | 'explicit';

export const PERSONA_ERROR_HANDLING: readonly {
  value: PersonaErrorHandling;
  label: string;
}[] = [
  { value: 'none', label: 'Nicht korrigieren (Gesprächsfluss hat Vorrang)' },
  {
    value: 'recast',
    label: 'Beiläufig richtigstellen (korrekte Form in der Antwort aufgreifen)',
  },
  {
    value: 'explicit',
    label: 'Kurz korrigieren (höchstens ein Hinweis pro Antwort)',
  },
];

/**
 * Literary past tenses that learners below the upper levels have not met.
 * The ISB example prompt bans the passato remoto for exactly this reason.
 */
export const PERSONA_LITERARY_TENSE: Partial<
  Record<Language, { tense: string; instead: string }>
> = {
  italiano: {
    tense: 'Passato remoto',
    instead: 'Passato prossimo und Imperfetto',
  },
  français: { tense: 'Passé simple', instead: 'Passé composé und Imparfait' },
};

export const PERSONA_SENTENCE_LIMITS = { min: 2, max: 8, default: 4 } as const;
export const PERSONA_TURN_LIMITS = { min: 5, max: 30, default: 12 } as const;

export interface PersonaPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  personaType: PersonaType;
  /** Who the AI plays, e.g. "Dante Alighieri". */
  persona: string;
  /** Optional apposition, e.g. "il famoso poeta italiano". */
  personaDescription?: string;
  /** Topics the conversation should centre on. */
  topics?: string;
  /** What the learners are supposed to find out. */
  researchGoal?: string;
  conversationStyle: PersonaConversationStyle;
  maxSentences: number;
  errorHandling: PersonaErrorHandling;
  /** Ban the passato remoto / passé simple (ignored for other languages). */
  avoidLiteraryTense?: boolean;
  /** Further language rules in the teacher's own words. */
  languageNotes?: string;
  /** End the conversation after about this many learner messages. */
  turnLimit?: number;
  /** Close with a summary of what was learned. */
  closingSummary?: boolean;
  /** Close with short feedback on the learner's language. */
  closingFeedback?: boolean;
  /** Further limits in the teacher's own words. */
  extraRules?: string;
}
