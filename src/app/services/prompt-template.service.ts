import { Injectable } from '@angular/core';
import { Language } from '../models/preferences.model';
import { VocabularyPromptConfig, VocabularyExerciseType } from '../models/vocabulary.model';
import {
  getBaseIntro,
  getExerciseTypeContent,
  commonTemplateParts,
  vocabularyExerciseTypeTranslations,
  vocabularySourceTypeTranslations,
  vocabularyFileSourceParts,
  itemCountRequirements,
} from '../templates/vocabulary-prompts';
import { grammarPromptTemplates } from '../templates/grammar-con-prompts';
import { GrammarPromptConfig } from '../models/grammar.model';
import {
  ComprehensionPromptConfig,
  ComprehensionSourceType,
  ComprehensionExerciseType,
} from '../models/comprehension.model';
import {
  comprehensionPromptTemplates,
  exerciseTypeDescriptions,
  exerciseTypeInstructions,
  exerciseTypeTranslations,
  itemCountInstructions,
} from '../templates/comprehension-prompts';
import { ClonePromptConfig, CloneSourceType } from '../models/clone.model';
import { clonePromptTemplates } from '../templates/clone-prompts';
import {
  WordfieldPromptConfig,
  WordfieldSourceType,
  WordfieldOutputType,
} from '../models/wordfield.model';
import {
  WordfieldPromptTemplate,
  wordfieldPromptTemplates,
} from '../templates/wordfield-prompts';
import {
  KorrekturPromptConfig,
  KorrekturSourceType,
} from '../models/korrektur.model';
import {
  korrekturPromptTemplates,
  korrekturCriteriaSourceTypeTranslations,
} from '../templates/korrektur-prompts';

@Injectable({
  providedIn: 'root',
})
export class PromptTemplateService {
  private sourceTypeTranslations: Record<
    Language,
    Record<CloneSourceType, string>
  > = {
    English: {
      docx: 'Word document',
      pdf: 'PDF document',
      screenshot: 'screenshot',
      'copied-text': 'copied text',
    },
    español: {
      docx: 'documento de Word',
      pdf: 'documento PDF',
      screenshot: 'captura de pantalla',
      'copied-text': 'texto copiado',
    },
    français: {
      docx: 'document Word',
      pdf: 'document PDF',
      screenshot: "capture d'écran",
      'copied-text': 'texte copié',
    },
    italiano: {
      docx: 'documento Word',
      pdf: 'documento PDF',
      screenshot: 'screenshot',
      'copied-text': 'testo copiato',
    },
  };
  private wordfieldSourceTypeTranslations: Record<
    Language,
    Record<WordfieldSourceType, string>
  > = {
    English: {
      image: 'image',
      docx: 'Word document',
      pdf: 'PDF document',
      'copied-text': 'copied text',
    },
    español: {
      image: 'imagen',
      docx: 'documento de Word',
      pdf: 'documento PDF',
      'copied-text': 'texto copiado',
    },
    français: {
      image: 'image',
      docx: 'document Word',
      pdf: 'document PDF',
      'copied-text': 'texte copié',
    },
    italiano: {
      image: 'immagine',
      docx: 'documento Word',
      pdf: 'documento PDF',
      'copied-text': 'testo copiato',
    },
  };
  private wordfieldOutputTypeTranslations: Record<
    Language,
    Record<WordfieldOutputType, string>
  > = {
    English: {
      table: 'table',
      markdown: 'markdown for mind mapping apps',
    },
    español: {
      table: 'tabla',
      markdown: 'markdown para aplicaciones de mapas mentales',
    },
    français: {
      table: 'tableau',
      markdown: 'markdown pour applications de cartes mentales',
    },
    italiano: {
      table: 'tabella',
      markdown: 'markdown per applicazioni di mappe mentali',
    },
  };
  private comprehensionSourceTypeTranslations: Record<
    Language,
    Record<ComprehensionSourceType, string>
  > = {
    English: {
      docx: 'Word document',
      pdf: 'PDF document',
      screenshot: 'screenshot',
      'copied-text': 'copied text',
    },
    español: {
      docx: 'documento de Word',
      pdf: 'documento PDF',
      screenshot: 'captura de pantalla',
      'copied-text': 'texto copiado',
    },
    français: {
      docx: 'document Word',
      pdf: 'document PDF',
      screenshot: "capture d'écran",
      'copied-text': 'texte copié',
    },
    italiano: {
      docx: 'documento Word',
      pdf: 'documento PDF',
      screenshot: 'screenshot',
      'copied-text': 'testo copiato',
    },
  };
  private korrekturSourceTypeTranslations: Record<
    Language,
    Record<KorrekturSourceType, string>
  > = {
    English: {
      pdf: 'PDF document',
      screenshot: 'screenshot',
      'copied-text': 'copied text',
    },
    español: {
      pdf: 'documento PDF',
      screenshot: 'captura de pantalla',
      'copied-text': 'texto copiado',
    },
    français: {
      pdf: 'document PDF',
      screenshot: "capture d'écran",
      'copied-text': 'texte copié',
    },
    italiano: {
      pdf: 'documento PDF',
      screenshot: 'screenshot',
      'copied-text': 'testo copiato',
    },
  };

