import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';

interface ChapterNavInfo {
  title: string;
  slug: string;
}

interface MobileChapterNavProps {
  currentTitle: string;
  prevChapter: ChapterNavInfo | null;
  nextChapter: ChapterNavInfo | null;
  isScrollSuspended?: boolean;
}

/**
 * MobileChapterNav Component
 * 
 * A floating, pill-shaped navigation bar for mobile screens (hidden on desktop).
 * Positioned exactly above the bottom navigation bar.
 * Auto-hides when scrolling down, and slides back up when scrolling up or at the page top.
 */
export default function MobileChapterNav({
  currentTitle,
  prevChapter,
  nextChapter,
  isScrollSuspended = false,
}: MobileChapterNavProps) {
  const scrollDirection = useScrollDirection(isScrollSuspended);
  const isHidden = scrollDirection === 'down';

  return (
    <div
      aria-hidden={isHidden}
      className={`fixed left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm flex items-center justify-between bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 shadow-2xl rounded-full px-4 py-3 md:hidden transition-all duration-300 ease-in-out bottom-20 ${
        isHidden
          ? 'translate-y-32 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Previous Chapter Button */}
      {prevChapter ? (
        <Link
          to={`/book/${prevChapter.slug}`}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold-light hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label={`Previous Chapter: ${prevChapter.title}`}
          tabIndex={isHidden ? -1 : undefined}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 text-slate-300 dark:text-slate-700 cursor-not-allowed pointer-events-none opacity-30"
          aria-label="No previous chapter"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Current Chapter Title (Truncated) */}
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[200px] text-center px-2">
        {currentTitle}
      </span>

      {/* Next Chapter Button */}
      {nextChapter ? (
        <Link
          to={`/book/${nextChapter.slug}`}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold-light hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label={`Next Chapter: ${nextChapter.title}`}
          tabIndex={isHidden ? -1 : undefined}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 text-slate-300 dark:text-slate-700 cursor-not-allowed pointer-events-none opacity-30"
          aria-label="No next chapter"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
