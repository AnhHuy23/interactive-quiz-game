import { useTranslation } from '../i18n/LanguageProvider.jsx'

function optionClass(i, selectedOption, correctAnswerIndex) {
  const locked = selectedOption != null
  if (!locked) {
    return 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
  }
  const isCorrect = i === correctAnswerIndex
  const isPicked = i === selectedOption
  const isWrongPick = isPicked && !isCorrect
  const timedOut = selectedOption === -1

  if (isCorrect) {
    return 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
  }
  if (isWrongPick) {
    return 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
  }
  if (timedOut && !isCorrect) {
    return 'border-slate-200 bg-slate-50 text-slate-500 opacity-70'
  }
  return 'border-slate-200 bg-slate-50 opacity-60'
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
  if (!question) return null

  const locked = selectedOption != null

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <p className="mb-2 text-center text-sm font-medium text-slate-500">
        {t('quiz.progress', { n: currentIndex + 1, total })}
      </p>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-left text-lg font-semibold leading-relaxed text-slate-900 md:text-xl">
          {question.question}
        </h2>
        {question.category && (
          <p className="mt-2 text-left text-sm text-slate-500">{question.category}</p>
        )}
      </div>

      <ul className="space-y-3">
        {question.options.map((text, i) => {
          const label = String.fromCharCode(65 + i)
          return (
            <li key={i}>
              <button
                type="button"
                disabled={locked}
                onClick={() => !locked && onAnswer(i)}
                className={`w-full rounded-xl border-2 px-4 py-4 text-left text-slate-800 transition ${optionClass(
                  i,
                  selectedOption,
                  correctAnswerIndex,
                )} ${locked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="mr-3 font-mono text-sm text-slate-500">{label}.</span>
                {text}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
