import { Language } from '../models/preferences.model';
import { BasePromptTemplate } from './vocabulary-prompts';
import { ComprehensionExerciseType } from '../models/comprehension.model';

export interface ComprehensionPromptTemplate {
  exercisesIntro: string;
  requirementsIntro: string;
  requirements: string[];
  formatInstructionsHeader: string;
  exerciseInstructionsHeader: string;
}

type ExerciseTypeInstruction = {
  [key in ComprehensionExerciseType]: string;
};

type ExerciseTypeDescription = {
  [key in ComprehensionExerciseType]: string;
};

export type ComprehensionPromptTemplates = {
  [key in Language]: ComprehensionPromptTemplate;
};

const englishExerciseTypeDescription: ExerciseTypeDescription = {
  'true-false':
    'Create a table with the following headers: Statement | True | False. Provide clear, concise statements based on the text.',
  'multiple-choice':
    'Create a list of questions with multiple options. Represent each option with a checkbox format like this: [_] Option.',
  matching:
    'Create a table with two columns: one for statements and one for possible matches. Students should match the statements on the left with the correct answers on the right.',
  'gapped-summary':
    'Write a coherent summary of the text, leaving gaps where key information should be filled in. Make sure the missing words are essential for understanding the text. Do not add more than one gap per sentence or more than one gap every five words.',
};

const frenchExerciseTypeDescription: ExerciseTypeDescription = {
  'true-false':
    'Créez un tableau avec les en-têtes suivants : Énoncé | Vrai | Faux. Proposez des affirmations claires et concises basées sur le texte.',
  'multiple-choice':
    'Rédigez une liste de questions avec plusieurs options. Représentez chaque option avec un format de case à cocher comme ceci : [_] Option.',
  matching:
    'Créez un tableau avec deux colonnes : une pour les énoncés et une pour les réponses possibles. Les élèves doivent associer les énoncés de gauche avec les bonnes réponses de droite.',
  'gapped-summary':
    'Rédigez un résumé cohérent du texte en laissant des trous pour les informations clés. Assurez-vous que les mots manquants sont essentiels à la compréhension. N’inclus pas plus de deux trous par phrase ni plus d’un trou tous les cinq mots.',
};

const spanishExerciseTypeDescription: ExerciseTypeDescription = {
  'true-false':
    'Crea una tabla con los siguientes encabezados: Enunciado | Verdadero | Falso. Proporciona afirmaciones claras y concisas basadas en el texto.',
  'multiple-choice':
    'Crea una lista de preguntas con varias opciones. Representa cada opción con un formato de casilla de verificación como este: [_] Opción.',
  matching:
    'Crea una tabla con dos columnas: una para los enunciados y otra para las respuestas posibles. Los estudiantes deben relacionar los enunciados de la izquierda con las respuestas correctas de la derecha.',
  'gapped-summary':
    'Escribe un resumen coherente del texto dejando huecos para la información clave. Asegúrate de que las palabras omitidas sean esenciales para la comprensión. No incluyas más de dos huecos por oración ni más de uno cada cinco palabras.',
};

const italianExerciseTypeDescription: ExerciseTypeDescription = {
  'true-false':
    'Crea una tabella con le seguenti intestazioni: Affermazione | Vero | Falso. Fornisci affermazioni chiare e concise basate sul testo.',
  'multiple-choice':
    'Crea un elenco di domande con diverse opzioni. Rappresenta ogni opzione con un formato di casella di controllo come questo: [_] Opzione.',
  matching:
    'Crea una tabella con due colonne: una per le affermazioni e una per le risposte possibili. Gli studenti devono abbinare le affermazioni a sinistra con le risposte corrette a destra.',
  'gapped-summary':
    'Scrivi un riassunto coerente del testo lasciando spazi vuoti per le informazioni chiave. Assicurati che le parole mancanti siano essenziali per la comprensione. Non inserire più di due spazi per frase né più di uno ogni cinque parole.',
};

export const exerciseTypeDescriptions: Record<
  Language,
  ExerciseTypeDescription
