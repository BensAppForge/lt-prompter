import { Language } from '../models/preferences.model';
import {
  VocabularyExerciseType,
  VocabularySourceType,
} from '../models/vocabulary.model';

// Exercise type translations for prompt generation (not UI labels)
export const vocabularyExerciseTypeTranslations: Record<
  Language,
  Record<VocabularyExerciseType, string>
> = {
  English: {
    'gap-filling': 'Gap-filling',
    'matching': 'Matching',
    'multiple-choice': 'Multiple choice',
    'word-formation': 'Word formation',
    'categorization': 'Categorization',
    'odd-one-out': 'Odd one out',
  },
  français: {
    'gap-filling': 'Texte à trous',
    'matching': 'Correspondance',
    'multiple-choice': 'Choix multiples',
    'word-formation': 'Formation de mots',
    'categorization': 'Catégorisation',
    'odd-one-out': 'Intrus',
  },
  español: {
    'gap-filling': 'Texto con espacios',
    'matching': 'Correspondencia',
    'multiple-choice': 'Opción múltiple',
    'word-formation': 'Formación de palabras',
    'categorization': 'Categorización',
    'odd-one-out': 'Encuentra el intruso',
  },
  italiano: {
    'gap-filling': 'Testo con spazi',
    'matching': 'Abbinamento',
    'multiple-choice': 'Scelta multipla',
    'word-formation': 'Formazione delle parole',
    'categorization': 'Categorizzazione',
    'odd-one-out': "Trova l'intruso",
  },
};

export interface BasePromptTemplate {
  intro: string;
  contextIntro: string;
  autoContextIntro: string;
  requirements: string[];
  dialogRequirement?: string;
}

export type ExerciseTypeIntros = {
  [key in Language]: {
    [type in VocabularyExerciseType]: {
      intro: string;
      instructions: string;
      requirements: string[];
    };
  };
};

// Base intro templates (common for all exercise types)
const baseIntros: { [key in Language]: string } = {
  English:
    'You are an expert in teaching [TARGET_LANGUAGE] as a foreign language.\n' +
    'Your students are German teenagers.\n' +
    'Their CEFR level is [CEFR].\n',
  français:
    "Vous êtes un expert dans l'enseignement du [TARGET_LANGUAGE] comme langue étrangère.\n" +
    'Vos élèves sont des adolescents allemands.\n' +
    'Leur niveau CECR est [CEFR].\n',
  español:
    'Eres un experto en la enseñanza del [TARGET_LANGUAGE] como lengua extranjera.\n' +
    'Tus estudiantes son adolescentes alemanes.\n' +
    'Su nivel MCER es [CEFR].\n',
  italiano:
    "Sei un esperto nell'insegnamento dell'[TARGET_LANGUAGE] come lingua straniera.\n" +
    'I tuoi studenti sono tedeschi.\n' +
    'Il loro livello QCER è [CEFR].\n',
};

