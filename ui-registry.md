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

## FontToggle (Multi-Font Dropdown & Size Controls)
- **File**: `src/components/reader/FontToggle.tsx`
- **Date**: 2026-07-13 (Text Size Controls added)
- **Trigger Button**: `p-2 text-white hover:text-gold-light`, contains accessible `aria-haspopup` attributes.
- **Dropdown Menu**: `absolute right-0 mt-2 w-48 z-50` — right-aligned to prevent mobile overflow.
- **Dropdown Styling**: `bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-md shadow-xl overflow-hidden`.
- **Font Menu Items**: `w-full text-left px-4 py-3`, active state `bg-navy/5 dark:bg-gold/10 text-navy dark:text-gold-light font-bold`.
- **Divider**: `my-2 border-slate-200 dark:border-slate-700`
- **Size Controls Container**: `px-4 py-2 gap-4 pb-3`
- **Size Buttons (Active)**: `text-text-body dark:text-text-body-dark hover:bg-slate-100 dark:hover:bg-slate-800`
- **Size Buttons (Disabled)**: `text-slate-300 dark:text-slate-700 cursor-not-allowed`
- **Size Buttons Shared**: `py-1.5 rounded-md font-medium transition-colors`
- **UX**: Implements a native React click-outside listener to close the dropdown when tapping elsewhere.

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
- **Feature List**: `list-disc list-outside pl-5 mt-3 mb-6 text-sm text-left mx-auto w-fit space-y-1`
- **List Items**: `font-bold text-text-primary dark:text-text-heading-dark`

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

---

## InstallSuccessModal
- **File**: `src/components/pwa/InstallSuccessModal.tsx`
- **Date**: 2026-07-10 (Success Flow)
- **Background**: Modal overlay `bg-navy/60 backdrop-blur-sm`, Dialog `bg-surface dark:bg-midnight`
- **Text Colors**: Heading `text-navy dark:text-text-heading-dark`, Body `text-text-body dark:text-text-body-dark`, Success Icon `text-green-400`
- **Button**: `bg-gold text-navy hover:bg-gold-light focus:ring-navy`
- **Spacing**: `fixed inset-0 p-4`, Dialog `p-6 max-w-sm`, Gap `gap-3`
- **Borders/Shadows**: `border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl`
- **Architecture Note (PWA Events)**: To solve Android event suspension, we employ a Dual-Trigger Strategy. The success modal renders immediately upon resolving the native prompt (`outcome === 'accepted'`). As a fallback for native-menu installs, the root `App.tsx` globally listens for `appinstalled` and dispatches a custom `pwa-success-install` event to synchronise with the hook state.

---

## HomePage Hero Section
- **File**: `src/pages/HomePage.tsx`
- **Date**: 2026-07-13 (3D Book Cover Effect)
- **Layout**: `flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12` — stacks vertically on mobile, horizontal on desktop, center-aligned
- **Text Colors**: Heading `text-navy dark:text-text-heading-dark`, Sub-heading `text-navy dark:text-text-heading-dark font-medium`, List items `text-text-body dark:text-text-body-dark`
- **Typography**: Heading `text-2xl sm:text-3xl font-serif font-bold`, Sub-heading `text-base`, List `text-sm`
- **Feature List**: `list-disc list-outside pl-5 mt-2 space-y-1 leading-snug`
- **Book Cover Image Container (3D Stage)**: `relative group perspective-[1200px] shrink-0 w-full max-w-[220px] sm:max-w-[260px] md:max-w-[340px] lg:max-w-[400px] mx-auto md:mx-0 flex justify-center md:justify-end`
- **Book Cover Image Wrapper (3D Transform)**: `relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(2deg)_rotateY(-4deg)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)]`
- **Book Cover Image Styling**: `w-full h-auto rounded-sm object-cover`
- **Book Cover Mockup Effect (Light)**: `shadow-2xl shadow-slate-900/20`
- **Book Cover Mockup Effect (Dark)**: `dark:shadow-black/60 dark:ring-1 dark:ring-white/10`
- **Book Cover 3D Shadows**: Spine crease `absolute inset-y-0 left-1/2 w-12 -ml-6 bg-gradient-to-r from-transparent via-black/40 dark:via-black/70 to-transparent mix-blend-multiply`, Page lighting `absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/10 to-transparent rounded-l-sm`
- **Spacing**: Container `mb-6 md:mb-8`, Sub-heading `mt-4`, List `mt-2 space-y-1`

