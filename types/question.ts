/** Độ khó câu hỏi */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

/** Bản đầy đủ (server / nội bộ) — có đáp án đúng */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  difficulty: QuestionDifficulty;
}

/** Gửi cho client khi làm bài — không lộ đáp án */
export type QuizQuestionPublic = Omit<QuizQuestion, 'correctAnswerIndex'>;
