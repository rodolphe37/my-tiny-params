import { DEFAULT_PARAM, KEY_CODES, VALUE_CODES, isTrackingKey } from './dictionary'

/**
 * Format v1 — les paramètres sont regroupés dans UN seul paramètre (`tp` par défaut) :
 *
 *   ?tp=s:!nl,m:!em,c:soldes_2026
 *
 *  - paires séparées par `,`, clé et valeur séparées par `:`
 *  - clé : code du dictionnaire (`s` = utm_source) ou `!` + clé littérale échappée
 *  - valeur : `!code` (dictionnaire) ou littéral échappé
 *  - échappement = encodeURIComponent + `!` -> %21 (seuls , : ! sont structurels,
 *    et ce sont des caractères réservés : aucun proxy ne les normalise)
 *
 * Tout est sans état : aucune base de données, le décodage est purement algorithmique.
 */

export type Scope = 'tracking' | 'all'

export interface CodecOptions {
  /** nom du paramètre conteneur */
  param: string
  /** `tracking` : seuls utm_* et identifiants de clic ; `all` : tous les paramètres */
  scope: Scope
  /** alias personnalisés : code -> valeur */
  aliases: Readonly<Record<string, string>>
}

export const DEFAULT_OPTIONS: CodecOptions = { param: DEFAULT_PARAM, scope: 'tracking', aliases: {} }

export interface Pair {
  key: string
  /** null = paramètre sans `=` */
  value: string | null
  raw: string
}

export interface ParamDetail {
  key: string
  value: string | null
  packed: boolean
  keyToken?: string
  valueToken?: string
  tracking: boolean
}

/** Clés de traduction des erreurs (voir src/i18n). */
export type ErrorKey = 'err.empty' | 'err.invalid' | 'err.protocol'

export interface EncodeResult {
  ok: boolean
  input: string
  output: string
  changed: boolean
  error?: ErrorKey
  params: ParamDetail[]
  savedChars: number
  /** réduction de la longueur totale, 0..1 */
  ratio: number
  /** réduction de la partie paramètres uniquement, 0..1 */
  queryRatio: number
  roundTrip: boolean
}

export interface DecodeResult {
  ok: boolean
  input: string
  output: string
  changed: boolean
  error?: ErrorKey
}

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k)

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '))
  } catch {
    return s
  }
}

export function escapeLit(s: string): string {
  return encodeURIComponent(s).replace(/!/g, '%21')
}

export function splitUrl(url: string): { base: string; query: string; hash: string } {
  const h = url.indexOf('#')
  const hash = h >= 0 ? url.slice(h) : ''
  const rest = h >= 0 ? url.slice(0, h) : url
  const q = rest.indexOf('?')
  return q >= 0
    ? { base: rest.slice(0, q), query: rest.slice(q + 1), hash }
    : { base: rest, query: '', hash }
}

export function parseQuery(query: string): Pair[] {
  return query
    .split('&')
    .filter(Boolean)
    .map((raw) => {
      const i = raw.indexOf('=')
      return i < 0
        ? { key: safeDecode(raw), value: null, raw }
        : { key: safeDecode(raw.slice(0, i)), value: safeDecode(raw.slice(i + 1)), raw }
    })
}

export type AliasErrorKey = 'alias.format' | 'alias.builtin' | 'alias.exists' | 'alias.empty' | 'alias.longer'

/** Retourne la clé de l'erreur (à traduire avec `{ code }`), ou null si l'alias est valide. */
export function validateAlias(
  code: string,
  value: string,
  aliases: Readonly<Record<string, string>> = {},
): AliasErrorKey | null {
  if (!/^[A-Za-z0-9_-]{1,12}$/.test(code)) return 'alias.format'
  if (has(VALUE_CODES, code)) return 'alias.builtin'
  if (has(aliases, code)) return 'alias.exists'
  if (!value.trim()) return 'alias.empty'
  if (value.length <= code.length + 1) return 'alias.longer'
  return null
}

function valueCodes(opts: CodecOptions): Record<string, string> {
  return { ...opts.aliases, ...VALUE_CODES }
}

function reverseMap(m: Record<string, string>): Map<string, string> {
  const r = new Map<string, string>()
  for (const [code, value] of Object.entries(m)) if (!r.has(value)) r.set(value, code)
  return r
}

function shouldPack(p: Pair, opts: CodecOptions): boolean {
  if (p.key === opts.param) return true // évite toute ambiguïté avec notre conteneur
  return opts.scope === 'all' ? true : isTrackingKey(p.key)
}