> = {
  English: englishExerciseTypeDescription,
  français: frenchExerciseTypeDescription,
  español: spanishExerciseTypeDescription,
  italiano: italianExerciseTypeDescription,
};

const englishExerciseTypeInstructions: ExerciseTypeInstruction = {
  'true-false':
    'Read each statement carefully and tick whether it is true or false.',
  'multiple-choice': 'Choose the correct option(s) and tick the box.',
  matching:
    'Match the statements on the left with the correct answers on the right.',
  'gapped-summary':
    'Fill in the gaps with the correct words based on the text.',
};

const frenchExerciseTypeInstructions: ExerciseTypeInstruction = {
  'true-false':
    "Lisez attentivement chaque énoncé et cochez s'il est vrai ou faux.",
  'multiple-choice': 'Choisissez la ou les bonnes réponses et cochez la case.',
  matching:
    'Associez les énoncés de gauche avec les bonnes réponses de droite.',
  'gapped-summary':
    'Complétez les espaces vides avec les mots corrects en vous basant sur le texte.',
};

const spanishExerciseTypeInstructions: ExerciseTypeInstruction = {
  'true-false':
    'Lee atentamente cada enunciado y marca si es verdadero o falso.',
  'multiple-choice': 'Elige la(s) opción(es) correcta(s) y marca la casilla.',
  matching:
    'Relaciona los enunciados de la izquierda con las respuestas correctas de la derecha.',
  'gapped-summary':
    'Rellena los espacios en blanco con las palabras correctas basándote en el texto.',
};

const italianExerciseTypeInstructions: ExerciseTypeInstruction = {
  'true-false':
    'Leggi attentamente ogni affermazione e indica se è vera o falsa.',
  'multiple-choice':
    "Scegli l'opzione o le opzioni corrette e spunta la casella.",
  matching:
    'Abbina le affermazioni a sinistra con le risposte corrette a destra.',
  'gapped-summary':
    'Completa gli spazi vuoti con le parole corrette basandoti sul testo.',
};

export const exerciseTypeInstructions: Record<
  Language,
  ExerciseTypeInstruction
> = {
  English: englishExerciseTypeInstructions,
  français: frenchExerciseTypeInstructions,
  español: spanishExerciseTypeInstructions,
  italiano: italianExerciseTypeInstructions,
};

// Exercise type translations for each language
export const exerciseTypeTranslations: Record<Language, Record<ComprehensionExerciseType, string>> = {
  English: {
    'true-false': 'true-false',
    'multiple-choice': 'multiple-choice',
    'matching': 'matching',
    'gapped-summary': 'gapped-summary'
  },
  français: {
    'true-false': 'vrai-faux',
    'multiple-choice': 'choix-multiple',
    'matching': 'appariement',
    'gapped-summary': 'texte-à-trous'
  },
  español: {
    'true-false': 'verdadero-falso',
    'multiple-choice': 'opción-múltiple',
    'matching': 'emparejamiento',
    'gapped-summary': 'texto-con-huecos'
  },
  italiano: {
    'true-false': 'vero-falso',
    'multiple-choice': 'scelta-multipla',
    'matching': 'abbinamento',
    'gapped-summary': 'testo-con-spazi'
  }
};

let englishIntro: string =
  'You are an expert in teaching [TARGET_LANGUAGE] as a foreign language.\n';
englishIntro += 'Your students are German teenagers.\n';
englishIntro += 'Their CEFR level is [CEFR].\n';
englishIntro +=
  'Create a set of comprehension exercises covering different aspects of the text.\n';
englishIntro +=
  'The exercises should be of the following types: [COMPREHENSION_TYPES].\n';
englishIntro +=
  'I will provide the source text as [COMPREHENSION_SOURCE_TYPE].\n';
let frenchIntro: string =
  'Vous êtes un expert en enseignement du [TARGET_LANGUAGE] comme langue étrangère.\n';
frenchIntro += 'Vos élèves sont des adolescents allemands.\n';
frenchIntro += 'Leur niveau CECR est [CEFR].\n';
frenchIntro +=
  'Créez un ensemble d’exercices de compréhension couvrant différents aspects du texte.\n';
