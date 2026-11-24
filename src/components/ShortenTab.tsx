import { useMemo, useState } from 'react'
import { encodeUrl, type CodecOptions, type EncodeResult } from '../lib/codec'
import { useI18n } from '../i18n'
import { CopyButton, copyText } from './CopyButton'
import { UrlView } from './UrlView'

function Card({ r, opts }: { r: EncodeResult; opts: CodecOptions }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const pct = (ratio: number) => t('fmt.pct', { n: Math.round(ratio * 100) })
  if (!r.ok) {
    return (
      <article className="card card-error">
        <code className="urlview">{r.input}</code>
        <p className="muted">⚠️ {r.error && t(r.error)}</p>
      </article>
    )
  }
  const before = r.output.length + r.savedChars
  return (
    <article className="card">
      <div className="card-head">
        <UrlView url={r.output} param={r.changed ? opts.param : undefined} />
        <CopyButton text={r.output} />
      </div>
      {r.changed ? (
        <>
          <div className="meter" aria-label={t('card.reduction', { pct: pct(r.ratio) })}>
            <div className="meter-fill" style={{ width: `${Math.max(4, (1 - r.ratio) * 100)}%` }} />
          </div>
          <div className="stats">
            <span className="chip chip-good">−{pct(r.ratio)}</span>
            <span>
              {before} → <strong>{r.output.length}</strong> {t('card.chars')}
            </span>
            <span className="muted">{t('card.params', { pct: pct(r.queryRatio) })}</span>
            <span className={`chip ${r.roundTrip ? 'chip-ok' : 'chip-bad'}`}>
              {r.roundTrip ? t('card.roundOk') : t('card.roundFail')}
            </span>
            <button type="button" className="link" onClick={() => setOpen(!open)}>
              {open ? t('card.hideDetail') : t('card.showDetail')}
            </button>
          </div>
          {open && (
            <table className="detail">
              <thead>
                <tr><th>{t('detail.param')}</th><th>{t('detail.value')}</th><th>{t('detail.becomes')}</th></tr>
              </thead>
              <tbody>
                {r.params.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <code>{p.key}</code> {p.tracking && <span className="chip chip-track">{t('detail.tracking')}</span>}
                    </td>
                    <td className="break"><code>{p.value ?? '—'}</code></td>
                    <td className="break">
                      {p.packed ? (
                        <code>{p.keyToken}{p.valueToken !== undefined ? `:${p.valueToken}` : ''}</code>
                      ) : (
                        <span className="muted">{t('detail.unchanged')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p className="muted">{t('card.noGain')}</p>
      )}
    </article>
  )
}

export function ShortenTab({ opts }: { opts: CodecOptions }) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const lines = useMemo(() => text.split('\n').map((l) => l.trim()).filter(Boolean), [text])
  const results = useMemo(() => lines.map((l) => encodeUrl(l, opts)), [lines, opts])

  const good = results.filter((r) => r.ok)
  const saved = good.reduce((n, r) => n + r.savedChars, 0)
  const csv = () => {
    const rows = [t('summary.csvHeader'), ...good.map((r) => `"${r.input}";"${r.output}";${r.savedChars}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'mytinyparams.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <section>
      <div className="input-box">
        <label htmlFor="urls">{t('shorten.label')}</label>
        <textarea
          id="urls"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('shorten.placeholder')}
          rows={4}
          spellCheck={false}
          autoFocus
        />
        <div className="row">
          <button type="button" className="btn" onClick={() => setText([t('example.1'), t('example.2')].join('\n'))}>{t('shorten.example')}</button>
          {text && <button type="button" className="btn btn-ghost" onClick={() => setText('')}>{t('shorten.clear')}</button>}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <p><strong>{t('shorten.empty.strong')}</strong> {t('shorten.empty.rest')}</p>
          <div className="how">
            <div><b>1</b> {t('shorten.step1')}</div>
            <div><b>2</b> {t('shorten.step2')}</div>
            <div><b>3</b> {t('shorten.step3')}</div>
          </div>
        </div>
      ) : (
        <>
          {good.length > 1 && (
            <div className="summary">
              <span>{t('summary.urls')} <strong>{good.length}</strong> · {t('summary.saved')} <strong>{saved}</strong></span>
              <span className="row">
                <button type="button" className="btn" onClick={() => copyText(good.map((r) => r.output).join('\n'))}>{t('summary.copyAll')}</button>
                <button type="button" className="btn" onClick={csv}>{t('summary.csv')}</button>
              </span>
            </div>
          )}
          <div className="cards">
            {results.map((r, i) => <Card key={i} r={r} opts={opts} />)}
          </div>
        </>
      )}
    </section>
  )
}
