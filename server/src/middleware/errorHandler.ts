import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../lib/appError';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal Server Error';
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL',
      message,
    },
  });
}
