import { Language, CEFRLevel } from './preferences.model';

export type KorrekturSourceType = 'screenshot' | 'pdf' | 'copied-text';

export type KorrekturCriteriaSourceType = 'screenshot' | 'txt' | 'docx' | 'pdf';

export const KORREKTUR_CRITERIA_SOURCE_TYPES: {
  value: KorrekturCriteriaSourceType;
  label: string;
}[] = [
  { value: 'screenshot', label: 'Screenshot / Bild' },
  { value: 'txt', label: 'Textdatei (TXT)' },
  { value: 'docx', label: 'Word-Dokument' },
  { value: 'pdf', label: 'PDF' },
];

export interface KorrekturPromptConfig {
  targetLanguage: Language;
  cefr: CEFRLevel;
  sourceType: KorrekturSourceType;
  /** Request written feedback on structure and content in addition to the
   * error visualisation. */
  includeFeedback?: boolean;
  /** Set when the teacher will attach assessment criteria / a sample solution
   * in their AI tool; names the attachment format. */
  criteriaSourceType?: KorrekturCriteriaSourceType;
}
