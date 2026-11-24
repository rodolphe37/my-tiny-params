import { describe, expect, it } from 'vitest'
import { DEFAULT_OPTIONS, decodeUrl, encodeUrl, sameParams, validateAlias, type CodecOptions } from './codec'
import { decoderCore } from './snippet'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'

const EXAMPLE_URLS = [fr['example.1'], fr['example.2'], en['example.1'], en['example.2']]

const all: CodecOptions = { ...DEFAULT_OPTIONS, scope: 'all' }

describe('encodeUrl', () => {
  it('raccourcit les UTM sans toucher au domaine ni au chemin', () => {
    const r = encodeUrl('https://www.exemple.fr/a/b?utm_source=newsletter&utm_medium=email&utm_campaign=soldes_2026')
    expect(r.output).toBe('https://www.exemple.fr/a/b?tp=s:!nl,m:!em,c:soldes_2026')
    expect(r.changed).toBe(true)
    expect(r.savedChars).toBeGreaterThan(30)
    expect(r.roundTrip).toBe(true)
  })

  it('laisse les paramètres métier intacts en portée tracking', () => {
    const r = encodeUrl('https://x.fr/p?page=2&utm_source=google&sort=asc')
    expect(r.output).toBe('https://x.fr/p?page=2&tp=s:!gg&sort=asc')
  })

  it('compresse tout en portée all et préserve le fragment', () => {
    const r = encodeUrl('https://x.fr/p?page=2&utm_source=google#top', all)
    expect(r.output).toBe('https://x.fr/p?tp=!page:2,s:!gg#top')
    expect(decodeUrl(r.output, all).output).toBe('https://x.fr/p?page=2&utm_source=google#top')
  })

  it('échappe les caractères structurels', () => {
    const url = 'https://x.fr/?utm_campaign=a%2Cb%3Ac%21d&utm_term=%21nl&q=a%26b'
    const r = encodeUrl(url, all)
    expect(r.output).not.toContain('=!nl')
    expect(sameParams(decodeUrl(r.output, all).output, url)).toBe(true)
  })

  it('gère les paramètres sans valeur, vides et dupliqués', () => {
    const url = 'https://x.fr/?utm_source&utm_medium=&a=1&a=2'
    const r = encodeUrl(url, all)
    expect(sameParams(decodeUrl(r.output, all).output, url)).toBe(true)
  })

  it('gère une collision avec le nom du paramètre conteneur', () => {
    const url = 'https://x.fr/?tp=foo&utm_source=google'
    const r = encodeUrl(url)
    expect(sameParams(decodeUrl(r.output).output, url)).toBe(true)
  })

  it('ne rend jamais une URL plus longue', () => {
    const url = 'https://x.fr/?a=1'
    expect(encodeUrl(url).output).toBe(url)
    expect(encodeUrl('https://x.fr/').changed).toBe(false)
  })

  it('utilise les alias personnalisés', () => {
    const opts: CodecOptions = { ...DEFAULT_OPTIONS, aliases: { bf26: 'black_friday_2026' } }
    const r = encodeUrl('https://x.fr/?utm_campaign=black_friday_2026', opts)
    expect(r.output).toBe('https://x.fr/?tp=c:!bf26')
    expect(decodeUrl(r.output, opts).output).toBe('https://x.fr/?utm_campaign=black_friday_2026')
  })

  it('refuse les entrées invalides', () => {
    expect(encodeUrl('').error).toBe('err.empty')
    expect(encodeUrl('ftp://x.fr/?a=b').error).toBe('err.protocol')
    expect(encodeUrl('https://').error).toBe('err.invalid')
  })

  it('accepte une URL sans schéma', () => {
    expect(encodeUrl('x.fr/?utm_source=newsletter').output).toBe('https://x.fr/?tp=s:!nl')
  })

  it('aller-retour sur les exemples', () => {
    for (const u of EXAMPLE_URLS) for (const o of [DEFAULT_OPTIONS, all]) {
      const r = encodeUrl(u, o)
      expect(r.roundTrip).toBe(true)
      expect(r.output.length).toBeLessThan(u.length)
    }
  })
})

