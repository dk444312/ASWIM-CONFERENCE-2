import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  ShieldCheck, 
  UserPlus, 
  ArrowLeft, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  ChevronDown,
  Lock,
  Search,
  CheckCircle2,
  FileEdit,
  LogOut
} from 'lucide-react';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminsManagementView } from './AdminsManagementView';
import { AdminLogsView } from './AdminLogsView';
import { AdminLandingEditorView } from './AdminLandingEditorView';
import { 
  getRegistrationAdmins, 
  getCurrentActiveAdmin, 
  setCurrentActiveAdmin, 
  RegistrationAdmin, 
  getAdminActivityLogs,
  getAdminSession,
  logoutAdmin
} from './adminStore';
import { isRegistrationOpen, toggleRegistrationOpen } from '../registration/registrationStore';

export function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminSession, setAdminSessionState] = useState<RegistrationAdmin | null>(() => getAdminSession());
  const [admins, setAdmins] = useState<RegistrationAdmin[]>(getRegistrationAdmins());
  const [currentAdmin, setCurrentAdmin] = useState<RegistrationAdmin>(getCurrentActiveAdmin());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [recentLogsCount, setRecentLogsCount] = useState(getAdminActivityLogs().length);
  const [registrationOpen, setRegistrationOpenState] = useState(() => isRegistrationOpen());

  useEffect(() => {
    const handleAuth = () => {
      const sess = getAdminSession();
      setAdminSessionState(sess);
    };
    window.addEventListener('ifsw_auth_admin_changed', handleAuth);
    return () => window.removeEventListener('ifsw_auth_admin_changed', handleAuth);
  }, []);

  useEffect(() => {
    const handleStatus = () => {
      setRegistrationOpenState(isRegistrationOpen());
    };
    window.addEventListener('ifsw_registration_status_changed', handleStatus);
    return () => window.removeEventListener('ifsw_registration_status_changed', handleStatus);
  }, []);

  const loadData = () => {
    setAdmins(getRegistrationAdmins());
    setCurrentAdmin(getCurrentActiveAdmin());
    setRecentLogsCount(getAdminActivityLogs().length);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ifsw_registration_admins_changed', loadData);
    window.addEventListener('ifsw_active_admin_changed', loadData);
    window.addEventListener('ifsw_admin_logs_changed', loadData);
    return () => {
      window.removeEventListener('ifsw_registration_admins_changed', loadData);
      window.removeEventListener('ifsw_active_admin_changed', loadData);
      window.removeEventListener('ifsw_admin_logs_changed', loadData);
    };
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  // If not authenticated as administrator, redirect to admin login
  if (!adminSession) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard, badge: null },
    { name: 'Landing CMS', path: '/admin/landing', icon: FileEdit, badge: 'CMS' },
    { name: 'Registration Admins', path: '/admin/admins', icon: Users, badge: admins.length },
    { name: 'Audit & Activity Logs', path: '/admin/logs', icon: Activity, badge: recentLogsCount },
  ];

  return (
    <div className="flex h-screen bg-[#f4f6f8] font-sans antialiased text-gray-900 overflow-hidden">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#061e14] text-white flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:w-[90px]' : 'lg:w-[280px]'
        } w-[280px] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-2xl lg:shadow-none`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 relative">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img 
                src="/IFSW LOGO.jpg" 
                alt="IFSW Africa 2027" 
                className="w-full h-full object-contain" 
              />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <div className="font-extrabold text-sm tracking-wide text-white">IFSW Africa 2027</div>
                <div className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Admin Control</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop collapse button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3.5 top-7 bg-white text-gray-700 rounded-full p-1 shadow-md hover:text-emerald-800 transition-colors border border-gray-200"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action in Sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-b border-white/10">
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <UserPlus size={15} />
              <span>New Registration Admin</span>
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80">
              Admin Systems
            </div>
          )}

          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin/overview' && location.pathname === '/admin');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all relative ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-xs font-extrabold' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={18} className={isActive ? 'text-emerald-400' : 'text-white/60'} />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!isCollapsed && item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${
                    isActive ? 'bg-emerald-400 text-gray-950' : 'bg-white/15 text-white/90'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full" />
                )}
              </Link>
            );
          })}

          {/* Quick Cross Portal Links */}
          <div className="pt-6">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80">
                Connected Portals
              </div>
            )}

            <Link
              to="/registration/dashboard"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ExternalLink size={16} className="text-emerald-400" />
              {!isCollapsed && <span>Registration Portal</span>}
            </Link>

            <Link
              to="/"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="text-emerald-400" />
              {!isCollapsed && <span>Conference Website</span>}
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer / Current Admin Card & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                {currentAdmin?.name ? currentAdmin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden leading-snug">
                  <div className="text-xs font-extrabold text-white truncate">
                    {currentAdmin?.name || 'Administrator'}
                  </div>
                  <div className="text-[10px] text-emerald-300 font-semibold truncate">
                    {currentAdmin?.role || 'Super Admin'}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                id="sidebar-admin-logout-btn"
                onClick={handleLogout}
                className="p-2 rounded-xl text-white/60 hover:text-red-300 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Sign Out of Admin Console"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-xl border border-gray-200"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>IFSW 2027 Admin Console · Live Audit Active</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Registration Open/Close Gateway Toggle Button */}
            <button
              id="admin-registration-toggle-btn"
              onClick={() => {
                const next = toggleRegistrationOpen();
                setRegistrationOpenState(next);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
                registrationOpen
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950 hover:bg-amber-100'
              }`}
              title={registrationOpen ? 'Click to CLOSE public delegate registrations' : 'Click to OPEN public delegate registrations'}
            >
              <span className="hidden sm:inline text-[11px] font-bold text-gray-600">Registration:</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                registrationOpen ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${registrationOpen ? 'animate-pulse' : ''}`} />
                {registrationOpen ? 'OPEN' : 'CLOSED'}
              </span>

              {/* Physical Switch UI */}
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
                registrationOpen ? 'bg-emerald-600' : 'bg-gray-400'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                  registrationOpen ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </button>

            {/* Quick Link to Registration Portal */}
            <Link
              to="/registration/dashboard"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors"
            >
              <span>Delegates Portal</span>
              <ExternalLink size={13} />
            </Link>

            {/* Acting Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-800 transition-colors shadow-2xs cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {currentAdmin?.name ? currentAdmin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] leading-tight text-gray-900 font-extrabold truncate max-w-[130px]">
                    {currentAdmin?.name}
                  </div>
                  <div className="text-[9px] leading-tight text-gray-500 font-medium">
                    Acting Session
                  </div>
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showAdminDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setShowAdminDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                      Switch Active Session Admin
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      New actions will be logged under this user.
                    </p>
                  </div>

                  <div className="py-1 max-h-60 overflow-y-auto">
                    {admins.map((admin) => (
                      <button
                        key={admin.id}
                        onClick={() => {
                          setCurrentActiveAdmin(admin.id);
                          setCurrentAdmin(admin);
                          setShowAdminDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 text-xs transition-colors cursor-pointer ${
                          currentAdmin?.id === admin.id ? 'bg-emerald-50/70 font-extrabold text-emerald-950' : 'text-gray-700'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-bold truncate">{admin.name}</div>
                          <div className="text-[10px] text-gray-500">{admin.role}</div>
                        </div>
                        {currentAdmin?.id === admin.id && (
                          <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-gray-100 space-y-1">
                    <button
                      onClick={() => {
                        setShowAdminDropdown(false);
                        setIsCreateModalOpen(true);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserPlus size={13} />
                      <span>+ Create Another Admin</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Topbar Logout Button */}
            <button
              id="topbar-admin-logout-btn"
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors border border-gray-200 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>

          </div>
        </header>

        {/* Main Content View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminOverviewView onOpenCreateModal={() => setIsCreateModalOpen(true)} />} />
              <Route path="/overview" element={<AdminOverviewView onOpenCreateModal={() => setIsCreateModalOpen(true)} />} />
              <Route path="/landing" element={<AdminLandingEditorView />} />
              <Route 
                path="/admins" 
                element={
                  <AdminsManagementView 
                    isCreateOpen={isCreateModalOpen} 
                    onCloseCreate={() => setIsCreateModalOpen(false)}
                    onOpenCreate={() => setIsCreateModalOpen(true)}
                  />
                } 
              />
              <Route path="/logs" element={<AdminLogsView />} />
              <Route path="*" element={<Navigate to="/admin/overview" replace />} />
            </Routes>
          </div>
        </main>

      </div>

    </div>
  );
}
