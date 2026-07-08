import { useState, useCallback, useRef, useEffect } from 'react';
import { search, invalidateIndexes } from '../lib/search';
import type { SearchResults } from '../lib/search';

const DEBOUNCE_MS = 300;

/**
 * Hook that manages search state with debounced querying.
 * Exposes query, results, loading state, and an overlay open/close toggle.
 */
export function useSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    bookResults: [],
    authorityResults: [],
    totalCount: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults({ bookResults: [], authorityResults: [], totalCount: 0 });
  }, []);

  // Debounced search execution
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (newQuery.trim().length < 2) {
      setResults({ bookResults: [], authorityResults: [], totalCount: 0 });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const searchResults = await search(newQuery);
        setResults(searchResults);
      } catch (err) {
        console.error('Search failed:', err);
        setResults({ bookResults: [], authorityResults: [], totalCount: 0 });
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  return {
    isOpen,
    query,
    results,
    isSearching,
    openSearch,
    closeSearch,
    handleQueryChange,
    invalidateIndexes,
  };
}
