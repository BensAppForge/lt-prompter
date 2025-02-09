import { BasePromptTemplate } from './vocabulary-prompts';

export interface GrammarPromptTemplate extends BasePromptTemplate {
  phenomenaIntro: string;
  requirementsIntro?: string;
}

export const grammarPromptTemplates: Record<string, GrammarPromptTemplate> = {
  English: {
    intro:
      'You are an expert in teaching English as a foreign language and teach German teenage students. Create a grammar exercise in [TARGET_LANGUAGE] suitable for learners at the [CEFR] level.',
    phenomenaIntro:
      'The exercise should focus on practicing the following grammatical phenomena (optional hints are included in brackets):',
    contextIntro: 'The exercise should be based on the following context:',
    autoContextIntro:
      'Create an appropriate context that naturally incorporates the required grammar.',
    dialogRequirement:
      'Present the exercise in the form of a dialog between two or more people.',
    requirementsIntro: 'Additional requirements:',
    requirements: [
      'When provided, always place hints in brackets behind the gaps, not in front of them.',
      'Ensure all examples are appropriate for the [CEFR] level.',
      'Ensure the gaps are wide enough for students to write their answers.',
      'Make sure the text sounds natural and authentic.',
      'Include at least 3 to 4 instances of each grammatical phenomenon.',
      'Provide the solutions by filling the gaps with the correct forms in bold.',
    ],
  },
  Français: {
    intro:
      "Vous êtes un expert dans l'enseignement du français comme langue étrangère et vous enseignez à des adolescents allemands. Créez un exercice de grammaire en [TARGET_LANGUAGE] adapté aux apprenants de niveau [CEFR].",
    phenomenaIntro:
      "L'exercice doit se concentrer sur la pratique des phénomènes grammaticaux suivants :",
    contextIntro: "L'exercice doit être basé sur le contexte suivant :",
    autoContextIntro:
      'Créez un contexte approprié qui incorpore naturellement la grammaire requise.',
    dialogRequirement:
      "Présentez l'exercice sous forme de dialogue entre deux personnes ou plus.",
    requirementsIntro: 'Exigences supplémentaires :',
    requirements: [
      'Lorsque des indications sont fournies, placez-les toujours entre parenthèses après les trous, et non avant.',
      'Assurez-vous que tous les exemples sont appropriés pour le niveau [CEFR].',
      'Assurez-vous que les espaces soient suffisamment larges pour que les élèves puissent écrire leurs réponses.',
      'Le texte doit sembler naturel et authentique.',
      'Assurez-vous que les élèves puissent déduire les mots manquants à partir du contexte.',
      'Incluez au moins 3 à 4 occurrences de chaque phénomène grammatical.',
      'Fournissez les solutions en remplissant les espaces avec les formes correctes en gras.',
    ],
  },
  Español: {
    intro:
      'Eres un experto en la enseñanza del español como lengua extranjera y enseñas a adolescentes alemanes. Crea un ejercicio de gramática en [TARGET_LANGUAGE] adecuado para estudiantes de nivel [CEFR].',
    phenomenaIntro:
      'El ejercicio debe centrarse en practicar los siguientes fenómenos gramaticales:',
    contextIntro: 'El ejercicio debe basarse en el siguiente contexto:',
    autoContextIntro:
      'Crea un contexto apropiado que incorpore naturalmente la gramática requerida.',
    dialogRequirement:
      'Presenta el ejercicio en forma de diálogo entre dos o más personas.',
    requirementsIntro: 'Requisitos adicionales:',
    requirements: [
      'Cuando se proporcionen, coloca siempre las pistas entre paréntesis después de los espacios, no antes.',
      'Asegúrate de que todos los ejemplos sean apropiados para el nivel [CEFR].',
      'Asegúrate de que los espacios sean lo suficientemente amplios para que los estudiantes puedan escribir sus respuestas.',
      'El texto debe sonar natural y auténtico.',
      'Asegúrate de que los estudiantes puedan deducir las palabras faltantes a partir del contexto.',
      'Incluye al menos de 3 a 4 ejemplos de cada fenómeno gramatical.',
      'Proporciona las soluciones rellenando los espacios con las formas correctas en negrita.',
    ],
  },
  Italiano: {
    intro:
      "Sei un esperto nell'insegnamento dell'italiano come lingua straniera e insegni a studenti adolescenti tedeschi. Crea un esercizio di grammatica in [TARGET_LANGUAGE] adatto a studenti di livello [CEFR].",
    phenomenaIntro:
      "L'esercizio deve concentrarsi sulla pratica dei seguenti fenomeni grammaticali:",
    contextIntro: "L'esercizio deve essere basato sul seguente contesto:",
    autoContextIntro:
      'Crea un contesto appropriato che incorpori naturalmente la grammatica richiesta.',
    dialogRequirement:
      "Presenta l'esercizio sotto forma di dialogo tra due o più persone.",
    requirementsIntro: 'Requisiti aggiuntivi:',
    requirements: [
      'Quando presenti, inserisci sempre le indicazioni tra parentesi dietro gli spazi, mai davanti.',
      'Assicurati che tutti gli esempi siano appropriati per il livello [CEFR].',
      'Assicurati che gli spazi siano abbastanza ampi per permettere agli studenti di scrivere le risposte.',
      'Il testo deve sembrare naturale e autentico.',
      'Assicurati che gli studenti possano dedurre le parole mancanti dal contesto.',
      'Includi almeno 3 o 4 esempi di ciascun fenomeno grammaticale.',
      'Fornisci le soluzioni riempiendo gli spazi con le forme corrette in grassetto.',
    ],
  },
};
