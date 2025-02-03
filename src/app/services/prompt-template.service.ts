import { Injectable } from '@angular/core';
import {
  BasePromptTemplate,
  VocabularyPromptTemplate,
  vocabularyPromptTemplates,
} from '../templates/vocabulary-prompts';
import {
  GrammarPromptTemplate,
  grammarPromptTemplates,
} from '../templates/grammar-con-prompts';
import { Language } from '../models/vocabulary.model';
import { VocabularyPromptConfig } from '../models/vocabulary.model';
import { GrammarPromptConfig, GrammarPhenomenon } from '../models/grammar.model';

@Injectable({
  providedIn: 'root',
})
export class PromptTemplateService {
  private getTemplate(language: Language): VocabularyPromptTemplate {
    return vocabularyPromptTemplates[language];
  }

  private getGrammarTemplate(language: Language): GrammarPromptTemplate {
    const template = grammarPromptTemplates[language];
    if (!template) {
      throw new Error(`No grammar template found for language: ${language}`);
    }
    return template;
  }

  public generateVocabularyPrompt(
    config: VocabularyPromptConfig,
    language: Language
  ): string {
    const template = vocabularyPromptTemplates[language];
    const parts: string[] = [];

    // Format target language based on the UI language
    const targetLanguage = language === 'English' 
      ? config.targetLanguage 
      : config.targetLanguage.toLowerCase();

    // Add intro
    parts.push(
      template.intro
        .replace('[TARGET_LANGUAGE]', targetLanguage)
        .replace('[CEFR]', config.cefr)
    );

    // Add word list if present
    if (config.words?.length) {
      parts.push(
        template.wordListIntro,
        config.words.map((w) => `- ${w.word}`).join('\n'),
        '\n'
      );
    }

    // Add context if present
    if (config.situationalContext?.trim()) {
      parts.push(template.contextIntro, config.situationalContext, '\n');
    } else {
      parts.push(template.autoContextIntro, '\n');
    }

    // Add requirements
    parts.push(
      'Requirements:\n',
      template.requirements
        .map(
          (req: string, index: number) =>
            `${index + 1}. ${req.replace('[CEFR]', config.cefr.toString())}`
        )
        .join('\n'),
      '\n'
    );

    // Add dialog requirement if needed
    if (config.situationalContextIsDialog && template.dialogRequirement) {
      parts.push(
        `${template.requirements.length + 1}. ${template.dialogRequirement}\n`
      );
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

    const template = this.getGrammarTemplate(language);
    
    // Format target language based on the UI language
    const targetLanguage = language === 'English' 
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
    parts.push('');

    // Add context if provided, otherwise use auto context
    const trimmedContext = config.situationalContext?.trim() ?? '';
    if (trimmedContext) {
      parts.push(template.contextIntro);
      parts.push(trimmedContext);
      parts.push('');
    } else {
      parts.push(template.autoContextIntro);
      parts.push('');
    }

    // Add dialog requirement if requested
    if (config.situationalContextIsDialog && template.dialogRequirement) {
      parts.push(template.dialogRequirement);
      parts.push('');
    }

    // Add requirements
    const requirementsIntro = template.requirementsIntro ?? 'Additional requirements:';
    parts.push(requirementsIntro);
    template.requirements.forEach((req) => {
      parts.push(`- ${req.replace('[CEFR]', config.cefr)}`);
    });

    return parts.join('\n');
  }
}
