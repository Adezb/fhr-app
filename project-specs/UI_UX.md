# UI/UX DESIGN SPECIFICATIONS

**Project:** Fundamental Rights Enforcement App & CMS


## 1. Global Design System (Tokens)

### 1.1 Color Palette
The app relies on a professional, judicial color scheme. All Tailwind classes should be configured in `tailwind.config.js` using these exact variables:

*   **Primary (Deep Navy):** `#1A2B4C` (Use for top navbars, primary buttons, active states, Splash background).
*   **Secondary/Backgrounds:**
    *   Light Mode Background: Pure White `#FFFFFF` and Off-White `#F8FAFC` (Tailwind `slate-50`).
    *   Dark Mode Background (Midnight Slate): `#0F172A` (Tailwind `slate-900`).
*   **Typography Colors:**
    *   Light Mode Text: Deep Navy `#1A2B4C` (Headings), Dark Slate `#334155` (Body).
    *   Dark Mode Text: Off-White `#F1F5F9` (Headings), Light Slate `#CBD5E1` (Body).
    *   Muted/Inactive Text: Cool Grey `#94A3B8` (Tailwind `slate-400`).
*   **Accents:**
    *   Bookmark/Progress/Highlight (Judicial Gold): `#D4AF37`.
    *   Notifications/New Authority (Action Red): `#DC2626` (Tailwind `red-600`).

### 1.2 Typography
### 1.2 Typography (Global Theming)
The application implements a global font-switching system. The user's selected font applies globally across the entire application (both UI and Reader Interface) via a standard Tailwind utility class (`font-sans`, `font-serif`, etc.) applied to the `<html>` root.

Four distinct font families are supported:
1.  **Sans-Serif (Default):** `Inter` or `Roboto`. Modern, clean, optimal for dense UI.
2.  **Serif:** `Merriweather` or `Lora`. Traditional, formal, optimal for long-form legal reading.
3.  **Monospace:** `JetBrains Mono` or system mono. Provides strict vertical alignment.
4.  **Accessible (Legible):** `Atkinson Hyperlegible`. Specifically designed to differentiate similarly shaped characters (like 'l' and '1') for visually impaired users.

*Implementation Note:* The `@tailwindcss/typography` (`prose` class) natively inherits the font family from this global root constraint. No hardcoded font classes (like `font-sans`) should be placed on structural wrappers (e.g., `AppShell`) as this will break the global inheritance cascade.

## 2. Global UI/UX Rules

### 2.1 Theming (Light/Dark Mode)
*   **Strategy:** Use Tailwind's `class` strategy for dark mode. 
*   **Trigger:** Sync with OS system preferences by default, but provide a manual override toggle (Sun/Moon icon) in the Reader and Settings UI.
*   **Transitions:** Apply `transition-colors duration-300 ease-in-out` to body and main containers to ensure smooth theme switching without flashing.

### 2.2 Responsiveness
*   **Mobile-First Strategy:** Default layouts must target mobile viewports.
*   **Tablet/Desktop Scaling:** 
    *   On Tablet (`md:`), expand cards to grids (e.g., Authorities list breaks into 2 columns).
    *   On Desktop (`lg:`), cap the maximum width of the Reader Interface to `max-w-3xl` and center it (`mx-auto`). Reading lines should never stretch across a full 1080p monitor.

## 3. Component-Specific Specifications

### 3.1 Custom PWA Install Modal
*   **Trigger:** Suppress the native `beforeinstallprompt`. Display this modal 3 seconds after the user first lands on the Home Dashboard.
*   **Layout:** Fixed, centered overlay (`fixed inset-0 flex items-center justify-center bg-black/60 z-50`).
*   **Container:** `bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center`.
*   **Contents:** 
    *   Book Cover Thumbnail (centered).
    *   Header: "Read Offline Anytime" (`text-lg font-bold`).
    *   Body: "Install the Fundamental Rights Practice Guide to your device for instant courtroom access without internet."
    *   Primary Button: "Install App" (Deep Navy bg, White text, full width).
    *   Dismiss: "Not Now" (Ghost button, muted text).

### 3.2 Smart Auto-Hide Navigation (TopNavbar)
*   **Positioning:** `fixed top-0 w-full z-50` — the TopNavbar always overlays the viewport and never scrolls with content.
*   **Content Offset:** `AppShell`'s `<main>` element carries `pt-16` to prevent the fixed navbar from covering page content.
*   **Hook:** `useAutoHideNav()` (`src/hooks/useAutoHideNav.ts`) tracks scroll direction via `useRef` to avoid stale closures.
*   **Scroll Behaviour:**
    *   *Scroll Down (past 50px):* Navbar slides out of view (`-translate-y-full`).
    *   *Scroll Up (even slightly):* Navbar slides back into view (`translate-y-0`).
    *   *At page top (scrollY < 50):* Navbar is always visible.
*   **Transition:** `transform transition-transform duration-300 ease-in-out` for smooth slide animation.
*   **Applies To:** Both the TopNavbar (global) and ReaderBottomNav (chapter reader). The ReaderBottomNav uses the same hook and mirrors the pattern with `translate-y-full` (slide down) / `translate-y-0` (slide up).

### 3.3 Unified Search Overlay
*   **Layout:** Full-screen slide-up modal (`fixed inset-0 z-40`).
*   **Input:** Sticky search bar at the top, auto-focus on open.
*   **Results Rendering:** 
    *   Segregate into two distinct sections with muted headers: "MATCHES IN CORE BOOK" and "MATCHES IN AUTHORITIES".
    *   *Highlighting:* The exact search query string matched within the snippet must be wrapped in a `<mark>` tag styled with Judicial Gold background (`bg-[#FEF08A] dark:bg-[#B45309] text-black dark:text-white`).
