import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, BookOpen, FileText, LogOut } from 'lucide-react';
import ThemeToggle from '../reader/ThemeToggle';
import { isSuperAdminRole } from '../../lib/config';

export default function AdminShell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (email?: string) => {
    if (!email) return 'AD';
    return email.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-cms/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy dark:bg-midnight border-r border-white/10 dark:border-slate-800 flex flex-col h-screen overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-4 border-b border-white/10 dark:border-slate-800 shrink-0 sticky top-0 z-10 bg-navy dark:bg-midnight">
          <h1 className="text-white font-serif font-bold text-lg">FHR CMS Portal</h1>
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavLink
            to="/admin-cms/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-gold-light'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard Overview
          </NavLink>
          {isSuperAdminRole(user) && (
            <NavLink
              to="/admin-cms/chapters/new"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-gold-light'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <BookOpen size={18} />
              Manage Core Book
            </NavLink>
          )}
          <NavLink
            to="/admin-cms/authorities/new"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-gold-light'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <FileText size={18} />
            New Authority
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10 dark:border-slate-800 shrink-0 sticky bottom-0 bg-navy dark:bg-midnight">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center font-bold shrink-0">
              {getInitials(user?.email)}
            </div>
            <div className="text-xs text-slate-300 truncate">
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-midnight p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
