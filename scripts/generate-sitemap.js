/**
 * generate-sitemap.js
 *
 * Runs after `vite build` (as a postbuild script).
 * Queries Supabase for all published chapters and authorities,
 * then writes a complete sitemap.xml into the dist/ directory.
 *
 * Environment variables required:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');

const SITE_URL = 'https://fhrnigeria.app';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ---------------------------------------------------------------------------
// 1. Load environment variables
//    Vite prefixes them with VITE_, and they live in .env.local.
//    Node doesn't auto-load .env files, so we do a minimal parse here.
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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// 2. Build URL entries
// ---------------------------------------------------------------------------

/** @param {string} loc @param {string} lastmod @param {'daily'|'weekly'|'monthly'} changefreq @param {string} priority */
function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  console.log('📄 Generating sitemap.xml …');

  // Static top-level routes
  const entries = [
    urlEntry(`${SITE_URL}/`, TODAY, 'weekly', '1.0'),
    urlEntry(`${SITE_URL}/book`, TODAY, 'weekly', '0.9'),
    urlEntry(`${SITE_URL}/authorities`, TODAY, 'weekly', '0.9'),
  ];

  // Fetch published chapters
  const { data: chapters, error: chapErr } = await supabase
    .from('chapters')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (chapErr) {
    console.warn('⚠️  Could not fetch chapters:', chapErr.message);
  } else if (chapters) {
    console.log(`   ✓ ${chapters.length} chapters found`);
    for (const ch of chapters) {
      const lastmod = ch.updated_at
        ? new Date(ch.updated_at).toISOString().split('T')[0]
        : TODAY;
      entries.push(urlEntry(`${SITE_URL}/book/${ch.slug}`, lastmod, 'monthly', '0.8'));
    }
  }

  // Fetch authorities
  const { data: authorities, error: authErr } = await supabase
    .from('authorities')
    .select('slug, updated_at');

  if (authErr) {
    console.warn('⚠️  Could not fetch authorities:', authErr.message);
  } else if (authorities) {
    console.log(`   ✓ ${authorities.length} authorities found`);
    for (const auth of authorities) {
      const lastmod = auth.updated_at
        ? new Date(auth.updated_at).toISOString().split('T')[0]
        : TODAY;
      entries.push(urlEntry(`${SITE_URL}/authorities/${auth.slug}`, lastmod, 'monthly', '0.7'));
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Write sitemap.xml
  // ---------------------------------------------------------------------------
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  const outPath = resolve(DIST_DIR, 'sitemap.xml');
  writeFileSync(outPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap written to ${outPath} (${entries.length} URLs)`);
}

main().catch((err) => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