  generateVocabularyPrompt(config: VocabularyPromptConfig): string {
    const language = config.targetLanguage;
    const exerciseTypes: VocabularyExerciseType[] = config.exerciseTypes && config.exerciseTypes.length > 0 
      ? config.exerciseTypes 
      : ['gap-filling' as VocabularyExerciseType]; // Fallback for backward compatibility

    // Get base intro
    const baseIntro = getBaseIntro(language);
    const templateParts = commonTemplateParts[language];

    const parts: string[] = [];

    // Add base intro with replacements
    const formattedBaseIntro = baseIntro
      .replace(
        '[TARGET_LANGUAGE]',
        language === 'English' ? language : language.toLowerCase()
      )
      .replace('[CEFR]', config.cefr);

    // Build exercise types list for intro (using language-specific translations)
    const exerciseTypeLabels = exerciseTypes.map(type => {
      return vocabularyExerciseTypeTranslations[language]?.[type] || type;
    });

    // Language-specific text for multiple exercise types
    const multipleTypesIntro: Record<Language, string> = {
      English: 'Create vocabulary exercises with the following exercise types: ',
      français: 'Créez des exercices de vocabulaire avec les types d\'exercices suivants : ',
      español: 'Crea ejercicios de vocabulario con los siguientes tipos de ejercicios: ',
      italiano: 'Crea esercizi di vocabolario con i seguenti tipi di esercizi: ',
    };
    const multipleTypesInstruction: Record<Language, string> = {
      English: 'Create a separate exercise for each exercise type with the following instructions:\n',
      français: 'Créez un exercice séparé pour chaque type d\'exercice avec les instructions suivantes :\n',
      español: 'Crea un ejercicio separado para cada tipo de ejercicio con las siguientes instrucciones:\n',
      italiano: 'Crea un esercizio separato per ogni tipo di esercizio con le seguenti istruzioni:\n',
    };

    // Add intro with exercise types
    if (exerciseTypes.length === 1) {
      // Single exercise type - use the original format
      const exerciseContent = getExerciseTypeContent(language, exerciseTypes[0]);
      parts.push(formattedBaseIntro + exerciseContent.intro);
    } else {
      // Multiple exercise types - create combined intro, followed by the
      // per-type instruction lines the intro announces
      const exerciseTypesText = exerciseTypeLabels.join(', ');
      const instructionLines = exerciseTypes
        .map((type, index) => {
          const content = getExerciseTypeContent(language, type);
          return `- ${exerciseTypeLabels[index]}: ${content.instructions}`;
        })
        .join('\n');
      parts.push(
        formattedBaseIntro +
        multipleTypesIntro[language] + exerciseTypesText + '.\n' +
        multipleTypesInstruction[language] +
        instructionLines + '\n'
      );
    }

    // Word source: the teacher either typed the words manually, or chose to
    // attach a screenshot/PDF/Word doc in their AI tool — in which case the
    // prompt instructs the LLM to pull the vocab from that attachment.
    const inputMode = config.inputMode ?? 'manual';
    if (inputMode === 'file' && config.sourceType) {
      const sourceTypeLabel =
        vocabularySourceTypeTranslations[language][config.sourceType];
      parts.push(
        vocabularyFileSourceParts[language].attachmentInstruction.replace(
          '[SOURCE_TYPE]',
          sourceTypeLabel
        )
      );
    } else {
      parts.push(
        templateParts.wordListIntro,
        config.wordList.map((w) => w.word).join(', '),
        ''
      );
    }

    // Always add context (as per user request)
    const trimmedContext = config.situationalContext?.trim() ?? '';
    if (trimmedContext) {
      parts.push('', templateParts.contextIntro, trimmedContext);
    } else {
      parts.push('', templateParts.autoContextIntro);
    }

    // Add dialog requirement if requested and gap-filling is selected.
    // With multiple exercise types the dialog only applies to gap-filling,
    // so it is added to that type's requirement block below instead.
    const hasGapFilling = exerciseTypes.includes('gap-filling');
    if (config.isDialog && hasGapFilling && exerciseTypes.length === 1) {
      parts.push('', templateParts.dialogRequirement);
    }

    // Add requirements for each exercise type
    parts.push('', templateParts.requirementsIntro);
    
    // Explicit item count set by the teacher for a type, as a requirement line
    const countRequirement = (type: VocabularyExerciseType): string | null => {
      const count = config.itemCounts?.[type];
      if (!count) return null;
      return itemCountRequirements[language][type].replaceAll(
        '[COUNT]',
        String(count)
      );
    };

    if (exerciseTypes.length === 1) {
      // Single exercise type - simple requirements list
      const exerciseContent = getExerciseTypeContent(language, exerciseTypes[0]);
      exerciseContent.requirements.forEach((req, index) => {
        parts.push(`${index + 1}. ${req.replace('[CEFR]', config.cefr)}`);
      });
      const countReq = countRequirement(exerciseTypes[0]);
      if (countReq) {
        parts.push(`${exerciseContent.requirements.length + 1}. ${countReq}`);
      }
    } else {
      // Multiple exercise types - group requirements by type
      exerciseTypes.forEach((exerciseType, typeIndex) => {
        const exerciseContent = getExerciseTypeContent(language, exerciseType);
        const typeLabel = vocabularyExerciseTypeTranslations[language]?.[exerciseType] || exerciseType;

        parts.push(`\n${typeLabel}:`);
        exerciseContent.requirements.forEach((req, index) => {
          parts.push(`  ${index + 1}. ${req.replace('[CEFR]', config.cefr)}`);
        });
        let extraIndex = exerciseContent.requirements.length + 1;
        const countReq = countRequirement(exerciseType);
        if (countReq) {
          parts.push(`  ${extraIndex}. ${countReq}`);
          extraIndex++;
        }
        if (config.isDialog && exerciseType === 'gap-filling') {
          parts.push(`  ${extraIndex}. ${templateParts.dialogRequirement}`);
        }
      });
    }

    return parts.join('\n');
  }

