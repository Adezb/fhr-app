import MiniSearch from 'minisearch';
import { getDB } from './db';
import type { Chapter, Authority } from '../types';

// ─── Types ───────────────────────────────────────────────────────────
export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  snippet: string;       // ~120-char context window with <mark> highlights
  source: 'book' | 'authority';
}

// ─── HTML Stripping ──────────────────────────────────────────────────
/**
 * Strips all HTML tags from a string, leaving only text content.
 * Uses a regex approach to avoid DOM dependency (works in web workers too).
 * Decodes common HTML entities for clean plaintext.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')           // Remove all tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&copy;/gi, '©')
    .replace(/&agrave;/gi, 'à')
    .replace(/\s+/g, ' ')              // Collapse whitespace
    .trim();
}

// ─── Snippet Builder ─────────────────────────────────────────────────
/**
 * Builds a ~120-character context window around the first occurrence
 * of any matched term, wrapping it in a <mark> tag using Judicial Gold.
 */
function buildSnippet(text: string, terms: string[]): string {
  const lowerText = text.toLowerCase();
  let earliestIndex = -1;
  let matchedTerm = '';

  // Find the earliest occurring term in the text
  for (const term of terms) {
    const idx = lowerText.indexOf(term.toLowerCase());
    if (idx !== -1 && (earliestIndex === -1 || idx < earliestIndex)) {
      earliestIndex = idx;
      matchedTerm = term;
    }
  }

  if (earliestIndex === -1) {
    // No match found in content — return first 120 chars as fallback
    return text.slice(0, 120) + (text.length > 120 ? '…' : '');
  }

  // Build the context window: ~60 chars before, match, ~60 chars after
  const WINDOW = 60;
  const start = Math.max(0, earliestIndex - WINDOW);
  const end = Math.min(text.length, earliestIndex + matchedTerm.length + WINDOW);

  let snippet = '';
  if (start > 0) snippet += '…';

  const before = text.slice(start, earliestIndex);
  const match = text.slice(earliestIndex, earliestIndex + matchedTerm.length);
  const after = text.slice(earliestIndex + matchedTerm.length, end);

  snippet += before + '<mark>' + match + '</mark>' + after;

  if (end < text.length) snippet += '…';

  return snippet;
}

// ─── Index Singletons ────────────────────────────────────────────────
let bookIndex: MiniSearch | null = null;
let authoritiesIndex: MiniSearch | null = null;

// Store the plaintext content keyed by id for snippet generation
const contentCache = new Map<string, string>();

/**
 * Builds (or rebuilds) the book chapters index from IndexedDB.
 * Called once on first search or after a sync completes.
 */
export async function buildBookIndex(): Promise<MiniSearch> {
  const db = await getDB();
  const chapters = await db.getAll('chapters');

  bookIndex = new MiniSearch<Chapter>({
    fields: ['title', 'plaintext'],       // Fields to index for full-text search
    storeFields: ['title', 'slug'],       // Fields to return in results
    searchOptions: {
      boost: { title: 2 },               // Title matches rank higher
      fuzzy: 0.2,                         // Tolerate minor typos
      prefix: true,                       // Enable prefix matching
    },
  });

  const documents = chapters.map((ch) => {
    const plaintext = stripHtml(ch.content_html);
    contentCache.set(ch.id, plaintext);
    return {
      id: ch.id,
      title: ch.title,
      slug: ch.slug,
      plaintext,
    };
  });

  bookIndex.addAll(documents);
  return bookIndex;
}

/**
 * Builds (or rebuilds) the authorities index from IndexedDB.
 * Should be called after each sync to pick up new/updated authorities.
 */
export async function buildAuthoritiesIndex(): Promise<MiniSearch> {
  const db = await getDB();
  const authorities = await db.getAll('authorities');

  authoritiesIndex = new MiniSearch<Authority>({
    fields: ['title', 'plaintext'],
    storeFields: ['title', 'slug'],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  const documents = authorities.map((auth) => {
    const plaintext = stripHtml(auth.content_html);
    contentCache.set(auth.id, plaintext);
    return {
      id: auth.id,
      title: auth.title,
      slug: auth.slug,
      plaintext,
    };
  });

  authoritiesIndex.addAll(documents);
  return authoritiesIndex;
}

// ─── Unified Search ──────────────────────────────────────────────────
export interface SearchResults {
  bookResults: SearchResult[];
  authorityResults: SearchResult[];
  totalCount: number;
}

/**
 * Searches both indexes and returns segregated, snippet-enriched results.
 * Lazily initializes indexes on first call.
 */
export async function search(query: string): Promise<SearchResults> {
  if (!query || query.trim().length < 2) {
    return { bookResults: [], authorityResults: [], totalCount: 0 };
  }

  // Lazily build indexes if they haven't been built yet
  if (!bookIndex) await buildBookIndex();
  if (!authoritiesIndex) await buildAuthoritiesIndex();

  const trimmedQuery = query.trim();

  // Search book index
  const rawBookResults = bookIndex!.search(trimmedQuery);
  const bookResults: SearchResult[] = rawBookResults.map((result) => {
    const plaintext = contentCache.get(result.id as string) ?? '';
    return {
      id: result.id as string,
      title: result.title as string,
      slug: result.slug as string,
      snippet: buildSnippet(plaintext, result.terms),
      source: 'book' as const,
    };
  });

  // Search authorities index
  const rawAuthResults = authoritiesIndex!.search(trimmedQuery);
  const authorityResults: SearchResult[] = rawAuthResults.map((result) => {
    const plaintext = contentCache.get(result.id as string) ?? '';
    return {
      id: result.id as string,
      title: result.title as string,
      slug: result.slug as string,
      snippet: buildSnippet(plaintext, result.terms),
      source: 'authority' as const,
    };
  });

  return {
    bookResults,
    authorityResults,
    totalCount: bookResults.length + authorityResults.length,
  };
}

/**
 * Invalidates both indexes, forcing a rebuild on the next search.
 * Call this after a sync completes to pick up new data.
 */
export function invalidateIndexes(): void {
  bookIndex = null;
  authoritiesIndex = null;
  contentCache.clear();
}
