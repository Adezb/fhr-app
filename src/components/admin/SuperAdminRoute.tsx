import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isSuperAdminRole } from '../../lib/config';

export default function SuperAdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-midnight">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Enforce super admin role requirement
  if (!user || !isSuperAdminRole(user)) {
    return <Navigate to="/admin-cms/dashboard" replace />;
  }

  return <Outlet />;
}
