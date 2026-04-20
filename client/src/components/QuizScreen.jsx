import { useEffect, useRef } from 'react'
import { useTranslation } from '../i18n/LanguageProvider.jsx'

function optionClass(i, selectedOption, correctAnswerIndex) {
  const locked = selectedOption != null
  if (!locked) {
    return 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-600 dark:bg-slate-800/90 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/40'
  }
  const isCorrect = i === correctAnswerIndex
  const isPicked = i === selectedOption
  const isWrongPick = isPicked && !isCorrect
  const timedOut = selectedOption === -1

  if (isCorrect) {
    return 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-100 dark:ring-emerald-800'
  }
  if (isWrongPick) {
    return 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200 dark:border-rose-400 dark:bg-rose-950/50 dark:text-rose-100 dark:ring-rose-800'
  }
  if (timedOut && !isCorrect) {
    return 'border-slate-200 bg-slate-50 text-slate-500 opacity-70 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400'
  }
  return 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-600 dark:bg-slate-800/40'
}

export default function QuizScreen({
  question,
  currentIndex,
  total,
  onAnswer,
  selectedOption,
  correctAnswerIndex,
}) {
  const { t } = useTranslation()
  const questionRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    questionRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [currentIndex, question?.id])

  if (!question) return null

  const locked = selectedOption != null

  return (
    <div className="mx-auto flex max-h-[calc(100dvh-5rem)] max-w-2xl flex-col px-4 pb-8 pt-4">
      <p className="mb-3 shrink-0 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        {t('quiz.progress', { n: currentIndex + 1, total })}
      </p>

      {/* Question stays visible; answers scroll if the list is long */}
      <div
        ref={questionRef}
        id="quiz-question-panel"
        className="mb-4 shrink-0 scroll-mt-24 rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-5 shadow-md dark:border-indigo-700/60 dark:bg-indigo-950/40 dark:shadow-slate-950/30"
      >
        <h2 className="text-left text-lg font-semibold leading-snug text-slate-900 md:text-xl dark:text-slate-100">
          {question.question}
        </h2>
        {question.category && (
          <p className="mt-3 text-left text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {question.category}
          </p>
        )}
      </div>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {question.options.map((text, i) => {
          const label = String.fromCharCode(65 + i)
          return (
            <li key={i}>
              <button
                type="button"
                disabled={locked}
                onClick={() => !locked && onAnswer(i)}
                className={`w-full rounded-xl border-2 px-4 py-4 text-left text-slate-800 transition dark:text-slate-100 ${optionClass(
                  i,
                  selectedOption,
                  correctAnswerIndex,
                )} ${locked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="mr-3 font-mono text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {label}.
                </span>
                <span className="align-top">{text}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
