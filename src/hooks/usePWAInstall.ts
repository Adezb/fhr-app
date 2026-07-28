import { useState, useEffect } from 'react';
import { isMobileOrTabletDevice } from '../utils/device';

// Define the BeforeInstallPromptEvent interface as it's not standard in TypeScript DOM lib yet
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

const COOLDOWN_KEY = 'pwa-install-cooldown';
const COOLDOWN_HOURS = 72;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isQRSource, setIsQRSource] = useState(false);
  const [showQRInterstitial, setShowQRInterstitial] = useState(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for ?source=qr in search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const isFromQR = urlParams.get('source') === 'qr';

    if (isFromQR) {
      setIsQRSource(true);
      setShowQRInterstitial(true);

      // Seamlessly strip query parameters from address bar to keep navigation trails clean
      urlParams.delete('source');
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile natively
      e.preventDefault();
      
      const evt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(evt);

      // If user arrived via QR code, skip cooldown entirely (0 min cooldown for QR visits)
      if (isFromQR) {
        setShowPrompt(true);
        return;
      }

      const cooldownData = localStorage.getItem(COOLDOWN_KEY);
      if (cooldownData) {
        const cooldownTime = parseInt(cooldownData, 10);
        const now = new Date().getTime();
        // If we are still within the 72-hour cooldown period, do not show prompt
        if (now < cooldownTime + COOLDOWN_HOURS * 60 * 60 * 1000) {
          return;
        }
      }

      setShowPrompt(true);
    };

    const handleGlobalSuccess = () => {
      setShowPrompt(false);
      setShowQRInterstitial(false);
      setShowSuccessModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    // Listen for the global fallback event dispatched from App.tsx
    window.addEventListener('pwa-success-install', handleGlobalSuccess);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-success-install', handleGlobalSuccess);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show native browser install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      if (isMobileOrTabletDevice()) {
        setShowSuccessModal(true);
      }
    } else {
      console.log('User dismissed the PWA install prompt');
      handleDismiss();
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
    setShowQRInterstitial(false);
  };

  const handleDismiss = () => {
    // Only apply 72h cooldown if user did NOT arrive via QR code scan (QR scan has 0 min cooldown)
    if (!isQRSource) {
      const now = new Date().getTime();
      localStorage.setItem(COOLDOWN_KEY, now.toString());
    }
    setShowPrompt(false);
    setShowQRInterstitial(false);
  };

  const handleDismissSuccess = () => {
    setShowSuccessModal(false);
  };

  return {
    showPrompt,
    showSuccessModal,
    isStandalone,
    isQRSource,
    showQRInterstitial,
    deferredPrompt,
    handleInstall,
    handleDismiss,
    handleDismissSuccess,
  };
}
