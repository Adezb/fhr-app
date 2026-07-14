import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Monitor } from 'lucide-react';

export default function AdminMobileGuard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight flex items-center justify-center p-6">
        <div className="bg-white dark:bg-midnight-light max-w-sm w-full rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Monitor size={32} />
          </div>
          <h1 className="text-xl font-bold text-navy dark:text-white font-serif">Mobile Access Disabled</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            The FHR CMS Portal requires a larger workspace for content editing. Please access this dashboard from a Desktop PC or Tablet device.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
