import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Chapter, Authority } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.email?.toLowerCase() === 'cektopventures@gmail.com';
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch chapters
    const { data: chaptersData, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (!chaptersError && chaptersData) {
      setChapters(chaptersData as Chapter[]);
    }

    // Fetch authorities
    const { data: authData, error: authError } = await supabase
      .from('authorities')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!authError && authData) {
      setAuthorities(authData as Authority[]);
    }
    
    setIsLoading(false);
  };

  const deleteChapter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;
    await supabase.from('chapters').delete().eq('id', id);
    fetchData();
  };

  const deleteAuthority = async (id: string) => {
    if (!confirm('Are you sure you want to delete this authority?')) return;
    await supabase.from('authorities').delete().eq('id', id);
    fetchData();
  };

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy dark:text-text-heading-dark">Chapters</h2>
          {isSuperAdmin && (
            <Link
              to="/admin-cms/chapters/new"
              className="px-4 py-2 bg-navy hover:bg-navy-light text-white text-sm font-medium rounded-lg transition-colors"
            >
              Manage Chapter
            </Link>
          )}
        </div>
        
        <div className="bg-white dark:bg-midnight-light rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                {isSuperAdmin && <th className="px-4 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{chapter.sort_order}</td>
                  <td className="px-4 py-3 font-medium text-navy dark:text-text-heading-dark">{chapter.title}</td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3 text-right space-x-3">
                      <Link to={`/admin-cms/chapters/${chapter.id}`} className="text-gold hover:text-gold-light font-medium">Edit</Link>
                      <button onClick={() => deleteChapter(chapter.id)} className="text-red-500 hover:text-red-400 font-medium">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan={isSuperAdmin ? 3 : 2} className="px-4 py-8 text-center text-slate-500">No chapters found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy dark:text-text-heading-dark">Authorities</h2>
          <Link
            to="/admin-cms/authorities/new"
            className="px-4 py-2 bg-navy hover:bg-navy-light text-white text-sm font-medium rounded-lg transition-colors"
          >
            Manage Authority
          </Link>
        </div>
        
        <div className="bg-white dark:bg-midnight-light rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {authorities.map((auth) => (
                <tr key={auth.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy dark:text-text-heading-dark">{auth.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${auth.is_published ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {auth.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin-cms/authorities/${auth.id}`} className="text-gold hover:text-gold-light font-medium">Edit</Link>
                    <button onClick={() => deleteAuthority(auth.id)} className="text-red-500 hover:text-red-400 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {authorities.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No authorities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
