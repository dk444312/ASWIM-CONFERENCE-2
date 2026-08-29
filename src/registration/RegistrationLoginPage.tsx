import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Shield,
  Calendar,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { 
  authenticateRegistrationStaff, 
  getAuthenticatedStaff
} from '../admin/adminStore';

export function RegistrationLoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const current = getAuthenticatedStaff();
    if (current) {
      navigate('/registration/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isLoading) return;

    setError(null);
    setIsLoading(true);
    isSubmittingRef.current = true;

    try {
      const result = await authenticateRegistrationStaff(identifier, password);

      if (!result.success) {
        setIsLoading(false);
        isSubmittingRef.current = false;
        setError(result.error || 'Invalid credentials. Please verify your username and password.');
        return;
      }

      navigate('/registration/dashboard', { replace: true });
    } catch (err: any) {
      setIsLoading(false);
      isSubmittingRef.current = false;
      setError('An error occurred during staff authentication. Please try again.');
    }
  };

  return (
    <div id="login-root-container" className="min-h-screen bg-[#f3f6f3] flex flex-col justify-between font-sans text-gray-900 selection:bg-[#06291a] selection:text-white">
      
      {/* Premium Minimal Header */}
      <header id="login-main-header" className="w-full bg-[#06291a] border-b border-emerald-950/40 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
        <Link to="/" id="login-brand-link" className="flex items-center gap-3">
          <div id="login-logo-container" className="w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105">
            <img 
              src="/IFSW LOGO.jpg" 
              alt="IFSW Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div id="login-brand-meta" className="flex flex-col">
            <span className="text-white font-extrabold text-sm tracking-tight leading-none font-heading">
              IFSW Africa 2027
            </span>
            <span className="text-emerald-300 font-bold text-[10px] tracking-widest uppercase mt-0.5">
              Conference Portal
            </span>
          </div>
        </Link>

        <nav id="login-nav" className="flex items-center gap-6 text-xs font-semibold">
          <Link
            to="/admin/login"
            id="login-link-admin"
            className="text-emerald-200/80 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-300 hover:after:w-full after:transition-all"
          >
            Admin Terminal
          </Link>
          <Link
            to="/"
            id="login-link-home"
            className="text-emerald-200/80 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-300 hover:after:w-full after:transition-all"
          >
            Website Home
          </Link>
        </nav>
      </header>

      {/* Main Redesigned Presentation & Form Container */}
      <main id="login-main-content" className="flex-1 flex items-center justify-center px-4 py-12">
        <div id="login-split-card" className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_16px_48px_-12px_rgba(6,41,26,0.08)] border border-emerald-100/80 overflow-hidden grid md:grid-cols-12 min-h-[520px]">
          
          {/* Column 1: Info panel (Sophisticated background & micro-copy) */}
          <div id="login-info-pane" className="md:col-span-5 bg-gradient-to-br from-[#06291a] via-[#093c26] to-[#0c4e33] p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,156,52,0.12),transparent_60%)] pointer-events-none" />
            
            {/* Top Badge */}
            <div id="login-badge" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 self-start">
              <Shield size={12} className="text-emerald-300" />
              <span>Officer Gateway</span>
            </div>

            {/* Conference Info Panel Block */}
            <div className="space-y-6 my-8 md:my-0">
              <h2 className="text-3xl font-black font-heading leading-tight tracking-tight text-white">
                Review, Manage & Support.
              </h2>
              <p className="text-sm text-emerald-100/80 font-medium leading-relaxed">
                Access the official staff portal to verify Malawian and International delegate registrations, assess research abstracts, and broadcast vital communications.
              </p>

              <div className="pt-4 space-y-3.5">
                <div className="flex items-center gap-3 text-xs font-bold text-emerald-200">
                  <Calendar size={15} className="text-[#c59c34] shrink-0" />
                  <span>April 2027 · Lilongwe, Malawi</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-emerald-200">
                  <MapPin size={15} className="text-[#c59c34] shrink-0" />
                  <span>Bingu International Convention Centre</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-emerald-200">
                  <HeartHandshake size={15} className="text-[#c59c34] shrink-0" />
                  <span>Advancing Continental Development</span>
                </div>
              </div>
            </div>

            {/* Micro branding */}
            <div className="text-[10px] font-semibold text-emerald-300/60 uppercase tracking-widest border-t border-white/10 pt-4">
              IFSW Africa Regional Council
            </div>
          </div>

          {/* Column 2: Elegant Form Panel */}
          <div id="login-form-pane" className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              <div className="space-y-2">
                <h1 className="text-2xl font-black font-heading text-gray-900 tracking-tight">
                  Staff Authentication
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-wide">
                  Enter your assigned credentials to manage delegate approvals.
                </p>
              </div>

              {/* Error Callout */}
              {error && (
                <div 
                  id="staff-login-error"
                  className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Username Input with transitions */}
                <div className="space-y-2">
                  <label 
                    htmlFor="staff-identifier" 
                    className="block text-[10px] font-black text-gray-500 uppercase tracking-widest"
                  >
                    Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={16} className="transition-colors group-focus-within:text-emerald-700" />
                    </div>
                    <input
                      id="staff-identifier"
                      name="identifier"
                      type="text"
                      required
                      autoFocus
                      disabled={isLoading}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. j.malawi@ifsw.org"
                      autoComplete="username"
                      className="w-full pl-11 pr-4 h-12 bg-gray-50 border border-gray-200 hover:border-emerald-200/80 rounded-2xl text-sm font-semibold text-gray-900 placeholder:text-gray-400/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Password Input with eye toggles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="staff-password" 
                      className="block text-[10px] font-black text-gray-500 uppercase tracking-widest"
                    >
                      Security Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      id="staff-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full pl-11 pr-11 h-12 bg-gray-50 border border-gray-200 hover:border-emerald-200/80 rounded-2xl text-sm font-semibold text-gray-900 placeholder:text-gray-400/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer"
                      tabIndex={-1}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button Block */}
                <div className="pt-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                  <Link
                    to="/admin/login"
                    id="staff-to-admin-console"
                    className="text-xs font-bold text-emerald-800 hover:text-[#c59c34] transition-colors hover:underline order-2 sm:order-1"
                  >
                    System Admin Terminal
                  </Link>

                  <button
                    type="submit"
                    id="staff-login-submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto h-12 px-8 bg-[#06291a] hover:bg-[#0a452c] active:bg-[#041a11] disabled:bg-gray-400 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Authenticate</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Modern Centered Footer */}
      <footer id="login-footer" className="w-full bg-white border-t border-emerald-100/50 py-5 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 gap-3">
        <div id="login-footer-copy" className="font-semibold text-gray-400">
          IFSW Africa 2027 · Lilongwe, Malawi
        </div>
        <div id="login-footer-links" className="flex items-center gap-5 text-gray-500 font-bold">
          <Link to="/" className="hover:text-emerald-800 transition-colors">
            Conference Home
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/register" className="hover:text-emerald-800 transition-colors">
            Delegate Registration
          </Link>
        </div>
      </footer>

    </div>
  );
}
