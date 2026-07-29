import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { initGA } from './lib/analytics'
import { initOneSignal } from './lib/onesignal'

// Initialize GA4 analytics and OneSignal push engines before app mounts
initGA();
initOneSignal();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)


