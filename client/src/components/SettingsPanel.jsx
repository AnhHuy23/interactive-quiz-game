import { useState } from 'react'
import { useTranslation } from '../i18n/LanguageProvider.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'

export default function SettingsPanel() {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-[100] rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-md backdrop-blur hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700/90"
      >
        {t('settings.button')}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm dark:bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-600 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="settings-title" className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">
              {t('settings.title')}
            </h2>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{t('settings.hint')}</p>

            <fieldset className="mb-6">
              <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('settings.theme')}
              </legend>
              <div className="mb-6 flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:border-slate-600 dark:has-[:checked]:border-indigo-400 dark:has-[:checked]:bg-indigo-950/50">
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                  />
                  <span className="text-slate-800 dark:text-slate-200">{t('settings.themeLight')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:border-slate-600 dark:has-[:checked]:border-indigo-400 dark:has-[:checked]:bg-indigo-950/50">
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                  />
                  <span className="text-slate-800 dark:text-slate-200">{t('settings.themeDark')}</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="mb-6">
              <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('settings.language')}
              </legend>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:border-slate-600 dark:has-[:checked]:border-indigo-400 dark:has-[:checked]:bg-indigo-950/50">
                  <input
                    type="radio"
                    name="locale"
                    checked={locale === 'en'}
                    onChange={() => setLocale('en')}
                  />
                  <span className="text-slate-800 dark:text-slate-200">English</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:border-slate-600 dark:has-[:checked]:border-indigo-400 dark:has-[:checked]:bg-indigo-950/50">
                  <input
                    type="radio"
                    name="locale"
                    checked={locale === 'vi'}
                    onChange={() => setLocale('vi')}
                  />
                  <span className="text-slate-800 dark:text-slate-200">Tiếng Việt</span>
                </label>
              </div>
            </fieldset>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {t('settings.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
