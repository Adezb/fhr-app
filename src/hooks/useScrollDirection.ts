import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track scroll direction (up or down).
 * Includes a 10px threshold to prevent jitter from small/accidental movements.
 * Near the very top of the page, the direction is forced to 'up' to keep UI visible.
 *
 * Global muting: If `document.body.dataset.isAutoScrolling` is 'true',
 * scroll events are ignored to prevent CSS transitions from aborting
 * programmatic scrollIntoView animations.
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const threshold = 10;

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      // Global mute guard — ReaderView sets this during programmatic scrolls
      if (document.body.dataset.isAutoScrolling === 'true') return;

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
