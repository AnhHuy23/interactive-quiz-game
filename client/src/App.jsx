import { useState, useEffect, useCallback, useRef } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import { fetchRandomQuestions } from './services/quizApi.js'
import { useCountdownTimer } from './hooks/useCountdownTimer.js'

const SECONDS_PER_QUESTION = 15
const ADVANCE_MS = 1200

export default function App() {
  const [phase, setPhase] = useState('start')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentIndexRef = useRef(0)
  const questionsRef = useRef([])
  const lockedRef = useRef(false)
  const stopTimerRef = useRef(() => {})

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    questionsRef.current = questions
  }, [questions])

  useEffect(() => {
    lockedRef.current = false
  }, [currentIndex])

  const scheduleAdvance = useCallback(() => {
    window.setTimeout(() => {
      setCurrentIndex((ci) => {
        const qs = questionsRef.current
        if (qs.length === 0) return ci
        if (ci >= qs.length - 1) {
          queueMicrotask(() => setPhase('result'))
          return ci
        }
        return ci + 1
      })
    }, ADVANCE_MS)
  }, [])

  const handleTimeUp = useCallback(() => {
    if (lockedRef.current) return
    lockedRef.current = true
    stopTimerRef.current()

    setUserAnswers((prev) => {
      const ci = currentIndexRef.current
      if (prev[ci] != null) return prev
      const next = [...prev]
      next[ci] = -1
      return next
    })

    scheduleAdvance()
  }, [scheduleAdvance])

  const { timeLeft, resetTimer, stopTimer } = useCountdownTimer(SECONDS_PER_QUESTION, handleTimeUp)

  stopTimerRef.current = stopTimer

  useEffect(() => {
    if (phase !== 'quiz') {
      stopTimer()
    }
  }, [phase, stopTimer])

  useEffect(() => {
    if (phase !== 'quiz') return
    resetTimer()
  }, [phase, currentIndex, resetTimer])

  async function handleStart({ difficulty, limit }) {
    setError(null)
    setLoading(true)
    try {
      const qs = await fetchRandomQuestions(limit, difficulty)
      if (!qs.length) {
        setError('Không lấy được câu hỏi nào. Thử giảm bộ lọc hoặc kiểm tra API.')
        return
      }
      setQuestions(qs)
      setUserAnswers(Array(qs.length).fill(null))
      setCurrentIndex(0)
      setPhase('quiz')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được câu hỏi')
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(optionIndex) {
    if (lockedRef.current) return
    lockedRef.current = true
    stopTimer()

    setUserAnswers((prev) => {
      const ci = currentIndexRef.current
      if (prev[ci] != null) return prev
      const next = [...prev]
      next[ci] = optionIndex
      return next
    })

    scheduleAdvance()
  }

  function handleRestart() {
    stopTimer()
    setPhase('start')
    setQuestions([])
    setUserAnswers([])
    setCurrentIndex(0)
    setError(null)
  }

  const total = questions.length
  const current = questions[currentIndex]
  const selectedOption = current ? userAnswers[currentIndex] : null

  let correctCount = 0
  if (phase === 'result' && total > 0) {
    correctCount = questions.reduce(
      (acc, q, i) => acc + (userAnswers[i] === q.correctAnswerIndex ? 1 : 0),
      0,
    )
  }
  const wrongCount = total > 0 ? total - correctCount : 0
  const percentCorrect = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <p className="text-lg font-medium text-slate-700">Đang tải câu hỏi…</p>
        </div>
      )}

      {error && phase === 'start' && (
        <div className="mx-auto max-w-lg px-4 pt-6">
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800"
          >
            {error}
          </div>
        </div>
      )}

      {phase === 'start' && <StartScreen onStart={handleStart} disabled={loading} />}

      {phase === 'quiz' && current && (
        <>
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-slate-600">
                Câu {currentIndex + 1} / {total}
              </span>
              <div
                className={`rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums ${
                  timeLeft <= 5 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {String(timeLeft).padStart(2, '0')}s
              </div>
            </div>
            <div className="h-1 w-full bg-slate-100">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{
                  width: `${((SECONDS_PER_QUESTION - timeLeft) / SECONDS_PER_QUESTION) * 100}%`,
                }}
              />
            </div>
          </header>

          <QuizScreen
            question={current}
            currentIndex={currentIndex}
            total={total}
            onAnswer={handleAnswer}
            selectedOption={selectedOption}
            correctAnswerIndex={current.correctAnswerIndex}
          />
        </>
      )}

      {phase === 'result' && (
        <ResultScreen
          correctCount={correctCount}
          wrongCount={wrongCount}
          total={total}
          percentCorrect={percentCorrect}
          onRestart={handleRestart}
          onBackHome={handleRestart}
        />
      )}
    </div>
  )
}
