import { useEffect, useSyncExternalStore } from 'react';

export type ReaderFont = 'sans' | 'serif' | 'mono' | 'accessible';
export type ReaderFontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';

export const FONT_SIZES: ReaderFontSize[] = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];

type FontState = {
  font: ReaderFont;
  fontSize: ReaderFontSize;
};

const subscribers = new Set<() => void>();

let state: FontState = {
  font: (localStorage.getItem('app-font') as ReaderFont) || 'sans',
  fontSize: (localStorage.getItem('app-font-size') as ReaderFontSize) || 'text-base',
};

function getState() {
  return state;
}

function setState(newState: Partial<FontState>) {
  state = { ...state, ...newState };
  if (newState.font) localStorage.setItem('app-font', newState.font);
  if (newState.fontSize) localStorage.setItem('app-font-size', newState.fontSize);
  subscribers.forEach((callback) => callback());
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function useFont() {
  const font = useSyncExternalStore(subscribe, () => getState().font);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('font-serif', 'font-sans', 'font-mono', 'font-accessible');
    root.classList.add(`font-${font}`);
  }, [font]);

  return { font, setFont: (f: ReaderFont) => setState({ font: f }) };
}

export function useFontSize() {
  const fontSize = useSyncExternalStore(subscribe, () => getState().fontSize);

  const increaseFontSize = () => {
    const index = FONT_SIZES.indexOf(fontSize);
    if (index < FONT_SIZES.length - 1) {
      setState({ fontSize: FONT_SIZES[index + 1] });
    }
  };

  const decreaseFontSize = () => {
    const index = FONT_SIZES.indexOf(fontSize);
    if (index > 0) {
      setState({ fontSize: FONT_SIZES[index - 1] });
    }
  };

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    canIncrease: FONT_SIZES.indexOf(fontSize) < FONT_SIZES.length - 1,
    canDecrease: FONT_SIZES.indexOf(fontSize) > 0,
  };
}
