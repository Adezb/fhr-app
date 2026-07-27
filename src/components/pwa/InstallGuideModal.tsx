import { useState, useEffect } from 'react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallGuideModal({ isOpen, onClose }: InstallGuideModalProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    
    // Check iOS
    const checkIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
    setIsIOS(checkIOS);

    // Check common in-app WebViews (WhatsApp, Instagram, FB, Telegram, etc.)
    const checkInApp = /WhatsApp|Instagram|FB_IAB|FBAV|Telegram|Line|MicroMessenger|Twitter/i.test(ua);
    setIsInAppBrowser(checkInApp);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 transition-all transform animate-scale-up text-slate-800 dark:text-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Header Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold-light mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="text-xl font-serif font-bold text-navy dark:text-gold-light text-center mb-2">
          Install App to Home Screen
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed mb-6">
          Follow these quick steps to install the FHR Practice Guide for offline access without an app store:
        </p>

        {/* Dynamic Instructions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 mb-6 space-y-3.5">
          {isInAppBrowser ? (
            <>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <p>Tap the <strong>Menu icon</strong> (<span className="font-mono font-bold">⋮</span> or <span className="font-mono font-bold">•••</span>) at the top right of your screen.</p>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <p>Select <strong>"Open in Browser"</strong> (Safari or Chrome).</p>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">3</span>
                <p>Tap the <strong>Share</strong> or <strong>Menu</strong> icon and select <strong>"Add to Home Screen"</strong>.</p>
              </div>
            </>
          ) : isIOS ? (
            <>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <p>Tap the <strong>Share icon</strong> (<span className="inline-block px-1 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">⎋</span> or <span className="inline-block px-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">↑</span>) in Safari's bottom toolbar.</p>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <p>Scroll down the share sheet and select <strong>"Add to Home Screen"</strong>.</p>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">3</span>
                <p>Tap <strong>"Add"</strong> at the top right to complete installation.</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <p>Tap your browser's <strong>Menu icon</strong> (<span className="font-mono font-bold">⋮</span> at top right).</p>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <p>Select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</p>
              </div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl shadow font-bold text-sm text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-navy transition-colors cursor-pointer"
        >
          Got It, Thanks!
        </button>

      </div>
    </div>
  );
}
