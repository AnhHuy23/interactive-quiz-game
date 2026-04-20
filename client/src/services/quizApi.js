import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

export const quizApi = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
})

function unwrap(response) {
  const { data } = response
  if (!data?.success) {
    const msg = data?.error?.message || 'Request failed'
    throw new Error(msg)
  }
  return data.data
}

/**
 * Quiz categories (for filters).
 */
export async function fetchCategories() {
  const data = unwrap(await quizApi.get('/api/questions/categories'))
  return {
    categories: data.categories || [],
    totalQuestions: data.totalQuestions ?? 0,
  }
}

/**
 * All questions, optional filters.
 * @param {string} [difficulty]
 * @param {string} [category] — omit or 'all'
 */
export async function fetchQuestions(difficulty, category) {
  const params = {}
  if (difficulty != null && String(difficulty).trim() !== '') {
    params.difficulty = difficulty
  }
  if (category != null && String(category).trim() !== '' && String(category).toLowerCase() !== 'all') {
    params.category = category
  }
  const data = unwrap(await quizApi.get('/api/questions', { params }))
  return data.questions
}

/**
 * Random subset (max 100).
 * @param {number} limit
 * @param {string} [difficulty]
 * @param {string} [category] — omit or 'all'
 */
export async function fetchRandomQuestions(limit, difficulty, category) {
  if (limit == null || Number.isNaN(Number(limit))) {
    throw new Error('limit must be a number')
  }
  const params = { limit: Number(limit) }
  if (difficulty != null && String(difficulty).trim() !== '') {
    params.difficulty = difficulty
  }
  if (category != null && String(category).trim() !== '' && String(category).toLowerCase() !== 'all') {
    params.category = category
  }
  const data = unwrap(await quizApi.get('/api/questions/random', { params }))
  return data.questions
}

/**
 * Single question by id.
 * @param {string} id
 */
export async function fetchQuestionById(id) {
  if (id == null || String(id).trim() === '') {
    throw new Error('invalid id')
  }
  const data = unwrap(await quizApi.get(`/api/questions/${encodeURIComponent(id)}`))
  return data.question
}
