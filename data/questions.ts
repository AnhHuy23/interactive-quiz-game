/**
 * Re-export dữ liệu in-memory từ API server (single source).
 * Frontend/bundler khác có thể import trực tiếp từ đây khi cần dùng offline.
 */
export { QUESTIONS } from '../server/src/data/questions';
