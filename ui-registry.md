# UI Registry

This document captures visual patterns extracted from UI components per the `/imprint` skill.
All future components must match these established patterns for consistency.

---

## AppShell
- **File**: `src/components/layout/AppShell.tsx`
- **Date**: 2026-07-04 (refactored)
- **Background**: `bg-surface dark:bg-midnight`
- **Text Colors**: `text-text-body dark:text-text-body-dark`
- **Layout**: `flex flex-col`, `flex-1` on main, **`overflow-x-hidden`** (CRITICAL: prevents X-axis overflow bugs from unscaled children)
- **Content Padding**: `pt-16` on `<main>` (compensates for fixed TopNavbar h-16), `pb-16 md:pb-0` (clears mobile BottomNav)
- **Interactive**: `transition-colors duration-300`

---

## TopNavbar (Smart Auto-Hide)
- **File**: `src/components/layout/TopNavbar.tsx`
- **Date**: 2026-07-08 (auto-hide refactor)
- **Positioning**: `fixed top-0 w-full z-50` — always overlays the viewport, never scrolls with content
- **Auto-Hide Behaviour**: Uses `useAutoHideNav` hook. Scroll DOWN → slides out (`-translate-y-full`). Scroll UP → slides in (`translate-y-0`). At top of page (scrollY < 50) → always visible.
- **Transform Transition**: `transform transition-transform duration-300 ease-in-out`
- **Background**: `bg-navy` — always, on all routes and all screen sizes
- **Height**: `h-16`
- **Text Colors**: `text-white`, `hover:text-gold-light`, `text-white/80`
- **Spacing**: `max-w-7xl mx-auto`, `px-4 sm:px-6 lg:px-8`, `gap-1` (controls), `gap-3` (left side)
- **Interactive**: `hover:text-white hover:bg-white/10`, `transition-colors duration-200/300`
- **Active State** (desktop nav links): `bg-white/10 text-gold-light`
- **Focus Ring**: `focus:outline-none focus:ring-2 focus:ring-gold-light rounded-md`
- **Shadows**: `shadow-md`
- **Mobile-specific** (< `md`):
  - Home: App title text left, no hamburger (primary routing via BottomNav)
  - Reader: back arrow left, truncated slug title (`max-w-[180px] sm:max-w-xs`)
- **Desktop-specific** (`md`+): inline `NavLink` items (`Home`, `Book`, `Authorities`) in centre (BottomNav hidden at this breakpoint)
- **Navigation Split Rule**: Mobile routing = `BottomNav` (fixed bottom, `md:hidden`). Desktop routing = `TopNavbar` inline links (`hidden md:flex`). These two components are mutually exclusive per viewport — never both visible.

---

## BottomNav
- **File**: `src/components/layout/BottomNav.tsx`
- **Date**: 2026-07-08 (spacing fix)
- **Visibility**: `md:hidden` — mobile only
- **Background**: `bg-white dark:bg-midnight`
- **Height**: `h-16`
- **Borders/Shadows**: `border-t border-slate-200 dark:border-slate-800`, `shadow-[0_-2px_8px_rgba(0,0,0,0.08)]`
- **Text Colors**: Active `text-navy dark:text-gold-light` | Inactive `text-text-muted hover:text-navy dark:hover:text-text-heading-dark`
- **Spacing**: Container `flex justify-around`, each NavLink `flex-1 py-2 gap-1` (equal-width columns, no `px-4` — ensures even distribution regardless of label width)
- **Typography**: `text-xs font-medium`
- **Interactive**: `transition-colors duration-200`

---

## ThemeToggle
- **File**: `src/components/reader/ThemeToggle.tsx`
- **Date**: 2026-07-04
- **Text Colors**: `text-white`, `hover:text-gold-light`
- **Spacing**: `p-2`
- **Interactive**: `hover:text-gold-light`, `transition-colors`, `focus:outline-none`, `focus:ring-2`, `focus:ring-gold-light`

---

## FontToggle (Multi-Font Dropdown)
- **File**: `src/components/reader/FontToggle.tsx`
- **Date**: 2026-07-08 (Dropdown Upgrade)
- **Trigger Button**: `p-2 text-white hover:text-gold-light`, contains accessible `aria-haspopup` attributes.
- **Dropdown Menu**: `absolute right-0 mt-2 w-48 z-50` — right-aligned to prevent mobile overflow.
- **Dropdown Styling**: `bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-md shadow-xl overflow-hidden`.
- **Menu Items**: `w-full text-left px-4 py-3`, active state `bg-navy/5 dark:bg-gold/10 text-navy dark:text-gold-light font-bold`.
- **UX**: Implements a native React click-outside listener to close the dropdown when tapping elsewhere.
- **Border Radius**: `rounded-md`

---

## ReaderBottomNav
- **File**: `src/components/reader/ReaderBottomNav.tsx`
- **Date**: 2026-07-04
- **Background**: `bg-surface dark:bg-midnight`
- **Text Colors**: `text-navy dark:text-text-heading-dark`, `hover:text-gold dark:hover:text-gold-light`, `text-text-muted`
- **Spacing**: `fixed bottom-0`, `h-16`, `max-w-3xl mx-auto`, `px-4 py-3`
- **Interactive**: `transition-transform duration-300`, `translate-y-0` / `translate-y-full`
- **Borders/Shadows**: `border-t border-slate-200 dark:border-slate-800`, `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`
- **Note**: Distinct from `BottomNav` — only shown inside `ChapterPage` and `AuthorityPage`

---

