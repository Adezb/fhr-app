import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Smart Auto-Hide Nav Hook
 *
 * Tracks scroll direction and returns whether the navbar should be visible.
 *  - Scrolling DOWN past threshold → hide (isVisible = false)
 *  - Scrolling UP even slightly   → show  (isVisible = true)
 *  - At the very top (scrollY < 50) → always visible
 *
 * Global muting: If `document.body.dataset.isAutoScrolling` is 'true',
 * scroll events are ignored to prevent CSS transitions from aborting
 * programmatic scrollIntoView animations.
 */
export function useAutoHideNav() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    // Global mute guard — ReaderView sets this during programmatic scrolls
    if (document.body.dataset.isAutoScrolling === 'true') return;

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
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isVisible;
}
