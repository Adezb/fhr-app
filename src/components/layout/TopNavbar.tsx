import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom';
import ThemeToggle from '../reader/ThemeToggle';
import FontToggle from '../reader/FontToggle';
import { useAutoHideNav } from '../../hooks/useAutoHideNav';

interface TopNavbarProps {
  onSearchClick: () => void;
}

/**
 * Contextual Top Navbar (Smart Auto-Hide)
 *
 * Mobile behaviour:
 *   - Home route:    App title displayed in the left area
 *   - Reader routes: Back arrow + truncated document title
 *   - Primary routing handled by BottomNav (not this component)
 *
 * Desktop (md+) behaviour:
 *   - Always solid navy bg
 *   - Nav links (Home, Book, Authorities) inline in the bar (BottomNav hidden)
 *   - Font + Theme toggles always visible on the right
 */
export default function TopNavbar({ onSearchClick }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isNavVisible = useAutoHideNav();

  const isReader =
    location.pathname.startsWith('/book/') ||
    location.pathname.startsWith('/authorities/');

  // Extract a friendly title for reader routes from the URL slug
  const slugTitle = location.pathname
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? '';

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-navy text-white shadow-md transform transition-transform duration-300 ease-in-out ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── LEFT SIDE ── */}
          <div className="flex items-center gap-3">
            {/* Mobile: back arrow on reader routes */}
            {isReader && (
              <button
                onClick={() => navigate(-1)}
                className="md:hidden text-white hover:text-gold-light transition-colors p-1 -ml-1 focus:outline-none focus:ring-2 focus:ring-gold-light rounded-md"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}


            {/* Desktop: Brand link — always visible */}
            <Link
              to="/"
              className="hidden md:block font-serif font-bold text-lg tracking-tight text-white hover:text-gold-light transition-colors"
            >
              Fundamental Rights Guide
            </Link>

            {/* Mobile: on reader show truncated title, on home show greeting */}
            <span className="md:hidden font-medium text-white truncate max-w-[180px] sm:max-w-xs">
              {isReader ? slugTitle : 'Fundamental Rights Guide'}
            </span>
          </div>

          {/* ── CENTRE (Desktop only): Nav links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/book', label: 'Book' },
              { to: '/authorities', label: 'Authorities' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/10 text-gold-light'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── RIGHT SIDE: Controls ── */}
          <div className="flex items-center gap-1">
            {/* Search icon — opens the SearchOverlay */}
            <button
              onClick={onSearchClick}
              className="text-white hover:text-gold-light transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Font toggle: always visible */}
            <FontToggle />

            {/* Theme toggle: always visible */}
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}
