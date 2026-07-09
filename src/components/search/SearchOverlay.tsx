import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult, SearchResults } from '../../lib/search';

interface SearchOverlayProps {
  isOpen: boolean;
  query: string;
  results: SearchResults;
  isSearching: boolean;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

function ResultCard({ result, onNavigate, query }: { result: SearchResult; onNavigate: () => void; query: string }) {
  const navigate = useNavigate();
  const route = result.source === 'book'
    ? `/book/${result.slug}`
    : `/authorities/${result.slug}`;

  return (
    <button
      onClick={() => {
        navigate({ pathname: route, search: `?q=${encodeURIComponent(query)}` });
        onNavigate();
      }}
      className="w-full text-left p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-midnight-light hover:border-gold-light dark:hover:border-gold hover:shadow-md transition-all duration-200 group"
    >
      <h4 className="font-serif font-bold text-navy dark:text-text-heading-dark group-hover:text-gold dark:group-hover:text-gold-light transition-colors text-sm sm:text-base leading-snug">
        {result.title}
      </h4>
      <p
        className="text-xs sm:text-sm text-text-muted dark:text-text-body-dark mt-1.5 leading-relaxed [&_mark]:bg-gold/30 [&_mark]:text-navy [&_mark]:dark:text-text-heading-dark [&_mark]:px-0.5 [&_mark]:rounded-sm"
        dangerouslySetInnerHTML={{ __html: result.snippet }}
      />
    </button>
  );
}

function ResultSection({
  title,
  results,
  icon,
  onNavigate,
  query,
}: {
  title: string;
  results: SearchResult[];
  icon: React.ReactNode;
  onNavigate: () => void;
  query: string;
}) {
  if (results.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gold dark:text-gold-light">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-text-body-dark">
          {title}
          <span className="ml-2 text-gold dark:text-gold-light">({results.length})</span>
        </h3>
      </div>
      <div className="space-y-2">
        {results.map((result) => (
          <ResultCard key={result.id} result={result} onNavigate={onNavigate} query={query} />
        ))}
      </div>
    </div>
  );
}

export default function SearchOverlay({
  isOpen,
  query,
  results,
  isSearching,
  onQueryChange,
  onClose,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to let the animation start before focusing
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length >= 2;
  const hasResults = results.totalCount > 0;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-surface/95 dark:bg-midnight/95 backdrop-blur-md">

      {/* ── Header Bar ── */}
      <div className="flex-shrink-0 bg-navy shadow-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Search icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Search input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search chapters, authorities, case law…"
              className="flex-1 bg-transparent text-white placeholder:text-white/50 text-base outline-none border-none caret-gold-light"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light"
              aria-label="Close search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Results Area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

          {/* Loading state */}
          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-text-muted dark:text-text-body-dark">
                <svg className="animate-spin h-5 w-5 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Searching…</span>
              </div>
            </div>
          )}

          {/* Results */}
          {!isSearching && hasQuery && hasResults && (
            <>
              {/* Book Results */}
              <ResultSection
                title="Book Chapters"
                results={results.bookResults}
                onNavigate={onClose}
                query={query}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />

              {/* Authorities Results */}
              <ResultSection
                title="Authorities"
                results={results.authorityResults}
                onNavigate={onClose}
                query={query}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                }
              />
            </>
          )}

          {/* No results state */}
          {!isSearching && hasQuery && !hasResults && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-muted/40 dark:text-text-body-dark/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-text-muted dark:text-text-body-dark font-medium">
                No results found for "<span className="text-navy dark:text-text-heading-dark font-bold">{query}</span>"
              </p>
              <p className="text-xs text-text-muted/70 dark:text-text-body-dark/70 mt-2">
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {/* Empty state — prompt */}
          {!hasQuery && !isSearching && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gold/30 dark:text-gold-light/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-text-muted dark:text-text-body-dark">
                Search across all chapters and authorities
              </p>
              <p className="text-xs text-text-muted/70 dark:text-text-body-dark/70 mt-2">
                Type at least 2 characters to begin · Press <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-[10px] font-mono bg-white dark:bg-midnight-light">Esc</kbd> to close
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
