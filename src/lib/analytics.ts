import ReactGA from 'react-ga4';

let initialized = false;

export function initGA(): void {
  if (initialized) return;
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('[Analytics] VITE_GA4_MEASUREMENT_ID missing — GA4 tracking disabled.');
    return;
  }

  ReactGA.initialize(measurementId, {
    gtagOptions: {
      send_page_view: false,
    },
  });
  initialized = true;
}

export function isGAInitialized(): boolean {
  return initialized;
}

export function trackPageview(path: string): void {
  if (!initialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!initialized) return;
  ReactGA.event(action, params);
}
