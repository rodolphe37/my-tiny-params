import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_OPTIONS, type CodecOptions } from './lib/codec'
import { usePersistentState } from './lib/storage'
import { useI18n, type Key } from './i18n'
import { ShortenTab } from './components/ShortenTab'
import { DecodeTab } from './components/DecodeTab'
import { IntegrationTab } from './components/IntegrationTab'
import { SettingsTab } from './components/SettingsTab'
import { InstallPrompt } from './components/InstallPrompt'
import { UpdateBanner } from './components/UpdateBanner'
import { LangSwitch } from './components/LangSwitch'
import { LegalPage } from './components/LegalPage'
import { copyright, legalDocs, REPO_URL } from './i18n/legal'
import { pathOf, useRoute, type Route } from './lib/route'

const TABS: { id: string; label: Key }[] = [
  { id: 'shorten', label: 'tab.shorten' },
  { id: 'decode', label: 'tab.decode' },
  { id: 'integrate', label: 'tab.integrate' },
  { id: 'settings', label: 'tab.settings' },
]

export default function App() {
  const { t, lang } = useI18n()
  const [route, go] = useRoute()
  const [tab, setTab] = useState('shorten')
  const [stored, setStored] = usePersistentState<CodecOptions>('mtp:options', DEFAULT_OPTIONS)
  const [theme, setTheme] = usePersistentState<{ mode: 'auto' | 'light' | 'dark' }>('mtp:theme', { mode: 'auto' })

  // un nom de paramètre invalide retombe sur le défaut pour ne jamais produire d'URL cassée
  const opts = useMemo<CodecOptions>(
    () => (/^[A-Za-z][A-Za-z0-9_-]{0,15}$/.test(stored.param) ? stored : { ...stored, param: DEFAULT_OPTIONS.param }),
    [stored],
  )

  // titre de l'onglet : celui de l'app, ou celui de la page juridique affichée
  useEffect(() => {
    document.title = route === 'home' ? t('meta.title') : `${legalDocs[lang][route].title} — MyTinyParams`
  }, [route, lang, t])

  useEffect(() => {
    document.documentElement.dataset.theme = theme.mode === 'auto' ? '' : theme.mode
  }, [theme])

  return (
    <div className="app">
      <header className="top">
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); go('home') }}>
          <img src="/brand/logo-240.png" alt="" width={68} height={34} />
          <span>MyTinyParams</span>
        </a>
        <div className="top-actions">
          <LangSwitch />
          <button
            type="button"
            className="btn btn-ghost"
            aria-label={t('theme.aria')}
            onClick={() => setTheme({ mode: theme.mode === 'dark' ? 'light' : theme.mode === 'light' ? 'auto' : 'dark' })}
          >
            {t(theme.mode === 'dark' ? 'theme.dark' : theme.mode === 'light' ? 'theme.light' : 'theme.auto')}
          </button>
        </div>
      </header>

      {route !== 'home' ? (
        <LegalPage kind={route} onBack={() => go('home')} />
      ) : (
        <>
          <section className="hero">
            <h1>{t('hero.title1')}<br /><em>{t('hero.title2')}</em></h1>
            <p>{t('hero.lead')}</p>
          </section>

          <nav className="tabs" role="tablist">
            {TABS.map((tb) => (
              <button key={tb.id} role="tab" aria-selected={tab === tb.id} className={tab === tb.id ? 'on' : ''} onClick={() => setTab(tb.id)}>
                {t(tb.label)}
              </button>
            ))}
          </nav>

          <main>
            {tab === 'shorten' && <ShortenTab opts={opts} />}
            {tab === 'decode' && <DecodeTab opts={opts} />}
            {tab === 'integrate' && <IntegrationTab opts={opts} />}
            {tab === 'settings' && <SettingsTab opts={stored} onChange={setStored} />}
          </main>
        </>
      )}

      <footer>
        <p>{t('footer', { version: __APP_VERSION__ })}</p>
        <p>
          {copyright()} ·{' '}
          {(['legal', 'terms'] as Route[]).map((r, i) => (
            <span key={r}>
              {i > 0 && ' · '}
              <a href={pathOf(r)} onClick={(e) => { e.preventDefault(); go(r) }}>{t(r === 'legal' ? 'footer.legal' : 'footer.terms')}</a>
            </span>
          ))}
          {' · '}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">{t('footer.source')}</a>
        </p>
      </footer>

      <InstallPrompt />
      <UpdateBanner />
    </div>
  )
}
