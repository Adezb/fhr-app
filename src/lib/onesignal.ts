import OneSignal from 'react-onesignal';

let initialized = false;

export async function initOneSignal(): Promise<void> {
  if (initialized) return;
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;

  if (!appId) {
    console.warn('[OneSignal] VITE_ONESIGNAL_APP_ID missing — push notifications disabled.');
    return;
  }

  try {
    await OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: import.meta.env.DEV,
      serviceWorkerParam: { scope: '/' },
      serviceWorkerPath: '/sw.js',
    });
    initialized = true;
  } catch (err) {
    console.error('[OneSignal] Initialization failed:', err);
  }
}

export function showPushPrompt(): void {
  if (!initialized) return;
  try {
    OneSignal.Slidedown.promptPush();
  } catch (e) {
    console.warn('[OneSignal] Failed to trigger push prompt:', e);
  }
}

export function isOneSignalInitialized(): boolean {
  return initialized;
}
