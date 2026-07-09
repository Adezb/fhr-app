import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Authority } from '../types';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { LEGAL_MAXIMS } from '../lib/maxims';

// 1. Dynamic Greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Welcome back';
}

export default function HomePage() {
  const greeting = useMemo(() => getGreeting(), []);
  const { progress } = useReadingProgress();
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Daily Maxim Rotation (deterministic by day of year)
  const maxim = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return LEGAL_MAXIMS[dayOfYear % LEGAL_MAXIMS.length];
  }, []);

  // 3. Recent Authorities Query
  useEffect(() => {
    async function loadRecentAuthorities() {
      try {
        const db = await getDB();
        const allAuths = await db.getAllFromIndex('authorities', 'by-published-date');
        
        const recent = allAuths
          .filter(a => a.is_published)
          .reverse()
          .slice(0, 3);
          
        setAuthorities(recent);
      } catch (error) {
        console.error("Failed to load authorities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadRecentAuthorities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Greeting (Full Width) */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy dark:text-text-heading-dark">
          {greeting}
        </h1>
        <p className="mt-1 text-text-muted">Your Fundamental Rights Guide dashboard</p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Continue Reading Card */}
        <Link 
          to={progress ? `/book/${progress.chapterSlug}` : "/book"}
          className="md:row-span-3 flex flex-col justify-between bg-navy dark:bg-midnight-light rounded-xl p-6 shadow-lg border border-white/10 group hover:shadow-xl transition-all duration-300"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-gold font-semibold flex items-center gap-2">
              <span>📖</span> {progress ? 'CONTINUE READING' : 'START READING'}
            </div>
            
            <h2 className="text-lg font-serif font-bold text-white mt-4 group-hover:text-gold-light transition-colors">
              {progress ? progress.bookTitle : 'Fundamental Rights Enforcement'}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {progress ? progress.chapterTitle : 'Begin with the Front Matter'}
            </p>
            
            {progress && (
              <div className="mt-6">
                <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gold h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress.scrollPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1.5 text-right">
                  {Math.round(progress.scrollPercentage)}%
                </div>
              </div>
            )}
          </div>
          
          <div className="text-gold font-medium text-sm mt-6 flex items-center gap-1 group-hover:text-gold-light transition-colors group-hover:translate-x-1 duration-200 w-fit">
            {progress ? 'Resume' : 'Start Reading'} &rarr;
          </div>
        </Link>

        {/* Recent Authorities Header */}
        <div className="md:col-start-2 flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-2 md:mt-0 mt-4">
          <h2 className="text-xl font-serif font-bold text-navy dark:text-text-heading-dark">
            Recent Authorities
          </h2>
          <Link 
            to="/authorities"
            className="text-sm font-medium text-gold hover:text-gold-light transition-colors flex items-center gap-1 hover:translate-x-0.5 duration-200"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Recent Authorities Feed */}
        {isLoading ? (
          <div className="md:col-start-2 space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
             ))}
          </div>
        ) : authorities.length === 0 ? (
          <div className="md:col-start-2 text-center py-8 text-sm text-text-muted bg-white dark:bg-midnight-light rounded-xl border border-slate-200 dark:border-slate-800">
            No authorities downloaded yet. They'll appear here automatically after your first sync.
          </div>
        ) : (
          authorities.map((auth, index) => {
            const year = auth.published_at ? new Date(auth.published_at).getFullYear() : '';
            return (
              <Link
                key={auth.id}
                to={`/authorities/${auth.slug}`}
                className="md:col-start-2 group relative bg-white dark:bg-midnight-light border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gold-light dark:hover:border-gold transition-all duration-200 flex flex-col"
              >
                {index === 0 && (
                  <span className="absolute -top-2.5 -right-2.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-action-red text-white shadow-sm">
                    NEW
                  </span>
                )}
                <h3 className="text-base font-serif font-semibold text-navy dark:text-text-heading-dark group-hover:text-gold dark:group-hover:text-gold-light transition-colors leading-snug pr-4">
                  {auth.title} {year && `(${year})`}
                </h3>
                {auth.summary && (
                  <p className="text-sm text-text-body dark:text-text-body-dark line-clamp-2 mt-2 flex-1">
                    {auth.summary}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-text-muted uppercase tracking-wider font-medium">
                  <span>
                    {auth.published_at 
                      ? new Date(auth.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Published'}
                  </span>
                  <span className="text-gold dark:text-gold-light group-hover:translate-x-1 transition-transform">
                    Read &rarr;
                  </span>
                </div>
              </Link>
            )
          })
        )}

        {/* Daily Maxim Card (Strategic Space Reservation) */}
        <div className="md:col-span-full min-h-[100px] bg-surface-alt dark:bg-midnight-light rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-center mt-2">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold flex items-center gap-1.5">
            <span>⚖️</span> DAILY LEGAL MAXIM
          </div>
          <q className="text-base font-serif italic text-navy dark:text-text-heading-dark mt-2 block">
            {maxim.latin}
          </q>
          <p className="text-sm text-text-body dark:text-text-body-dark mt-1">
            {maxim.english}
          </p>
        </div>

      </div>
    </div>
  );
}
