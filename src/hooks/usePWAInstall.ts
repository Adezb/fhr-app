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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile natively
      e.preventDefault();
      
      const cooldownData = localStorage.getItem(COOLDOWN_KEY);
      if (cooldownData) {
        const cooldownTime = parseInt(cooldownData, 10);
        const now = new Date().getTime();
        // If we are still within the 72-hour cooldown period, do not show the prompt
        if (now < cooldownTime + COOLDOWN_HOURS * 60 * 60 * 1000) {
          return;
        }
      }

      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleGlobalSuccess = () => {
      setShowPrompt(false);
      setShowSuccessModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    // Listen for the global fallback event dispatched from App.tsx
    window.addEventListener('pwa-success-install', handleGlobalSuccess);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-success-install', handleGlobalSuccess);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native browser install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      if (isMobileOrTabletDevice()) {
        setShowSuccessModal(true);
      }
    } else {
      console.log('User dismissed the PWA install prompt');
      handleDismiss(); // Trigger cooldown if they dismiss via the native prompt
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    const now = new Date().getTime();
    localStorage.setItem(COOLDOWN_KEY, now.toString());
    setShowPrompt(false);
  };

  const handleDismissSuccess = () => {
    setShowSuccessModal(false);
  };

  return { showPrompt, showSuccessModal, handleInstall, handleDismiss, handleDismissSuccess };
}
