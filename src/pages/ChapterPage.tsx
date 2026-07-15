import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getDB } from '../lib/db';
import type { Chapter } from '../types';
import ReaderView from '../components/reader/ReaderView';
import ReaderBottomNav from '../components/reader/ReaderBottomNav';
import MobileChapterNav from '../components/book/MobileChapterNav';
import { useReadingProgress } from '../hooks/useReadingProgress';

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const highlightQuery = searchParams.get('q') || undefined;
  
  const { saveProgress } = useReadingProgress();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRestoringScroll = useRef(false);

  useEffect(() => {
    async function loadChapter() {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const db = await getDB();
        
        // Find current chapter
        const current = await db.getFromIndex('chapters', 'by-slug', slug);
        if (!current || !current.is_published) {
          // Fallback to TOC if chapter doesn't exist or is not published
          navigate('/book');
          return;
        }
        setChapter(current);

        // Fetch all chapters to determine prev/next efficiently
        // Since a book has <100 chapters, this is very fast client-side
        const allChapters = (await db.getAllFromIndex('chapters', 'by-sort-order')).filter(c => c.is_published);
        const currentIndex = allChapters.findIndex(c => c.id === current.id);
        
        if (currentIndex > 0) {
          setPrevChapter(allChapters[currentIndex - 1]);
        } else {
          setPrevChapter(null);
        }
        
        if (currentIndex > -1 && currentIndex < allChapters.length - 1) {
          setNextChapter(allChapters[currentIndex + 1]);
        } else {
          setNextChapter(null);
        }
        
        // Auto scroll to top when chapter changes, unless we are highlighting a search result
        if (!searchParams.get('q')) {
          const savedProgressStr = localStorage.getItem('fhr_reading_progress');
          let shouldRestore = false;
          
          if (savedProgressStr) {
            try {
              const parsed = JSON.parse(savedProgressStr);
              if (parsed.chapterSlug === slug && parsed.scrollPercentage > 0) {
                shouldRestore = true;
                isRestoringScroll.current = true;
                
                // Wait for React to paint the dangerouslySetInnerHTML
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    const docHeight = document.documentElement.scrollHeight;
                    const windowHeight = window.innerHeight;
                    const targetY = (parsed.scrollPercentage / 100) * (docHeight - windowHeight);
                    
                    window.scrollTo({ top: targetY, behavior: 'instant' });
                    
                    // Release lock after a brief delay to let scroll events settle
                    setTimeout(() => {
                      isRestoringScroll.current = false;
                    }, 100);
                  });
                });
              }
            } catch (e) {
              // ignore parse errors
            }
          }
          
          if (!shouldRestore) {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }
      } catch (error) {
        console.error("Failed to load chapter:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadChapter();
  }, [slug, navigate]);

  // Track reading progress
  useEffect(() => {
    if (!chapter || !slug) return;

    let timeoutId: number;

    const handleScroll = () => {
      if (isRestoringScroll.current) return;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        const totalScrollableDistance = docHeight - windowHeight;
        let percentage = 0;
        
        if (totalScrollableDistance > 0) {
          percentage = (scrollPosition / totalScrollableDistance) * 100;
          percentage = Math.min(100, Math.max(0, percentage));
        } else {
          percentage = 100;
        }
        
        saveProgress({
          chapterSlug: slug,
          chapterTitle: chapter.title,
          bookTitle: 'Fundamental Rights Enforcement',
          scrollPercentage: percentage,
        });
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial save on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [chapter, slug]);

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
        searchQuery={highlightQuery}
        searchKey={location.key}
      />
      <MobileChapterNav
        currentTitle={chapter.title}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
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
