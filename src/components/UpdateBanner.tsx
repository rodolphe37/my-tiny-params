import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useI18n } from '../i18n'

/** Nouvelle version prête (rechargement à la demande, pour ne pas perdre un texte en cours de saisie) ou app prête hors ligne. */
export function UpdateBanner() {
  const { t } = useI18n()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()
  const close = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }
  // « Prête hors ligne » n'est qu'une information : elle s'efface seule (la mise à jour, elle, attend un clic)
  useEffect(() => {
    if (!offlineReady || needRefresh) return
    const id = setTimeout(() => setOfflineReady(false), 6000)
    return () => clearTimeout(id)
  }, [offlineReady, needRefresh, setOfflineReady])
  if (!needRefresh && !offlineReady) return null
  return (
    <div className="toast" role="status">
      <span>{needRefresh ? t('update.text') : t('update.offline')}</span>
      {needRefresh && (
        <button type="button" className="btn btn-primary" onClick={() => void updateServiceWorker(true)}>
          {t('update.reload')}
        </button>
      )}
      <button type="button" className="btn btn-ghost" onClick={close} aria-label={t('update.close')}>
        ×
      </button>
    </div>
  )
}
