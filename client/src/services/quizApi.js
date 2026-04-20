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
 * All questions, optionally filtered by difficulty.
 * @param {string} [difficulty] - 'easy' | 'medium' | 'hard'
 */
export async function fetchQuestions(difficulty) {
  const params = {}
  if (difficulty != null && String(difficulty).trim() !== '') {
    params.difficulty = difficulty
  }
  const data = unwrap(await quizApi.get('/api/questions', { params }))
  return data.questions
}

/**
 * Random subset of questions.
 * @param {number} limit
 * @param {string} [difficulty]
 */
export async function fetchRandomQuestions(limit, difficulty) {
  if (limit == null || Number.isNaN(Number(limit))) {
    throw new Error('limit must be a number')
  }
  const params = { limit: Number(limit) }
  if (difficulty != null && String(difficulty).trim() !== '') {
    params.difficulty = difficulty
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