describe('validateAlias', () => {
  it('valide les alias', () => {
    expect(validateAlias('bf26', 'black_friday_2026')).toBeNull()
    expect(validateAlias('nl', 'autre_chose_longue')).toBe('alias.builtin')
    expect(validateAlias('a b', 'xxxxxxxx')).toBe('alias.format')
    expect(validateAlias('abcd', 'abc')).toBe('alias.longer')
    expect(validateAlias('x', '  ')).toBe('alias.empty')
    expect(validateAlias('bf26', 'black_friday_2026', { bf26: 'x' })).toBe('alias.exists')
  })
})

describe('snippet décodeur', () => {
  const run = (search: string, opts: CodecOptions) =>
    new Function(`${decoderCore(opts)}; return tinyDecode(${JSON.stringify(search)});`)() as string | null

  it('est équivalent à decodeUrl', () => {
    const opts: CodecOptions = { ...DEFAULT_OPTIONS, scope: 'all', aliases: { bf26: 'black_friday_2026' } }
    const urls = [
      ...EXAMPLE_URLS,
      'https://x.fr/?utm_campaign=black_friday_2026&utm_term=a%2Cb%3Ac%21d&z=1&z=2&flag',
      'https://x.fr/?tp=foo&utm_source=google',
      'https://x.fr/?q=é+à%20ç&utm_medium=email',
    ]
    for (const u of urls) {
      const tiny = encodeUrl(u, opts).output
      const query = tiny.includes('?') ? '?' + tiny.split('#')[0].split('?')[1] : ''
      const viaSnippet = run(query, opts)
      const viaLib = decodeUrl(tiny, opts)
      const expected = viaLib.changed ? '?' + viaLib.output.split('#')[0].split('?')[1] : null
      expect(viaSnippet).toBe(expected)
    }
  })

  it('ne touche pas une URL sans conteneur', () => {
    expect(run('?a=1', DEFAULT_OPTIONS)).toBeNull()
    expect(run('', DEFAULT_OPTIONS)).toBeNull()
  })
})

describe('i18n', () => {
  it('fr et en ont exactement les mêmes clés, sans valeur vide', async () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort())
    for (const k of Object.keys(fr) as (keyof typeof fr)[]) {
      expect(en[k].length, k).toBeGreaterThan(0)
      // mêmes variables {x} dans les deux langues
      const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join()
      expect(vars(en[k]), k).toBe(vars(fr[k]))
    }
  })

  it('traduit avec variables', async () => {
    const { translate } = await import('../i18n')
    expect(translate('fr', 'fmt.pct', { n: 31 })).toBe('31 %')
    expect(translate('en', 'fmt.pct', { n: 31 })).toBe('31%')
    expect(translate('en', 'decode.notFound', { param: 'tp' })).toContain('“tp”')
  })
})

describe('pages juridiques', () => {
  it('fr et en ont la même structure', async () => {
    const { legalDocs } = await import('../i18n/legal')
    for (const kind of ['legal', 'terms'] as const) {
      expect(legalDocs.en[kind].sections.map((s) => s.body.length)).toEqual(legalDocs.fr[kind].sections.map((s) => s.body.length))
    }
  })

  it('cite l’éditeur, l’hébergeur et le copyright', async () => {
    const { legalDocs, copyright } = await import('../i18n/legal')
    for (const lang of ['fr', 'en'] as const) {
      const text = JSON.stringify(legalDocs[lang])
      expect(text).toContain('Rodolphe Augusto')
      expect(text).toContain('Netlify')
    }
    expect(copyright(2026)).toBe('© 2026 Rodolphe Augusto')
    expect(copyright(2028)).toBe('© 2026–2028 Rodolphe Augusto')
  })
})

describe('routage', () => {
  it('reconnaît les pages et retombe sur l’accueil', async () => {
    const { routeFromPath } = await import('./route')
    expect(routeFromPath('/legal')).toBe('legal')
    expect(routeFromPath('/terms/')).toBe('terms')
    expect(routeFromPath('/')).toBe('home')
    expect(routeFromPath('/nimporte-quoi')).toBe('home')
  })
})
