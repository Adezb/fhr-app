# Session Memory

## Project Overview
- **App Name**: Fundamental Rights Practice Guide (FHR App)
- **Primary Goal**: Offline-first legal reference application built with React, Vite, Tailwind CSS v4, Supabase, IndexedDB, and Workbox PWA.

## Recent Architectural Feature: GA4 Analytics & OneSignal Web Push Integration
- **Status**: Completed & Production Build Verified across 5 Execution Phases
- **Environment Credentials**:
  - `VITE_GA4_MEASUREMENT_ID`: `G-CKQ4VBPFVZ`
  - `VITE_ONESIGNAL_APP_ID`: `76995195-8875-4b55-96e8-dd1004b687e2`

### Architecture & Implementation Details
1. **Service Worker Harmonization (`src/sw.ts` & `public/OneSignalSDKWorker.js`)**:
   - Refactored `vite.config.ts` from `generateSW` to `injectManifest`.
   - Created custom `src/sw.ts` combining Workbox precaching (`self.__WB_MANIFEST`), SPA navigation fallback, Google Fonts runtime caching, and OneSignal push worker via `importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js')`.
   - Created static `public/OneSignalSDKWorker.js` redirecting root-scope worker checks to `/sw.js`.
2. **GA4 Analytics Pipeline (`src/lib/analytics.ts` & `src/components/analytics/PageTracker.tsx`)**:
   - Created `analytics.ts` wrapper with `initGA()`, `trackPageview()`, and `trackEvent()`.
   - Created `<PageTracker />` mounted inside `<BrowserRouter>` in `App.tsx` to automatically track route pageviews while strictly filtering out all `/admin-cms/*` layout paths.
   - Bootstrapped `initGA()` in `src/main.tsx` prior to mounting the React tree.
3. **OneSignal Push Pipeline (`src/lib/onesignal.ts`)**:
   - Created `onesignal.ts` wrapper initialized in `src/main.tsx` bound to `/sw.js`.
   - Option A: Integrated 8-second delayed slide-in opt-in trigger (`showPushPrompt()`) on `HomePage.tsx` when `!isLocked`.
   - Option B: Integrated 5-second post-countdown unlock trigger (`showPushPrompt()`) on `LaunchPage.tsx` when `!isLocked`.
4. **Engagement Telemetry Instrumentation**:
   - PWA Install Funnel: `pwa_banner_impression`, `pwa_qr_interstitial_impression`, `pwa_launch_page_install_click`, `pwa_install_accepted`, `pwa_install_dismissed`, `pwa_banner_dismissed`, `pwa_install_complete`.
   - Reading & CTAs: `cta_start_reading`, `cta_continue_reading`, `cta_reading_blocked_prelaunch`, `reading_progress_milestone` (25%, 50%, 75%, 100%).
   - Launch & Authorities: `launch_countdown_view`, `launch_enter_app`, `navigate_authorities_hub`, `authority_view`, `authority_content_loaded`.

## Previous Features Retained
- Time-Gated Launch Landing Page & Content Lock (`2026-08-03T15:00:00+01:00`).
- Meta Tags (`react-helmet-async`), Sitemap Generator & Postbuild Static Pre-rendering (`scripts/prerender.js`).
- PWA Native Install Prompt Architecture & Singleton Store.
- QR Code Installation Interstitial Flow (`?source=qr`).

## Next Steps / Backlog
- Live physical device testing for push notification permissions and GA4 Realtime event verification.
