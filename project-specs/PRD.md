# PRODUCT REQUIREMENT DOCUMENT (PRD)

**Project Name:** Fundamental Rights Enforcement App & CMS

## 1. Executive Summary
The objective is to digitize the book *"Fundamental Rights Enforcement in Nigeria - A Practical Guide"* into a standalone, offline-first legal utility Progressive Web Application (PWA). The platform will serve as a dynamic legal resource, allowing the administrator to continuously publish recent judicial authorities, keeping legal practitioners updated in real time. 

## 2. Product Scope (Phase 1)
The application will launch as a free, public-use utility to drive rapid organic adoption among legal professionals. Monetization via professional ad networks (Phase 2) is deferred to ensure strict adherence to the delivery deadline and to build initial user trust.

## 3. Technical Architecture & Infrastructure
*   **Frontend Framework:** React + Vite + TypeScript tailored for PWA compilation.
*   **Hosting & CI/CD:** Vercel.
*   **Domain Management:** Custom domain via WhoGoHost mapped to Vercel (Vercel handles SSL/CDN).
*   **SEO & Open Graph:** Google indexing handled natively via Vite. Dynamic Open Graph tags (for WhatsApp, Twitter, etc.) handled via Vercel Serverless/Edge Functions intercepting bot User-Agents.
*   **Styling:** Tailwind CSS. The design is **mobile-first** but must be fully responsive, scaling seamlessly across Mobile, Tablet, and Desktop environments.
*   **Backend & Database:** Supabase (PostgreSQL) optimized for raw text storage to ensure minimal bandwidth usage and maximum free-tier longevity.
*   **Offline Functionality:** Service worker caching (IndexedDB) to guarantee that previously synced books and authorities are accessible in courtrooms without internet connectivity.

## 4. SEO & Open Graph (OG) Strategy
To guarantee strong discoverability and professional sharing capabilities:
*   **Semantic HTML:** All rich text uploaded via the CMS must render using strict semantic HTML (e.g., `<article>`, `<h1>`, `<h2>`, `<p>`) to optimize search engine indexing.
*   **Dynamic Meta Tags:** Implement dynamic `<title>` and `<meta name="description">` tags that update based on the specific chapter or case law being viewed.
*   **Open Graph Implementation:** Embed OG tags (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Cards. The `og:image` should natively pull the high-resolution book cover or a dynamically generated card containing the CEK TOP VENTURES LTD branding.

## 5. Core Features & UX Flows

### 5.1 Enforced PWA Installation
*   **Trigger Logic:** Intercept the browser's native `beforeinstallprompt` event upon the user's initial launch of the web link.
*   **UI Component:** Prevent the default browser prompt and instead render a custom, centered Pop-up Modal.
*   **Modal Contents:** Display the Book Cover, the app's value proposition ("Install for offline courtroom access"), and a prominent "Install App" button.
*   **Action:** Clicking "Install" will trigger the PWA installation, downloading the application directly to the user's device and placing the app shortcut on their Home Screen and App Drawer.

### 5.2 The Reader Interface
*   A distraction-free reading environment utilizing the `@tailwindcss/typography` plugin for dynamic, book-like typesetting.
*   **Theme Toggle:** A system-level and manual Light/Dark mode switch to reduce eye strain.
*   **Typography Toggle:** Allow users to switch between Serif (traditional legal reading) and Sans-Serif fonts.

### 5.3 Authorities Hub
*   A dedicated repository for newly uploaded case laws and legal precedents.
*   Automatically syncs new uploads in the background via the PWA service worker when an internet connection is detected.

### 5.4 Unified Search Engine
*   A lightning-fast, client-side GIN-indexed search mechanism.
*   Simultaneously scans both the core book and all downloaded authorities.
*   Segregates search results contextually (e.g., "Matches in Core Book" vs. "Matches in Authorities") to prevent user confusion.

### 5.5 Admin CMS Dashboard
*   A secure, desktop-optimized web portal for the author/administrator.
*   Features a Rich Text / Markdown editor (e.g., TipTap or React Quill) allowing the admin to format and publish new legal updates with standard word-processing tools (Bold, Italic, H1, H2, Blockquotes).
*   Data must be saved as raw text strings to maintain a lightweight database footprint.