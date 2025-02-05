export interface BasePromptTemplate {
  intro: string;
  contextIntro: string;
}

export interface VocabularyPromptTemplate extends BasePromptTemplate {
  wordListIntro: string;
}

export interface GrammarPromptTemplate extends BasePromptTemplate {
  phenomenaIntro: string;
  dialogIntro: string;
}

export interface ComprehensionPromptTemplate extends BasePromptTemplate {
  questionIntro: string;
  difficultyIntro: string;
}
