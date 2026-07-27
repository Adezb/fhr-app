import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import SEO from '../components/common/SEO';
import { useLaunchGate } from '../hooks/useLaunchGate';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function LaunchPage() {
  const { isLocked, timeRemaining } = useLaunchGate();
  const { showPrompt, handleInstall } = usePWAInstall();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    setIsIOS(checkIOS);
  }, []);

  return (
    <>
      <SEO
        title="Official App Launch & PWA Download"
        description="Official book app launch for Fundamental Rights Practice Guide by CEK TOP VENTURES LTD. Launching Monday, August 3rd, 2026. On-the-go offline access to Chapter IV of the 1999 Constitution, FREP Rules 2009, and the African Charter."
        image="/fhr-full-cover.png"
        url="/launch"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Top Header */}
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-8">
          <Link to="/" className="font-serif font-bold text-lg tracking-tight text-navy dark:text-gold-light hover:opacity-90 transition-opacity flex items-center gap-2">
            <span>⚖️</span> Fundamental Rights Practice Guide
          </Link>
          <Link
            to="/"
            className="text-xs sm:text-sm font-medium text-gold hover:text-gold-light transition-colors flex items-center gap-1"
          >
            Explore Home &rarr;
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center items-center">

          {/* Conference Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/10 dark:bg-gold/10 border border-navy/20 dark:border-gold/30 text-navy dark:text-gold-light text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            Official Book App Launch
          </div>

          {/* Hero Section */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-navy dark:text-text-heading-dark leading-tight mb-4">
              Fundamental Rights Practice Guide
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              A digital companion app for all. To be launched on Monday, August 3rd, 2026 at 3:00 PM WAT. On-the-go offline access to Chapter IV of the 1999 Constitution, FREP Rules 2009, and the African Charter.
            </p>
          </div>

          {/* Cover Art Preview */}
          <div className="relative group w-full max-w-[200px] sm:max-w-[240px] mb-10 flex justify-center">
            <div className="relative w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(2deg)_rotateY(-4deg)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)]">
              <img
                src="/fhr-full-cover.png"
                alt="Fundamental Rights Practice Guide Cover"
                className="w-full h-auto rounded shadow-2xl shadow-slate-900/20 dark:shadow-black/70 dark:ring-1 dark:ring-white/10 object-cover"
              />
              <div className="absolute inset-y-0 left-1/2 w-12 -ml-6 bg-gradient-to-r from-transparent via-black/30 dark:via-black/60 to-transparent pointer-events-none mix-blend-multiply" />
            </div>
          </div>

          {/* Countdown / Status Section */}
          {isLocked ? (
            <div className="w-full max-w-xl mb-12">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-4">
                Official Launch Countdown
              </h2>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                {[
                  { label: 'Days', value: timeRemaining?.days ?? 0 },
                  { label: 'Hours', value: timeRemaining?.hours ?? 0 },
                  { label: 'Minutes', value: timeRemaining?.minutes ?? 0 },
                  { label: 'Seconds', value: timeRemaining?.seconds ?? 0 },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-md flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl sm:text-4xl font-serif font-bold text-navy dark:text-gold-light tracking-tight">
                      {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3 font-medium">
                Launching Monday, August 3rd, 2026 at 3:00 PM WAT
              </p>
            </div>
          ) : (
            <div className="w-full max-w-md bg-navy text-white rounded-xl p-6 shadow-xl border border-gold/30 text-center mb-10">
              <span className="text-3xl mb-2 block">🎉</span>
              <h2 className="text-2xl font-serif font-bold text-gold-light mb-2">
                We're Officially Live!
              </h2>
              <p className="text-sm text-slate-200 mb-6">
                The full text of the Fundamental Rights Practice Guide and Legal Authorities is now completely unlocked.
              </p>
              <Link
                to="/"
                className="inline-flex justify-center items-center py-3 px-6 rounded-md shadow-md text-base font-bold text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors w-full"
              >
                Enter App &rarr;
              </Link>
            </div>
          )}

          {/* Install & QR Code Integration Section */}
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">

            {/* Left: App Install Actions */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-serif font-bold text-navy dark:text-text-heading-dark mb-2">
                Get the App on Your Device
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Install as a Progressive Web App (PWA) for 100% offline access—no app store download required.
              </p>

              {isIOS ? (
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  To install on iOS Safari: Tap <strong>Share</strong> and select <strong>"Add to Home Screen"</strong>.
                </div>
              ) : showPrompt ? (
                <button
                  onClick={handleInstall}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-md shadow-md text-sm font-bold text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Install App Now
                </button>
              ) : (
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-md shadow text-sm font-bold text-navy bg-gold hover:bg-gold-light transition-colors"
                >
                  Open App in Browser &rarr;
                </Link>
              )}
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center shrink-0">
              <div className="bg-white p-3 rounded-xl shadow-md border border-slate-200">
                <QRCode
                  value="https://fhrnigeria.app"
                  size={140}
                  bgColor="#FFFFFF"
                  fgColor="#1A2B4C"
                  level="L"
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 text-center max-w-[160px]">
                Scan with phone camera to open on mobile
              </span>
            </div>

          </div>

        </main>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto w-full border-t border-slate-200 dark:border-slate-800/80 pt-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
          Powered by{' '}
          <a
            href="https://www.cektopventures.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-light transition-colors font-medium"
          >
            CEK TOP VENTURES LTD
          </a>
        </footer>
      </div>
    </>
  );
}