// Exercise type specific content
export const exerciseTypeContent: ExerciseTypeIntros = {
  English: {
    'gap-filling': {
      intro:
        'Create a gapped vocabulary exercise with the following instructions right below the title:\n' +
        'Complete the following exercise with the words provided below:\n',
      instructions: 'Complete the following exercise with the words provided below:',
      requirements: [
        'Create a coherent text with gaps.',
        'Use the words in a random order.',
        'Ensure the gaps are wide enough for students to write their answers.',
        'Make sure the text sounds natural and authentic.',
        'Ensure students can infer the missing words from the context.',
        'Adjust the complexity to match the [CEFR] level.',
        'Make sure each word from the list is used exactly once.',
        'Provide the solutions by filling the gaps with the correct words in bold.',
        'Provide the word list under the instructions as a comma separated list.',
      ],
    },
    'matching': {
      intro:
        'Create a matching vocabulary exercise with the following instructions right below the title:\n' +
        'Match the words on the left with their definitions/synonyms on the right:\n',
      instructions: 'Match the words on the left with their definitions/synonyms on the right:',
      requirements: [
        'Create two columns: words on the left, definitions/synonyms on the right.',
        'Shuffle the right column so items are not in matching order.',
        'Use clear, concise definitions appropriate for the [CEFR] level.',
        'Make sure each word has exactly one correct match.',
        'Provide clear numbering or lettering for matching (e.g., 1-A, 2-B).',
        'Provide the solution key at the end.',
      ],
    },
    'multiple-choice': {
      intro:
        'Create a multiple-choice vocabulary exercise with the following instructions right below the title:\n' +
        'Choose the correct word to complete each sentence:\n',
      instructions: 'Choose the correct word to complete each sentence:',
      requirements: [
        'Create sentences with a blank where one of the vocabulary words fits.',
        'Provide 3-4 options for each blank, including the correct word and plausible distractors.',
        'Use distractors that are semantically or phonetically similar but incorrect in context.',
        'Ensure only one answer is clearly correct based on context.',
        'Adjust sentence complexity to match the [CEFR] level.',
        'Provide the solution key at the end with the correct answers highlighted.',
      ],
    },
    'word-formation': {
      intro:
        'Create a word formation exercise with the following instructions right below the title:\n' +
        'Transform the words in brackets into the correct form to complete the sentences:\n',
      instructions: 'Transform the words in brackets into the correct form to complete the sentences:',
      requirements: [
        'Create sentences where students must change the word form (e.g., verb to noun, adjective to adverb).',
        'Put the base form of the word in brackets at the end of each sentence.',
        'Ensure the required transformation is clear from the sentence context.',
        'Include various types of word formation (prefixes, suffixes, conversion).',
        'Adjust complexity to match the [CEFR] level.',
        'Provide the solution key with the correct word forms in bold.',
      ],
    },
    'categorization': {
      intro:
        'Create a categorization exercise with the following instructions right below the title:\n' +
        'Sort the following words into the correct categories:\n',
      instructions: 'Sort the following words into the correct categories:',
      requirements: [
        'Define 2-4 clear categories relevant to the vocabulary theme.',
        'Provide empty category boxes/tables for students to fill in.',
        'List all words to be categorized in a word bank.',
        'Ensure each word clearly belongs to one category.',
        'Make categories distinct and logical for the [CEFR] level.',
        'Provide the solution showing words correctly sorted into categories.',
      ],
    },
    'odd-one-out': {
      intro:
        'Create an "odd one out" exercise with the following instructions right below the title:\n' +
        'In each group, find the word that does not belong and explain why:\n',
      instructions: 'In each group, find the word that does not belong and explain why:',
      requirements: [
        'Create groups of 4-5 words where one does not fit.',
        'The odd word should be identifiable through semantic, grammatical, or thematic differences.',
        'Make the distinction clear but require thinking appropriate for [CEFR] level.',
        'Include space for students to write their reasoning.',
        'Provide solutions with explanations of why each word is the odd one out.',
      ],
    },
  },
  français: {
    'gap-filling': {
      intro:
        'Créez un exercice de vocabulaire à trous avec les instructions suivantes juste sous le titre :\n' +
        "Complétez l'exercice suivant avec les mots fournis ci-dessous :\n",
      instructions: "Complétez l'exercice suivant avec les mots fournis ci-dessous :",
      requirements: [
        'Créez un texte cohérent avec des trous.',
        'Utilisez les mots dans un ordre aléatoire.',
        'Assurez-vous que les espaces soient suffisamment larges pour que les élèves puissent écrire leurs réponses.',
        'Le texte doit sembler naturel et authentique.',
        'Assurez-vous que les élèves puissent déduire les mots manquants à partir du contexte.',
        'Adaptez la complexité au niveau [CEFR].',
        'Assurez-vous que chaque mot de la liste soit utilisé une seule fois.',
        'Fournissez les solutions en remplissant les espaces avec les bons mots en gras.',
        'Fournissez la liste des mots sous les instructions comme une liste séparée par des virgules.',
      ],
    },
    'matching': {
      intro:
        'Créez un exercice de correspondance avec les instructions suivantes juste sous le titre :\n' +
        'Associez les mots de gauche avec leurs définitions/synonymes de droite :\n',
      instructions: 'Associez les mots de gauche avec leurs définitions/synonymes de droite :',
      requirements: [
        'Créez deux colonnes : les mots à gauche, les définitions/synonymes à droite.',
        'Mélangez la colonne de droite pour que les éléments ne soient pas dans le bon ordre.',
        'Utilisez des définitions claires et concises adaptées au niveau [CEFR].',
        'Assurez-vous que chaque mot a exactement une correspondance correcte.',
        'Fournissez une numérotation ou un lettrage clair pour la correspondance (ex : 1-A, 2-B).',
        'Fournissez le corrigé à la fin.',
      ],
    },
    'multiple-choice': {
      intro:
        'Créez un exercice de vocabulaire à choix multiples avec les instructions suivantes juste sous le titre :\n' +
        'Choisissez le mot correct pour compléter chaque phrase :\n',
      instructions: 'Choisissez le mot correct pour compléter chaque phrase :',
      requirements: [
        'Créez des phrases avec un espace où un des mots de vocabulaire convient.',
        'Proposez 3-4 options pour chaque espace, incluant le mot correct et des distracteurs plausibles.',
        'Utilisez des distracteurs sémantiquement ou phonétiquement similaires mais incorrects dans le contexte.',
        'Assurez-vous qu\'une seule réponse est clairement correcte selon le contexte.',
        'Adaptez la complexité des phrases au niveau [CEFR].',
        'Fournissez le corrigé à la fin avec les réponses correctes mises en évidence.',
      ],
    },
    'word-formation': {
      intro:
        'Créez un exercice de formation de mots avec les instructions suivantes juste sous le titre :\n' +
        'Transformez les mots entre parenthèses dans la forme correcte pour compléter les phrases :\n',
      instructions: 'Transformez les mots entre parenthèses dans la forme correcte pour compléter les phrases :',
      requirements: [
        'Créez des phrases où les élèves doivent changer la forme du mot (ex : verbe en nom, adjectif en adverbe).',
        'Mettez la forme de base du mot entre parenthèses à la fin de chaque phrase.',
        'Assurez-vous que la transformation requise est claire d\'après le contexte de la phrase.',
        'Incluez différents types de formation de mots (préfixes, suffixes, conversion).',
        'Adaptez la complexité au niveau [CEFR].',
        'Fournissez le corrigé avec les formes correctes en gras.',
      ],
    },
    'categorization': {
      intro:
        'Créez un exercice de catégorisation avec les instructions suivantes juste sous le titre :\n' +
        'Classez les mots suivants dans les bonnes catégories :\n',
      instructions: 'Classez les mots suivants dans les bonnes catégories :',
      requirements: [
        'Définissez 2-4 catégories claires en rapport avec le thème du vocabulaire.',
        'Fournissez des cases/tableaux de catégories vides à remplir.',
        'Listez tous les mots à catégoriser dans une banque de mots.',
        'Assurez-vous que chaque mot appartient clairement à une catégorie.',
        'Rendez les catégories distinctes et logiques pour le niveau [CEFR].',
        'Fournissez la solution montrant les mots correctement classés.',
      ],
    },
    'odd-one-out': {
      intro:
        'Créez un exercice "intrus" avec les instructions suivantes juste sous le titre :\n' +
        'Dans chaque groupe, trouvez le mot qui n\'appartient pas et expliquez pourquoi :\n',
      instructions: 'Dans chaque groupe, trouvez le mot qui n\'appartient pas et expliquez pourquoi :',
      requirements: [
        'Créez des groupes de 4-5 mots où un ne convient pas.',
        'Le mot intrus doit être identifiable par des différences sémantiques, grammaticales ou thématiques.',
        'Rendez la distinction claire mais nécessitant une réflexion adaptée au niveau [CEFR].',
        'Incluez un espace pour que les élèves écrivent leur raisonnement.',
        'Fournissez les solutions avec des explications sur pourquoi chaque mot est l\'intrus.',
      ],
    },
  },
  español: {
    'gap-filling': {
      intro:
        'Crea un ejercicio de vocabulario con espacios en blanco con las siguientes instrucciones justo debajo del título:\n' +
        'Completa el siguiente ejercicio con las palabras proporcionadas a continuación:\n',
      instructions: 'Completa el siguiente ejercicio con las palabras proporcionadas a continuación:',
      requirements: [
        'Crea un texto coherente con espacios en blanco.',
        'Utiliza las palabras en un orden aleatorio.',
        'Asegúrate de que los espacios sean lo suficientemente anchos para que los estudiantes escriban sus respuestas.',
        'El texto debe sonar natural y auténtico.',
        'Asegúrate de que los estudiantes puedan inferir las palabras que faltan del contexto.',
        'Ajusta la complejidad al nivel [CEFR].',
        'Asegúrate de que cada palabra de la lista se use exactamente una vez.',
        'Proporciona las soluciones rellenando los espacios con las palabras correctas en negrita.',
        'Proporciona la lista de palabras debajo de las instrucciones como una lista separada por comas.',
      ],
    },
    'matching': {
      intro:
        'Crea un ejercicio de correspondencia con las siguientes instrucciones justo debajo del título:\n' +
        'Une las palabras de la izquierda con sus definiciones/sinónimos de la derecha:\n',
      instructions: 'Une las palabras de la izquierda con sus definiciones/sinónimos de la derecha:',
      requirements: [
        'Crea dos columnas: palabras a la izquierda, definiciones/sinónimos a la derecha.',
        'Mezcla la columna derecha para que los elementos no estén en orden correspondiente.',
        'Usa definiciones claras y concisas apropiadas para el nivel [CEFR].',
        'Asegúrate de que cada palabra tenga exactamente una correspondencia correcta.',
        'Proporciona numeración o letras claras para la correspondencia (ej: 1-A, 2-B).',
        'Proporciona la clave de solución al final.',
      ],
    },
    'multiple-choice': {
      intro:
        'Crea un ejercicio de vocabulario de opción múltiple con las siguientes instrucciones justo debajo del título:\n' +
        'Elige la palabra correcta para completar cada oración:\n',
      instructions: 'Elige la palabra correcta para completar cada oración:',
      requirements: [
        'Crea oraciones con un espacio donde encaje una de las palabras de vocabulario.',
        'Proporciona 3-4 opciones para cada espacio, incluyendo la palabra correcta y distractores plausibles.',
        'Usa distractores semántica o fonéticamente similares pero incorrectos en contexto.',
        'Asegúrate de que solo una respuesta sea claramente correcta según el contexto.',
        'Ajusta la complejidad de las oraciones al nivel [CEFR].',
        'Proporciona la clave de solución al final con las respuestas correctas resaltadas.',
      ],
    },
    'word-formation': {
      intro:
        'Crea un ejercicio de formación de palabras con las siguientes instrucciones justo debajo del título:\n' +
        'Transforma las palabras entre paréntesis a la forma correcta para completar las oraciones:\n',
      instructions: 'Transforma las palabras entre paréntesis a la forma correcta para completar las oraciones:',
      requirements: [
        'Crea oraciones donde los estudiantes deben cambiar la forma de la palabra (ej: verbo a sustantivo, adjetivo a adverbio).',
        'Pon la forma base de la palabra entre paréntesis al final de cada oración.',
        'Asegúrate de que la transformación requerida sea clara por el contexto de la oración.',
        'Incluye varios tipos de formación de palabras (prefijos, sufijos, conversión).',
        'Ajusta la complejidad al nivel [CEFR].',
        'Proporciona la clave de solución con las formas correctas en negrita.',
      ],
    },
    'categorization': {
      intro:
        'Crea un ejercicio de categorización con las siguientes instrucciones justo debajo del título:\n' +
        'Clasifica las siguientes palabras en las categorías correctas:\n',
      instructions: 'Clasifica las siguientes palabras en las categorías correctas:',
      requirements: [
        'Define 2-4 categorías claras relevantes al tema del vocabulario.',
        'Proporciona cajas/tablas de categorías vacías para que los estudiantes llenen.',
        'Lista todas las palabras a categorizar en un banco de palabras.',
        'Asegúrate de que cada palabra pertenezca claramente a una categoría.',
        'Haz que las categorías sean distintas y lógicas para el nivel [CEFR].',
        'Proporciona la solución mostrando las palabras correctamente clasificadas.',
      ],
    },
    'odd-one-out': {
      intro:
        'Crea un ejercicio "encuentra el intruso" con las siguientes instrucciones justo debajo del título:\n' +
        'En cada grupo, encuentra la palabra que no pertenece y explica por qué:\n',
      instructions: 'En cada grupo, encuentra la palabra que no pertenece y explica por qué:',
      requirements: [
        'Crea grupos de 4-5 palabras donde una no encaja.',
        'La palabra intrusa debe ser identificable por diferencias semánticas, gramaticales o temáticas.',
        'Haz que la distinción sea clara pero requiera pensamiento apropiado para el nivel [CEFR].',
        'Incluye espacio para que los estudiantes escriban su razonamiento.',
        'Proporciona soluciones con explicaciones de por qué cada palabra es el intruso.',
      ],
    },
  },
  italiano: {
    'gap-filling': {
      intro:
        'Crea un esercizio di vocabolario con spazi vuoti con le seguenti istruzioni subito sotto il titolo:\n' +
        'Completa il seguente esercizio con le parole fornite qui sotto:\n',
      instructions: 'Completa il seguente esercizio con le parole fornite qui sotto:',
      requirements: [
        'Crea un testo coerente con spazi vuoti.',
        'Utilizza le parole in ordine casuale.',
        'Assicurati che gli spazi siano abbastanza larghi per permettere agli studenti di scrivere le risposte.',
        'Il testo deve suonare naturale e autentico.',
        'Assicurati che gli studenti possano dedurre le parole mancanti dal contesto.',
        'Adatta la complessità al livello [CEFR].',
        'Assicurati che ogni parola della lista sia usata esattamente una volta.',
        'Fornisci le soluzioni riempiendo gli spazi con le parole corrette in grassetto.',
        'Fornisci la lista delle parole sotto le istruzioni come una lista separata da virgole.',
      ],
    },
    'matching': {
      intro:
        'Crea un esercizio di abbinamento con le seguenti istruzioni subito sotto il titolo:\n' +
        'Abbina le parole a sinistra con le loro definizioni/sinonimi a destra:\n',
      instructions: 'Abbina le parole a sinistra con le loro definizioni/sinonimi a destra:',
      requirements: [
        'Crea due colonne: parole a sinistra, definizioni/sinonimi a destra.',
        'Mescola la colonna destra in modo che gli elementi non siano in ordine corrispondente.',
        'Usa definizioni chiare e concise appropriate per il livello [CEFR].',
        'Assicurati che ogni parola abbia esattamente una corrispondenza corretta.',
        'Fornisci una numerazione o lettere chiare per l\'abbinamento (es: 1-A, 2-B).',
        'Fornisci la chiave di soluzione alla fine.',
      ],
    },
    'multiple-choice': {
      intro:
        'Crea un esercizio di vocabolario a scelta multipla con le seguenti istruzioni subito sotto il titolo:\n' +
        'Scegli la parola corretta per completare ogni frase:\n',
      instructions: 'Scegli la parola corretta per completare ogni frase:',
      requirements: [
        'Crea frasi con uno spazio dove si inserisce una delle parole di vocabolario.',
        'Fornisci 3-4 opzioni per ogni spazio, includendo la parola corretta e distrattori plausibili.',
        'Usa distrattori semanticamente o foneticamente simili ma incorretti nel contesto.',
        'Assicurati che solo una risposta sia chiaramente corretta in base al contesto.',
        'Adatta la complessità delle frasi al livello [CEFR].',
        'Fornisci la chiave di soluzione alla fine con le risposte corrette evidenziate.',
      ],
    },
    'word-formation': {
      intro:
        'Crea un esercizio di formazione delle parole con le seguenti istruzioni subito sotto il titolo:\n' +
        'Trasforma le parole tra parentesi nella forma corretta per completare le frasi:\n',
      instructions: 'Trasforma le parole tra parentesi nella forma corretta per completare le frasi:',
      requirements: [
        'Crea frasi dove gli studenti devono cambiare la forma della parola (es: verbo in nome, aggettivo in avverbio).',
        'Metti la forma base della parola tra parentesi alla fine di ogni frase.',
        'Assicurati che la trasformazione richiesta sia chiara dal contesto della frase.',
        'Includi vari tipi di formazione delle parole (prefissi, suffissi, conversione).',
        'Adatta la complessità al livello [CEFR].',
        'Fornisci la chiave di soluzione con le forme corrette in grassetto.',
      ],
    },
    'categorization': {
      intro:
        'Crea un esercizio di categorizzazione con le seguenti istruzioni subito sotto il titolo:\n' +
        'Ordina le seguenti parole nelle categorie corrette:\n',
      instructions: 'Ordina le seguenti parole nelle categorie corrette:',
      requirements: [
        'Definisci 2-4 categorie chiare pertinenti al tema del vocabolario.',
        'Fornisci caselle/tabelle di categorie vuote da compilare.',
        'Elenca tutte le parole da categorizzare in una banca di parole.',
        'Assicurati che ogni parola appartenga chiaramente a una categoria.',
        'Rendi le categorie distinte e logiche per il livello [CEFR].',
        'Fornisci la soluzione mostrando le parole correttamente ordinate.',
      ],
    },
    'odd-one-out': {
      intro:
        'Crea un esercizio "trova l\'intruso" con le seguenti istruzioni subito sotto il titolo:\n' +
        'In ogni gruppo, trova la parola che non appartiene e spiega perché:\n',
      instructions: 'In ogni gruppo, trova la parola che non appartiene e spiega perché:',
      requirements: [
        'Crea gruppi di 4-5 parole dove una non si adatta.',
        'La parola intrusa deve essere identificabile attraverso differenze semantiche, grammaticali o tematiche.',
        'Rendi la distinzione chiara ma che richieda un ragionamento appropriato per il livello [CEFR].',
        'Includi spazio per gli studenti per scrivere il loro ragionamento.',
        'Fornisci soluzioni con spiegazioni del perché ogni parola è l\'intrusa.',
      ],
    },
  },
};

