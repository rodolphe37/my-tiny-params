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

const TABS: { id: string; label: Key }[] = [
  { id: 'shorten', label: 'tab.shorten' },
  { id: 'decode', label: 'tab.decode' },
  { id: 'integrate', label: 'tab.integrate' },
  { id: 'settings', label: 'tab.settings' },
]

export default function App() {
  const { t } = useI18n()
  const [tab, setTab] = useState('shorten')
  const [stored, setStored] = usePersistentState<CodecOptions>('mtp:options', DEFAULT_OPTIONS)
  const [theme, setTheme] = usePersistentState<{ mode: 'auto' | 'light' | 'dark' }>('mtp:theme', { mode: 'auto' })

  // un nom de paramètre invalide retombe sur le défaut pour ne jamais produire d'URL cassée
  const opts = useMemo<CodecOptions>(
    () => (/^[A-Za-z][A-Za-z0-9_-]{0,15}$/.test(stored.param) ? stored : { ...stored, param: DEFAULT_OPTIONS.param }),
    [stored],
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme.mode === 'auto' ? '' : theme.mode
  }, [theme])

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <img src="/brand/logo-240.png" alt="" width={68} height={34} />
          <span>MyTinyParams</span>
        </div>
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

      <footer>{t('footer', { version: __APP_VERSION__ })}</footer>

      <InstallPrompt />
      <UpdateBanner />
    </div>
  )
}