  public generateGrammarPrompt(
    config: GrammarPromptConfig,
    language: Language
  ): string {
    if (!language) {
      throw new Error('Language is required for generating grammar prompts');
    }

    const template = grammarPromptTemplates[language];
    if (!template) {
      throw new Error(`No template found for language: ${language}`);
    }

    // Format target language based on the UI language
    const targetLanguage =
      language === 'English'
        ? config.targetLanguage
        : config.targetLanguage.toLowerCase();

    const parts: string[] = [
      template.intro
        .replace('[TARGET_LANGUAGE]', targetLanguage)
        .replace('[CEFR]', config.cefr),
      '',
      template.phenomenaIntro,
    ];

    // Add phenomena with optional hints
    config.phenomena.forEach((phenomenon) => {
      parts.push(
        `- ${phenomenon.description}${
          phenomenon.hint ? ` (${phenomenon.hint})` : ''
        }`
      );
    });

    // Add context if provided, otherwise use auto context
    const trimmedContext = config.situationalContext?.trim() ?? '';
    if (trimmedContext) {
      parts.push('', template.contextIntro, trimmedContext);
    } else {
      parts.push('', template.autoContextIntro);
    }

    // Add dialog requirement if requested
    if (config.situationalContextIsDialog && template.dialogRequirement) {
      parts.push('', template.dialogRequirement);
    }

    // Add requirements
    if (template.requirementsIntro) {
      parts.push('', template.requirementsIntro);
      template.requirements.forEach((req) => {
        parts.push(`- ${req.replace('[CEFR]', config.cefr)}`);
      });
    }

    return parts.join('\n');
  }

  generateComprehensionPrompt(config: ComprehensionPromptConfig): string {
    const template = comprehensionPromptTemplates[config.targetLanguage];
    if (!template) {
      throw new Error(
        `No template found for language ${config.targetLanguage}`
      );
    }

    const parts: string[] = [];
    const localizedSourceType =
      this.comprehensionSourceTypeTranslations[config.targetLanguage][
        config.sourceType
      ];

    // Add intro
    parts.push(
      template.exercisesIntro
        .replace('[TARGET_LANGUAGE]', config.targetLanguage)
        .replace('[CEFR]', config.cefr)
        .replace(
          '[COMPREHENSION_TYPES]',
          config.exercises
            .map(
              (ex: ComprehensionExerciseType) =>
                exerciseTypeTranslations[config.targetLanguage][ex]
            )
            .join(', ')
        )
        .replace('[COMPREHENSION_SOURCE_TYPE]', localizedSourceType)
    );

    // Add exercise type descriptions for the bot
    parts.push('\n' + template.formatInstructionsHeader);
    config.exercises.forEach((exerciseType: ComprehensionExerciseType) => {
      const description =
        exerciseTypeDescriptions[config.targetLanguage]?.[exerciseType];
      const translatedType =
        exerciseTypeTranslations[config.targetLanguage][exerciseType];
      if (description) {
        const count = config.itemCounts?.[exerciseType];
        const countInstruction = count
          ? ' ' +
            itemCountInstructions[config.targetLanguage][
              exerciseType
            ].replaceAll('[COUNT]', String(count))
          : '';
        parts.push(`\n${translatedType}:\n${description}${countInstruction}`);
      }
    });

    // Add requirements
    parts.push('\n' + template.requirementsIntro);
    template.requirements.forEach((req) => {
      parts.push(`- ${req}`);
    });

    // Add exercise type instructions that will be shown above each exercise
    parts.push('\n' + template.exerciseInstructionsHeader);
    config.exercises.forEach((exerciseType: ComprehensionExerciseType) => {
      const instruction =
        exerciseTypeInstructions[config.targetLanguage]?.[exerciseType];
      const translatedType =
        exerciseTypeTranslations[config.targetLanguage][exerciseType];
      if (instruction) {
        parts.push(`\n${translatedType}:\n${instruction}`);
      }
    });

    return parts.join('\n');
  }

