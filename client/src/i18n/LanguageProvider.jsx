import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { translate, STORAGE_LOCALE_KEY } from './messages.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_LOCALE_KEY)
      if (s === 'en' || s === 'vi') return s
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const setLocale = useCallback((next) => {
    if (next !== 'en' && next !== 'vi') return
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_LOCALE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'vi' ? 'vi' : 'en'
  }, [locale])

  const value = useMemo(() => {
    const t = (key, vars) => translate(locale, key, vars)
    return { locale, setLocale, t }
  }, [locale, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider')
  }
  return ctx
}
