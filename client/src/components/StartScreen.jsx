import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from '../i18n/LanguageProvider.jsx'
import { fetchCategories } from '../services/quizApi.js'

export default function StartScreen({ onStart, disabled }) {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState('easy')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState(10)
  const [categories, setCategories] = useState([])
  const [catError, setCatError] = useState(null)

  const difficulties = useMemo(
    () => [
      { value: 'easy', label: t('diff.easy') },
      { value: 'medium', label: t('diff.medium') },
      { value: 'hard', label: t('diff.hard') },
    ],
    [t],
  )

  useEffect(() => {
    let cancelled = false
    fetchCategories()
      .then(({ categories: list }) => {
        if (!cancelled) {
          setCategories(list)
          setCatError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setCatError(t('start.categoriesLoadError'))
      })
    return () => {
      cancelled = true
    }
  }, [t])

  function handleSubmit(e) {
    e.preventDefault()
    const n = Number(limit)
    if (!Number.isFinite(n) || n < 1) return
    onStart({
      difficulty,
      limit: Math.min(100, Math.floor(n)),
      category,
    })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 pt-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 dark:border-slate-600 dark:bg-slate-900 dark:shadow-slate-950/40">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t('start.title')}
        </h1>
        <p className="mb-8 text-center text-slate-600 dark:text-slate-400">{t('start.subtitle')}</p>

        {catError && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
            {catError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="difficulty" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('start.difficulty')}
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-indigo-500 focus:ring-2 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-indigo-400"
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('start.category')}
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-indigo-500 focus:ring-2 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-indigo-400"
            >
              <option value="">{t('start.categoryAll')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="limit" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-indigo-500 focus:ring-2 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:shadow-indigo-900/30 dark:hover:bg-indigo-400"
          >
            {disabled ? t('start.loading') : t('start.start')}
          </button>
        </form>
      </div>
    </div>
  )
}
