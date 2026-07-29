import { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import InstallSuccessModal from './InstallSuccessModal';
import { trackEvent } from '../../lib/analytics';

export default function QRInstallInterstitial() {
  const {
    showSuccessModal,
    isStandalone,
    showQRInterstitial,
    deferredPrompt,
    handleInstall,
    handleDismiss,
    handleDismissSuccess,
  } = usePWAInstall();

  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';

    // Check iOS Safari / Webkit
    const checkIOS =
      /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
    setIsIOS(checkIOS);

    // Check common in-app WebViews (WhatsApp, Instagram, Facebook, Telegram, etc.)
    const checkInApp =
      /WhatsApp|Instagram|FB_IAB|FBAV|Telegram|Line|MicroMessenger|Twitter/i.test(ua);
    setIsInAppBrowser(checkInApp);
  }, []);

  useEffect(() => {
    if (!isStandalone && showQRInterstitial) {
      trackEvent('pwa_qr_interstitial_impression');
    }
  }, [isStandalone, showQRInterstitial]);

  if (showSuccessModal) {
    return <InstallSuccessModal onDismiss={handleDismissSuccess} />;
  }

  // Hide if already running as installed standalone PWA, or if QR interstitial is not triggered
  if (isStandalone || !showQRInterstitial) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 transition-all transform animate-scale-up text-slate-800 dark:text-slate-200 relative">
        
        {/* Top Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Header Badge */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider border border-gold/20">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            ⚡ Event Quick Setup
          </div>
        </div>

        {/* Header Icon */}
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-navy text-gold-light mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy dark:text-gold-light text-center mb-2">
          Install FHR Practice Guide
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed mb-5">
          Welcome to the official app launch! Install this guide to your device home screen for instant, 100% offline access to legal texts—no app store required.
        </p>

        {/* Action Content based on Platform */}
        {isInAppBrowser ? (
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 mb-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              ⚠️ In-App Browser Detected
            </p>
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">1</span>
              <p>Tap the <strong>Menu icon</strong> (<span className="font-mono font-bold">⋮</span> or <span className="font-mono font-bold">•••</span>) at top right.</p>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">2</span>
              <p>Select <strong>"Open in Browser"</strong> (Chrome or Safari).</p>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">3</span>
              <p>Tap <strong>"Add to Home Screen"</strong> inside your main browser.</p>
            </div>
          </div>
        ) : isIOS ? (
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 mb-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-navy dark:text-gold-light mb-1">
              📱 Apple iOS Installation
            </p>
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">1</span>
              <p>Tap the <strong>Share icon</strong> (<span className="inline-block px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">⎋</span> or <span className="inline-block px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">↑</span>) in Safari toolbar.</p>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">2</span>
              <p>Scroll down the share menu and select <strong>"Add to Home Screen"</strong>.</p>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">3</span>
              <p>Tap <strong>"Add"</strong> at the top right to complete installation.</p>
            </div>
          </div>
        ) : (
          <div className="mb-5 space-y-3">
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg font-bold text-base text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-navy transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install App Now
              </button>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy dark:text-gold-light mb-1">
                  🤖 Android Installation Steps
                </p>
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">1</span>
                  <p>Tap your browser's <strong>Menu icon</strong> (<span className="font-mono font-bold">⋮</span> at top right).</p>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold shrink-0 mt-0.5">2</span>
                  <p>Select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Secondary Action */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleDismiss}
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-2 cursor-pointer border-none bg-transparent"
          >
            Continue reading in browser &rarr;
          </button>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center border-t border-slate-200 dark:border-slate-800 pt-3">
          Official Book App Launch • Powered by <a href="https://www.cektopventures.com/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">CEK TOP VENTURES LTD</a>
        </div>

      </div>
    </div>
  );
}
