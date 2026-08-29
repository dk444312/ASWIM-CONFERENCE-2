import { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  UserPlus, 
  ArrowUpRight, 
  Clock, 
  Search,
  ExternalLink,
  FileEdit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getRegistrationAdmins, 
  getAdminActivityLogs, 
  RegistrationAdmin, 
  AdminActivityLog 
} from './adminStore';
import { 
  getStoredRegistrations, 
  RegistrationData, 
  isRegistrationOpen, 
  toggleRegistrationOpen 
} from '../registration/registrationStore';

export function AdminOverviewView({ onOpenCreateModal }: { onOpenCreateModal: () => void }) {
  const [admins, setAdmins] = useState<RegistrationAdmin[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isOpen, setIsOpen] = useState(() => isRegistrationOpen());

  const loadData = () => {
    setAdmins(getRegistrationAdmins());
    setLogs(getAdminActivityLogs());
    setRegistrations(getStoredRegistrations());
    setIsOpen(isRegistrationOpen());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ifsw_registration_admins_changed', loadData);
    window.addEventListener('ifsw_registrations_updated', loadData);
    window.addEventListener('ifsw_admin_logs_updated', loadData);
    window.addEventListener('ifsw_registration_status_changed', loadData);
    return () => {
      window.removeEventListener('ifsw_registration_admins_changed', loadData);
      window.removeEventListener('ifsw_registrations_updated', loadData);
      window.removeEventListener('ifsw_admin_logs_updated', loadData);
      window.removeEventListener('ifsw_registration_status_changed', loadData);
    };
  }, []);

  const activeAdmins = admins.filter(a => a.status === 'active');
  const acceptedDelegates = registrations.filter(r => r.status === 'accepted').length;
  const rejectedDelegates = registrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#072418] via-[#0b3322] to-[#124d34] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-extrabold border border-emerald-400/30">
              <ShieldCheck size={14} />
              <span>Super Administrator & Access Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Registration Admin Management
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Provision credentialed registration officers, assign verification roles, and track complete real-time audit logs across all delegate admissions and decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <UserPlus size={16} />
              <span>Create Registration Admin</span>
            </button>
            <Link
              to="/registration/dashboard"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-2"
            >
              <span>Open Registration Portal</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Control Strip: Gateway Status + Landing CMS Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Registration Gateway Live Control Card with Toggle Button (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
              isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-gray-900">Registration Gateway:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isOpen 
                  ? 'Delegates can freely submit new profiles via the public portal.' 
                  : 'Public submission form is closed. Visitors see closure notice.'}
              </p>
            </div>
          </div>

          <button
            id="overview-registration-toggle-btn"
            onClick={() => {
              const next = toggleRegistrationOpen();
              setIsOpen(next);
            }}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shrink-0 border ${
              isOpen 
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
            }`}
            title={isOpen ? 'Click to turn off registration' : 'Click to turn on registration'}
          >
            {/* Toggle Switch Visual */}
            <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors relative flex items-center ${
              isOpen ? 'bg-emerald-600' : 'bg-gray-400'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                isOpen ? 'translate-x-3.5' : 'translate-x-0'
              }`} />
            </div>
            <span>{isOpen ? 'Turn OFF' : 'Turn ON'}</span>
          </button>
        </div>

        {/* Landing Page CMS Shortcut Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <FileEdit size={22} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-gray-900 truncate">
                Landing Page Content CMS
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                Customize titles, narrative copy, dates & team members
              </p>
            </div>
          </div>

          <Link
            to="/admin/landing"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <span>Edit Texts</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Registration Admins</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-heading">
            {admins.length}
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>{activeAdmins.length} currently active & verified</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Audit Logs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-heading">
            {logs.length}
          </div>
          <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            <span>Immutable action logging</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Decisions Recorded</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-heading">
            {acceptedDelegates + rejectedDelegates}
          </div>
          <div className="text-[11px] font-semibold text-gray-600 flex items-center gap-2">
            <span className="text-emerald-700 font-bold">{acceptedDelegates} Accepted</span>
            <span>·</span>
            <span className="text-red-700 font-bold">{rejectedDelegates} Rejected</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Delegates</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Mail size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-heading">
            {registrations.length}
          </div>
          <div className="text-[11px] font-semibold text-amber-800">
            Across {new Set(registrations.map(r => r.category)).size || 0} delegate categories (Free Admission)
          </div>
        </div>
      </div>

      {/* Two Column Layout: Admins Roster & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Registration Admins Roster */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                Active Registration Admins
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Personnel authorized to review submissions and dispatch credentials.
              </p>
            </div>
            <Link
              to="/admin/admins"
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
            >
              <span>View All Admins</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {admins.slice(0, 4).map((admin) => (
              <div 
                key={admin.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 hover:bg-white"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-gray-900 truncate">
                        {admin.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        admin.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        {admin.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-800 truncate">
                      {admin.role}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {admin.department} · {admin.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    to={`/admin/logs?admin=${encodeURIComponent(admin.id)}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors shadow-2xs"
                  >
                    View Logs ({admin.actionsCount || 0})
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Want to add a new verification officer or committee member?
            </span>
            <button
              onClick={onOpenCreateModal}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
            >
              + Create New Admin
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Live Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-700" size={18} />
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                Recent Admin Activity
              </h2>
            </div>
            <Link
              to="/admin/logs"
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
            >
              <span>Full Audit Trail</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {logs.slice(0, 6).map((log) => (
              <div 
                key={log.id}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-gray-900 truncate">
                    {log.adminName}
                  </span>
                  <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-gray-800 font-medium leading-snug">
                  {log.actionLabel}
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                    log.action.includes('ACCEPTED') ? 'bg-emerald-100 text-emerald-900' :
                    log.action.includes('REJECTED') ? 'bg-red-100 text-red-900' :
                    log.action.includes('CREATED') ? 'bg-blue-100 text-blue-900' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {log.action}
                  </span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="py-8 text-center text-xs text-gray-500">
                No activity logged yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
