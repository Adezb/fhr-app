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



## Recent Architectural Feature: SEO Image, Mobile Header Responsive Layout, and PWA Install Logic
- **Status**: Completed & Production Build Verified

### Components & Utilities Implemented/Updated
1. `public/fhr-full-cover.png`: Compressed cover image from 921 KB (2441x1654) down to **106.37 KB** (1200x813 PNG). Guarantees WhatsApp link preview scrapers unfurl the Open Graph card without hitting WhatsApp's 300KB image payload limit.
2. `src/components/common/SEO.tsx`: Updated `DEFAULT_IMAGE` to absolute `https://fhrnigeria.app/fhr-full-cover.png`. Enforces absolute URL conversion for relative paths and injects `og:image:type` (`image/png`), `og:image:width` (1200), and `og:image:height` (813).
3. `index.html` & `scripts/prerender.js`: Updated static template fallback and pre-rendered static HTML routes (`dist/launch/index.html`, `dist/*/index.html`) to use absolute `https://fhrnigeria.app/fhr-full-cover.png`.
4. `src/hooks/usePWAInstall.ts`: Refactored hook to track `isStandalone` state using `window.matchMedia('(display-mode: standalone)')` and `(navigator as any).standalone`. Returned `isStandalone` in hook return value.
5. `src/components/pwa/InstallGuideModal.tsx`: New responsive modal explaining manual installation steps tailored to user environment (iOS Safari share sheet, WhatsApp/Instagram in-app WebViews, and unsupported Android/desktop browser menus).
6. `src/pages/LaunchPage.tsx`:
   - Updated header container with `gap-3 sm:gap-4`, `min-w-0`, responsive typography (`text-sm sm:text-base md:text-lg`), and `shrink-0 whitespace-nowrap` on "Explore Home &rarr;" link to prevent mobile squeezing and line wraps.
   - Refactored PWA action button logic: Displays "Open App in Browser &rarr;" strictly when in standalone mode (`isStandalone === true`). When in browser/WebView (`isStandalone === false`), explicitly displays "Install App Now", triggering native prompt if available or `InstallGuideModal` when native prompt cannot be triggered.

## Key Technical Decisions
- **Absolute Social Image URLs**: Open Graph specification requires absolute HTTP/HTTPS URLs for scrapers (e.g. WhatsApp, Twitter, Facebook). Relative image paths cause scraping failures on external webviews.
- **Standalone Display Mode Check**: Rather than relying on `beforeinstallprompt` presence to determine installation status, the app explicitly queries `(display-mode: standalone)` media query.
- **Responsive Header Text Truncation**: Used `min-w-0` on flex children and `shrink-0` on action links to ensure right-aligned CTA elements are never pushed off-screen on small viewports (<360px).


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
- Production deployment on Vercel and live physical device QR scan testing (Android Chrome, iOS Safari, WhatsApp in-app browser).



