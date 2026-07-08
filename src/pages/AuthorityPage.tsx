import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Authority } from '../types';
import ReaderView from '../components/reader/ReaderView';

export default function AuthorityPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [authority, setAuthority] = useState<Authority | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthority() {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const db = await getDB();
        
        // Find authority by slug
        const current = await db.getFromIndex('authorities', 'by-slug', slug);
        
        if (!current) {
          // Fallback to hub if it doesn't exist
          navigate('/authorities');
          return;
        }
        
        setAuthority(current);
        
        // Auto scroll to top when authority loads
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (error) {
        console.error("Failed to load authority:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAuthority();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!authority) return null;

  return (
    <>
      {/* 
        Note: We intentionally omit <ReaderBottomNav> here per architectural specs.
        Authorities are discrete reference documents, not sequential chapters.
        Users navigate out using the Back arrow in the TopNavbar.
      */}
      <ReaderView 
        title={authority.title} 
        contentHtml={authority.content_html} 
      />
    </>
  );
}