---

## Continue Reading Card
- **File**: `src/pages/HomePage.tsx`
- **Date**: 2026-07-13 (Mobile Optimization)
- **Background**: `bg-navy dark:bg-midnight-light`
- **Borders/Shadows**: `rounded-xl shadow-lg border border-white/10`
- **Padding**: `p-4 md:p-6` (compact on mobile to fit above the fold)
- **Internal Spacing**: `mt-2 md:mt-4` on heading, `mt-4 md:mt-6` on progress bar and bottom action link
- **Interactive**: `group hover:shadow-xl transition-all duration-300`

---

## AdminShell (CMS Layout)
- **File**: `src/components/admin/AdminShell.tsx`
- **Date**: 2026-07-13 (Phase 1 Refinement)
- **Background**: Main wrapper `bg-slate-50 dark:bg-midnight`, Sidebar `bg-navy dark:bg-midnight`, Content area `bg-slate-50 dark:bg-midnight`
- **Text Colors**: Sidebar Headings `text-white`, Sidebar Body `text-slate-300`
- **Layout Structure**: 
  - Sidebar: `w-64 flex flex-col h-screen overflow-y-auto` (Strictly desktop, no mobile hidden classes)
  - Sidebar Header/Footer: `shrink-0 sticky top-0 z-10 bg-navy dark:bg-midnight` (Footer is `bottom-0`)
  - Sidebar Header Content: `flex justify-between items-center px-4 py-4` housing the logo and `<ThemeToggle />`.
  - Main: `flex-1 flex flex-col h-screen overflow-hidden`
  - Main Content Area: `flex-1 overflow-y-auto`
- **Avatar Profile**: Circular `w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center`. Extracts first 2 capitalized letters from email.
- **Navigation UI**: Includes `lucide-react` icons (size 18).
- **Navigation (Active)**: `bg-white/10 text-gold-light`
- **Navigation (Inactive)**: `text-slate-300 hover:bg-white/5 hover:text-white`
- **RBAC (Phase 3)**: The 'Manage Core Book' navigation link is conditionally rendered and strictly reserved for the Super Admin (`cektopventures@gmail.com`).
- **Borders**: `border-r border-white/10 dark:border-slate-800`, `border-b border-white/10 dark:border-slate-800`

---

## Editor Action Bar (CMS)
- **Files**: `src/pages/admin/ChapterEditorPage.tsx`, `src/pages/admin/AuthorityEditorPage.tsx`
- **Date**: 2026-07-13 (Phase 4 Fix)
- **Container Layout**: `space-x-4 flex items-center`
- **Cancel Button**: `text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200`
- **Save Draft Button**: `px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-70`
- **Publish Button**: `px-6 py-2 bg-navy hover:bg-navy-light text-white font-medium rounded-lg transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-70`
- **Interaction Logic**: Replaces checkbox UI. Leverages a `publishIntent` boolean state updated via `onClick` on `type="submit"` buttons. Buttons use the `form="form-id"` attribute to explicitly trigger form submission outside the `<form>` wrapper to preserve native HTML5 validation.

---

## RichTextEditor (TipTap)
- **File**: `src/components/admin/RichTextEditor.tsx`
- **Date**: 2026-07-13 (Phase 6 Audit Fix)
- **Container**: `border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-midnight` (Note: NO `overflow-hidden` on parent to allow sticky toolbar to work relative to scrolling viewport)
- **Sticky Toolbar**: `sticky top-0 z-10 p-2 bg-slate-50 dark:bg-midnight-light border-b border-slate-300 dark:border-slate-700`
- **Toolbar Buttons (Active)**: `bg-navy text-white dark:bg-gold-light dark:text-navy`
- **Toolbar Buttons (Inactive)**: `text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700`
- **Editor Prose Styles**: `prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:text-navy dark:prose-headings:text-text-heading-dark prose-a:text-gold dark:prose-a:text-gold-light prose-blockquote:border-l-gold`

---

