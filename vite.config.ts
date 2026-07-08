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
       * Strategy: generateSW
       * Workbox auto-generates the service worker from the Vite build manifest.
       * Handles registration, updates, and lifecycle automatically.
       */
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      /**
       * Web App Manifest
       * Controls how the app appears when installed on the user's device.
       */
      manifest: {
        name: 'Fundamental Rights Enforcement in Nigeria',
        short_name: 'Rights Guide',
        description: 'A practical offline guide to fundamental rights enforcement in Nigeria. Instant courtroom access without internet.',
        theme_color: '#1A2B4C',    // Deep Navy — matches our primary brand token
        background_color: '#1A2B4C', // Splash screen background
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
       * Workbox Configuration
       * Tier 1 caching: App shell (JS, CSS, HTML, fonts, static images).
       * Content data (chapters, authorities) is managed in IndexedDB by our sync engine.
       */
      workbox: {
        // Precache everything Vite bundles (JS, CSS, HTML)
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],

        // Cache Google Fonts at runtime (stale-while-revalidate keeps them fast)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],

        // Prevent Workbox from trying to cache the Supabase API — we handle that via IndexedDB
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/],
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
