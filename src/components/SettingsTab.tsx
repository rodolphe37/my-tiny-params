import { useState } from 'react'
import { validateAlias, type AliasErrorKey, type CodecOptions, type Scope } from '../lib/codec'
import { DEFAULT_PARAM, KEY_CODES, VALUE_CODES } from '../lib/dictionary'
import { useI18n } from '../i18n'
import { Html } from './Html'
import { InstallCard } from './InstallPrompt'

export function SettingsTab({ opts, onChange }: { opts: CodecOptions; onChange: (o: CodecOptions) => void }) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [value, setValue] = useState('')
  const [err, setErr] = useState<AliasErrorKey | null>(null)
  const paramOk = /^[A-Za-z][A-Za-z0-9_-]{0,15}$/.test(opts.param)

  const add = () => {
    const e = validateAlias(code.trim(), value.trim(), opts.aliases)
    setErr(e)
    if (e) return
    onChange({ ...opts, aliases: { ...opts.aliases, [code.trim()]: value.trim() } })
    setCode('')
    setValue('')
  }
  const remove = (c: string) => {
    if (!confirm(t('set.removeConfirm', { code: c }))) return
    const next = { ...opts.aliases }
    delete next[c]
    onChange({ ...opts, aliases: next })
  }

  return (
    <section className="prose">
      <h2>{t('set.title')}</h2>

      <div className="field">
        <label htmlFor="param">{t('set.param')}</label>
        <input id="param" value={opts.param} onChange={(e) => onChange({ ...opts, param: e.target.value })} spellCheck={false} />
        <p className="muted">
          {paramOk ? <Html k="set.paramHint" vars={{ default: DEFAULT_PARAM }} />
            : <span className="err">{t('set.paramError')}</span>}
        </p>
      </div>

      <fieldset className="field">
        <legend>{t('set.scope')}</legend>
        {(['tracking', 'all'] as Scope[]).map((s) => (
          <label key={s} className="radio">
            <input type="radio" name="scope" checked={opts.scope === s} onChange={() => onChange({ ...opts, scope: s })} />
            <span>
              <strong>{t(s === 'tracking' ? 'set.scope.tracking' : 'set.scope.all')}</strong>
              <small>{t(s === 'tracking' ? 'set.scope.trackingDesc' : 'set.scope.allDesc')}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="field">
        <h3>{t('set.aliases')}</h3>
        <p className="muted">
          {t('set.aliasesHint')}
        </p>
        <div className="alias-form">
          <input placeholder={t('set.aliasCode')} value={code} onChange={(e) => setCode(e.target.value)} aria-label={t('set.aliasCodeAria')} />
          <input placeholder={t('set.aliasValue')} value={value} onChange={(e) => setValue(e.target.value)} aria-label={t('set.aliasValueAria')} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <button type="button" className="btn btn-primary" onClick={add}>{t('set.add')}</button>
        </div>
        {err && <p className="err">{t(err, { code: code.trim() })}</p>}
        {Object.keys(opts.aliases).length > 0 && (
          <ul className="alias-list">
            {Object.entries(opts.aliases).map(([c, v]) => (
              <li key={c}><code>!{c}</code> <span>→</span> <code className="break">{v}</code>
                <button type="button" className="link" onClick={() => remove(c)}>{t('set.remove')}</button></li>
            ))}
          </ul>
        )}
      </div>

      <details className="field">
        <summary>{t('set.dict', { keys: Object.keys(KEY_CODES).length, values: Object.keys(VALUE_CODES).length })}</summary>
        <div className="dict">
          <div>
            <h4>{t('set.dictParams')}</h4>
            {Object.entries(KEY_CODES).map(([k, c]) => <div key={k}><code>{c}</code> = {k}</div>)}
          </div>
          <div>
            <h4>{t('set.dictValues')}</h4>
            {Object.entries(VALUE_CODES).map(([c, v]) => <div key={c}><code>!{c}</code> = {v}</div>)}
          </div>
        </div>
      </details>

      <InstallCard />
    </section>
  )
}
