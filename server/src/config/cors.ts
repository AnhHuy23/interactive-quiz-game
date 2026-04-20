import type { CorsOptions } from 'cors';

/**
 * CORS for Vite dev server (React at http://localhost:5173).
 *
 * - origin: allowlist only (cannot use * with credentials).
 * - credentials: true — sends/receives cookies on cross-origin when allowed above.
 * - methods: common REST verbs.
 * - allowedHeaders: Content-Type, Authorization for preflight OPTIONS.
 */
export const corsOptions: CorsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};
