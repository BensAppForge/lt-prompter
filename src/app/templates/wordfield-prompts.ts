import { Language } from '../models/preferences.model';

export interface WordfieldPromptTemplate {
  intro: string;
  requirementsIntro: string;
  requirements: string[];
  /** Appended when the teacher sets an explicit entry count ([COUNT]). */
  wordCountRequirement: string;
}
export type WordfieldPromptTemplates = {
  [key in Language]: WordfieldPromptTemplate;
};
// English intro template with target language and CEFR level
let englishIntro: string =
  'You are an expert in teaching [TARGET_LANGUAGE] as a foreign language.\n';
englishIntro += 'Your students are German teenagers.\n';
englishIntro += 'Their CEFR level is [CEFR].\n';
englishIntro +=
  'Extract a thematic vocabulary from the following source: [WORDFIELD_SOURCE_TYPE]\n';
englishIntro +=
  'Create the output of the word field as follows: [WORDFIELD_OUTPUT_TYPE]\n';

// French intro template with target language and CEFR level
let frenchIntro: string =
  "Vous êtes un expert dans l'enseignement du [TARGET_LANGUAGE] comme langue étrangère.\n";
frenchIntro += 'Vos élèves sont des adolescents allemands.\n';
frenchIntro += 'Leur niveau CECR est [CEFR].\n';
frenchIntro +=
  'Extrayez un vocabulaire thématique à partir de la source suivante : [WORDFIELD_SOURCE_TYPE]\n';
frenchIntro +=
  'Présentez le champ lexical comme suit : [WORDFIELD_OUTPUT_TYPE]\n';

// Spanish intro template with target language and CEFR level
let spanishIntro: string =
  'Eres un experto en la enseñanza del [TARGET_LANGUAGE] como lengua extranjera.\n';
spanishIntro += 'Tus alumnos son adolescentes alemanes.\n';
spanishIntro += 'Su nivel del MCER es [CEFR].\n';
spanishIntro +=
  'Extrae un vocabulario temático a partir de la siguiente fuente: [WORDFIELD_SOURCE_TYPE]\n';
spanishIntro +=
  'Presenta el campo léxico de la siguiente manera: [WORDFIELD_OUTPUT_TYPE]\n';

// Italian intro template with target language and CEFR level
let italianIntro: string =
  "Sei un esperto nell'insegnamento dell'[TARGET_LANGUAGE] come lingua straniera.\n";
italianIntro += 'I tuoi studenti sono adolescenti tedeschi.\n';
italianIntro += 'Il loro livello QCER è [CEFR].\n';
italianIntro +=
  'Estrai un vocabolario tematico dalla seguente fonte: [WORDFIELD_SOURCE_TYPE]\n';
italianIntro += 'Presentalo nel modo seguente: [WORDFIELD_OUTPUT_TYPE]\n';

export const wordfieldPromptTemplates: WordfieldPromptTemplates = {
  English: {
    intro: englishIntro,
    requirementsIntro: 'Additional requirements:',
    wordCountRequirement:
      'The word field must contain exactly [COUNT] entries.',
    requirements: [
      'The output should contain the most important thematically relevant words or phrases.',
      "The word field should match the students' CEFR level: [CEFR].",
      'If the output is a table, it should have exactly these four columns: Lemma | Example sentence | Definition | German translation.',
      'If the output is in Markdown, it should be structured hierarchically so that it can be imported into a mind-mapping app.',
    ],
  },
  français: {
    intro: frenchIntro,
    requirementsIntro: 'Exigences supplémentaires :',
    wordCountRequirement:
      'Le champ lexical doit contenir exactement [COUNT] entrées.',
    requirements: [
      'La sortie doit contenir les mots ou expressions thématiques les plus importants.',
      'Le champ lexical doit correspondre au niveau CECR des élèves : [CEFR].',
      'Si la sortie est un tableau, elle doit comporter exactement ces quatre colonnes : Lemme | Phrase d’exemple | Définition | Traduction allemande.',
      'Si la sortie est en Markdown, elle doit être structurée hiérarchiquement afin de pouvoir être importée dans une application de mind-mapping.',
    ],
  },
  español: {
    intro: spanishIntro,
    requirementsIntro: 'Requisitos adicionales:',
    wordCountRequirement:
      'El campo léxico debe contener exactamente [COUNT] entradas.',
    requirements: [
      'La salida debe contener las palabras o frases temáticas más importantes.',
      'El campo léxico debe coincidir con el nivel del MCER de los alumnos: [CEFR].',
      'Si la salida es una tabla, debe tener exactamente estas cuatro columnas: Lema | Frase de ejemplo | Definición | Traducción al alemán.',
      'Si la salida está en Markdown, debe estructurarse jerárquicamente para poder importarse en una aplicación de mapas mentales.',
    ],
  },
  italiano: {
    intro: italianIntro,
    requirementsIntro: 'Requisiti aggiuntivi:',
    wordCountRequirement:
      'Il campo lessicale deve contenere esattamente [COUNT] voci.',
    requirements: [
      'L’output deve contenere le parole o le espressioni tematiche più importanti.',
      'Il campo lessicale deve corrispondere al livello QCER degli studenti: [CEFR].',
      'Se l’output è una tabella, deve avere esattamente queste quattro colonne: Lemma | Frase di esempio | Definizione | Traduzione tedesca.',
      'Se l’output è in Markdown, deve essere strutturato gerarchicamente per poter essere importato in un’app di mind-mapping.',
    ],
  },
};
