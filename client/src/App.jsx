import { useState, useEffect, useCallback, useRef } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import { fetchRandomQuestions } from './services/quizApi.js'
import { useCountdownTimer } from './hooks/useCountdownTimer.js'
import { useTranslation } from './i18n/LanguageProvider.jsx'

const SECONDS_PER_QUESTION = 15
const ADVANCE_MS = 1200

export default function App() {
  const { t } = useTranslation()
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

  /** Keep question text in view when moving to the next item (fixes “only options visible”). */
  useEffect(() => {
    if (phase !== 'quiz') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [phase, currentIndex])

  async function handleStart({ difficulty, limit, category }) {
    setError(null)
    setLoading(true)
    try {
      const qs = await fetchRandomQuestions(limit, difficulty, category)
      if (!qs.length) {
        setError(t('app.errorEmpty'))
        return
      }
      setQuestions(qs)
      setUserAnswers(Array(qs.length).fill(null))
      setCurrentIndex(0)
      setPhase('quiz')
    } catch (e) {
      setError(e instanceof Error ? e.message : t('app.errorLoad'))
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/40">
      <SettingsPanel />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-950/75">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{t('app.loading')}</p>
        </div>
      )}

      {error && phase === 'start' && (
        <div className="mx-auto max-w-lg px-4 pt-16">
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/50 dark:text-rose-200"
          >
            {error}
          </div>
        </div>
      )}

      {phase === 'start' && <StartScreen onStart={handleStart} disabled={loading} />}

      {phase === 'quiz' && current && (
        <>
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/90">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t('app.progress', { n: currentIndex + 1, total })}
              </span>
              <div
                className={`rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums ${
                  timeLeft <= 5
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {String(timeLeft).padStart(2, '0')}s
              </div>
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-indigo-500 transition-all dark:bg-indigo-400"
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
