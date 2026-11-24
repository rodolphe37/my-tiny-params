import { useI18n } from '../i18n'
import { usePwaInstall } from '../lib/pwa'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function ShareIcon() {
  const { t } = useI18n()
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} className="install__glyph" role="img" aria-label={t('install.share')}>
      <path d="M12 15V3" />
      <path d="m7 8 5-5 5 5" />
      <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  )
}

/** Invitation à installer l'app (carte flottante en bas de l'écran), comme dans Lumélia Tile. */
export function InstallPrompt() {
  const { t } = useI18n()
  const { canInstall, showIosHint, promptInstall, dismiss } = usePwaInstall()
  if (!canInstall && !showIosHint) return null
  return (
    <div className="install" role="region" aria-label={t('install.region')}>
      <div className="install__card">
        <img className="install__icon" src="/icons/icon-192.png" alt="" width={56} height={56} />
        <div className="install__body">
          <p className="install__title">{t('install.title')}</p>
          {showIosHint ? (
            <p className="install__text">
              {t('install.iosA')} <ShareIcon /> {t('install.iosB')}
            </p>
          ) : (
            <p className="install__text">{t('install.text')}</p>
          )}
          {canInstall && (
            <button type="button" className="btn btn-primary install__cta" onClick={() => void promptInstall()}>
              <DownloadIcon />
              {t('install.button')}
            </button>
          )}
        </div>
        <button type="button" className="install__close" onClick={dismiss} aria-label={t('install.close')}>
          ×
        </button>
      </div>
    </div>
  )
}

/** Carte des réglages : installer plus tard, ou rappeler comment faire sur iPhone. */
export function InstallCard() {
  const { t } = useI18n()
  const { installed, nativeAvailable, iosSafari, promptInstall } = usePwaInstall()
  if (installed || (!nativeAvailable && !iosSafari)) return null
  return (
    <div className="field install-card">
      <h3>{t('install.cardTitle')}</h3>
      {nativeAvailable ? (
        <button type="button" className="btn btn-primary" onClick={() => void promptInstall()}>
          {t('install.cardButton')}
        </button>
      ) : (
        <p className="muted">
          {t('install.iosA')} <ShareIcon /> {t('install.iosB')}
        </p>
      )}
    </div>
  )
}