// Helper to get base intro for a language
export function getBaseIntro(language: Language): string {
  return baseIntros[language];
}

// Helper to get exercise type content
export function getExerciseTypeContent(
  language: Language,
  exerciseType: VocabularyExerciseType
): { intro: string; instructions: string; requirements: string[] } {
  return exerciseTypeContent[language][exerciseType];
}

// Per-exercise-type item-count requirements ([COUNT] placeholder).
// Appended to a type's requirements when the teacher sets an explicit count.
export const itemCountRequirements: Record<
  Language,
  Record<VocabularyExerciseType, string>
> = {
  English: {
    'gap-filling':
      'Use exactly [COUNT] words from the source; the text must contain exactly [COUNT] gaps.',
    matching: 'Include exactly [COUNT] pairs to match.',
    'multiple-choice': 'Include exactly [COUNT] sentences.',
    'word-formation': 'Include exactly [COUNT] sentences.',
    categorization: 'Include exactly [COUNT] words to sort.',
    'odd-one-out': 'Include exactly [COUNT] groups.',
  },
  français: {
    'gap-filling':
      'Utilisez exactement [COUNT] mots de la source ; le texte doit contenir exactement [COUNT] trous.',
    matching: 'Incluez exactement [COUNT] paires à associer.',
    'multiple-choice': 'Incluez exactement [COUNT] phrases.',
    'word-formation': 'Incluez exactement [COUNT] phrases.',
    categorization: 'Incluez exactement [COUNT] mots à classer.',
    'odd-one-out': 'Incluez exactement [COUNT] groupes.',
  },
  español: {
    'gap-filling':
      'Utiliza exactamente [COUNT] palabras de la fuente; el texto debe contener exactamente [COUNT] huecos.',
    matching: 'Incluye exactamente [COUNT] parejas para relacionar.',
    'multiple-choice': 'Incluye exactamente [COUNT] frases.',
    'word-formation': 'Incluye exactamente [COUNT] frases.',
    categorization: 'Incluye exactamente [COUNT] palabras para clasificar.',
    'odd-one-out': 'Incluye exactamente [COUNT] grupos.',
  },
  italiano: {
    'gap-filling':
      'Utilizza esattamente [COUNT] parole dalla fonte; il testo deve contenere esattamente [COUNT] spazi vuoti.',
    matching: 'Includi esattamente [COUNT] coppie da abbinare.',
    'multiple-choice': 'Includi esattamente [COUNT] frasi.',
    'word-formation': 'Includi esattamente [COUNT] frasi.',
    categorization: 'Includi esattamente [COUNT] parole da classificare.',
    'odd-one-out': 'Includi esattamente [COUNT] gruppi.',
  },
};

