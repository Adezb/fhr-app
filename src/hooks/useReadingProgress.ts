import { useState } from 'react';

export interface ReadingProgress {
  chapterSlug: string;
  chapterTitle: string;
  bookTitle: string;
  scrollPercentage: number;
  lastReadAt: string;
}

const STORAGE_KEY = 'fhr_reading_progress';

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to parse initial reading progress:', e);
      return null;
    }
  });

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
