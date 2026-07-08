import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import TableOfContentsPage from './pages/TableOfContentsPage';
import ChapterPage from './pages/ChapterPage';
import AuthoritiesHubPage from './pages/AuthoritiesHubPage';
import AuthorityPage from './pages/AuthorityPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
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
        
        {/* Admin Routes (Standalone or using a different layout later) */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
