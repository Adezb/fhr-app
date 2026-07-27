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

## Next Steps / Backlog
- Staging deployment & live countdown testing across devices.
