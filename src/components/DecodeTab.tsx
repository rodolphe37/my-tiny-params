import { useMemo, useState } from 'react'
import { decodeUrl, type CodecOptions } from '../lib/codec'
import { useI18n } from '../i18n'
import { CopyButton } from './CopyButton'
import { UrlView } from './UrlView'

export function DecodeTab({ opts }: { opts: CodecOptions }) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const results = useMemo(
    () => text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => decodeUrl(l, opts)),
    [text, opts],
  )
  return (
    <section>
      <div className="input-box">
        <label htmlFor="tiny">{t('decode.label')}</label>
        <textarea
          id="tiny"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('decode.placeholder')}
          rows={3}
          spellCheck={false}
        />
      </div>
      <div className="cards">
        {results.map((r, i) => (
          <article className="card" key={i}>
            <div className="card-head">
              <UrlView url={r.output} />
              <CopyButton text={r.output} />
            </div>
            <p className="muted">
              {r.changed ? t('decode.restored') : t('decode.notFound', { param: opts.param })}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
