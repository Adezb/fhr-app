import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Authority } from '../types';

export default function AuthoritiesHubPage() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthorities() {
      try {
        const db = await getDB();
        const allAuths = await db.getAll('authorities');
        
        // Filter and sort by published date descending
        const published = allAuths
          .filter(a => a.is_published)
          .sort((a, b) => {
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
            return dateB - dateA;
          });
          
        setAuthorities(published);
      } catch (error) {
        console.error("Failed to load authorities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAuthorities();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-navy dark:text-text-heading-dark">
          Authorities & Case Law
        </h1>
        <p className="mt-2 text-text-muted dark:text-text-body-dark max-w-3xl">
          Browse judgments, legal principles, and reference materials cited in the Fundamental Rights Enforcement procedure.
        </p>
      </div>

      {authorities.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-midnight-light border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <h3 className="text-lg font-medium text-navy dark:text-text-heading-dark">No Authorities Available</h3>
          <p className="mt-1 text-sm text-text-muted dark:text-text-body-dark">
            Check your connection or wait for the initial sync to complete.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorities.map(auth => (
            <Link 
              key={auth.id} 
              to={`/authorities/${auth.slug}`}
              className="group flex flex-col bg-white dark:bg-midnight-light border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gold-light dark:hover:border-gold transition-all duration-200"
            >
              <h2 className="text-lg md:text-xl font-serif font-bold text-navy dark:text-text-heading-dark group-hover:text-gold dark:group-hover:text-gold-light transition-colors leading-snug">
                {auth.title}
              </h2>
              
              {auth.summary && (
                <p className="mt-3 text-sm md:text-base text-text-body dark:text-text-body-dark line-clamp-3 leading-relaxed flex-1">
                  {auth.summary}
                </p>
              )}
              
              <div className="mt-6 flex items-center justify-between text-xs font-medium text-text-muted uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold dark:text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {auth.published_at 
                    ? new Date(auth.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Published'}
                </span>
                <span className="text-gold dark:text-gold-light group-hover:translate-x-1 transition-transform">
                  Read &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
