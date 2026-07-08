import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Chapter } from '../types';

export default function TableOfContentsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const db = await getDB();
        const allChapters = await db.getAllFromIndex('chapters', 'by-sort-order');
        setChapters(allChapters);
      } catch (error) {
        console.error("Failed to load chapters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChapters();
  }, []);

  return (
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
          {chapters.map((chapter) => (
            <Link 
              key={chapter.id} 
              to={`/book/${chapter.slug}`}
              className="block p-5 bg-white dark:bg-midnight-light border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md hover:border-gold-light dark:hover:border-gold transition-all duration-300 group"
            >
              <h2 className="text-xl font-medium font-serif text-navy dark:text-text-heading-dark group-hover:text-gold dark:group-hover:text-gold-light transition-colors">
                {chapter.title}
              </h2>
              {chapter.summary && (
                <p className="mt-2 text-text-body dark:text-text-body-dark line-clamp-2">
                  {chapter.summary}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
