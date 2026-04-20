import { useState, useMemo } from 'react'
import { useTranslation } from '../i18n/LanguageProvider.jsx'

export default function StartScreen({ onStart, disabled }) {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState('easy')
  const [limit, setLimit] = useState(5)

  const difficulties = useMemo(
    () => [
      { value: 'easy', label: t('diff.easy') },
      { value: 'medium', label: t('diff.medium') },
      { value: 'hard', label: t('diff.hard') },
    ],
    [t],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const n = Number(limit)
    if (!Number.isFinite(n) || n < 1) return
    onStart({ difficulty, limit: Math.min(100, Math.floor(n)) })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 pt-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          {t('start.title')}
        </h1>
        <p className="mb-8 text-center text-slate-600">{t('start.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="difficulty" className="mb-2 block text-sm font-medium text-slate-700">
              {t('start.difficulty')}
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-indigo-500 focus:ring-2 disabled:opacity-50"
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="limit" className="mb-2 block text-sm font-medium text-slate-700">
              {t('start.countLabel')}
            </label>
            <input
              id="limit"
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-indigo-500 focus:ring-2 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {disabled ? t('start.loading') : t('start.start')}
          </button>
        </form>
      </div>
    </div>
  )
}
