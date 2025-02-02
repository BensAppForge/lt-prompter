import { Injectable } from '@angular/core';
import { Language, VocabularyPromptConfig } from '../models/vocabulary.model';
import {
  vocabularyPromptTemplates,
  PromptTemplate,
} from '../templates/vocabulary-prompts';

@Injectable({
  providedIn: 'root',
})
export class PromptTemplateService {
  private readonly defaultLanguage: Language = 'English';

  public getTemplate(language: Language): PromptTemplate {
    return (
      vocabularyPromptTemplates[language] ??
      vocabularyPromptTemplates[this.defaultLanguage]
    );
  }

  public generateVocabularyPrompt(
    config: VocabularyPromptConfig,
    uiLanguage: Language
  ): string {
    const template = this.getTemplate(uiLanguage);
    const parts: string[] = [];

    // Add intro
    parts.push(
      template.intro
        .replace('[TARGET_LANGUAGE]', config.targetLanguage)
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
            `${index + 1}. ${req.replace('[CEFR]', config.cefr)}`
        )
        .join('\n'),
      '\n'
    );

    // Add dialog requirement if needed
    if (config.situationalContextIsDialog) {
      parts.push(
        `${template.requirements.length + 1}. ${template.dialogRequirement}\n`
      );
    }

    return parts.join('\n');
  }
}
