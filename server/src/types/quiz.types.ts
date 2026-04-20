export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  difficulty: Difficulty;
}

/** Payload gửi client — không lộ đáp án */
export type QuizQuestionPublic = Omit<QuizQuestion, 'correctAnswerIndex'>;

export interface QuizBankMeta {
  schemaVersion: string;
  title: string;
  description: string;
}

export interface QuizBank {
  meta: QuizBankMeta;
  questions: QuizQuestion[];
}
