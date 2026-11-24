import { useState } from 'react'
import type { CodecOptions } from '../lib/codec'
import { useI18n } from '../i18n'
import { browserSnippet, serverSnippet } from '../lib/snippet'
import { CopyButton } from './CopyButton'
import { Html } from './Html'

type Kind = 'browser' | 'server'

export function IntegrationTab({ opts }: { opts: CodecOptions }) {
  const { t, lang } = useI18n()
  const [kind, setKind] = useState<Kind>('browser')
  const code = kind === 'browser' ? browserSnippet(opts, lang) : serverSnippet(opts, lang)
  return (
    <section className="prose">
      <h2>{t('integ.title')}</h2>
      <ol className="steps">
        <Html as="li" k="integ.step1" vars={{ param: opts.param }} />
        <Html as="li" k="integ.step2" />
        <Html as="li" k="integ.step3" />
      </ol>

      <p className="callout"><Html k="integ.callout" /></p>

      <div className="tabs-inner" role="tablist">
        <button role="tab" aria-selected={kind === 'browser'} className={kind === 'browser' ? 'on' : ''} onClick={() => setKind('browser')}>{t('integ.browser')}</button>
        <button role="tab" aria-selected={kind === 'server'} className={kind === 'server' ? 'on' : ''} onClick={() => setKind('server')}>{t('integ.server')}</button>
      </div>
      <div className="code-wrap">
        <CopyButton text={code} label={t('integ.copyCode')} className="code-copy" />
        <pre className="code"><code>{code}</code></pre>
      </div>
      <p className="muted">{kind === 'browser' ? t('integ.noteBrowser') : t('integ.noteServer')}</p>
      <p className="muted"><Html k="integ.noteSettings" /></p>
    </section>
  )
}
