import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from './en'
import { fr, type Key } from './fr'

export type Lang = 'fr' | 'en'
export const LANGS: readonly Lang[] = ['fr', 'en']
const dictionaries: Record<Lang, Record<Key, string>> = { fr, en }
const STORAGE_KEY = 'mtp:lang'

/** Langue mémorisée, sinon celle du navigateur (français si disponible, anglais sinon). */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    /* stockage indisponible */
  }
  const prefs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  return prefs.some((l) => l?.toLowerCase().startsWith('fr')) ? 'fr' : 'en'
}

export type Vars = Record<string, string | number>

export function translate(lang: Lang, key: Key, vars?: Vars): string {
  const text = dictionaries[lang][key]
  return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m)) : text
}

interface I18n {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: Key, vars?: Vars) => string
}

const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)
  const t = useCallback((key: Key, vars?: Vars) => translate(lang, key, vars), [lang])
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, 'meta.description'))
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): I18n {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n doit être utilisé dans <I18nProvider>')
  return v
}

export type { Key }
