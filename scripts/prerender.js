/**
 * prerender.js
 *
 * Runs after `vite build` (as a postbuild script).
 * Reads the generated dist/index.html, queries Supabase for published chapters and authorities,
 * and generates pre-rendered HTML files for static and dynamic routes with pre-populated <head> meta tags.
 *
 * Static pre-rendering ensures social sharing bots (WhatsApp, iMessage, Twitter, Telegram, Facebook)
 * receive fully populated <title>, <meta description>, og:*, and twitter:* preview cards.
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://fhrnigeria.app';


// ---------------------------------------------------------------------------
// 1. Environment Parsing
// ---------------------------------------------------------------------------
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const envPath = resolve(__dirname, '..', file);
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// ---------------------------------------------------------------------------
// 2. Helpers
// ---------------------------------------------------------------------------
function stripHtml(htmlStr = '', maxLength = 155) {
  const text = htmlStr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && /^[a-zA-Z0-9_-]+$/.test(slug);
}

function escapeHtml(str = '') {

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMetaTagsHtml({ title, description, image, url }) {
  const fullTitle = escapeHtml(title);
  const fullDesc = escapeHtml(description);
  const fullImg = escapeHtml(image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`);
  const fullUrl = escapeHtml(url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`);

  return `
    <title>${fullTitle}</title>
    <meta name="description" content="${fullDesc}" />
    <link rel="canonical" href="${fullUrl}" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Fundamental Rights Enforcement" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${fullDesc}" />
    <meta property="og:image" content="${fullImg}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${fullUrl}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${fullDesc}" />
    <meta name="twitter:image" content="${fullImg}" />
    <meta name="twitter:url" content="${fullUrl}" />
  `.trim();
}

function injectMetaTags(indexHtmlContent, metaObj) {
  const newMetaSnippet = buildMetaTagsHtml(metaObj);

  // Strip existing <title>, meta description, og:*, twitter:*, and canonical link from template <head>
  let html = indexHtmlContent
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, '')
    .replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][\s\S]*?>/gi, '');

  // Remove empty lines leftover from stripped meta tags
  html = html.replace(/^\s*[\r\n]/gm, '');

  // Inject the route-specific meta snippet before </head>
  return html.replace('</head>', `  ${newMetaSnippet}\n</head>`);
}


// ---------------------------------------------------------------------------
// 3. Main Pre-rendering Execution
// ---------------------------------------------------------------------------
async function main() {
  console.log('🚀 Pre-rendering static HTML files for bot scraping...');

  const indexPath = resolve(DIST_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }

  const baseIndexHtml = readFileSync(indexPath, 'utf-8');

  // Core Static Routes Definition
  const routesToRender = [
    {
      path: '/launch',
      title: 'Official App Launch & PWA Download | Fundamental Rights Practice Guide',
      description: 'Official book app launch for Fundamental Rights Practice Guide by CEK TOP VENTURES LTD. Launching Monday, August 3rd, 2026. On-the-go offline access to Chapter IV of the 1999 Constitution, FREP Rules 2009, and the African Charter.',
      image: 'https://fhrnigeria.app/fhr-full-cover.png',
      url: '/launch',
    },
    {
      path: '/',
      title: 'Fundamental Rights Enforcement in Nigeria',
      description: 'A practice guide to fundamental rights enforcement in Nigeria. Access legal authorities and case laws offline.',
      image: '/og-image.png',
      url: '/',
    },
    {
      path: '/book',
      title: 'Table of Contents | Fundamental Rights Practice Guide',
      description: 'Complete chapter index of Fundamental Rights Enforcement practice guide in Nigeria.',
      image: '/og-image.png',
      url: '/book',
    },
    {
      path: '/authorities',
      title: 'Legal Authorities & Case Laws | Fundamental Rights Practice Guide',
      description: 'Read latest judgments and legal principles on Fundamental Rights Enforcement procedure in Nigeria.',
      image: '/og-image.png',
      url: '/authorities',
    },
  ];

  let hadErrors = false;

  // Fetch published chapters and authorities if Supabase credentials exist
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Fetch Chapters
      const { data: chapters, error: chapErr } = await supabase
        .from('chapters')
        .select('slug, title, summary, content_html')
        .eq('is_published', true);

      if (chapErr) {
        console.warn('⚠️ Could not fetch chapters for pre-rendering:', chapErr.message);
        hadErrors = true;
      } else if (chapters) {
        console.log(`   ✓ Found ${chapters.length} published chapters`);
        for (const ch of chapters) {
          if (!isValidSlug(ch.slug)) {
            console.warn(`⚠️ Skipping chapter with invalid slug: "${ch.slug}"`);
            hadErrors = true;
            continue;
          }
          const desc = ch.summary || stripHtml(ch.content_html, 155) || 'Chapter guide on Fundamental Rights Enforcement in Nigeria.';
          routesToRender.push({
            path: `/book/${ch.slug}`,
            title: `${ch.title} | Fundamental Rights Practice Guide`,
            description: desc,
            image: '/og-image.png',
            url: `/book/${ch.slug}`,
          });
        }
      }

      // 2. Fetch Authorities
      const { data: authorities, error: authErr } = await supabase
        .from('authorities')
        .select('slug, title, summary, content_html')
        .eq('is_published', true);

      if (authErr) {
        console.warn('⚠️ Could not fetch authorities for pre-rendering:', authErr.message);
        hadErrors = true;
      } else if (authorities) {
        console.log(`   ✓ Found ${authorities.length} published authorities`);
        for (const auth of authorities) {
          if (!isValidSlug(auth.slug)) {
            console.warn(`⚠️ Skipping authority with invalid slug: "${auth.slug}"`);
            hadErrors = true;
            continue;
          }
          const desc = auth.summary || stripHtml(auth.content_html, 155) || 'Legal authority judgment and analysis on Fundamental Rights Enforcement.';
          routesToRender.push({
            path: `/authorities/${auth.slug}`,
            title: `${auth.title} | Fundamental Rights Practice Guide`,
            description: desc,
            image: '/og-image.png',
            url: `/authorities/${auth.slug}`,
          });
        }
      }
    } catch (err) {
      console.warn('⚠️ Supabase connection error during pre-rendering:', err.message);
      hadErrors = true;
    }
  } else {
    console.warn('⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — rendering static routes only.');
    hadErrors = true;
  }

  // Pre-render HTML file for each route
  let generatedCount = 0;
  for (const route of routesToRender) {
    let targetDir = DIST_DIR;
    if (route.path !== '/') {
      targetDir = resolve(DIST_DIR, route.path.replace(/^\//, ''));
    }

    // Security check: Refuse to process paths resolving outside DIST_DIR
    if (!targetDir.startsWith(DIST_DIR)) {
      console.warn(`⚠️ Refusing to write to target path outside dist/: "${targetDir}"`);
      hadErrors = true;
      continue;
    }

    if (route.path !== '/') {
      mkdirSync(targetDir, { recursive: true });
    }

    const renderedHtml = injectMetaTags(baseIndexHtml, route);
    const targetFile = resolve(targetDir, 'index.html');
    writeFileSync(targetFile, renderedHtml, 'utf-8');
    generatedCount++;
  }


  console.log(`✅ Pre-rendering complete! Generated ${generatedCount} static route files in dist/`);

  if (hadErrors) {
    process.exitCode = 1;
  }
}


main().catch((err) => {
  console.error('❌ Pre-rendering failed:', err);
  process.exit(1);
});
