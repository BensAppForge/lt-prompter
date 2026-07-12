import { Language } from '../models/preferences.model';
export interface ClonePromptTemplate {
  exercisesIntro: string;
  contextIntro: string;
  autoContextIntro: string;
  requirementsIntro: string;
  requirements: string[];
  /** Default requirement: keep the source length. */
  sameLengthRequirement: string;
  /** Used instead when the teacher sets an explicit item count ([COUNT]). */
  itemCountRequirement: string;
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
  'Eres un experto en la enseñanza del [TARGET_LANGUAGE] como lengua extranjera.\n';
spanishIntro += 'Tus alumnos son adolescentes alemanes.\n';
spanishIntro += 'Su nivel del MCER es [CEFR].\n';
spanishIntro += 'Analiza el ejercicio que te proporciono y crea uno similar.\n';
spanishIntro +=
  'El ejercicio original se proporcionará en formato [CLONE_SOURCE_TYPE].\n';
//!SECTION:Italian
let italianIntro: string =
  "Sei un esperto nell'insegnamento dell'[TARGET_LANGUAGE] come lingua straniera.\n";
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
    autoContextIntro: 'Keep the context used in the source.\n',
    requirementsIntro: 'Additional requirements:',
    sameLengthRequirement: 'Keep the same length as the source.',
    itemCountRequirement:
      'The new exercise must contain exactly [COUNT] items, regardless of the length of the source.',
    requirements: [
      'Mimic the layout of the source exercise. Output as a printable and editable document, not as a webpage.',
      'Adjust the complexity to match the [CEFR] level.',
      'Provide a solution key.',
      'For gap filling exercises: Provide the solutions by filling the gaps with the correct forms in bold.',
    ],
  },
  français: {
    exercisesIntro: frenchIntro,
    contextIntro: 'Contexte :\n',
    autoContextIntro: 'Conservez le contexte utilisé dans la source.\n',
    requirementsIntro: 'Exigences supplémentaires :',
    sameLengthRequirement: 'Gardez la même longueur que la source.',
    itemCountRequirement:
      "Le nouvel exercice doit contenir exactement [COUNT] éléments, indépendamment de la longueur de la source.",
    requirements: [
      "Imitez la mise en page de l'exercice source. Produisez un document imprimable et modifiable, pas une page web.",
      'Adaptez la complexité au niveau [CEFR].',
      'Fournissez un corrigé.',
      'Pour les exercices à trous : fournissez les solutions en remplissant les espaces avec les formes correctes en gras.',
    ],
  },
  español: {
    exercisesIntro: spanishIntro,
    contextIntro: 'Contexto:\n',
    autoContextIntro: 'Mantén el contexto utilizado en la fuente.\n',
    requirementsIntro: 'Requisitos adicionales:',
    sameLengthRequirement: 'Mantén la misma longitud que la fuente.',
    itemCountRequirement:
      'El nuevo ejercicio debe contener exactamente [COUNT] elementos, independientemente de la longitud de la fuente.',
    requirements: [
      'Imita el diseño del ejercicio original. Genera un documento imprimible y editable, no una página web.',
      'Ajusta la complejidad al nivel [CEFR].',
      'Proporciona una clave de respuestas.',
      'Para ejercicios de completar espacios: proporciona las soluciones rellenando los huecos con las formas correctas en negrita.',
    ],
  },
  italiano: {
    exercisesIntro: italianIntro,
    contextIntro: 'Contesto:\n',
    autoContextIntro: 'Mantieni il contesto usato nella fonte.\n',
    requirementsIntro: 'Requisiti aggiuntivi:',
    sameLengthRequirement: 'Mantieni la stessa lunghezza della fonte.',
    itemCountRequirement:
      "Il nuovo esercizio deve contenere esattamente [COUNT] elementi, indipendentemente dalla lunghezza della fonte.",
    requirements: [
      "Imita il layout dell'esercizio originale. Produci un documento stampabile e modificabile, non una pagina web.",
      'Adatta la complessità al livello [CEFR].',
      'Fornisci una chiave di soluzione.',
      'Per gli esercizi con spazi vuoti: fornisci le soluzioni riempiendo gli spazi con le forme corrette in grassetto.',
    ],
  },
};
