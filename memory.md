# Session Memory

## Project Overview
- **App Name**: Fundamental Rights Practice Guide (FHR App)
- **Primary Goal**: Offline-first legal reference application built with React, Vite, Tailwind CSS v4, Supabase, IndexedDB, and Workbox PWA.

## Recent Architectural Feature
- **Feature**: Time-Gated Launch Landing Page & Content Lock
- **Launch Timestamp**: `2026-08-03T15:00:00+01:00` (Monday, August 3rd, 2026 at 3:00 PM WAT)
- **Status**: Implemented & Production Built

### Components & Utilities Added/Updated
1. `src/hooks/useLaunchGate.ts`: Core launch time-gate hook refactored into a single, centralized `LaunchGateProvider` context with dual-context architecture (`IsLockedContext` and `LaunchGateContext`). Provides a lightweight `useIsLocked()` hook for `AppShell` and page layout consumers so they only subscribe to boolean `isLocked` state changes and never re-render on the 1-second countdown ticks. Only `LaunchPage` subscribes to live countdown ticks via `useLaunchGate()`. Validates `VITE_LAUNCH_DATE` presence and parsing with fail-safe error logging.
2. `src/components/launch/AccessRestrictedModal.tsx`: Consistent padlock modal displaying NBA Ikorodu Branch launch date copy with gold "Go to Launch Page" primary CTA.
3. `src/pages/LaunchPage.tsx`: Standalone promotional page at `/launch` containing book cover preview, live countdown timer, PWA install prompt, QR code (encoding `https://fhrnigeria.app` via `react-qr-code`), and post-launch "We're Live!" state.
4. `src/App.tsx`: Added `/launch` route as a standalone sibling outside `<AppShell />`.
5. `src/pages/HomePage.tsx`: Intercepted Continue Reading card & Recent Authorities cards to open `AccessRestrictedModal` when `isLocked === true`, supporting mouse clicks and keyboard activation (`Enter` / `Space`).
6. `src/pages/TableOfContentsPage.tsx`: Intercepted chapter items to open `AccessRestrictedModal` when `isLocked === true`, supporting mouse clicks and keyboard activation (`Enter` / `Space`).
7. `src/pages/AuthoritiesHubPage.tsx`: Intercepted authority cards to open `AccessRestrictedModal` when `isLocked === true`, supporting mouse clicks and keyboard activation (`Enter` / `Space`).
8. `src/components/layout/AppShell.tsx`: Intercepted search trigger in `TopNavbar` when `isLocked === true` to open `AccessRestrictedModal` instead of `SearchOverlay`.
9. `src/pages/ChapterPage.tsx` & `src/pages/AuthorityPage.tsx`: Route guards with top-level unconditional React hooks execution, skipping content fetches when locked, and rendering `<Navigate to="/launch" replace />` after hook execution.

## Key Technical Decisions
- **Search Interception**: Completely disables search overlay during lock state; clicking the search icon triggers `AccessRestrictedModal`.
- **Post-Launch Page Behavior**: The `/launch` route remains accessible post-launch, displaying a "🎉 We're Officially Live!" hero card with an "Enter App →" button routing to `/`.
- **No Admin Bypass on Public Routes**: Public content locking is absolute. Admins review and edit content via `/admin-cms`.

## Recent Architectural Feature: Meta Tags, Pre-rendering & Launch UI Polish
- **Status**: Completed & Production Build Verified

### Components & Build Scripts Implemented
1. `src/components/common/SEO.tsx`: Reusable SEO meta tags component powered by `react-helmet-async`. Injects dynamic `<title>`, `<meta name="description">`, `og:*` (type, title, description, image, url), `twitter:*`, and canonical URL links per route.
2. `src/main.tsx`: Wrapped `<App />` with `<HelmetProvider>` for thread-safe React 19 meta management.
3. `src/pages/LaunchPage.tsx`: Integrated `<SEO />` with launch cover image (`/fhr-full-cover.png`) and route metadata. Polished UI wrapper classes to use soft off-white `bg-slate-50` for light mode (alleviating night viewing eye strain) and `dark:bg-slate-950` with high-contrast text and cards for dark mode.
4. `src/pages/ChapterPage.tsx` & `src/pages/AuthorityPage.tsx`: Injected `<SEO />` dynamically populated with full title, route URL, and clean 155-character plaintext excerpts stripped from HTML content.
5. `src/pages/HomePage.tsx`, `src/pages/TableOfContentsPage.tsx`, `src/pages/AuthoritiesHubPage.tsx`: Injected route-specific `<SEO />` fallbacks.
6. `scripts/prerender.js`: Node postbuild script executed during `npm run postbuild` alongside `generate-sitemap.js`. Reads `dist/index.html`, queries Supabase for published chapters and authorities, and generates 20 static route HTML files (`dist/launch/index.html`, `dist/book/*/index.html`, `dist/authorities/*/index.html`) with pre-populated `<head>` meta tags so social media scraping bots (WhatsApp, Twitter, Telegram, iMessage) receive rich link preview cards without executing JavaScript. Validates CMS-provided slugs (`isValidSlug`) and target resolution paths against `DIST_DIR` to prevent path traversal vulnerabilities. Tracks dynamic fetch errors with a `hadErrors` flag, setting `process.exitCode = 1` while allowing static HTML generation to complete.