## AdminMobileGuard (CMS Desktop Enforcement)
- **File**: `src/components/admin/AdminMobileGuard.tsx`
- **Date**: 2026-07-13 (Phase 2 Refinement)
- **Logic**: Uses `window.innerWidth < 768` event listener to strictly enforce desktop/tablet access for all `/admin-cms` routes.
- **Background**: `bg-slate-50 dark:bg-midnight` (Full screen flex center layout)
- **Message Card**: `bg-white dark:bg-midnight-light max-w-sm w-full rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center`
- **Icon Container**: `w-16 h-16 bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold rounded-full flex items-center justify-center`

---

## AdminLoginPage
- **File**: `src/pages/AdminLoginPage.tsx`
- **Date**: 2026-07-13 (Phase 3 Refinement)
- **Password Visibility Toggle**: Input is wrapped in a `relative` container. A `lucide-react` Eye/EyeOff button is positioned with `absolute inset-y-0 right-0 pr-3 flex items-center`.
- **Toggle Button Styles**: `text-slate-400 hover:text-navy dark:hover:text-white transition-colors`
- **Input Field Adjustment**: Added `pr-10` padding to prevent text overlapping the absolute toggle button.

---

## CMS Form Groups
- **Files**: `src/pages/admin/*`
- **Date**: 2026-07-13 (UI Form Fix)
- **Container Layout**: Use `flex flex-col gap-2` to wrap labels and input fields, ensuring the label sits cleanly above the input box.
- **Labels**: `text-sm font-medium text-navy dark:text-text-heading-dark`
- **Inputs**: `w-full px-4 py-2 border rounded-lg bg-white dark:bg-midnight-light border-slate-300 dark:border-slate-700`

---

## Task 1 Database RLS Audit
- **Location**: Supabase `authorities` & `chapters` tables
- **Date**: 2026-07-14
- **Note**: Database-level Role-Based Access Control enforced. No UI components were built or modified in this task, so no visual patterns were extracted.

---

## Task 2 Database Schema Update
- **Location**: Supabase `chapters` table
- **Date**: 2026-07-14
- **Note**: Added `is_published` and `published_at` columns. No UI visual patterns were modified.

---

## Task 3 Frontend Editor Fix
- **File**: `src/components/admin/RichTextEditor.tsx`
- **Date**: 2026-07-14
- **Note**: Moved Tiptap `extensions` array outside the component scope to ensure referential stability and prevent duplicate extension registration under React 18 Strict Mode. No visual UI patterns were altered.

---

## Task 4 Frontend CSS Specificity Fix
- **File**: `src/index.css`
- **Date**: 2026-07-14
- **Note**: Wrapped standard HTML base styles inside `@layer base { ... }`. This prevents raw CSS styles from erroneously overriding Tailwind utility classes (like `text-white`) by ensuring the correct precedence layer in Tailwind v4. No visual UI patterns were changed.

---

## Admin Config Refactor (ChapterEditorPage & AdminShell)
- **Files**: `src/lib/config.ts`, `src/pages/admin/ChapterEditorPage.tsx`, `src/components/admin/AdminShell.tsx`
- **Date**: 2026-07-14
- **Note**: Extracted hardcoded email credentials from ChapterEditorPage and AdminShell into a central configuration file (`config.ts`). Verified that all read and write database operations continue to rely strictly on server-enforced RLS policies rather than client-side checks. No visual UI styles were modified.

---

## ChapterEditorPage SortOrder Input Fix
- **File**: `src/pages/admin/ChapterEditorPage.tsx`
- **Date**: 2026-07-14
- **Note**: Updated the `sortOrder` state and onChange handler to allow empty string values `""` instead of NaN when the input field is cleared. Enforced radix 10 `parseInt(val, 10)` for parsing non-empty inputs. Updated save mapper to parse string representations with fallback value `0` when saving. No visual UI styles were modified.

---

## AdminLoginPage Location State Typing Fix
- **File**: `src/pages/AdminLoginPage.tsx`
- **Date**: 2026-07-14
- **Note**: Created and applied `LocationState` interface to cast `location.state` when accessing route redirection metadata (`from?.pathname`). This corrects TypeScript type compilation issues where `location.state` defaults to `unknown` in React Router v6. Preserved fallback route behavior. No visual UI styles were modified.

---

