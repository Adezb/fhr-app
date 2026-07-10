

interface InstallSuccessModalProps {
  onDismiss: () => void;
}

export default function InstallSuccessModal({ onDismiss }: InstallSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
      <div className="bg-surface dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-[90%] max-w-sm mx-auto p-6 transform transition-all animate-fade-in-up">
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-navy text-green-400 mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold text-navy dark:text-text-heading-dark mb-2">
            🎉 Installation Complete!
          </h3>
          <p className="text-sm text-text-body dark:text-text-body-dark mb-6 leading-relaxed">
            The FHR Guide has been successfully added to your device. Please close this browser tab and open the app directly from your home screen for the full offline experience.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onDismiss}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors"
          >
            Got it
          </button>
        </div>
        
      </div>
    </div>
  );
}