## ReaderView
- **File**: `src/components/reader/ReaderView.tsx`
- **Date**: 2026-07-08 (responsive scale fix)
- **Typography (Title)**: `text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words` (Scales down for mobile, breaks long unbroken words to prevent X-axis overflow).
- **Typography (Prose)**: `prose prose-base md:prose-lg dark:prose-invert max-w-none` (Uses base size on mobile, scales to `lg` on tablet+).
- **Prose overrides**: `prose-headings:break-words` (Critical to stop long legal headings from overflowing), `prose-headings:text-navy dark:prose-headings:text-text-heading-dark`, `prose-a:text-gold dark:prose-a:text-gold-light hover:prose-a:text-gold-dark`, `prose-blockquote:border-l-gold`
- **Spacing**: `max-w-3xl mx-auto`, `px-4 sm:px-6`, `py-6 pb-24`, header: `mb-8 pb-6`
- **Borders**: `border-b border-slate-200 dark:border-slate-800`

---

## TableOfContentsCard
- **File**: `src/pages/TableOfContentsPage.tsx`
- **Date**: 2026-07-04
- **Background**: `bg-white dark:bg-midnight-light`
- **Text Colors**: `text-navy dark:text-text-heading-dark`, `group-hover:text-gold dark:group-hover:text-gold-light`
- **Spacing**: `block p-5`, `space-y-4`
- **Interactive**: `group`, `hover:shadow-md hover:border-gold-light dark:hover:border-gold`, `transition-all duration-300`
- **Borders/Shadows**: `border border-slate-200 dark:border-slate-800`, `rounded-lg shadow-sm`

---

## InstallModal
- **File**: `src/components/pwa/InstallModal.tsx`
- **Date**: 2026-07-10 (UX update)
- **Background**: Modal overlay `bg-navy/60 backdrop-blur-sm`, Dialog `bg-surface dark:bg-midnight`, iOS Fallback Card `bg-slate-50 dark:bg-slate-800`
- **Text Colors**: Heading `text-navy dark:text-text-heading-dark`, Body `text-text-body dark:text-text-body-dark`, Dismiss/Agency `text-text-muted`, Agency Link `text-gold hover:text-gold-light`
- **Primary Button**: `bg-gold text-navy hover:bg-gold-light focus:ring-navy` (Non-iOS only)
- **Dismiss Link**: `text-sm hover:underline bg-transparent border-none outline-none` (Replaces Secondary Button)
- **Spacing**: `fixed inset-0 p-4`, Dialog `p-6 max-w-sm`, Gap `gap-3`, iOS Fallback Card `p-4`
- **Borders/Shadows**: Dialog `border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl`, iOS Fallback Card `border border-slate-200 dark:border-slate-700 rounded-lg`

---

## SearchOverlay
- **File**: `src/components/search/SearchOverlay.tsx`
- **Date**: 2026-07-08
- **Background**: `bg-surface/95 dark:bg-midnight/95 backdrop-blur-md`
- **Header Bar**: `bg-navy shadow-md`, `max-w-3xl mx-auto px-4 sm:px-6 py-3`
- **Input**: `bg-transparent text-white placeholder:text-white/50 caret-gold-light`
- **Text Colors**: Section headings `text-text-muted dark:text-text-body-dark text-xs font-bold uppercase tracking-widest`, Count badge `text-gold dark:text-gold-light`
- **Spacing**: `fixed inset-0`, Results area `max-w-3xl mx-auto px-4 sm:px-6 py-6`, Cards `p-4 space-y-2`
- **Interactive**: Close `text-white/70 hover:text-white`, `focus:ring-2 focus:ring-gold-light`

## SearchResultCard
- **File**: `src/components/search/SearchOverlay.tsx` (inline)
- **Date**: 2026-07-08
- **Background**: `bg-white dark:bg-midnight-light`
- **Text Colors**: Title `text-navy dark:text-text-heading-dark group-hover:text-gold dark:group-hover:text-gold-light`, Snippet `text-text-muted dark:text-text-body-dark`
- **Mark Highlight**: `[&_mark]:bg-gold/30 [&_mark]:text-navy [&_mark]:dark:text-text-heading-dark [&_mark]:px-0.5 [&_mark]:rounded-sm`
- **Spacing**: `p-4 rounded-lg`
- **Interactive**: `group hover:border-gold-light dark:hover:border-gold hover:shadow-md transition-all duration-200`
- **Borders**: `border border-slate-200 dark:border-slate-800`

---

## Transient Highlight V2 (In-Page Search Match)
- **File**: `src/components/reader/ReaderView.tsx`
- **Date**: 2026-07-09
- **Background**: `bg-gold-light` (fades to `bg-transparent`)
- **Text Color**: `text-navy` (fades to `text-inherit`)
- **Spacing**: `px-1 rounded-sm`
- **Animation**: `transition-colors duration-1000 ease-in-out` (triggered dynamically after a 2500ms timeout)
- **UX**: Uses standard DOM `TreeWalker` to split text nodes safely and automatically `scrollIntoView`.
- **Architecture**: 
  - Employs a double `requestAnimationFrame` to guarantee the DOM is fully painted by the browser before searching.
  - The 2500ms fade-out timer is isolated in a `useRef` to prevent premature cancellation by React's aggressive re-render/cleanup cycles.

---

## PWA Manifest & Meta Branding
- **File**: `vite.config.ts` and `index.html`
- **Date**: 2026-07-10 (OpenGraph & Splash Screen Polish)
- **Background**: Splash Screen `background_color` and `theme_color` set to `#0f172a` (Dark Navy) for a seamless dark mode transition.
- **Branding**: App `name` and `short_name` set to `FHR Guide`.
- **Social Sharing**: OpenGraph and Twitter image meta tags mapped to absolute URL `https://www.fhrnigeria.app/og-image.png` (`1200x630`).
