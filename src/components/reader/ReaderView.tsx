import { useEffect, useRef, useState } from 'react';
import { useFontSize } from '../../hooks/useFont';

const proseSizeMap: Record<string, string> = {
  'text-sm': 'prose-sm',
  'text-base': 'prose-base',
  'text-lg': 'prose-lg',
  'text-xl': 'prose-xl',
  'text-2xl': 'prose-2xl',
};

interface ReaderViewProps {
  title: string;
  contentHtml: string;
  searchQuery?: string;
  searchKey?: string;
}

/**
 * Clears the global auto-scroll muting flag on `document.body`.
 * Called when the smooth scroll has physically finished.
 */
function clearAutoScrollFlag() {
  delete document.body.dataset.isAutoScrolling;
}

export default function ReaderView({ title, contentHtml, searchQuery, searchKey }: ReaderViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { fontSize } = useFontSize();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Search highlight + auto-scroll effect
  // Architecture: ResizeObserver (paint signal) → dataset muting → scrollIntoView → scrollend (completion signal)
  useEffect(() => {
    if (!searchQuery || !contentRef.current) return;

    const lowerQuery = searchQuery.toLowerCase();
    let observer: ResizeObserver | null = null;
    let scrollEndCleanup: (() => void) | null = null;

    // Use a ResizeObserver on the content div to detect when the browser has
    // finished laying out the full chapter HTML. The observer callback fires
    // after layout and before paint — a reliable signal that the DOM is stable.
    observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !contentRef.current) return;

      // Wait for the content to have meaningful height (i.e., it has been laid out)
      if (entry.contentRect.height < 100) return;

      // Layout is stable — disconnect immediately (one-shot)
      observer?.disconnect();
      observer = null;

      // Walk the DOM to find and highlight the search match
      const treeWalker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (node.nodeValue?.toLowerCase().includes(lowerQuery)) {
              // Ignore text nodes already inside a mark (to prevent nested highlights)
              if (node.parentElement?.tagName === 'MARK') return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        }
      );

      const firstNode = treeWalker.nextNode() as Text;
      if (!firstNode) return;

      // Found a text node containing the exact query. Split it safely.
      const matchIndex = firstNode.nodeValue!.toLowerCase().indexOf(lowerQuery);
      const matchNode = firstNode.splitText(matchIndex);
      matchNode.splitText(searchQuery.length);

      // Wrap the matched text in a <mark> element
      const mark = document.createElement('mark');
      mark.id = 'transient-match';
      mark.className = 'bg-gold-light text-navy transition-colors duration-1000 ease-in-out rounded-sm';
      // CSS scroll margins ensure scrollIntoView accounts for fixed navbar heights
      mark.style.scrollMarginTop = '150px';
      mark.style.scrollMarginBottom = '150px';

      matchNode.parentNode?.insertBefore(mark, matchNode);
      mark.appendChild(matchNode);

      // Sanity check: confirm the mark has a valid layout position
      const rect = mark.getBoundingClientRect();
      if (rect.top === 0 && rect.height === 0) return;

      // ── Global Mute ──
      // Set the muting flag BEFORE scrolling. All useScrollDirection and
      // useAutoHideNav instances will ignore scroll events while this is set.
      document.body.dataset.isAutoScrolling = 'true';

      // ── Scroll ──
      mark.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // ── Scroll Completion Detection ──
      // Use the native `scrollend` event (Chrome 114+, Firefox 109+, Safari 17.4+)
      // with a scroll-idle fallback for older browsers.
      let idleTimer: ReturnType<typeof setTimeout> | null = null;

      const onScrollEnd = () => {
        // Clean up both listeners
        window.removeEventListener('scrollend', onScrollEnd);
        window.removeEventListener('scroll', onScrollIdle);
        if (idleTimer) clearTimeout(idleTimer);
        clearAutoScrollFlag();
      };

      const onScrollIdle = () => {
        // Reset the idle timer on each scroll tick — when scrolling stops
        // for 200ms, we consider the scroll animation complete.
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(onScrollEnd, 200);
      };

      // Register both — whichever fires first wins
      window.addEventListener('scrollend', onScrollEnd, { once: true });
      window.addEventListener('scroll', onScrollIdle, { passive: true });

      // Safety net: if the element is already in view (no scroll needed),
      // scrollend may never fire. Clear the flag after 2 seconds maximum.
      const safetyTimer = setTimeout(() => {
        clearAutoScrollFlag();
        window.removeEventListener('scrollend', onScrollEnd);
        window.removeEventListener('scroll', onScrollIdle);
        if (idleTimer) clearTimeout(idleTimer);
      }, 2000);

      scrollEndCleanup = () => {
        clearAutoScrollFlag();
        window.removeEventListener('scrollend', onScrollEnd);
        window.removeEventListener('scroll', onScrollIdle);
        if (idleTimer) clearTimeout(idleTimer);
        clearTimeout(safetyTimer);
      };

      // 2500ms fade-out effect by stripping the active highlight colors
      fadeTimerRef.current = setTimeout(() => {
        mark.classList.remove('bg-gold-light', 'text-navy');
        mark.classList.add('bg-transparent', 'text-inherit');
      }, 2500);
    });

    // Start observing the content div
    observer.observe(contentRef.current);

    return () => {
      // Disconnect the ResizeObserver if it hasn't fired yet
      observer?.disconnect();

      // Clean up scroll listeners if the component unmounts mid-scroll
      scrollEndCleanup?.();

      // Restore the DOM to its original state
      const existingHighlight = contentRef.current?.querySelector('#transient-match');
      if (existingHighlight) {
        const parent = existingHighlight.parentNode;
        while (existingHighlight.firstChild) {
          parent?.insertBefore(existingHighlight.firstChild, existingHighlight);
        }
        parent?.removeChild(existingHighlight);
        parent?.normalize(); // Merges split TextNodes back together
      }
    };
  }, [searchQuery, searchKey, contentHtml]);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 pb-24">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-navy dark:text-text-heading-dark leading-tight break-words ${isMounted ? 'transition-colors duration-300 ease-in-out' : ''}`}>
          {title}
        </h1>
      </header>

      {/* 
        Tailwind Typography (`prose`) automatically styles raw HTML (headings, paragraphs, lists, etc.).
        We use `dark:prose-invert` for dark mode compatibility and explicitly theme links and blockquotes.
        Note: transition-colors is applied only to the container div itself (for dark mode toggle),
        NOT to all descendants via [&_*] — that wildcard caused layout thrash during mark insertion.
      */}
      <div
        ref={contentRef}
        className={`prose ${proseSizeMap[fontSize]} dark:prose-invert max-w-none prose-headings:text-navy dark:prose-headings:text-text-heading-dark prose-headings:break-words prose-a:text-gold dark:prose-a:text-gold-light hover:prose-a:text-gold-dark prose-blockquote:border-l-gold ${isMounted ? 'transition-colors duration-300 ease-in-out' : ''}`}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
