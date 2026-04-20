/** Question difficulty level */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

/** Full record (server / internal) — includes correct answer */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  difficulty: QuestionDifficulty;
}

/** Payload for client during play — omits correct answer */
export type QuizQuestionPublic = Omit<QuizQuestion, 'correctAnswerIndex'>;
