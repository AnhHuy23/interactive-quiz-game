import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/LanguageProvider.jsx'

const STORAGE_KEY = 'interactive-quiz-best-percent'

function loadBest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw != null ? Number(raw) : null
  } catch {
    return null
  }
}

export default function ResultScreen({
  correctCount,
  wrongCount,
  total,
  percentCorrect,
  onRestart,
  onBackHome,
}) {
  const { t } = useTranslation()
  const [best, setBest] = useState(() => loadBest())

  useEffect(() => {
    const prev = loadBest()
    if (prev == null || percentCorrect > prev) {
      try {
        localStorage.setItem(STORAGE_KEY, String(percentCorrect))
        setBest(percentCorrect)
      } catch {
        setBest(percentCorrect)
      }
    } else {
      setBest(prev)
    }
  }, [percentCorrect])

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 pt-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-600 dark:bg-slate-900">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{t('result.title')}</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {t('result.summary', {
            correct: correctCount,
            total,
            percent: percentCorrect,
          })}
        </p>

        <div className="mb-6 grid grid-cols-2 gap-4 text-left">
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/50">
            <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {t('result.correct')}
            </p>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{correctCount}</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/50">
            <p className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-400">
              {t('result.wrongLabel')}
            </p>
            <p className="text-2xl font-bold text-rose-800 dark:text-rose-200">{wrongCount}</p>
          </div>
        </div>

        {best != null && (
          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
            {t('result.best')} <span className="font-semibold text-slate-800 dark:text-slate-100">{best}%</span>
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {t('result.playAgain')}
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {t('result.home')}
          </button>
        </div>
      </div>
    </div>
  )
}
