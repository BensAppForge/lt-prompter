import { Language } from '../models/vocabulary.model';

export interface BasePromptTemplate {
  intro: string;
  contextIntro: string;
  autoContextIntro: string;
  requirements: string[];
  dialogRequirement?: string;
}

export interface VocabularyPromptTemplate extends BasePromptTemplate {
  wordListIntro: string;
  requirementsIntro: string;
}

export type PromptTemplates = {
  [key in Language]: VocabularyPromptTemplate;
};

//English intro template with target language and CEFR level
let englishIntro: string =
  'You are an expert in teaching [TARGET_LANGUAGE]  as a foreign language.\n';
englishIntro += 'Your students are German teenagers.\n';
englishIntro += 'Their CEFR level is [CEFR].\n';
englishIntro +=
  'Create a gapped vocabulary exercise with the following instructions right below the title:\n';
englishIntro +=
  'Complete the following exercise with the words provided below:\n';
//French intro template with target language and CEFR level
let frenchIntro: string =
  "Vous êtes un expert dans l'enseignement du [TARGET_LANGUAGE] comme langue étrangère.\n";
frenchIntro += 'Vos élèves sont des adolescents allemands.\n';
frenchIntro += 'Leur niveau CECR est [CEFR].\n';
frenchIntro +=
  'Créez un exercice de vocabulaire à trous avec les instructions suivantes juste sous le titre :\n';
frenchIntro +=
  "Complétez l'exercice suivant avec les mots fournis ci-dessous :\n";
//Spanish intro template with target language and CEFR level
let spanishIntro: string =
  'Eres un experto en la enseñanza del [TARGET_LANGUAGE] como lengua extranjera.\n';
spanishIntro += 'Tus estudiantes son alemanes.\n';
spanishIntro += 'Su nivel MCER es [CEFR].\n';
spanishIntro +=
  'Crea un ejercicio de vocabulario con espacios en blanco con las siguientes instrucciones justo debajo del título:\n';
spanishIntro +=
  'Completa el siguiente ejercicio con las palabras proporcionadas a continuación:\n';
//Italian intro template with target language and CEFR level
let italianIntro: string =
  "Sei un esperto nell'insegnamento dell'[TARGET_LANGUAGE] come lingua straniera.\n";
italianIntro += 'I tuoi studenti sono tedeschi.\n';
italianIntro += 'Il loro livello QCER è [CEFR].\n';
italianIntro +=
  'Crea un esercizio di vocabolario con spazi vuoti con le seguenti istruzioni subito sotto il titolo:\n';
italianIntro +=
  'Completa il seguente esercizio con le parole fornite qui sotto:\n';
export const vocabularyPromptTemplates: PromptTemplates = {
  English: {
    intro: englishIntro,
    wordListIntro: 'Use the following words:\n',
    contextIntro: 'Context:\n',
    autoContextIntro:
      'Create a context that is appropriate for teenage students and incorporates the provided words.\n',
    requirementsIntro: 'Additional requirements:',
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
    dialogRequirement: 'Present the exercise in the form of a dialogue.',
  },
  Français: {
    intro: frenchIntro,
    wordListIntro: 'Utilisez les mots suivants :\n',
    contextIntro: 'Contexte :\n',
    autoContextIntro:
      'Créez un contexte approprié pour des élèves adolescents en utilisant les mots fournis.\n',
    requirementsIntro: 'Exigences supplémentaires :',
    requirements: [
      'Créez un texte cohérent avec des trous.',
      'Utilisez les mots dans un ordre aléatoire.',
      'Assurez-vous que les espaces soient suffisamment larges pour que les élèves puissent écrire leurs réponses.',
      'Le texte doit sembler naturel et authentique.',
      'Assurez-vous que les élèves puissent déduire les mots manquants à partir du contexte.',
      'Adaptez la complexité au niveau [CEFR].',
      'Assurez-vous que chaque mot de la liste soit utilisé une seule fois.',
      'Fournissez les solutions en remplissant les espaces avec les bons mots en gras.',
      'Fournissez la liste des mots sous les instructions comme une liste separatee par des virgules.',
    ],
    dialogRequirement: 'Présentez l’exercice sous la forme d’un dialogue.',
  },
  Español: {
    intro: spanishIntro,
    wordListIntro: 'Utiliza las siguientes palabras:\n',
    contextIntro: 'Contexto:\n',
    autoContextIntro:
      'Crea un contexto apropiado para estudiantes adolescentes utilizando las palabras proporcionadas.\n',
    requirementsIntro: 'Requisitos adicionales:',
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
    dialogRequirement: 'Presenta el ejercicio en forma de diálogo.',
  },
  Italiano: {
    intro: italianIntro,
    wordListIntro: 'Usa le seguenti parole:\n',
    contextIntro: 'Contesto:\n',
    autoContextIntro:
      'Crea un contesto adatto per studenti adolescenti utilizzando le parole fornite.\n',
    requirementsIntro: 'Requisiti aggiuntivi:',
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
    dialogRequirement: 'Presenta l’esercizio sotto forma di dialogo.',
  },
};