export function encodeUrl(input: string, opts: CodecOptions = DEFAULT_OPTIONS): EncodeResult {
  const url = input.trim()
  const fail = (error: ErrorKey): EncodeResult => ({
    ok: false, input, output: url, changed: false, error, params: [], savedChars: 0, ratio: 0, queryRatio: 0, roundTrip: false,
  })

  if (!url) return fail('err.empty')
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`
  try {
    const u = new URL(candidate)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return fail('err.protocol')
  } catch {
    return fail('err.invalid')
  }

  const { base, query, hash } = splitUrl(candidate)
  const pairs = parseQuery(query)
  const reverse = reverseMap(valueCodes(opts))

  const details: ParamDetail[] = []
  const out: string[] = []
  const payload: string[] = []
  let slot = -1

  for (const p of pairs) {
    if (!shouldPack(p, opts)) {
      out.push(p.raw)
      details.push({ key: p.key, value: p.value, packed: false, tracking: isTrackingKey(p.key) })
      continue
    }
    const keyToken = has(KEY_CODES, p.key) ? KEY_CODES[p.key] : `!${escapeLit(p.key)}`
    let valueToken: string | undefined
    if (p.value !== null) {
      const literal = escapeLit(p.value)
      const code = reverse.get(p.value)
      valueToken = code !== undefined && code.length + 1 < literal.length ? `!${code}` : literal
    }
    payload.push(valueToken === undefined ? keyToken : `${keyToken}:${valueToken}`)
    if (slot < 0) {
      slot = out.length
      out.push('')
    }
    details.push({ key: p.key, value: p.value, packed: true, keyToken, valueToken, tracking: isTrackingKey(p.key) })
  }

  let output = candidate
  if (slot >= 0) {
    out[slot] = `${encodeURIComponent(opts.param)}=${payload.join(',')}`
    const candidateOut = `${base}?${out.join('&')}${hash}`
    // on ne retourne la version courte que si elle est réellement plus courte
    if (candidateOut.length < candidate.length) output = candidateOut
  }

  const changed = output !== candidate
  const origQ = query.length
  const newQ = changed ? output.length - base.length - hash.length - 1 : origQ
  const result: EncodeResult = {
    ok: true,
    input,
    output,
    changed,
    params: details.map((d) => (changed ? d : { ...d, packed: false, keyToken: undefined, valueToken: undefined })),
    savedChars: candidate.length - output.length,
    ratio: candidate.length ? (candidate.length - output.length) / candidate.length : 0,
    queryRatio: origQ ? (origQ - newQ) / origQ : 0,
    roundTrip: true,
  }
  result.roundTrip = sameParams(decodeUrl(output, opts).output, candidate)
  return result
}

export function decodeUrl(input: string, opts: CodecOptions = DEFAULT_OPTIONS): DecodeResult {
  const url = input.trim()
  if (!url) return { ok: false, input, output: url, changed: false, error: 'err.empty' }
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`
  const { base, query, hash } = splitUrl(candidate)
  const codes = valueCodes(opts)

  const val = (t: string) => (t.charAt(0) === '!' && has(codes, t.slice(1)) ? codes[t.slice(1)] : safeDecode(t))
  const keyOf = (t: string) => (t.charAt(0) === '!' ? safeDecode(t.slice(1)) : has(codeToKey, t) ? codeToKey[t] : safeDecode(t))

  const segments = query.split('&').filter(Boolean)
  const out: string[] = []
  let done = false
  for (const seg of segments) {
    const i = seg.indexOf('=')
    const k = i < 0 ? seg : seg.slice(0, i)
    if (!done && i >= 0 && safeDecode(k) === opts.param) {
      done = true
      for (const item of seg.slice(i + 1).split(',')) {
        if (!item) continue
        const c = item.indexOf(':')
        const key = encodeURIComponent(keyOf(c < 0 ? item : item.slice(0, c)))
        out.push(c < 0 ? key : `${key}=${encodeURIComponent(val(item.slice(c + 1)))}`)
      }
    } else out.push(seg)
  }
  if (!done) return { ok: true, input, output: candidate, changed: false }
  return { ok: true, input, output: `${base}${out.length ? `?${out.join('&')}` : ''}${hash}`, changed: true }
}

const codeToKey: Record<string, string> = Object.fromEntries(Object.entries(KEY_CODES).map(([k, c]) => [c, k]))

/** Compare deux URLs au niveau sémantique (même base, même hash, mêmes paramètres dans le même ordre). */
export function sameParams(a: string, b: string): boolean {
  const x = splitUrl(a)
  const y = splitUrl(b)
  if (x.base !== y.base || x.hash !== y.hash) return false
  const px = parseQuery(x.query)
  const py = parseQuery(y.query)
  return px.length === py.length && px.every((p, i) => p.key === py[i].key && p.value === py[i].value)
}

export function codecTables(opts: CodecOptions) {
  return { keys: codeToKey, values: valueCodes(opts) }
}
