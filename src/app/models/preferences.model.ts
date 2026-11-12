export type CEFRLevel =
  | 'A1'
  | 'A1+'
  | 'A2'
  | 'A2+'
  | 'B1'
  | 'B1+'
  | 'B2'
  | 'B2+'
  | 'C1'
  | 'C1+'
  | 'C2';

export type Language = 'English' | 'español' | 'français' | 'italiano';

export const LANGUAGES: readonly Language[] = [
  'English',
  'español',
  'français',
  'italiano',
];

export const CEFR_LEVELS: readonly CEFRLevel[] = [
  'A1',
  'A1+',
  'A2',
  'A2+',
  'B1',
  'B1+',
  'B2',
  'B2+',
  'C1',
  'C1+',
  'C2',
];
