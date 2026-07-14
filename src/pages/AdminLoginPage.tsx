import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function AdminLoginPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state as LocationState | null;

  // If already logged in, redirect to intended destination or dashboard
  if (!authLoading && user) {
    const from = state?.from?.pathname || '/admin-cms/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
    } else {
      const from = state?.from?.pathname || '/admin-cms/dashboard';
      navigate(from, { replace: true });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-midnight">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-midnight px-4">
      <div className="w-full max-w-md bg-white dark:bg-midnight-light p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy dark:text-text-heading-dark mb-2">CMS Portal</h1>
          <p className="text-sm text-text-muted dark:text-text-body-dark">Sign in to manage FHR Practice Guide content</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy dark:text-text-heading-dark mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-50 dark:bg-midnight border border-slate-300 dark:border-slate-700 rounded-lg text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-light transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy dark:text-text-heading-dark mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 bg-slate-50 dark:bg-midnight border border-slate-300 dark:border-slate-700 rounded-lg text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-light transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-navy hover:bg-navy-light text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-gold hover:text-gold-light transition-colors">
            &larr; Back to Public App
          </a>
        </div>
      </div>
    </div>
  );
}
