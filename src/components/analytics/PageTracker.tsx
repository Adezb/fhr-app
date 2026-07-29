import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../../lib/analytics';

export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Strictly exclude all /admin-cms routes from GA4 pageview telemetry
    if (location.pathname.startsWith('/admin-cms')) {
      return;
    }

    const fullPath = location.pathname + location.search;
    trackPageview(fullPath);
  }, [location]);

  return null;
}
