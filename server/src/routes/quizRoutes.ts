import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

import { QUESTIONS } from '../data/questions';
import {
  filterQuestions,
  getQuestionById,
  getRandomQuestions,
  listCategories,
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

/** Express query values may be string | string[] */
function firstQuery(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  const raw = Array.isArray(val) ? val[0] : val;
  if (raw === undefined || raw === null) return undefined;
  const s = String(raw).trim();
  return s.length === 0 ? undefined : s;
}

/** GET /api/questions/categories — register before :id */
router.get(
  '/questions/categories',
  asyncHandler(async (_req: Request, res: Response) => {
    jsonSuccess(res, {
      categories: listCategories(),
      totalQuestions: QUESTIONS.length,
    });
  }),
);

/** GET /api/questions — optional ?difficulty=&category= (omit category or use all) */
router.get(
  '/questions',
  asyncHandler(async (req: Request, res: Response) => {
    const d = firstQuery(req.query.difficulty);
    const c = firstQuery(req.query.category);
    const list = filterQuestions(d, c);
    jsonSuccess(res, { questions: list, count: list.length });
  }),
);

/** GET /api/questions/random?limit=&difficulty=&category= */
router.get(
  '/questions/random',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit;
    const diff = firstQuery(req.query.difficulty);
    const cat = firstQuery(req.query.category);
    const list = getRandomQuestions(limit, diff, cat);
    const limitNum = Number.parseInt(String(limit), 10);
    jsonSuccess(res, {
      questions: list,
      count: list.length,
      limit: Number.isFinite(limitNum) ? limitNum : limit,
      difficulty: diff ?? 'all',
      category: cat && cat.toLowerCase() !== 'all' ? cat : 'all',
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
