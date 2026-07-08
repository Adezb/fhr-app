import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Chapter } from '../types';
import ReaderView from '../components/reader/ReaderView';
import ReaderBottomNav from '../components/reader/ReaderBottomNav';

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadChapter() {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const db = await getDB();
        
        // Find current chapter
        const current = await db.getFromIndex('chapters', 'by-slug', slug);
        if (!current) {
          // Fallback to TOC if chapter doesn't exist
          navigate('/book');
          return;
        }
        setChapter(current);

        // Fetch all chapters to determine prev/next efficiently
        // Since a book has <100 chapters, this is very fast client-side
        const allChapters = await db.getAllFromIndex('chapters', 'by-sort-order');
        const currentIndex = allChapters.findIndex(c => c.id === current.id);
        
        if (currentIndex > 0) {
          setPrevChapter(allChapters[currentIndex - 1]);
        } else {
          setPrevChapter(null);
        }
        
        if (currentIndex < allChapters.length - 1) {
          setNextChapter(allChapters[currentIndex + 1]);
        } else {
          setNextChapter(null);
        }
        
        // Auto scroll to top when chapter changes
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (error) {
        console.error("Failed to load chapter:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadChapter();
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

  if (!chapter) return null;

  return (
    <>
      <ReaderView 
        title={chapter.title} 
        contentHtml={chapter.content_html} 
      />
      <ReaderBottomNav 
        prevSlug={prevChapter?.slug || null}
        prevTitle={prevChapter?.title || null}
        nextSlug={nextChapter?.slug || null}
        nextTitle={nextChapter?.title || null}
      />
    </>
  );
}
