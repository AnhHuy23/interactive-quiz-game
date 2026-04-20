import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

import {
  getAllQuestions,
  getQuestionById,
  getQuestionsByDifficulty,
  getRandomQuestions,
} from '../services/quizService';

const router = Router();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function jsonSuccess<T>(res: Response, data: T, status = 200) {
  res.status(status).json({
    success: true,
    data,
  });
}

/** Express: query có thể là string | string[] | undefined */
function firstQuery(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  const raw = Array.isArray(val) ? val[0] : val;
  if (raw === undefined || raw === null) return undefined;
  const s = String(raw).trim();
  return s.length === 0 ? undefined : s;
}

/** GET /api/questions — toàn bộ hoặc lọc ?difficulty=easy */
router.get(
  '/questions',
  asyncHandler(async (req: Request, res: Response) => {
    const d = firstQuery(req.query.difficulty);
    if (d !== undefined) {
      const list = getQuestionsByDifficulty(d);
      jsonSuccess(res, { questions: list, count: list.length });
      return;
    }
    const list = getAllQuestions();
    jsonSuccess(res, { questions: list, count: list.length });
  }),
);

/** GET /api/questions/random?limit=10&difficulty=easy — đặt trước :id */
router.get(
  '/questions/random',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit;
    const diff = firstQuery(req.query.difficulty);
    const list = getRandomQuestions(limit, diff);
    const limitNum = Number.parseInt(String(limit), 10);
    jsonSuccess(res, {
      questions: list,
      count: list.length,
      limit: Number.isFinite(limitNum) ? limitNum : limit,
      difficulty: diff ?? 'all',
    });
  }),
);

/** GET /api/questions/:id */
router.get(
  '/questions/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const q = getQuestionById(req.params.id);
    jsonSuccess(res, { question: q });
  }),
);

export { router as quizRoutes };
