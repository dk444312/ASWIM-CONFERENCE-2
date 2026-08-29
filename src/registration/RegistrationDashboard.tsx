import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  Mail, 
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  Lock,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { SettingsView } from './SettingsView';
import { DashboardView } from './DashboardView';
import { DelegatesView } from './DelegatesView';
import { SubmissionsView } from './SubmissionsView';
import { AbstractsView } from './AbstractsView';
import { CommunicationsView } from './CommunicationsView';
import { HelpSupportView } from './HelpSupportView';
import { RegistrationLoginPage } from './RegistrationLoginPage';
import { getStoredRegistrations, RegistrationData, isRegistrationOpen, toggleRegistrationOpen } from './registrationStore';
import { isAbstractSubmissionOpen, toggleAbstractSubmissionOpen } from './abstractStore';
import { 
  getAuthenticatedStaff, 
  logoutRegistrationStaff, 
  getCurrentActiveAdmin, 
  RegistrationAdmin 
} from '../admin/adminStore';

export function RegistrationDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authStaff, setAuthStaff] = useState<RegistrationAdmin | null>(getAuthenticatedStaff());
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [registrationOpen, setRegistrationOpenState] = useState(() => isRegistrationOpen());
  const [abstractsOpen, setAbstractsOpenState] = useState(() => isAbstractSubmissionOpen());

  const loadData = () => {
    const staff = getAuthenticatedStaff();
    setAuthStaff(staff);
    setRegistrations(getStoredRegistrations());
    setRegistrationOpenState(isRegistrationOpen());
    setAbstractsOpenState(isAbstractSubmissionOpen());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ifsw_auth_staff_changed', loadData);
    window.addEventListener('ifsw_active_admin_changed', loadData);
    window.addEventListener('ifsw_registrations_updated', loadData);
    window.addEventListener('ifsw_registration_status_changed', loadData);
    window.addEventListener('ifsw_abstracts_open_status_changed', loadData);
    return () => {
      window.removeEventListener('ifsw_auth_staff_changed', loadData);
      window.removeEventListener('ifsw_active_admin_changed', loadData);
      window.removeEventListener('ifsw_registrations_updated', loadData);
      window.removeEventListener('ifsw_registration_status_changed', loadData);
      window.removeEventListener('ifsw_abstracts_open_status_changed', loadData);
    };
  }, []);

  // If on /registration/login route, directly render RegistrationLoginPage
  if (location.pathname === '/registration/login') {
    return <RegistrationLoginPage />;
  }

  // If not authenticated, redirect to login page
  if (!authStaff) {
    return <Navigate to="/registration/login" replace />;
  }

  const handleSignOut = () => {
    logoutRegistrationStaff();
    navigate('/registration/login', { replace: true });
  };

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  const navItems = [
    { name: 'Dashboard', path: '/registration/dashboard', icon: LayoutGrid, count: null },
    { name: 'Delegates', path: '/registration/delegates', icon: Users, count: registrations.length },
    { name: 'Submissions', path: '/registration/submissions', icon: FileText, count: null },
    { name: 'Abstracts', path: '/registration/abstracts', icon: BookOpen, count: null },
    { name: 'Communications', path: '/registration/communications', icon: Mail, count: null },
    { name: 'Settings', path: '/registration/settings', icon: Settings, count: null },
  ];

  return (
    <div id="registration-dashboard-wrapper" className="flex h-screen bg-[#f4f7f5] font-sans antialiased text-gray-900 overflow-hidden selection:bg-[#06291a] selection:text-white">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          id="registration-mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#06291a]/40 z-40 lg:hidden backdrop-blur-md transition-opacity duration-300"
        />
      )}

      {/* Redesigned Sidebar Container */}
      <aside 
        id="registration-sidebar-aside"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#051c11] text-white flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-[88px]' : 'lg:w-[280px]'
        } w-[280px] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-[8px_0_32px_rgba(4,41,26,0.12)] lg:shadow-none border-r border-emerald-950/40`}
      >
        {/* Sidebar Header & Brand */}
        <div id="registration-sidebar-header" className="h-[74px] px-6 flex items-center justify-between border-b border-emerald-950/60 relative">
          <Link to="/" id="registration-header-logo-link" className="flex items-center gap-3 overflow-hidden group">
            <div id="registration-logo-badge" className="w-9 h-9 rounded-xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <img 
                src="/IFSW LOGO.jpg" 
                alt="IFSW Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            {!isCollapsed && (
              <div id="registration-header-text" className="overflow-hidden flex flex-col">
                <span className="font-black text-xs tracking-tight text-white font-heading truncate leading-none">
                  IFSW Africa 2027
                </span>
                <span className="text-[9px] text-[#c59c34] font-black tracking-widest uppercase mt-1 leading-none">
                  Officer Gateway
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse button */}
          <button 
            id="registration-sidebar-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-[22px] bg-white text-[#051c11] hover:bg-[#edf3ef] rounded-full p-1 shadow-md hover:text-emerald-700 transition-all border border-gray-200 z-50 hover:scale-110 active:scale-95"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} className="stroke-[3]" /> : <ChevronLeft size={14} className="stroke-[3]" />}
          </button>

          {/* Mobile close button */}
          <button 
            id="registration-sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Authenticated Officer Mini Card */}
        <div id="registration-sidebar-officer" className="border-b border-emerald-950/60">
          {!isCollapsed ? (
            <div className="p-4.5 m-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3.5 transition-all hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#c59c34] text-gray-950 font-black text-xs shrink-0 flex items-center justify-center border border-white/10 shadow-sm">
                {authStaff.name ? authStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="overflow-hidden flex-1">
                <Link to="/registration/settings" className="block group">
                  <h3 className="font-extrabold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                    {authStaff.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 font-mono text-[9px] font-bold">
                      @{authStaff.username}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate mt-1">
                    {authStaff.role}
                  </p>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-4.5 flex justify-center">
              <Link to="/registration/settings" title={`Officer: ${authStaff.name} (@${authStaff.username})`}>
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#c59c34] text-gray-950 font-black text-xs flex items-center justify-center border border-white/10 shadow-md hover:scale-105 hover:rotate-3 transition-all">
                  {authStaff.name ? authStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav id="registration-nav-menu" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/registration/dashboard' && location.pathname === '/registration');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-emerald-900/60 text-white shadow-sm border-l-4 border-[#c59c34] pl-3' 
                    : 'text-emerald-100/70 hover:bg-white/5 hover:text-white hover:pl-5'
                } ${isCollapsed ? 'justify-center px-2 hover:pl-2' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-emerald-200/60 shrink-0'} />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!isCollapsed && item.count !== null && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-emerald-200 font-mono font-black">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Console & Logout */}
        <div id="registration-sidebar-footer" className="p-3 border-t border-emerald-950/60 bg-emerald-950/20 space-y-1">
          <Link
            to="/admin"
            id="registration-link-admin-console"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-300 hover:bg-white/5 transition-all ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'Admin Console & Logs' : undefined}
          >
            <ShieldCheck size={18} className="shrink-0 text-amber-400" />
            {!isCollapsed && <span>Admin Terminal</span>}
          </Link>

          <Link
            to="/registration/support"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all ${
              location.pathname === '/registration/support' ? 'bg-white/10 text-white' : ''
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? 'Help & Manual' : undefined}
          >
            <HelpCircle size={18} className="shrink-0" />
            {!isCollapsed && <span>Help & Manual</span>}
          </Link>

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={18} className="shrink-0 text-red-500" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div id="registration-main-view-box" className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header id="registration-header-bar" className="h-[74px] bg-white border-b border-gray-200/60 flex items-center justify-between px-6 sm:px-8 shrink-0 relative z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>

            {/* Quick Context breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Registrations Portal</span>
              <span>/</span>
              <span className="text-brand-green font-extrabold capitalize">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Tools & Officer Status */}
          <div className="flex items-center gap-3">
            {/* Registration Open/Close Gateway Toggle Button */}
            <button
              id="registration-portal-toggle-btn"
              onClick={() => {
                const next = toggleRegistrationOpen();
                setRegistrationOpenState(next);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
                registrationOpen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
              }`}
              title={registrationOpen ? 'Registration is OPEN. Click to CLOSE.' : 'Registration is CLOSED. Click to OPEN.'}
            >
              <span className="hidden lg:inline text-[11px] font-bold text-gray-600">Registrations:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                registrationOpen ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${registrationOpen ? 'animate-pulse' : ''}`} />
                {registrationOpen ? 'OPEN' : 'CLOSED'}
              </span>

              {/* Physical Switch UI */}
              <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                registrationOpen ? 'bg-emerald-600' : 'bg-gray-400'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                  registrationOpen ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </button>

            {/* Abstract Open/Close Gateway Toggle Button */}
            <button
              id="abstract-portal-toggle-btn"
              onClick={() => {
                const next = toggleAbstractSubmissionOpen();
                setAbstractsOpenState(next);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
                abstractsOpen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
              }`}
              title={abstractsOpen ? 'Abstract Submissions is OPEN. Click to CLOSE.' : 'Abstract Submissions is CLOSED. Click to OPEN.'}
            >
              <span className="hidden lg:inline text-[11px] font-bold text-gray-600">Abstracts:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                abstractsOpen ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${abstractsOpen ? 'animate-pulse' : ''}`} />
                {abstractsOpen ? 'OPEN' : 'CLOSED'}
              </span>

              {/* Physical Switch UI */}
              <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                abstractsOpen ? 'bg-emerald-600' : 'bg-gray-400'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                  abstractsOpen ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </button>

            {/* Admin Console Link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-extrabold transition-all shadow-2xs"
            >
              <ShieldCheck size={14} className="text-emerald-700" />
              <span className="hidden sm:inline">Admin Console</span>
            </Link>

            {/* Submit Application Link */}
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-green/10 text-brand-green text-xs font-bold hover:bg-brand-green hover:text-white transition-all"
            >
              <PlusCircle size={15} />
              <span>Submit Registration</span>
            </Link>

            {/* Pending Reviews Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-gray-500 hover:text-brand-green hover:bg-gray-100 transition-colors relative"
                title="Notifications"
              >
                <Bell size={20} />
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-bold text-xs text-gray-900">Notifications & Alerts</span>
                    <span className="text-[11px] text-amber-600 font-semibold">{pendingCount} Action items</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-gray-600">
                    {pendingCount > 0 ? (
                      <Link 
                        to="/registration/delegates" 
                        onClick={() => setShowNotifications(false)}
                        className="block p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/50 text-amber-900 transition-colors"
                      >
                        <div className="font-bold">Pending Review Applications</div>
                        <div className="text-[11px] text-amber-700 mt-0.5">
                          {pendingCount} delegate{pendingCount > 1 ? 's' : ''} awaiting subcommittee clearance.
                        </div>
                      </Link>
                    ) : (
                      <div className="py-4 text-center text-gray-400">All submissions are reviewed!</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-brand-green text-white font-extrabold text-xs flex items-center justify-center">
                {authStaff.name ? authStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-bold text-gray-900 text-xs leading-none">
                  {authStaff.name}
                </span>
                <span className="text-[10px] font-bold text-brand-green leading-tight">
                  @{authStaff.username}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/registration/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="delegates" element={<DelegatesView />} />
            <Route path="submissions" element={<SubmissionsView />} />
            <Route path="abstracts" element={<AbstractsView />} />
            <Route path="communications" element={<CommunicationsView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="support" element={<HelpSupportView />} />
            <Route path="*" element={<Navigate to="/registration/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
