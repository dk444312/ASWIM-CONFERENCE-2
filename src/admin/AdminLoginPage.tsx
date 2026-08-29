import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { 
  authenticateAdmin, 
  getAdminSession 
} from './adminStore';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const current = getAdminSession();
    if (current) {
      navigate('/admin/overview', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authenticateAdmin(username, password);

      if (!result.success) {
        setIsLoading(false);
        setError(result.error || 'Invalid credentials.');
        return;
      }

      // Redirect immediately on success without unnecessary local state updates
      navigate('/admin/overview', { replace: true });
    } catch (err: unknown) {
      setIsLoading(false);
      setError('An error occurred during authentication. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3ef] flex flex-col justify-between font-sans text-gray-900 selection:bg-emerald-800 selection:text-white">
      {/* Header */}
      <header className="w-full bg-[#06291a] border-b border-emerald-950/40 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img 
              src="/IFSW LOGO.jpg" 
              alt="IFSW Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="text-white font-extrabold text-sm tracking-tight font-heading">
            IFSW Africa 2027
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link
            to="/login"
            className="text-emerald-200/80 hover:text-white transition-colors"
          >
            Staff Login
          </Link>
          <Link
            to="/"
            className="text-emerald-200/80 hover:text-white transition-colors"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px] space-y-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200/90 overflow-hidden">
            <div className="h-2.5 bg-gradient-to-r from-[#06291a] via-[#0d4e32] to-[#c59c34]" />

            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-black text-gray-900 font-heading tracking-tight">
                  Admin Login
                </h1>
              </div>

              {/* Error Box */}
              {error && (
                <div 
                  id="admin-login-error"
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2"
                >
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="username" 
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Username or Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username or email"
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4e32] focus:border-[#0d4e32] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label 
                    htmlFor="password" 
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4e32] focus:border-[#0d4e32] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-[#0d4e32] hover:underline"
                  >
                    Staff Portal
                  </Link>

                  <button
                    type="submit"
                    id="admin-login-submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#06291a] hover:bg-[#0a3f28] disabled:bg-gray-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center text-[11px] text-gray-500 space-x-3">
            <Link to="/" className="hover:text-gray-800 transition-colors">
              Conference Home
            </Link>
            <span>•</span>
            <Link to="/register" className="hover:text-gray-800 transition-colors">
              Delegate Registration
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center text-xs text-gray-500 border-t border-gray-200 bg-white/50">
        IFSW Africa 2027 · Lilongwe, Malawi
      </footer>
    </div>
  );
}
