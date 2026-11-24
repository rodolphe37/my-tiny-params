import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  plugins: [
    react(),
    // version.json : permet de vérifier la version réellement en ligne après un déploiement.
    {
      name: 'version-json',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: `${JSON.stringify({ version: pkg.version })}\n` })
      },
    },
    VitePWA({
      // « prompt » : la nouvelle version s'installe quand la personne le décide (bandeau), sans perdre sa saisie.
      registerType: 'prompt',
      includeAssets: ['favicon.png', 'icons/apple-touch-icon.png', 'brand/logo-240.png'],
      manifest: {
        name: 'MyTinyParams',
        short_name: 'TinyParams',
        description: 'Raccourcissez les paramètres de vos URLs sans casser vos campagnes de suivi. / Shorten your URL parameters without breaking your tracking campaigns.',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        // Bleu nuit du logo : barre du système et écran de lancement de l'app installée.
        background_color: '#0a136e',
        theme_color: '#0a136e',
        categories: ['productivity', 'utilities'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  test: { environment: 'node' },
})
