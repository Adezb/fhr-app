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



## Key Technical Decisions
- **Static HTML Pre-rendering**: Combined client-side dynamic tag management (`react-helmet-async`) with a build-time HTML generator script (`scripts/prerender.js`) in `postbuild`. This ensures social crawlers that ignore client-side JS receive pre-rendered HTML `<head>` tags directly from static hosting (Vercel).
- **Soft Light/Dark Color Scheme**: `LaunchPage.tsx` background updated from pure `#FFFFFF` (`bg-surface`) to `#F8FAFC` (`bg-slate-50`) in light mode and `#020617` (`dark:bg-slate-950`) in dark mode with white/slate-900 cards, avoiding harsh glare for late night reading.

## Next Steps / Backlog
- Staging deployment & live link preview verification on WhatsApp and Twitter.


