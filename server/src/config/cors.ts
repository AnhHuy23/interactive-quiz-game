import type { CorsOptions } from 'cors';

/**
 * CORS cho frontend Vite dev (React tại http://localhost:5173).
 *
 * - origin: chỉ danh sách được phép (không dùng * khi bật credentials).
 * - credentials: true → browser gửi/nhận cookie / Authorization khi same-origin policy
 *   vẫn cho phép cross-origin với origin cụ thể ở trên.
 * - methods: cho phép method REST thông dụng.
 * - allowedHeaders: cho phép Content-Type, Authorization khi preflight OPTIONS.
 */
export const corsOptions: CorsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};
