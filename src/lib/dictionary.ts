/**
 * Dictionnaires intégrés (format v1).
 *
 * ⚠️ Ces tables sont GELÉES : des liens diffusés en dépendent. On peut en
 * ajouter, jamais en modifier ni en retirer.
 */

/** nom de paramètre -> code court */
export const KEY_CODES: Readonly<Record<string, string>> = {
  utm_source: 's',
  utm_medium: 'm',
  utm_campaign: 'c',
  utm_term: 't',
  utm_content: 'o',
  utm_id: 'i',
  utm_source_platform: 'sp',
  utm_creative_format: 'cf',
  utm_marketing_tactic: 'mt',
  gclid: 'g',
  gbraid: 'gb',
  wbraid: 'wb',
  gad_source: 'gs',
  gad_campaignid: 'gc',
  dclid: 'd',
  fbclid: 'f',
  msclkid: 'ms',
  ttclid: 'tt',
  twclid: 'tw',
  li_fat_id: 'li',
  yclid: 'y',
  mc_cid: 'mc',
  mc_eid: 'me',
  _ga: 'ga',
  _gl: 'gl',
  ref: 'r',
}

/** code court -> valeur fréquente (sources, médiums, plateformes…) */
export const VALUE_CODES: Readonly<Record<string, string>> = {
  nl: 'newsletter',
  em: 'email',
  so: 'social',
  ps: 'paid_social',
  org: 'organic',
  ref: 'referral',
  aff: 'affiliate',
  dsp: 'display',
  fb: 'facebook',
  ig: 'instagram',
  li: 'linkedin',
  tw: 'twitter',
  yt: 'youtube',
  tt: 'tiktok',
  gg: 'google',
  bg: 'bing',
  pin: 'pinterest',
  rdt: 'reddit',
  snap: 'snapchat',
  wa: 'whatsapp',
  tg: 'telegram',
  sms: 'sms_campaign',
  push: 'push_notification',
  rtg: 'retargeting',
  rmk: 'remarketing',
  brd: 'brand',
  nbr: 'non_brand',
  prt: 'partner',
  blg: 'blog',
  wbn: 'webinar',
  vid: 'video',
  bnr: 'banner',
  cta: 'call_to_action',
  prm: 'promotion',
  lnch: 'launch',
}

/** Paramètres de suivi reconnus en portée « tracking ». */
export function isTrackingKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(KEY_CODES, key) || key.startsWith('utm_')
}

export const DEFAULT_PARAM = 'tp'
