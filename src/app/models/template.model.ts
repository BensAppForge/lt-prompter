import { CEFRLevel, Language } from './preferences.model';
import { VocabularyExerciseType } from './vocabulary.model';

export interface Template {
  id?: number;
  name: string;
  content: string;
  exerciseType: VocabularyExerciseType;
  language?: Language;
  cefrLevel?: CEFRLevel;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface PromptTemplate extends Omit<Template, 'id' | 'createdAt' | 'updatedAt'> {
  variables?: Record<string, string>;
}
