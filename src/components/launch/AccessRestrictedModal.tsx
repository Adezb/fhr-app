import { useNavigate } from 'react-router-dom';

interface AccessRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessRestrictedModal({ isOpen, onClose }: AccessRestrictedModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLaunch = () => {
    onClose();
    navigate('/launch');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
      <div className="bg-surface dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-[90%] max-w-sm mx-auto p-6 transform transition-all animate-fade-in-up">

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-navy text-gold-light mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold text-navy dark:text-text-heading-dark mb-2">
            Access Restricted
          </h3>
          <p className="text-sm text-text-body dark:text-text-body-dark leading-relaxed mb-6">
            The full text of the Fundamental Rights Practice Guide and Legal Authorities will be unlocked during the lecture presentation at <strong>NBA Ikorodu Branch meeting on Monday, August 3rd, 2026 at 3:00 PM WAT</strong> being its official launch date.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToLaunch}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-navy bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors cursor-pointer"
          >
            Go to Launch Page
          </button>

          <button
            onClick={onClose}
            className="text-sm text-text-muted hover:underline mt-2 cursor-pointer w-full text-center bg-transparent border-none outline-none"
          >
            Dismiss
          </button>
        </div>

        <div className="text-xs text-text-muted mt-6 text-center">
          Powered by <a href="https://www.cektopventures.com/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">CEK TOP VENTURES LTD</a>
        </div>

      </div>
    </div>
  );
}
