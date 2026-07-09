import { useState, useRef, useEffect } from 'react';
import { useFont, type ReaderFont } from '../../hooks/useFont';

const FONT_OPTIONS: { id: ReaderFont; label: string; className: string }[] = [
  { id: 'sans', label: 'Sans-Serif', className: 'font-sans' },
  { id: 'serif', label: 'Serif', className: 'font-serif' },
  { id: 'mono', label: 'Monospace', className: 'font-mono' },
  { id: 'accessible', label: 'Accessible (Legible)', className: 'font-accessible' },
];

export default function FontToggle() {
  const { font, setFont } = useFont();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside listener to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (selectedFont: ReaderFont) => {
    setFont(selectedFont);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-gold-light transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light text-sm font-medium flex items-center gap-1"
        aria-label="Select Font Style"
        title="Select Font Style"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-sans">Aa</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-md shadow-xl z-50 overflow-hidden"
          role="listbox"
        >
          {FONT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ${option.className} ${
                font === option.id 
                  ? 'bg-navy/5 dark:bg-gold/10 text-navy dark:text-gold-light font-bold' 
                  : 'text-text-body dark:text-text-body-dark hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              role="option"
              aria-selected={font === option.id}
            >
              {option.label}
              {font === option.id && (
                <span className="float-right text-gold-dark dark:text-gold-light">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