  generateClonePrompt(
    config: ClonePromptConfig & { newContext?: string }
  ): string {
    const template = clonePromptTemplates[config.targetLanguage];
    const localizedSourceType =
      this.sourceTypeTranslations[config.targetLanguage][config.sourceType];

    let prompt = template.exercisesIntro
      .replace('[TARGET_LANGUAGE]', config.targetLanguage)
      .replace('[CEFR]', config.cefr)
      .replace('[CLONE_SOURCE_TYPE]', localizedSourceType);

    if (config.newContext) {
      prompt += template.contextIntro + config.newContext + '\n';
    } else {
      prompt += template.autoContextIntro + '\n';
    }

    prompt += template.requirementsIntro + '\n';
    template.requirements.forEach((req) => {
      prompt += '- ' + req.replace('[CEFR]', config.cefr) + '\n';
    });

    return prompt;
  }

  generateWordfieldPrompt(config: WordfieldPromptConfig): string {
    try {
      const template = wordfieldPromptTemplates[config.targetLanguage];
      if (!template) {
        throw new Error(
          `No template found for language: ${config.targetLanguage}`
        );
      }

      const localizedSourceType =
        this.wordfieldSourceTypeTranslations[config.targetLanguage][
          config.sourceType
        ];
      const localizedOutputType =
        this.wordfieldOutputTypeTranslations[config.targetLanguage][
          config.outputType
        ];

      if (!localizedSourceType) {
        throw new Error(
          `No translation found for source type: ${config.sourceType}`
        );
      }
      if (!localizedOutputType) {
        throw new Error(
          `No translation found for output type: ${config.outputType}`
        );
      }

      let prompt = template.intro
        .replace('[TARGET_LANGUAGE]', config.targetLanguage)
        .replace('[CEFR]', config.cefr)
        .replace('[WORDFIELD_SOURCE_TYPE]', localizedSourceType)
        .replace('[WORDFIELD_OUTPUT_TYPE]', localizedOutputType);

      // Add requirements if they exist in the template
      if (template.requirements?.length) {
        prompt += '\n\n' + template.requirementsIntro;
        template.requirements.forEach((req) => {
          prompt += '\n- ' + req.replace('[CEFR]', config.cefr);
        });
      }

      return prompt;
    } catch (error) {
      console.error('Error generating wordfield prompt:', error);
      return `Error generating prompt: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
    }
  }

  generateKorrekturPrompt(config: KorrekturPromptConfig): string {
    const template = korrekturPromptTemplates[config.targetLanguage];
    if (!template) {
      throw new Error(
        `No template found for language: ${config.targetLanguage}`
      );
    }

    const localizedSourceType =
      this.korrekturSourceTypeTranslations[config.targetLanguage][
        config.sourceType
      ];

    // [CEFR] appears twice in the intro (level display + strictness section)
    const parts: string[] = [
      template.intro
        .replaceAll('[KORREKTUR_SOURCE_TYPE]', localizedSourceType)
        .replaceAll('[CEFR]', config.cefr),
    ];

    if (config.includeFeedback) {
      parts.push(
        '',
        template.feedbackSection.replaceAll('[CEFR]', config.cefr)
      );
      if (config.criteriaSourceType) {
        const criteriaLabel =
          korrekturCriteriaSourceTypeTranslations[config.targetLanguage][
            config.criteriaSourceType
          ];
        parts.push(
          '',
          template.criteriaNote.replaceAll(
            '[CRITERIA_SOURCE_TYPE]',
            criteriaLabel
          )
        );
      }
    }

    return parts.join('\n');
  }
}
