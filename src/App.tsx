import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import TableOfContentsPage from './pages/TableOfContentsPage';
import ChapterPage from './pages/ChapterPage';
import AuthoritiesHubPage from './pages/AuthoritiesHubPage';
import AuthorityPage from './pages/AuthorityPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminShell from './components/admin/AdminShell';
import ChapterEditorPage from './pages/admin/ChapterEditorPage';
import AuthorityEditorPage from './pages/admin/AuthorityEditorPage';
import AdminMobileGuard from './components/admin/AdminMobileGuard';
import SuperAdminRoute from './components/admin/SuperAdminRoute';
import { isMobileOrTabletDevice } from './utils/device';

function App() {
  useEffect(() => {
    // Global fallback listener for native-menu PWA installations
    const handleAppInstalled = () => {
      if (isMobileOrTabletDevice()) {
        window.dispatchEvent(new Event('pwa-success-install'));
      }
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes inside AppShell */}
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="book" element={<TableOfContentsPage />} />
          <Route path="book/:slug" element={<ChapterPage />} />
          <Route path="authorities" element={<AuthoritiesHubPage />} />
          <Route path="authorities/:slug" element={<AuthorityPage />} />
        </Route>
        
        {/* Admin CMS Routes */}
        <Route element={<AdminMobileGuard />}>
          <Route path="/admin-cms/login" element={<AdminLoginPage />} />
          
          <Route path="/admin-cms" element={<ProtectedRoute />}>
            <Route element={<AdminShell />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route element={<SuperAdminRoute />}>
                <Route path="chapters/:id" element={<ChapterEditorPage />} />
              </Route>
              <Route path="authorities/:id" element={<AuthorityEditorPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
