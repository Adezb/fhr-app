import { useState, useEffect } from 'react';

export type ReaderFont = 'serif' | 'sans';

export function useFont() {
  const [font, setFont] = useState<ReaderFont>(() => {
    // Default to 'serif' as per UI/UX specs for the reader interface
    return (localStorage.getItem('reader-font') as ReaderFont) || 'serif';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('reader-serif', 'reader-sans');
    root.classList.add(`reader-${font}`);
    localStorage.setItem('reader-font', font);
  }, [font]);

  return { font, setFont };
}
