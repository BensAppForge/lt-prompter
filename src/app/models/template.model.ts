import { ExerciseType, CEFRLevel, Language } from './preferences.model';

export interface Template {
  id?: number;
  name: string;
  content: string;
  exerciseType: ExerciseType;
  language?: Language;
  cefrLevel?: CEFRLevel;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface PromptTemplate extends Omit<Template, 'id' | 'createdAt' | 'updatedAt'> {
  variables?: Record<string, string>;
}