*   **Transient Highlight V2 (In-Page Match):**
    *   Clicking a result passes the query string via the URL `?q=` parameter.
    *   The `ReaderView` automatically uses a `TreeWalker` to safely find the exact phrase in the DOM without breaking HTML, wraps it in a `<mark>` tag, and scrolls it into view.
    *   **Architecture Note:** To avoid race conditions, the DOM walk and injection are wrapped in a **double `requestAnimationFrame`** to ensure the browser has fully painted the `dangerouslySetInnerHTML` tree before searching. The 2500ms fade-out timeout is decoupled into a `useRef` to survive React's aggressive cleanup cycles.
    *   The highlight fades out seamlessly over 2500ms using CSS `transition-colors duration-1000` fading from `bg-gold-light text-navy` to `bg-transparent text-inherit`.

### 3.4 Admin CMS Dashboard (Desktop Optimized)
*   **Layout:** Fixed left sidebar navigation (`w-64`), scrollable main content area right.
*   **Editor:** Integrate a Rich Text/Markdown editor (e.g., TipTap).
    *   Toolbar must remain sticky at the top of the editor container while scrolling through long legal text.
    *   Must support headers (H1/H2), Bold, Italic, Underline, Blockquotes (for quoting judgments), and Lists.
*   **Action Button:** The "Publish to App" button must be highly prominent and feature a loading state (spinner + disabled click) while syncing to Supabase.

---

## 4. Responsive Layout Strategy

This section documents the definitive navigation architecture implemented during the Phase 2 UI Refactor. It supersedes any implicit layout assumptions in earlier sections and serves as the single source of truth for all layout-related decisions.

### 4.1 Mobile-First Navigation (< `md` breakpoint)

*   **Primary Routing Mechanism:** A `BottomNav.tsx` component fixed to the bottom of the screen (`fixed bottom-0`). It contains icon+label links for the three core destinations: **Home**, **Book**, and **Authorities**.
*   **Visibility:** `md:hidden` — the `BottomNav` is exclusively a mobile UI element and is fully hidden on tablet and desktop viewports.
*   **Active State:** The active route link uses `text-navy` (Light Mode) / `text-gold-light` (Dark Mode) to provide clear location feedback. Inactive links use `text-text-muted`.
*   **Content Clearance:** The `<main>` element in `AppShell` carries `pb-16 md:pb-0` to prevent page content from being obscured by the fixed `BottomNav` on mobile.

### 4.2 Contextual Top Navbar (Mobile Behaviour)
 
The `TopNavbar` is context-aware on mobile and changes its left-side content based on the current route:
 
*   **Home Route (`/`):**
    *   **Left:** App title text (`"Fundamental Rights Guide"`). No hamburger icon — primary mobile routing is handled entirely by `BottomNav`.
    *   **Right:** Search icon, Font Toggle, Theme Toggle.
 
*   **Reader Routes (`/book/:slug`, `/authorities/:slug`):**
    *   **Left:** Back arrow button (`navigate(-1)`) to return to the previous listing page.
    *   **Centre:** A truncated, human-readable version of the URL slug displayed as the document title (`max-w-[180px] sm:max-w-xs truncate`).
    *   **Right:** Search icon, Font Toggle, Theme Toggle.

### 4.3 Desktop / Tablet Extrapolation (`md` breakpoint and above)

*   **`BottomNav` hidden.** All primary routing moves into the `TopNavbar`.
*   **`TopNavbar` structure on desktop:**
    *   **Left:** Brand logo link (`"Fundamental Rights Guide"`) linking to `/`.
    *   **Centre:** Inline `NavLink` items — `Home`, `Book`, `Authorities` — with an active state of `bg-white/10 text-gold-light` and a hover state of `hover:bg-white/10 hover:text-white`.
    *   **Right:** Search icon, Font Toggle, Theme Toggle.
*   **Background:** Always `bg-navy` (`#1A2B4C`) to frame the application with a professional, judicial aesthetic.

### 4.4 Reader Bottom Navigation

*   A **separate, distinct component** (`ReaderBottomNav.tsx`) is used exclusively inside `ChapterPage` and `AuthorityPage`.
*   It displays **"Prev Chapter"** and **"Next Chapter"** links derived from the chapter's position in the `sort_order` index.
*   It uses `useAutoHideNav` to slide out of view (`translate-y-full`) on scroll-down and snap back into view on scroll-up, maximising vertical reading space.
*   This component is **entirely separate** from `BottomNav` (the routing nav) and must never be confused with it.

### 4.5 Bug Fix Record: Unconditional `bg-navy` on `TopNavbar`

**Issue Identified:** The original `TopNavbar` implementation contained a `mobileHeaderBg` conditional variable that rendered the navbar as `bg-transparent` on the Home route in mobile view. In Light Mode, this caused the transparent header to appear white, making the white icon buttons invisible against the white page background.

**Root Cause:** The transparent-on-home behaviour was an over-interpretation of the design intent. Since the `BottomNav` already handles all primary mobile navigation, the `TopNavbar` does not need to be transparent on any route.

**Resolution Applied:** The `mobileHeaderBg` conditional variable was **removed entirely** from `TopNavbar.tsx`. The header now carries a single, unconditional `bg-navy` class, ensuring all icon buttons remain visible and readable in both Light and Dark mode, on all routes, at all viewport sizes.