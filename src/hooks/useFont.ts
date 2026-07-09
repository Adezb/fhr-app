import { useState, useEffect } from 'react';

export type ReaderFont = 'sans' | 'serif' | 'mono' | 'accessible';

export function useFont() {
  const [font, setFont] = useState<ReaderFont>(() => {
    // Default to 'sans' as a sensible baseline now that we apply globally
    return (localStorage.getItem('app-font') as ReaderFont) || 'sans';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('font-serif', 'font-sans', 'font-mono', 'font-accessible');
    root.classList.add(`font-${font}`);
    localStorage.setItem('app-font', font);
  }, [font]);

  return { font, setFont };
}
