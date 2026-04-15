'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { en } from './translations/en'
import { ja } from './translations/ja'
import { sr } from './translations/sr'
import { es } from './translations/es'

export type Locale = 'en' | 'ja' | 'sr' | 'es'

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'ja', label: '日本語', flag: 'JA' },
  { code: 'sr', label: 'Srpski', flag: 'SR' },
  { code: 'es', label: 'Español', flag: 'ES' },
]

const dictionaries: Record<Locale, typeof en> = { en, ja, sr, es }

type TranslationKey = string

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
