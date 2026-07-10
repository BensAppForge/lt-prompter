import { Language } from '../models/preferences.model';
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
    'Rédigez un résumé cohérent du texte en laissant des trous pour les informations clés. Assurez-vous que les mots manquants sont essentiels à la compréhension. N’incluez pas plus d’un trou par phrase ni plus d’un trou tous les cinq mots.',
};

const spanishExerciseTypeDescription: ExerciseTypeDescription = {
  'true-false':
    'Crea una tabla con los siguientes encabezados: Enunciado | Verdadero | Falso. Proporciona afirmaciones claras y concisas basadas en el texto.',
  'multiple-choice':
    'Crea una lista de preguntas con varias opciones. Representa cada opción con un formato de casilla de verificación como este: [_] Opción.',
  matching:
    'Crea una tabla con dos columnas: una para los enunciados y otra para las respuestas posibles. Los estudiantes deben relacionar los enunciados de la izquierda con las respuestas correctas de la derecha.',
  'gapped-summary':
    'Escribe un resumen coherente del texto dejando huecos para la información clave. Asegúrate de que las palabras omitidas sean esenciales para la comprensión. No incluyas más de un hueco por oración ni más de uno cada cinco palabras.',
};

const italianExerciseTypeDescription: ExerciseTypeDescription = {
  'true-false':
    'Crea una tabella con le seguenti intestazioni: Affermazione | Vero | Falso. Fornisci affermazioni chiare e concise basate sul testo.',
  'multiple-choice':
    'Crea un elenco di domande con diverse opzioni. Rappresenta ogni opzione con un formato di casella di controllo come questo: [_] Opzione.',
  matching:
    'Crea una tabella con due colonne: una per le affermazioni e una per le risposte possibili. Gli studenti devono abbinare le affermazioni a sinistra con le risposte corrette a destra.',
  'gapped-summary':
    'Scrivi un riassunto coerente del testo lasciando spazi vuoti per le informazioni chiave. Assicurati che le parole mancanti siano essenziali per la comprensione. Non inserire più di uno spazio vuoto per frase né più di uno ogni cinque parole.',
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

// Per-exercise-type item-count instructions ([COUNT] placeholder).
// Appended to a type's formatting instructions when the teacher sets a count.
export const itemCountInstructions: Record<
  Language,
  ExerciseTypeInstruction
> = {
  English: {
    'true-false': 'Include exactly [COUNT] statements.',
    'multiple-choice': 'Include exactly [COUNT] questions.',
    matching: 'Include exactly [COUNT] pairs to match.',
    'gapped-summary': 'The summary must contain exactly [COUNT] gaps.',
  },
  français: {
    'true-false': 'Incluez exactement [COUNT] énoncés.',
    'multiple-choice': 'Incluez exactement [COUNT] questions.',
    matching: 'Incluez exactement [COUNT] paires à associer.',
    'gapped-summary': 'Le résumé doit contenir exactement [COUNT] trous.',
  },
  español: {
    'true-false': 'Incluye exactamente [COUNT] enunciados.',
    'multiple-choice': 'Incluye exactamente [COUNT] preguntas.',
    matching: 'Incluye exactamente [COUNT] parejas para relacionar.',
    'gapped-summary': 'El resumen debe contener exactamente [COUNT] huecos.',
  },
  italiano: {
    'true-false': 'Includi esattamente [COUNT] affermazioni.',
    'multiple-choice': 'Includi esattamente [COUNT] domande.',
    matching: 'Includi esattamente [COUNT] coppie da abbinare.',
    'gapped-summary': 'Il riassunto deve contenere esattamente [COUNT] spazi vuoti.',
  },
};

// Exercise type translations for each language
export const exerciseTypeTranslations: Record<
  Language,
  Record<ComprehensionExerciseType, string>
> = {
  English: {
    'true-false': 'true/false',
    'multiple-choice': 'multiple choice',
    matching: 'matching',
    'gapped-summary': 'gapped summary',
  },
  français: {
    'true-false': 'vrai ou faux',
    'multiple-choice': 'choix multiple',
    matching: 'appariement',
    'gapped-summary': 'résumé à trous',
  },
  español: {
    'true-false': 'verdadero o falso',
    'multiple-choice': 'opción múltiple',
    matching: 'emparejamiento',
    'gapped-summary': 'resumen con huecos',
  },
  italiano: {
    'true-false': 'vero o falso',
    'multiple-choice': 'scelta multipla',
    matching: 'abbinamento',
    'gapped-summary': 'riassunto con spazi vuoti',
  },
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
  'Eres un experto en la enseñanza del [TARGET_LANGUAGE] como lengua extranjera.\n';
spanishIntro += 'Tus estudiantes son adolescentes alemanes.\n';
spanishIntro += 'Su nivel del MCER es [CEFR].\n';
spanishIntro +=
  'Crea un conjunto de ejercicios de comprensión que abarquen diferentes aspectos del texto.\n';
spanishIntro +=
  'Los ejercicios deben ser de los siguientes tipos: [COMPREHENSION_TYPES].\n';
spanishIntro +=
  'Proporcionaré el texto fuente en el siguiente formato: [COMPREHENSION_SOURCE_TYPE].\n';
let italianIntro: string =
  'Sei un esperto nell’insegnamento dell’[TARGET_LANGUAGE] come lingua straniera.\n';
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
      'Create exercises that match the given CEFR level.',
      'Ensure the exercises assess comprehension rather than simple recall or general knowledge.',
      'Avoid redundancy by varying question formats and content.',
      'Provide clear and unambiguous instructions.',
      'Include an answer key at the end.',
    ],
    formatInstructionsHeader: 'Exercise type formatting instructions:',
    exerciseInstructionsHeader: 'Exercise instructions to display:',
  },
  français: {
    exercisesIntro: frenchIntro,
    requirementsIntro: 'Exigences supplémentaires :',
    requirements: [
      'Créez des exercices adaptés au niveau CECR donné.',
      'Assurez-vous que les exercices évaluent la compréhension plutôt que la simple mémorisation ou les connaissances générales.',
      'Évitez les redondances en variant les formats et le contenu des questions.',
      'Fournissez des instructions claires et sans ambiguïté.',
      'Incluez un corrigé à la fin.',
    ],
    formatInstructionsHeader: "Instructions de formatage par type d'exercice :",
    exerciseInstructionsHeader: 'Instructions à afficher pour les exercices :',
  },
  español: {
    exercisesIntro: spanishIntro,
    requirementsIntro: 'Requisitos adicionales:',
    requirements: [
      'Crea ejercicios adecuados al nivel del MCER indicado.',
      'Asegúrate de que los ejercicios evalúen la comprensión en lugar de la simple memoria o conocimientos generales.',
      'Evita la redundancia variando los formatos y el contenido de las preguntas.',
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
      'Crea esercizi adatti al livello QCER indicato.',
      'Assicurati che gli esercizi valutino la comprensione anziché la semplice memoria o conoscenze generali.',
      'Evita le ridondanze variando i formati e i contenuti delle domande.',
      'Fornisci istruzioni chiare e non ambigue.',
      'Includi una chiave di soluzione alla fine.',
    ],
    formatInstructionsHeader:
      'Istruzioni di formattazione per tipo di esercizio:',
    exerciseInstructionsHeader: 'Istruzioni da mostrare per gli esercizi:',
  },
};
