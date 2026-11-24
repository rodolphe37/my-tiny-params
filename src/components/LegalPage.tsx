import { Fragment, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { legalDocs } from '../i18n/legal'

/** Rend un texte brut en rendant les URLs cliquables (aucun HTML injecté). */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
    if (!/^https?:\/\//.test(part)) return <Fragment key={i}>{part}</Fragment>
    // la ponctuation finale de la phrase ne fait pas partie de l'adresse
    const url = part.replace(/[).,;:]+$/, '')
    return (
      <Fragment key={i}>
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        {part.slice(url.length)}
      </Fragment>
    )
  })
}

export function LegalPage({ kind, onBack }: { kind: 'legal' | 'terms'; onBack: () => void }) {
  const { t, lang } = useI18n()
  const doc = legalDocs[lang][kind]

  return (
    <article className="prose legal">
      <a
        href="/"
        className="link"
        onClick={(e) => {
          e.preventDefault()
          onBack()
        }}
      >
        {t('legal.back')}
      </a>
      <h1>{doc.title}</h1>
      <p className="muted">{t('legal.updated', { date: doc.updated })}</p>
      {doc.sections.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          {s.body.map((p, i) => (
            <p key={i}>{linkify(p)}</p>
          ))}
        </section>
      ))}
    </article>
  )
}
