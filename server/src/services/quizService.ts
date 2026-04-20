import { QUESTIONS } from '../data/questions';
import { AppError } from '../lib/appError';
import type { Difficulty, QuizQuestion } from '../types/quiz.types';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const MAX_RANDOM_LIMIT = 100;

function assertDifficulty(value: unknown): asserts value is Difficulty {
  if (typeof value !== 'string' || !DIFFICULTIES.includes(value as Difficulty)) {
    throw new AppError(400, `difficulty phải là một trong: ${DIFFICULTIES.join(', ')}`, 'VALIDATION_ERROR');
  }
}

function assertPositiveIntLimit(value: unknown): number {
  if (value === undefined || value === null || value === '') {
    throw new AppError(400, 'limit là bắt buộc và phải là số nguyên dương', 'VALIDATION_ERROR');
  }
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
    throw new AppError(400, 'limit phải là số nguyên >= 1', 'VALIDATION_ERROR');
  }
  if (n > MAX_RANDOM_LIMIT) {
    throw new AppError(400, `limit không được vượt quá ${MAX_RANDOM_LIMIT}`, 'VALIDATION_ERROR');
  }
  return n;
}

function assertId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new AppError(400, 'id không hợp lệ', 'VALIDATION_ERROR');
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Trả đầy đủ kèm correctAnswerIndex — client SPA dùng để chấm điểm (chỉ tin cậy trong dev/demo). */
export function getAllQuestions(): QuizQuestion[] {
  try {
    return [...QUESTIONS];
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Lỗi đọc dữ liệu';
    throw new AppError(500, msg, 'INTERNAL');
  }
}

export function getQuestionsByDifficulty(difficulty: unknown): QuizQuestion[] {
  assertDifficulty(difficulty);
  return QUESTIONS.filter((q) => q.difficulty === difficulty);
}

/**
 * @param limit — số câu cần lấy (1..100)
 * @param difficulty — optional; nếu có thì chỉ lấy trong nhóm đó
 */
export function getRandomQuestions(limit: unknown, difficulty?: unknown): QuizQuestion[] {
  const n = assertPositiveIntLimit(limit);
  let pool: QuizQuestion[] = [...QUESTIONS];

  if (difficulty !== undefined && difficulty !== null && String(difficulty).length > 0) {
    assertDifficulty(typeof difficulty === 'string' ? difficulty : String(difficulty));
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  if (pool.length === 0) {
    return [];
  }

  const take = Math.min(n, pool.length);
  return shuffle(pool).slice(0, take);
}

export function getQuestionById(id: unknown): QuizQuestion {
  assertId(id);
  const found = QUESTIONS.find((q) => q.id === id);
  if (!found) {
    throw new AppError(404, `Không tìm thấy câu hỏi: ${id}`, 'NOT_FOUND');
  }
  return found;
}
