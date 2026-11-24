import { useCallback, useEffect, useState } from 'react'

/** Routage minimal (pas de bibliothèque) : l'accueil, et deux pages juridiques. Netlify sert index.html pour toutes les routes. */
export type Route = 'home' | 'legal' | 'terms'

const PATHS: Record<Route, string> = { home: '/', legal: '/legal', terms: '/terms' }

export function routeFromPath(path: string): Route {
  const clean = path.replace(/\/+$/, '') || '/'
  return (Object.keys(PATHS) as Route[]).find((r) => PATHS[r] === clean) ?? 'home'
}

export const pathOf = (route: Route) => PATHS[route]

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => routeFromPath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = useCallback((next: Route) => {
    if (window.location.pathname !== PATHS[next]) window.history.pushState({}, '', PATHS[next])
    setRoute(next)
    window.scrollTo(0, 0)
  }, [])

  return [route, go] as const
}
