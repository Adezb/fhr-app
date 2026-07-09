import { useState, useEffect } from 'react';

export interface ReadingProgress {
  chapterSlug: string;
  chapterTitle: string;
  bookTitle: string;
  scrollPercentage: number;
  lastReadAt: string;
}

const STORAGE_KEY = 'fhr_reading_progress';

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse reading progress:', e);
    }
  }, []);

  const saveProgress = (data: Omit<ReadingProgress, 'lastReadAt'>) => {
    try {
      const fullData: ReadingProgress = {
        ...data,
        lastReadAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
      setProgress(fullData);
    } catch (e) {
      console.error('Failed to save reading progress:', e);
    }
  };

  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProgress(null);
    } catch (e) {
      console.error('Failed to clear reading progress:', e);
    }
  };

  return { progress, saveProgress, clearProgress };
}
