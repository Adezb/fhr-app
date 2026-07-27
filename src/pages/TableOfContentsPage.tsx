import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Chapter } from '../types';
import SEO from '../components/common/SEO';
import { useIsLocked } from '../hooks/useLaunchGate';
import AccessRestrictedModal from '../components/launch/AccessRestrictedModal';

export default function TableOfContentsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLocked = useIsLocked();
  const [showLockedModal, setShowLockedModal] = useState(false);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const db = await getDB();
        const allChapters = await db.getAllFromIndex('chapters', 'by-sort-order');
        setChapters(allChapters.filter(c => c.is_published));
      } catch (error) {
        console.error("Failed to load chapters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChapters();
  }, []);

  return (
    <>
      <SEO
        title="Table of Contents"
        description="Complete chapter index of Fundamental Rights Enforcement practice guide in Nigeria."
        url="/book"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      <h1 className="text-3xl font-bold font-serif text-navy dark:text-text-heading-dark mb-8">Table of Contents</h1>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
          ))}
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-midnight-light rounded-lg border border-slate-200 dark:border-slate-800">
          <p className="text-text-muted">No chapters downloaded yet. The book will automatically sync when you are online.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const cardInner = (
              <>
                <h2 className="text-xl font-medium font-serif text-navy dark:text-text-heading-dark group-hover:text-gold dark:group-hover:text-gold-light transition-colors">
                  {chapter.title}
                </h2>
                {chapter.summary && (
                  <p className="mt-2 text-text-body dark:text-text-body-dark line-clamp-2">
                    {chapter.summary}
                  </p>
                )}
              </>
            );

            if (isLocked) {
              return (
                <div
                  key={chapter.id}
                  onClick={() => setShowLockedModal(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                      setShowLockedModal(true);
                    }
                  }}
                  className="block p-5 bg-white dark:bg-midnight-light border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md hover:border-gold-light dark:hover:border-gold transition-all duration-300 group cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  {cardInner}
                </div>
              );
            }

            return (
              <Link 
                key={chapter.id} 
                to={`/book/${chapter.slug}`}
                className="block p-5 bg-white dark:bg-midnight-light border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md hover:border-gold-light dark:hover:border-gold transition-all duration-300 group"
              >
                {cardInner}
              </Link>
            );
          })}
        </div>
      )}

      <AccessRestrictedModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
      />
    </div>
  </>
);
}




