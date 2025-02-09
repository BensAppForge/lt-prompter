import { Language } from '../models/preferences.model';
export interface ClonePromptTemplate {
  exercisesIntro: string;
  contextIntro: string;
  autoContextIntro: string;
  requirementsIntro: string;
  requirements: string[];
}
export type ClonePromptTemplates = {
  [key in Language]: ClonePromptTemplate;
};
let englishIntro: string =
  'You are an expert in teaching [TARGET_LANGUAGE] as a foreign language.\n';
englishIntro += 'Your students are German teenagers.\n';
englishIntro += 'Their CEFR level is [CEFR].\n';
englishIntro += 'Analyze the exercise I provide and create a similar one.\n';
englishIntro += 'The source exercise will be given as a [CLONE_SOURCE_TYPE].\n';
//!SECTION:French
let frenchIntro: string =
  "Vous êtes un expert dans l'enseignement du [TARGET_LANGUAGE] comme langue étrangère.\n";
frenchIntro += 'Vos élèves sont des adolescents allemands.\n';
frenchIntro += 'Leur niveau CECR est [CEFR].\n';
frenchIntro +=
  "Analysez l'exercice que je vous fournis et créez-en un similaire.\n";
frenchIntro +=
  "L'exercice source sera fourni sous la forme d'un(e) [CLONE_SOURCE_TYPE].\n";
//!SECTION:Spanish
let spanishIntro: string =
  'Eres un experto en la enseñanza de [TARGET_LANGUAGE] como lengua extranjera.\n';
spanishIntro += 'Tus alumnos son adolescentes alemanes.\n';
spanishIntro += 'Su nivel del MCER es [CEFR].\n';
spanishIntro += 'Analiza el ejercicio que te proporciono y crea uno similar.\n';
spanishIntro +=
  'El ejercicio original se proporcionará en formato [CLONE_SOURCE_TYPE].\n';
//!SECTION:Italian
let italianIntro: string =
  "Sei un esperto nell'insegnamento del [TARGET_LANGUAGE] come lingua straniera.\n";
italianIntro += 'I tuoi studenti sono adolescenti tedeschi.\n';
italianIntro += 'Il loro livello QCER è [CEFR].\n';
italianIntro +=
  "Analizza l'esercizio che ti fornirò e crea un'attività simile.\n";
italianIntro +=
  "L'esercizio originale sarà fornito in formato [CLONE_SOURCE_TYPE].\n";
export const clonePromptTemplates: ClonePromptTemplates = {
  English: {
    exercisesIntro: englishIntro,
    contextIntro: 'Context:\n',
    autoContextIntro: 'Keep the context used in the source\n',
    requirementsIntro: 'Additional requirements:',
    requirements: ['Keep the same length as the source.'],
  },
  français: {
    exercisesIntro: frenchIntro,
    contextIntro: 'Contexte:\n',
    autoContextIntro: 'Conservez le contexte utilisé dans la source\n',
    requirementsIntro: 'Exigences supplémentaires:',
    requirements: ['Gardez la même longueur que la source.'],
  },
  español: {
    exercisesIntro: spanishIntro,
    contextIntro: 'Contexto:\n',
    autoContextIntro: 'Mantén el contexto utilizado en la fuente\n',
    requirementsIntro: 'Requisitos adicionales:',
    requirements: ['Mantén la misma longitud que la fuente.'],
  },
  italiano: {
    exercisesIntro: italianIntro,
    contextIntro: 'Contesto:\n',
    autoContextIntro: 'Mantieni il contesto usato nella fonte\n',
    requirementsIntro: 'Requisiti aggiuntivi:',
    requirements: ['Mantieni la stessa lunghezza della fonte.'],
  },
};
