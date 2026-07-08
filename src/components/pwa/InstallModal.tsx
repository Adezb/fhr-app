import { usePWAInstall } from '../../hooks/usePWAInstall';

export default function InstallModal() {
  const { showPrompt, handleInstall, handleDismiss } = usePWAInstall();

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
      <div className="bg-surface dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-[90%] max-w-sm mx-auto p-6 transform transition-all animate-fade-in-up">
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-navy text-gold-light mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold text-navy dark:text-text-heading-dark mb-2">
            Install Offline Guide
          </h3>
          <p className="text-sm text-text-body dark:text-text-body-dark mb-6 leading-relaxed">
            Install the Fundamental Rights Guide to your device for instant, offline courtroom access. No internet required after installation.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleInstall}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="w-full flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-text-body dark:text-text-body-dark bg-white dark:bg-midnight-light hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors"
          >
            Not Now
          </button>
        </div>
        
      </div>
    </div>
  );
}