// Common template parts
export const commonTemplateParts: {
  [key in Language]: {
    wordListIntro: string;
    contextIntro: string;
    autoContextIntro: string;
    requirementsIntro: string;
    dialogRequirement: string;
  };
} = {
  English: {
    wordListIntro: 'Use the following words:\n',
    contextIntro: 'Context:\n',
    autoContextIntro:
      'Create a context that is appropriate for teenage students and incorporates the provided words.\n',
    requirementsIntro: 'Additional requirements:',
    dialogRequirement: 'Present the exercise in the form of a dialogue.',
  },
  français: {
    wordListIntro: 'Utilisez les mots suivants :\n',
    contextIntro: 'Contexte :\n',
    autoContextIntro:
      'Créez un contexte approprié pour des élèves adolescents en utilisant les mots fournis.\n',
    requirementsIntro: 'Exigences supplémentaires :',
    dialogRequirement: 'Présentez l\'exercice sous la forme d\'un dialogue.',
  },
  español: {
    wordListIntro: 'Utiliza las siguientes palabras:\n',
    contextIntro: 'Contexto:\n',
    autoContextIntro:
      'Crea un contexto apropiado para estudiantes adolescentes utilizando las palabras proporcionadas.\n',
    requirementsIntro: 'Requisitos adicionales:',
    dialogRequirement: 'Presenta el ejercicio en forma de diálogo.',
  },
  italiano: {
    wordListIntro: 'Usa le seguenti parole:\n',
    contextIntro: 'Contesto:\n',
    autoContextIntro:
      'Crea un contesto adatto per studenti adolescenti utilizzando le parole fornite.\n',
    requirementsIntro: 'Requisiti aggiuntivi:',
    dialogRequirement: 'Presenta l\'esercizio sotto forma di dialogo.',
  },
};

