export interface Preferences {
  id?: number;
  language: string;
  level: string;
  theme: 'light' | 'dark';
  lastExerciseType?: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Language = 'English' | 'French' | 'Italian' | 'Spanish';
export type ExerciseType = 'vocabulary' | 'grammar' | 'listening' | 'reading';
