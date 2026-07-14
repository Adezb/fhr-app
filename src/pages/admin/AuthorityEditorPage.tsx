import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { X, Save, Rocket } from 'lucide-react';

export default function AuthorityEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      loadAuthority();
    }
  }, [id]);

  const loadAuthority = async () => {
    const { data, error } = await supabase.from('authorities').select('*').eq('id', id).single();
    if (data && !error) {
      setTitle(data.title);
      setSlug(data.slug);
      setSummary(data.summary || '');
      setContentHtml(data.content_html || '');
    } else {
      console.error(error);
      alert('Failed to load authority');
      navigate('/admin-cms/dashboard');
    }
    setIsLoading(false);
  };

  const handleSave = async (isPublished: boolean) => {
    setIsSaving(true);

    const authorityData = {
      title,
      slug,
      summary: summary || null,
      is_published: isPublished,
      content_html: contentHtml,
      updated_at: new Date().toISOString(),
      // Handle published_at logic
      ...(isPublished ? { published_at: new Date().toISOString() } : {})
    };

    if (isNew) {
      const { error } = await supabase.from('authorities').insert([
        { ...authorityData, created_at: new Date().toISOString() }
      ]);
      if (error) {
        alert('Error creating authority: ' + error.message);
      } else {
        navigate('/admin-cms/dashboard');
      }
    } else {
      const { error } = await supabase.from('authorities').update(authorityData).eq('id', id);
      if (error) {
        alert('Error updating authority: ' + error.message);
      } else {
        navigate('/admin-cms/dashboard');
      }
    }
    
    setIsSaving(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const isPublished = submitter?.getAttribute('data-publish') === 'true';
    handleSave(isPublished);
  };

  if (isLoading) {
    return <div className="p-8">Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="sticky top-0 z-30 flex justify-between items-center py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-6">
        <h1 className="text-2xl font-bold text-navy dark:text-text-heading-dark">
          {isNew ? 'New Authority' : 'Edit Authority'}
        </h1>
        <div className="space-x-4 flex items-center">
          <button 
            type="button" 
            onClick={() => navigate('/admin-cms/dashboard')}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button 
            type="submit"
            form="authority-form"
            data-publish="false"
            disabled={isSaving}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button 
            type="submit"
            form="authority-form"
            data-publish="true"
            disabled={isSaving}
            className="px-6 py-2 bg-navy hover:bg-navy-light text-white font-medium rounded-lg transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-70 gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Rocket size={16} />
                Publish to App
              </>
            )}
          </button>
        </div>
      </div>

      <form className="space-y-6" id="authority-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-navy dark:text-text-heading-dark">Title</label>
            <input 
              type="text" required
              value={title} onChange={e => {
                const val = e.target.value;
                setTitle(val);
                setSlug(generateSlug(val));
              }}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-midnight-light border-slate-300 dark:border-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-navy dark:text-text-heading-dark">Slug (URL)</label>
            <input 
              type="text" required
              value={slug} onChange={e => setSlug(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-midnight-light border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-navy dark:text-text-heading-dark">Summary (Optional)</label>
          <textarea 
            value={summary} onChange={e => setSummary(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-midnight-light border-slate-300 dark:border-slate-700 min-h-[100px]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-navy dark:text-text-heading-dark block mb-2">Content</label>
          <RichTextEditor 
            contentHtml={contentHtml} 
            onChange={setContentHtml} 
          />
        </div>
      </form>
    </div>
  );
}
