export interface Preferences {
  id?: number;
  language: Language;
  level: CEFRLevel;
  theme: 'light' | 'dark';
}

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