// Source type translations for the prompt body
export const vocabularySourceTypeTranslations: Record<
  Language,
  Record<VocabularySourceType, string>
> = {
  English: {
    image: 'image',
    pdf: 'PDF document',
    docx: 'Word document',
  },
  français: {
    image: 'image',
    pdf: 'document PDF',
    docx: 'document Word',
  },
  español: {
    image: 'imagen',
    pdf: 'documento PDF',
    docx: 'documento de Word',
  },
  italiano: {
    image: 'immagine',
    pdf: 'documento PDF',
    docx: 'documento Word',
  },
};

// Fragment used when the teacher will attach a file (image / PDF / docx) in
// their AI tool instead of typing the vocabulary list. The teacher uploads
// the file in ChatGPT/Claude/etc. — lt-prompter only generates the prompt.
export const vocabularyFileSourceParts: {
  [key in Language]: {
    attachmentInstruction: string;
  };
} = {
  English: {
    attachmentInstruction:
      'I will attach a file ([SOURCE_TYPE]) to this message. Extract the target vocabulary words from it and use them as the word list for the exercise. Use every word that is clearly part of the vocabulary list and ignore unrelated text.\n',
  },
  français: {
    attachmentInstruction:
      "Je joindrai un fichier ([SOURCE_TYPE]) à ce message. Extrayez-en les mots de vocabulaire cibles et utilisez-les comme liste de mots pour l'exercice. Utilisez chaque mot qui fait clairement partie de la liste de vocabulaire et ignorez les textes non pertinents.\n",
  },
  español: {
    attachmentInstruction:
      'Adjuntaré un archivo ([SOURCE_TYPE]) a este mensaje. Extrae de él las palabras de vocabulario objetivo y úsalas como lista de palabras para el ejercicio. Utiliza cada palabra que forme claramente parte de la lista de vocabulario e ignora el texto no relacionado.\n',
  },
  italiano: {
    attachmentInstruction:
      'Allegherò un file ([SOURCE_TYPE]) a questo messaggio. Estrai da esso le parole di vocabolario obiettivo e usale come elenco di parole per l\'esercizio. Usa ogni parola che fa chiaramente parte della lista di vocabolario e ignora il testo non pertinente.\n',
  },
};
