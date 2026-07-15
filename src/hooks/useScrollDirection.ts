import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track scroll direction (up or down).
 * Includes a 10px threshold to prevent jitter from small/accidental movements.
 * Near the very top of the page, the direction is forced to 'up' to keep UI visible.
 * Suspends scroll tracking for 1500ms during search highlights to prevent compositor aborts.
 */
export function useScrollDirection(isProgrammaticScrolling = false) {
  const location = useLocation();
  const hasQuery = location.search.includes('q=');
  const [isSuspended, setIsSuspended] = useState(isProgrammaticScrolling || hasQuery);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
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

  useEffect(() => {
    if (isSuspended) {
      setScrollDirection('up');
      return;
    }
    const threshold = 10;
    
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always force 'up' at the very top of the page to ensure navbar is visible
      if (currentScrollY <= threshold) {
        setScrollDirection('up');
        lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
        return;
      }

      // Check if the scroll difference exceeds our threshold to prevent jitter
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
      if (scrollDiff < threshold) {
        return;
      }

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSuspended]);

  return scrollDirection;
}
