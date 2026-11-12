import { PromptTemplateService } from './prompt-template.service';
import { CEFR_LEVELS, LANGUAGES } from '../models/preferences.model';
import {
  VOCABULARY_EXERCISE_TYPES,
  VocabularyPromptConfig,
} from '../models/vocabulary.model';
import { COMPREHENSION_EXERCISE_TYPES } from '../models/comprehension.model';
import {
  PERSONA_TYPES,
  PersonaPromptConfig,
} from '../models/persona.model';
import { OUTPUT_FORMATS } from '../models/output-format.model';
import { appendOutputFormat } from '../templates/output-format-prompts';

/** No template placeholder like [CEFR] or [TARGET_LANGUAGE] may survive. */
const PLACEHOLDER = /\[[A-Z_]{3,}\]/;

describe('PromptTemplateService', () => {
  const service = new PromptTemplateService();

  const vocabulary = (
    overrides: Partial<VocabularyPromptConfig> = {}
  ): string =>
    service.generateVocabularyPrompt({
      targetLanguage: 'English',
      cefr: 'B1',
      numberOfWords: 2,
      exerciseTypes: ['gap-filling'],
      wordList: [{ word: 'house' }, { word: 'garden' }],
      inputMode: 'manual',
      ...overrides,
    });

  describe('placeholders', () => {
    for (const targetLanguage of LANGUAGES) {
      it(`are all replaced in every ${targetLanguage} prompt`, () => {
        const cefr = CEFR_LEVELS[4];
        const allVocabularyTypes = VOCABULARY_EXERCISE_TYPES.map(
          (t) => t.value
        );
        const allCounts = Object.fromEntries(
          allVocabularyTypes.map((type) => [type, 5])
        );
        const prompts = [
          ...allVocabularyTypes.map((type) =>
            vocabulary({ targetLanguage, exerciseTypes: [type] })
          ),
          vocabulary({
            targetLanguage,
            exerciseTypes: allVocabularyTypes,
            inputMode: 'file',
            sourceType: 'pdf',
            wordList: [],
            itemCounts: allCounts,
            isDialog: true,
          }),
          service.generateGrammarPrompt(
            {
              targetLanguage,
              cefr,
              phenomena: [{ description: 'past tense', hint: 'regular verbs' }],
              situationalContextIsDialog: true,
              instancesPerPhenomenon: 3,
            },
            targetLanguage
          ),
          service.generateComprehensionPrompt({
            targetLanguage,
            cefr,
            exercises: COMPREHENSION_EXERCISE_TYPES,
            sourceType: 'pdf',
            itemCounts: {
              'true-false': 4,
              'multiple-choice': 4,
              matching: 4,
              'gapped-summary': 4,
            },
          }),
          service.generateClonePrompt({
            targetLanguage,
            cefr,
            sourceType: 'screenshot',
            itemCount: 8,
          }),
          service.generateWordfieldPrompt({
            targetLanguage,
            cefr,
            sourceType: 'image',
            outputType: 'table',
            wordCount: 20,
          }),
          service.generateKorrekturPrompt({
            targetLanguage,
            cefr,
            sourceType: 'copied-text',
            includeFeedback: true,
            criteriaSourceType: 'docx',
          }),
          ...PERSONA_TYPES.map((type) =>
            service.generatePersonaPrompt({
              targetLanguage,
              cefr,
              personaType: type.value,
              persona: 'Leonardo da Vinci',
              personaDescription: 'pittore e inventore del Rinascimento',
              topics: 'le invenzioni, la pittura',
              researchGoal: 'Scoprire quali macchine ha disegnato Leonardo',
              conversationStyle: 'dialogue',
              maxSentences: 4,
              errorHandling: 'explicit',
              avoidLiteraryTense: true,
              languageNotes: 'Usa il lessico della famiglia',
              turnLimit: 12,
              closingSummary: true,
              closingFeedback: true,
              extraRules: 'Non parlare degli studi di anatomia',
            })
          ),
          ...OUTPUT_FORMATS.map((format) =>
            appendOutputFormat('Prompt', targetLanguage, format.value)
          ),
        ];

        for (const prompt of prompts) {
          expect(prompt).not.toMatch(PLACEHOLDER);
        }
      });
    }
  });

  describe('vocabulary context', () => {
    const autoContext = 'Create a context that is appropriate';
    const scopeNote = 'The context applies only to';

    it('is requested for exercise types built around text', () => {
      const prompt = vocabulary({ exerciseTypes: ['gap-filling'] });
      expect(prompt).toContain(autoContext);
      expect(prompt).not.toContain(scopeNote);
    });

    it('is left out when no selected type works with a context', () => {
      const prompt = vocabulary({
        exerciseTypes: ['matching', 'categorization', 'odd-one-out'],
        situationalContext: 'A day at the zoo',
      });
      expect(prompt).not.toContain(autoContext);
      expect(prompt).not.toContain('Context:');
      expect(prompt).not.toContain('A day at the zoo');
    });

    it('names the types it applies to when only some take a context', () => {
      const prompt = vocabulary({
        exerciseTypes: ['matching', 'gap-filling', 'multiple-choice'],
        situationalContext: 'A day at the zoo',
      });
      expect(prompt).toContain('A day at the zoo');
      expect(prompt).toContain(
        `${scopeNote} the following exercise types: Gap-filling, Multiple choice.`
      );
    });
  });

  describe('vocabulary from a file', () => {
    const fromFile = (overrides: Partial<VocabularyPromptConfig> = {}) =>
      vocabulary({
        inputMode: 'file',
        sourceType: 'pdf',
        wordList: [],
        ...overrides,
      });

    it('uses every extracted word when no counts are set', () => {
      const prompt = fromFile();
      expect(prompt).toContain('PDF document');
      expect(prompt).toContain('Use every word');
    });

    it('does not ask for every word and an exact count at once', () => {
      const prompt = fromFile({ itemCounts: { 'gap-filling': 4 } });
      expect(prompt).not.toContain('Use every word');
      expect(prompt).toContain('You do not need to use every extracted word');
      // The count line defines the word list, so it leads the requirements
      expect(prompt).toContain(
        '1. Select exactly 4 words from the extracted vocabulary.'
      );
    });
  });

  it('ignores counts for word-bound types when the words are typed in', () => {
    const prompt = vocabulary({
      exerciseTypes: ['gap-filling', 'multiple-choice'],
      itemCounts: { 'gap-filling': 4, 'multiple-choice': 6 },
    });
    expect(prompt).not.toContain('Select exactly 4 words');
    expect(prompt).toContain('Include exactly 6 sentences.');
  });

  describe('persona chat', () => {
    const persona = (overrides: Partial<PersonaPromptConfig> = {}): string =>
      service.generatePersonaPrompt({
        targetLanguage: 'italiano',
        cefr: 'A2',
        personaType: 'historical',
        persona: 'Leonardo da Vinci',
        conversationStyle: 'interview',
        maxSentences: 4,
        errorHandling: 'recast',
        ...overrides,
      });

    it('contains the essentials of a persona chat', () => {
      const prompt = persona({
        personaDescription: 'pittore e inventore del Rinascimento.',
        avoidLiteraryTense: true,
      });
      expect(prompt).toContain(
        'vesti i panni di Leonardo da Vinci, pittore e inventore del Rinascimento. Ti scrivono'
      );
      expect(prompt).toContain('messaggio sei Leonardo da Vinci: racconta');
      expect(prompt).toContain('livello A2 del QCER');
      expect(prompt).toContain('Il passato remoto è escluso');
      expect(prompt).toContain('fra parentesi, una breve parafrasi facile');
      expect(prompt).toContain('al massimo 4 frasi');
      expect(prompt).toContain('Chiudi ogni messaggio con un breve spunto');
      expect(prompt).toContain('1. Chi sei');
      expect(prompt).toContain('2. Come si svolge lo scambio');
      expect(prompt).toContain('3. La tua lingua: livello A2');
      expect(prompt).toContain('4. Regole da rispettare');
    });

    it('bans the literary past tense only where the language has one', () => {
      expect(persona({ avoidLiteraryTense: false })).not.toContain(
        'passato remoto'
      );
      expect(
        persona({ targetLanguage: 'français', avoidLiteraryTense: true })
      ).toContain('Le passé simple est exclu');
      const english = persona({
        targetLanguage: 'English',
        avoidLiteraryTense: true,
      });
      expect(english).not.toContain('passato remoto');
      expect(english).not.toContain('passé simple');
    });

    it('adapts the language rule to the level', () => {
      expect(persona({ cefr: 'A1+' })).toContain('frasi molto brevi e semplici');
      expect(persona({ cefr: 'B2' })).toContain('lingua naturale e ben strutturata');
      expect(persona({ cefr: 'C1' })).toContain('come farebbe un madrelingua colto');
    });

    it('speaks under the name alone when the persona field describes more', () => {
      const prompt = persona({
        targetLanguage: 'français',
        personaType: 'everyday',
        persona: 'Camille, boulangère à Lyon',
      });
      expect(prompt).toContain(
        'dans la peau de Camille, boulangère à Lyon. Ceux'
      );
      expect(prompt).toContain('vous êtes Camille : racontez');
    });

    it('handles facts according to the kind of persona', () => {
      expect(persona()).toContain('ciò che si sa con certezza');
      expect(persona({ personaType: 'fictional' })).toContain(
        "Resta fedele all'opera"
      );
      expect(persona({ personaType: 'everyday' })).toContain(
        'Sei una persona inventata ma realistica'
      );
    });

    it('adds the closing part and its stop word only when asked for', () => {
      const plain = persona();
      expect(plain).not.toContain('5. ');
      expect(plain).not.toContain('FINE');

      const withClosing = persona({ closingSummary: true });
      expect(withClosing).toContain('5. Per concludere');
      expect(withClosing).toContain('possono scrivere «FINE»');
      expect(withClosing).toContain('- Riassunto:');
      expect(withClosing).not.toContain('Feedback linguistico');

      expect(persona({ closingFeedback: true })).toContain(
        '- Feedback linguistico:'
      );
    });

    it('includes goal, topics, limits and own rules as written', () => {
      const prompt = persona({
        topics: 'le invenzioni,  la pittura',
        researchGoal: 'Scoprire quali macchine\nha disegnato Leonardo.',
        turnLimit: 10,
        extraRules: 'Costa $& [CEFR] poco',
      });
      expect(prompt).toContain('su questi temi: le invenzioni, la pittura.');
      expect(prompt).toContain(
        '«Scoprire quali macchine ha disegnato Leonardo». Aiutali'
      );
      expect(prompt).toContain('Dopo circa 10 messaggi degli studenti');
      // Typed text is neither treated as a placeholder nor as a pattern
      expect(prompt).toContain('Altre regole: Costa $& [CEFR] poco.');

      const bare = persona();
      expect(bare).not.toContain('su questi temi');
      expect(bare).not.toContain('Dopo circa');
      expect(bare).not.toContain('Altre regole');
    });
  });

  describe('file output', () => {
    it('leaves the prompt alone for chat output', () => {
      expect(appendOutputFormat('Prompt\n', 'English', 'chat')).toBe('Prompt\n');
    });

    it('asks for the chosen file and offers a fallback', () => {
      const word = appendOutputFormat('Prompt\n', 'English', 'docx');
      expect(word.startsWith('Prompt\n\nOutput format:\n')).toBeTrue();
      expect(word).toContain('downloadable Word document (.docx)');
      expect(word).not.toContain('PDF');
      expect(word).toContain('If you cannot create files');

      expect(appendOutputFormat('Prompt', 'français', 'pdf')).toContain(
        'fichier PDF téléchargeable'
      );
      const both = appendOutputFormat('Prompt', 'italiano', 'docx-pdf');
      expect(both).toContain('un documento Word (.docx) e un file PDF');
    });
  });
});
