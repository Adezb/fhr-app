import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Smart Auto-Hide Nav Hook
 *
 * Tracks scroll direction and returns whether the navbar should be visible.
 *  - Scrolling DOWN past threshold → hide (isVisible = false)
 *  - Scrolling UP even slightly   → show  (isVisible = true)
 *  - At the very top (scrollY < 50) → always visible
 * 
 * Suspends scroll tracking for 1500ms during search highlights to prevent compositor aborts.
 */
export function useAutoHideNav(isProgrammaticScrolling = false) {
  const location = useLocation();
  const hasQuery = location.search.includes('q=');
  const [isSuspended, setIsSuspended] = useState(isProgrammaticScrolling || hasQuery);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Suspend scroll tracking on route transitions with search queries to allow smooth scroll completion
  useEffect(() => {
    const shouldSuspend = isProgrammaticScrolling || hasQuery;
    if (shouldSuspend) {
      setIsSuspended(true);
      const timer = setTimeout(() => {
        setIsSuspended(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsSuspended(false);
    }
  }, [location.pathname, location.search, isProgrammaticScrolling, hasQuery]);

  const handleScroll = useCallback(() => {
    if (isSuspended) return;
    const currentScrollY = window.scrollY;

    // Always show at the very top of the page
    if (currentScrollY < 50) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      // Scrolling DOWN past the threshold → hide
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling UP (even slightly) → show
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, [isSuspended]);

  useEffect(() => {
    if (isSuspended) {
      setIsVisible(true);
      return;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isSuspended]);

  return isVisible;
}
