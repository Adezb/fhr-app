import { Link } from 'react-router-dom';
import { useAutoHideNav } from '../../hooks/useAutoHideNav';

interface NavProps {
  prevSlug: string | null;
  prevTitle: string | null;
  nextSlug: string | null;
  nextTitle: string | null;
  isScrollSuspended?: boolean;
}

export default function ReaderBottomNav({
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
  isScrollSuspended = false,
}: NavProps) {
  const isVisible = useAutoHideNav(isScrollSuspended);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-surface dark:bg-midnight border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 z-40 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center h-16">
        {prevSlug ? (
          <Link 
            to={`/book/${prevSlug}`}
            className="flex flex-col items-start text-navy dark:text-text-heading-dark hover:text-gold dark:hover:text-gold-light transition-colors max-w-[45%] truncate"
          >
            <span className="text-xs uppercase font-bold text-text-muted">Previous</span>
            <span className="font-medium truncate w-full">{prevTitle}</span>
          </Link>
        ) : <div />}

        {nextSlug ? (
          <Link 
            to={`/book/${nextSlug}`}
            className="flex flex-col items-end text-navy dark:text-text-heading-dark hover:text-gold dark:hover:text-gold-light transition-colors max-w-[45%] text-right truncate"
          >
            <span className="text-xs uppercase font-bold text-text-muted">Next</span>
            <span className="font-medium truncate w-full">{nextTitle}</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
