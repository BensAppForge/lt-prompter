import { Injectable } from '@angular/core';
import { Language } from '../models/preferences.model';
import { VocabularyPromptConfig } from '../models/vocabulary.model';
import {
  VocabularyPromptTemplate,
  vocabularyPromptTemplates,
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
} from '../templates/comprehension-prompts';
import { ClonePromptConfig, CloneSourceType } from '../models/clone.model';
import { clonePromptTemplates } from '../templates/clone-prompts';
import {
  WordfieldPromptConfig,
  WordfieldSourceType,
  WORDFIELD_SOURCE_TYPES,
  WordfieldOutputType,
  WORDFIELD_OUTPUT_TYPES,
} from '../models/wordfield.model';
import {
  WordfieldPromptTemplate,
  wordfieldPromptTemplates,
} from '../templates/wordfield-prompts';
import {
  KorrekturPromptConfig,
  KorrekturSourceType,
} from '../models/korrektur.model';
import { korrekturPromptTemplates } from '../templates/korrektur-prompts';

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
      markdown: 'markdown pour applications de cartographie',
    },
    italiano: {
      table: 'tabella',
      markdown: 'markdown per applicazioni di mappatura',
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

  private getVocabularyTemplate(language: Language): VocabularyPromptTemplate {
    const template = vocabularyPromptTemplates[language];
    if (!template) {
      throw new Error(`No template found for language: ${language}`);
    }
    return template;
  }

  generateVocabularyPrompt(config: VocabularyPromptConfig): string {
    const template = this.getVocabularyTemplate(config.targetLanguage);

    if (!template) {
      throw new Error('No template found for the specified language');
    }

    const parts: string[] = [];

    // Add intro
    parts.push(
      template.intro
        .replace(
          '[TARGET_LANGUAGE]',
          config.targetLanguage === 'English'
            ? config.targetLanguage
            : config.targetLanguage.toLowerCase()
        )
        .replace('[CEFR]', config.cefr)
    );

    // Add word list
    parts.push(
      template.wordListIntro,
      config.wordList.map((w) => w.word).join(', '),
      ''
    );

    // Add context if provided, otherwise use auto context
    const trimmedContext = config.situationalContext?.trim() ?? '';
    if (trimmedContext) {
      parts.push('', template.contextIntro, trimmedContext);
    } else {
      parts.push('', template.autoContextIntro);
    }

    // Add dialog requirement if requested
    if (config.isDialog && template.dialogRequirement) {
      parts.push('', template.dialogRequirement);
    }

    // Add requirements
    parts.push('', template.requirementsIntro);
    template.requirements.forEach((req, index) => {
      parts.push(`${index + 1}. ${req.replace('[CEFR]', config.cefr)}`);
    });

    return parts.join('\n');
  }

  public generateGrammarPrompt(
    config: GrammarPromptConfig,
    language: Language
  ): string {
    if (!language) {
      throw new Error('Language is required for generating grammar prompts');
    }

    // Convert language to proper casing for template lookup
    const templateKey =
      language === 'English'
        ? 'English'
        : language.charAt(0).toUpperCase() + language.slice(1);

    const template = grammarPromptTemplates[templateKey];
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
        parts.push(`\n${translatedType}:\n${description}`);
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

    return template.intro
      .replace('[KORREKTUR_SOURCE_TYPE]', localizedSourceType)
      .replace('[CEFR]', config.cefr);
  }
}
