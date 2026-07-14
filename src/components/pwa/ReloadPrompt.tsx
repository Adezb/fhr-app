import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registered: ' + r);
    },
    onRegisterError(error) {
      console.error('SW registration error: ' + error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-4 right-4 z-[100] max-w-md p-4 bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      role="alert"
    >
      <div className="flex-1 text-sm font-medium text-navy dark:text-text-heading-dark">
        New content available, click to update.
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-2 bg-gold hover:bg-gold-light text-navy font-bold rounded-lg transition-colors text-sm shadow-sm cursor-pointer"
        >
          Reload
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
