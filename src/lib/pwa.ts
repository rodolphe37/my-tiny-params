import { useCallback, useEffect, useState } from 'react'

/**
 * Installation PWA — même logique que Lumélia Tile (usePwaInstall) :
 *  - Chromium (Android, ordinateur) : bouton natif via `beforeinstallprompt` ;
 *  - Safari sur iPhone / iPad : jamais d'événement, instructions « Partager → Sur l'écran d'accueil » ;
 *  - masqué une fois l'app installée, ou quand on ferme l'invitation (mémorisé sur cet appareil).
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'mtp:pwa-dismissed'

// L'événement est capté dès le chargement du module : Chrome peut le déclencher avant que React soit monté.
let deferredEvent: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredEvent = e as BeforeInstallPromptEvent
  notify()
})
window.addEventListener('appinstalled', () => {
  deferredEvent = null
  notify()
})

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  const ua = navigator.userAgent
  // iPadOS se présente comme un Mac : on la reconnaît à son écran tactile
  return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
}

/** Exclut Chrome / Firefox / Edge iOS : leur menu de partage diffère. */
export function isIosSafari(): boolean {
  const ua = navigator.userAgent
  return isIOS() && /safari/i.test(ua) && !/crios|fxios|edgios|opios/i.test(ua)
}

export function usePwaInstall() {
  const [deferred, setDeferred] = useState(deferredEvent)
  const [installed, setInstalled] = useState(isStandalone)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const sync = () => {
      setDeferred(deferredEvent)
      if (!deferredEvent && isStandalone()) setInstalled(true)
    }
    const onInstalled = () => setInstalled(true)
    listeners.add(sync)
    window.addEventListener('appinstalled', onInstalled)
    sync()
    return () => {
      listeners.delete(sync)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredEvent) return
    const e = deferredEvent
    await e.prompt()
    await e.userChoice
    deferredEvent = null
    notify()
  }, [])

  const dismiss = useCallback(() => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [])

  const iosSafari = isIosSafari()
  return {
    installed,
    /** Bouton natif disponible (ignore la fermeture de l'invitation : sert à la carte des réglages). */
    nativeAvailable: Boolean(deferred) && !installed,
    iosSafari,
    canInstall: Boolean(deferred) && !installed && !dismissed,
    showIosHint: iosSafari && !installed && !dismissed,
    promptInstall,
    dismiss,
  }
}