## Super Admin Role-based Router & Navigation Protection
- **Files**: `src/App.tsx`, `src/components/admin/AdminShell.tsx`, `src/components/admin/SuperAdminRoute.tsx`, `src/pages/admin/ChapterEditorPage.tsx`
- **Date**: 2026-07-14
- **Note**: Replaced hardcoded email identity checks with a standard role-based client-side check (`isSuperAdminRole`) that checks app/user metadata before falling back to email config. Created `SuperAdminRoute` route guard component and wrapped the chapters editor route with it in `App.tsx` to strictly prevent direct URL navigation to chapter modification pages for non-super admins. No visual UI styles were modified.

---

## AuthorityEditorPage Form Submission Refactor
- **File**: `src/pages/admin/AuthorityEditorPage.tsx`
- **Date**: 2026-07-14
- **Note**: Refactored the form submission model to use standard HTML5 forms and submit buttons (leveraging `form="authority-form"` and `type="submit"` outside the `<form>` wrapper). Added `data-publish` attributes to buttons, which are explicitly read on form submit event via `nativeEvent.submitter` to determine draft vs publish intent. This leverages browser native validation and avoids reliance on React state synchronization, resolving stale state bugs. No visual UI styles were modified.

---

## Trusted app_metadata Role Authorization
- **Files**: `src/lib/config.ts`
- **Date**: 2026-07-14
- **Note**: Refactored `getAdminRole` function to derive role-based authorization exclusively from `user.app_metadata.role` (which is server-set and secure), removing checks on the client-controlled `user.user_metadata.role`. The trusted fallback to email-based config is retained. Audited and updated the live database RLS policies on `chapters` and `authorities` to support both `auth.jwt() -> 'app_metadata' ->> 'role'` checking and the trusted `email` fallback, securing mutation access at the server level. No visual UI styles were changed.

---

## Tiptap Dependency Synchronization
- **File**: `package.json`, `package-lock.json`
- **Date**: 2026-07-14
- **Note**: Synchronized all `@tiptap/*` dependency versions in `package.json` to exactly `^3.27.4` to fix ERESOLVE peer conflicts during deployment. Added `@tiptap/core` explicitly to lock it to the matching version. Resolved the dependency tree and generated a clean lockfile using `npm install --legacy-peer-deps`. No visual UI styles were changed.

---

## Tiptap Duplicate Extension Fix (useMemo Refactor)
- **File**: `src/components/admin/RichTextEditor.tsx`
- **Date**: 2026-07-14
- **Note**: Refactored the TipTap `extensions` array configuration. Defined the array inside `useMemo(() => [ ... ], [])` inside the component. This ensures that new extension instances are cleanly created only when the component actually mounts (avoiding the global sharing of stateful extension instances that triggered warnings during React 18 Strict Mode double-mounts), while still preserving referential stability across keystroke re-renders to prevent cursor loss/jumping. No visual UI styles were changed.

---

## Vercel SPA Routing Config
- **File**: `vercel.json`
- **Date**: 2026-07-14
- **Note**: Created a `vercel.json` file in the root directory containing routing rewrite rules mapping all wildcard paths (`/(.*)`) back to `index.html`. This enables React Router to handle client-side routing on direct URL access in production deployments, preventing Vercel from returning 404 errors. No visual UI styles were changed.

---

## RichTextEditor Block Formatting & Typography Fix (Task 2 & Task 3)
- **File**: `src/components/admin/RichTextEditor.tsx`
- **Date**: 2026-07-14
- **Note**: Wrapped the TipTap `EditorContent` component with a `div` containing Tailwind CSS typography classes (`prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none`) along with custom heading, link, and blockquote styles. Cleaned up conflicting duplicate prose classes in `editorProps.attributes`. Audited and verified `TextAlign` configuration to recognize all `heading` and `paragraph` blocks explicitly.

---

## RichTextEditor Horizontal Rule Button Addition
- **File**: `src/components/admin/RichTextEditor.tsx`
- **Date**: 2026-07-14
- **Note**: Imported `Minus` icon from `lucide-react` and added a new Horizontal Rule button to the toolbar right after the text alignment tools. Clicking the button calls `editor.chain().focus().setHorizontalRule().run()`. Set `isActive` state check to `editor.isActive('horizontalRule')`.
