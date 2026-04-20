import type { Request, Response } from 'express';

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Not Found',
      path: req.path,
    },
  });
}
