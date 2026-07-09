import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import BottomNav from './BottomNav';
import { useSync } from '../../hooks/useSync';
import { useSearch } from '../../hooks/useSearch';
import InstallModal from '../pwa/InstallModal';
import SearchOverlay from '../search/SearchOverlay';

export default function AppShell() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize background sync (auto-runs on launch & network reconnect)
  const { error: syncError } = useSync();

  // Search state — shared between TopNavbar (trigger) and SearchOverlay (consumer)
  const {
    isOpen: isSearchOpen,
    query,
    results,
    isSearching,
    openSearch,
    closeSearch,
    handleQueryChange,
  } = useSearch();

  return (
    <div className={`min-h-screen overflow-x-hidden bg-surface dark:bg-midnight text-text-body dark:text-text-body-dark flex flex-col ${isMounted ? 'transition-colors duration-300 ease-in-out' : ''}`}>
      <TopNavbar onSearchClick={openSearch} />

      {/* Sync Error Banner */}
      {syncError && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sync Error: {syncError.message}. Check console or credentials.
        </div>
      )}

      {/* pt-16 compensates for the fixed TopNavbar (h-16). pb-16 clears mobile BottomNav. */}
      <main className="flex-1 w-full pt-16 pb-16 md:pb-0">
        <Outlet />
      </main>

      <BottomNav />
      <InstallModal />
      <SearchOverlay
        isOpen={isSearchOpen}
        query={query}
        results={results}
        isSearching={isSearching}
        onQueryChange={handleQueryChange}
        onClose={closeSearch}
      />
    </div>
  );
}
