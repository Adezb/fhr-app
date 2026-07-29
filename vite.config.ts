import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      /**
       * Strategy: injectManifest
       * Custom service worker (src/sw.ts) combining Workbox precaching with OneSignal push notification worker.
       */
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: 'auto',

      /**
       * Web App Manifest
       * Controls how the app appears when installed on the user's device.
       */
      manifest: {
        name: 'FHR Practice Guide',
        short_name: 'FHR Practice Guide',
        description: 'A practical offline guide to fundamental rights enforcement in Nigeria. On-the-go access to Fundamental Rights Practice Guide—no internet connection required.',
        theme_color: '#0f172a',    // Dark navy hex code for PWA Splash Screen
        background_color: '#0f172a', // Splash screen background
        display: 'standalone',      // Hides browser chrome when installed
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            // Book cover as the PWA icon — client will supply the actual file
            src: '/fhr-cover-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/fhr-cover-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      /**
       * Workbox injectManifest Configuration
       * Precache manifest injection parameters for src/sw.ts
       */
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2,png,jpg,jpeg,webp}'],
        globIgnores: ['**/sitemap.xml', '**/robots.txt'],
        maximumFileSizeToCacheInBytes: 3000000,
      },

      /**
       * Dev options: enable SW in dev so we can test PWA behaviour locally
       */
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
