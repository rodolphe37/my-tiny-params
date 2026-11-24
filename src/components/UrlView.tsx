import { splitUrl } from '../lib/codec'

/** Affiche une URL avec domaine/chemin estompés et paramètres mis en valeur. */
export function UrlView({ url, param }: { url: string; param?: string }) {
  const { base, query, hash } = splitUrl(url)
  const segs = query ? query.split('&') : []
  return (
    <code className="urlview">
      <span className="u-base">{base}</span>
      {segs.length > 0 && <span className="u-sep">?</span>}
      {segs.map((s, i) => {
        const key = s.split('=')[0]
        return (
          <span key={i}>
            {i > 0 && <span className="u-sep">&amp;</span>}
            <span className={param && key === param ? 'u-tiny' : 'u-param'}>{s}</span>
          </span>
        )
      })}
      {hash && <span className="u-hash">{hash}</span>}
    </code>
  )
}
