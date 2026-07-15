import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track scroll direction (up or down).
 * Includes a 10px threshold to prevent jitter from small/accidental movements.
 * Near the very top of the page, the direction is forced to 'up' to keep UI visible.
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const threshold = 10;
    
    // Set initial scroll Y on mount to avoid large jumps if page is refreshed at scroll position
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
  }, []);

  return scrollDirection;
}