## Recent Architectural Feature: PWA Native Install Prompt Architecture & Singleton Store Fix
- **Status**: Completed & Production Build Verified

### Components & Hooks Implemented/Updated
1. `src/hooks/usePWAInstall.ts`:
   - Established module-level singleton `globalDeferredPrompt` store listening to `window.addEventListener('beforeinstallprompt', ...)`. Captures `BeforeInstallPromptEvent` instantly upon script load, immune to React lifecycle unmounts or hydration timing delays.
   - Decoupled `localStorage` cooldown (`pwa-install-cooldown`) from event capture. Event handle `globalDeferredPrompt` is now ALWAYS preserved in memory when fired by Chromium. Cooldown ONLY affects `showPrompt` for automatic popup banners.
   - Added `canInstallNative` boolean state (`globalDeferredPrompt !== null`) to hook return value.
2. `src/pages/LaunchPage.tsx`:
   - Refactored `handleInstallClick` to check `if (canInstallNative)`. When `canInstallNative` is true, calling `handleInstall()` immediately triggers Chromium's native OS install sheet (`globalDeferredPrompt.prompt()`).
   - If `canInstallNative` is false (iOS Safari, in-app WebViews like WhatsApp/Instagram), `handleInstallClick` opens the manual fallback modal (`InstallGuideModal`).

## Key Technical Decisions
- **Module-Level Event Caching**: PWA `beforeinstallprompt` event is fired only once per page load by Chromium. Capturing it in a module-level variable guarantees event handle preservation across component mounts, page navigation, and re-renders.
- **Decoupled User Intent**: Auto-popup banner suppression (cooldowns) must never destroy explicit user action capabilities. Separating auto-banner state (`showPrompt`) from native prompt availability (`canInstallNative`) ensures user-initiated button clicks always invoke native prompt APIs when supported.


## Recent Architectural Feature: QR Code Installation Interstitial Flow
- **Status**: Implemented & Production Build Verified
- **Issue Solved**: Mobilized QR code scanners were not receiving a proactive install prompt due to missing URL signal, route un-mounting, 72-hour cooldown lockouts, and lack of iOS auto-display mechanisms.

### Components & Utilities Implemented/Updated
1. `src/pages/LaunchPage.tsx`: Updated `QRCode` value to point explicitly to `https://fhrnigeria.app/launch?source=qr`.
2. `src/hooks/usePWAInstall.ts`:
   - Detects `?source=qr` in `window.location.search`.
   - Seamlessly strips `source` from address bar using `window.history.replaceState` without triggering page reload.
   - Bypasses the 72-hour `localStorage` cooldown entirely when `source=qr` is present (0 min event cooldown).
   - Dismissing the QR interstitial does NOT set a 72-hour cooldown in `localStorage`.
   - Exports `isQRSource` and `showQRInterstitial` flags.
3. `src/components/pwa/QRInstallInterstitial.tsx`:
   - New root-level interstitial modal auto-displayed when `?source=qr` is detected.
   - Tailored per user environment:
     - **Android**: Displays "Install App Now" CTA button triggering native `deferredPrompt.prompt()`.
     - **iOS**: Displays Safari Share → Add to Home Screen visual step-by-step instructions immediately.
     - **In-App Browser**: Displays "Open in Browser" (Chrome/Safari) step-by-step instructions.
   - Returns `null` if user is already running app in `isStandalone` display mode.
   - Features "Continue reading in browser" secondary dismiss option.
4. `src/App.tsx`: Mounted `<QRInstallInterstitial />` at root level inside `<BrowserRouter>` (before `<Routes>`), ensuring auto-prompt works across any landing route (`/launch`, `/`, etc.).

## Key Technical Decisions
- **URL Parameter Signal (`?source=qr`)**: Differentiates event QR scan traffic from organic site visits without altering clean path routing.
- **Address Bar Cleanup (`replaceState`)**: Immediately strips query parameters after hook initialization so copied/shared links remain clean.
- **Zero-Cooldown Event Re-Scans**: Dismissing a QR scan does not lock out subsequent QR scans; re-scanning the QR code always re-triggers the interstitial.
- **Root-Level Interstitial Mounting**: Mounted outside the route tree so it displays regardless of whether the target route is inside or outside `AppShell`.

## Next Steps / Backlog
<<<<<<< HEAD
- Production deployment on Vercel and live physical device QR scan testing (Android Chrome, iOS Safari, WhatsApp in-app browser).

=======
- Production deployment on Vercel and final live link sharing & PWA install tests on Android Chrome, iOS Safari, and WhatsApp WebViews.
>>>>>>> 5196a03789154958969f97e0cd6ce84df4ae0897


