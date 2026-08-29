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
    <div className="flex h-screen bg-[#f4f5f8] font-sans antialiased text-gray-900 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#062217] text-white flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:w-[90px]' : 'lg:w-[280px]'
        } w-[280px] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-xl lg:shadow-none`}
      >
        {/* Sidebar Header & Brand */}
        <div className="h-[74px] px-6 flex items-center justify-between border-b border-white/10 relative">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-0.5 shadow-md shrink-0 flex items-center justify-center font-bold text-white text-xs">
              IFSW
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="font-extrabold text-sm tracking-wide text-white font-heading truncate">IFSW Africa 2027</div>
                <div className="text-[10px] text-[#e4bd4d] font-bold tracking-wider uppercase truncate">Registrations Portal</div>
              </div>
            )}
          </Link>

          {/* Desktop collapse button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3.5 top-7 bg-white text-gray-700 rounded-full p-1 shadow-md hover:text-brand-green transition-colors border border-gray-200"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Authenticated Officer Mini Card */}
        {!isCollapsed ? (
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-brand-green text-white font-extrabold text-xs shrink-0 flex items-center justify-center border border-white/20 shadow-xs">
              {authStaff.name ? authStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="overflow-hidden flex-1">
              <Link to="/registration/settings" className="block hover:opacity-80 transition-opacity">
                <h3 className="font-extrabold text-xs text-white truncate">
                  {authStaff.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-700/60 text-emerald-200 font-mono text-[10px] font-bold">
                    @{authStaff.username}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300 font-medium truncate mt-0.5">
                  {authStaff.role}
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 flex justify-center border-b border-white/10">
            <Link to="/registration/settings" title={`Officer: ${authStaff.name} (@${authStaff.username})`}>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-green text-white font-bold text-xs flex items-center justify-center border border-white/20">
                {authStaff.name ? authStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
              </div>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/registration/dashboard' && location.pathname === '/registration');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-brand-green text-white shadow-sm' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-white/70 shrink-0'} />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!isCollapsed && item.count !== null && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20 text-white font-mono font-bold">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Console & Logout */}
        <div className="p-3 border-t border-white/10 space-y-1 mt-auto">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:bg-white/10 transition-all ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'Admin Console & Logs' : undefined}
          >
            <ShieldCheck size={18} className="shrink-0 text-amber-400" />
            {!isCollapsed && <span>Admin Console & Logs</span>}
          </Link>

          <Link
            to="/registration/support"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all ${
              location.pathname === '/registration/support' ? 'bg-white/15 text-white' : ''
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? 'Help / Support Guide' : undefined}
          >
            <HelpCircle size={18} className="shrink-0" />
            {!isCollapsed && <span>Help / Support Guide</span>}
          </Link>

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/50 transition-all ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={18} className="shrink-0 text-red-400" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-[74px] bg-white border-b border-gray-200/80 flex items-center justify-between px-6 sm:px-8 shrink-0 relative z-20">
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