frenchIntro +=
  'Les exercices doivent être des types suivants : [COMPREHENSION_TYPES].\n';
frenchIntro +=
  'Je fournirai le texte source sous la forme suivante : [COMPREHENSION_SOURCE_TYPE].\n';
let spanishIntro: string =
  'Eres un experto en la enseñanza de [TARGET_LANGUAGE] como lengua extranjera.\n';
spanishIntro += 'Tus estudiantes son adolescentes alemanes.\n';
spanishIntro += 'Su nivel del MCER es [CEFR].\n';
spanishIntro +=
  'Crea un conjunto de ejercicios de comprensión que abarquen diferentes aspectos del texto.\n';
spanishIntro +=
  'Los ejercicios deben ser de los siguientes tipos: [COMPREHENSION_TYPES].\n';
spanishIntro +=
  'Proporcionaré el texto fuente en el siguiente formato: [COMPREHENSION_SOURCE_TYPE].\n';
let italianIntro: string =
  'Sei un esperto nell’insegnamento di [TARGET_LANGUAGE] come lingua straniera.\n';
italianIntro += 'I tuoi studenti sono adolescenti tedeschi.\n';
italianIntro += 'Il loro livello QCER è [CEFR].\n';
italianIntro +=
  'Crea un insieme di esercizi di comprensione che coprano diversi aspetti del testo.\n';
italianIntro +=
  'Gli esercizi devono essere dei seguenti tipi: [COMPREHENSION_TYPES].\n';
italianIntro +=
  'Fornirò il testo sorgente nel seguente formato: [COMPREHENSION_SOURCE_TYPE].\n';

export const comprehensionPromptTemplates: ComprehensionPromptTemplates = {
  English: {
    exercisesIntro: englishIntro,
    requirementsIntro: 'Additional requirements:',
    requirements: [
      'Create exercises that are appropriate for the given CEFR level.',
      'Make sure the exercises test comprehension, not just memory.',
      'Provide clear and unambiguous instructions.',
      'Include an answer key at the end.',
    ],
    formatInstructionsHeader: 'Exercise Type Formatting Instructions:',
    exerciseInstructionsHeader: 'Exercise Instructions to Display:',
  },
  français: {
    exercisesIntro: frenchIntro,
    requirementsIntro: 'Exigences supplémentaires :',
    requirements: [
      'Créez des exercices adaptés au niveau CECR donné.',
      'Assurez-vous que les exercices testent la compréhension, pas seulement la mémoire.',
      'Fournissez des instructions claires et sans ambiguïté.',
      'Incluez un corrigé à la fin.',
    ],
    formatInstructionsHeader: 'Instructions de formatage par type d\'exercice :',
    exerciseInstructionsHeader: 'Instructions à afficher pour les exercices :',
  },
  español: {
    exercisesIntro: spanishIntro,
    requirementsIntro: 'Requisitos adicionales:',
    requirements: [
      'Crea ejercicios apropiados para el nivel MCER dado.',
      'Asegúrate de que los ejercicios evalúen la comprensión, no solo la memoria.',
      'Proporciona instrucciones claras y sin ambigüedades.',
      'Incluye una clave de respuestas al final.',
    ],
    formatInstructionsHeader: 'Instrucciones de formato por tipo de ejercicio:',
    exerciseInstructionsHeader: 'Instrucciones para mostrar en los ejercicios:',
  },
  italiano: {
    exercisesIntro: italianIntro,
    requirementsIntro: 'Requisiti aggiuntivi:',
    requirements: [
      'Crea esercizi appropriati per il livello QCER specificato.',
      'Assicurati che gli esercizi verifichino la comprensione, non solo la memoria.',
      'Fornisci istruzioni chiare e non ambigue.',
      'Includi una chiave di risposta alla fine.',
    ],
    formatInstructionsHeader: 'Istruzioni di formattazione per tipo di esercizio:',
    exerciseInstructionsHeader: 'Istruzioni da mostrare per gli esercizi:',
  },
};
