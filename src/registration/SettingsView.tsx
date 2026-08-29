import React, { useState, useEffect } from 'react';
import { 
  Info, 
  Settings2, 
  ShieldCheck, 
  Bell, 
  User, 
  Users, 
  CreditCard,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  MapPin,
  Save,
  LogOut,
  ExternalLink,
  Lock,
  Shield,
  Key
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getAuthenticatedStaff, 
  getCurrentActiveAdmin, 
  logoutRegistrationStaff, 
  RegistrationAdmin 
} from '../admin/adminStore';
import { isRegistrationOpen, toggleRegistrationOpen } from './registrationStore';
import { isAbstractSubmissionOpen, toggleAbstractSubmissionOpen } from './abstractStore';

export function SettingsView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Officer Profile');
  const [authAdmin, setAuthAdmin] = useState<RegistrationAdmin>(getAuthenticatedStaff() || getCurrentActiveAdmin());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(() => isRegistrationOpen());
  const [isAbstractsOpen, setIsAbstractsOpen] = useState(() => isAbstractSubmissionOpen());

  // Conference settings
  const [confSettings, setConfSettings] = useState({
    conferenceName: 'IFSW Africa 2027 Regional Conference',
    venue: 'Bingu International Conference Centre (BICC), Lilongwe',
    earlyBirdDeadline: '2027-03-31',
    standardDeadline: '2027-06-15',
    maxDelegates: '1200',
    currency: 'Free Admission (Sponsored)',
    notifyNewSubmission: true,
    notifyStatusChange: true
  });

  const loadData = () => {
    const staff = getAuthenticatedStaff();
    setAuthAdmin(staff || getCurrentActiveAdmin());
    setIsRegOpen(isRegistrationOpen());
    setIsAbstractsOpen(isAbstractSubmissionOpen());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ifsw_auth_staff_changed', loadData);
    window.addEventListener('ifsw_active_admin_changed', loadData);
    window.addEventListener('ifsw_registration_admins_changed', loadData);
    window.addEventListener('ifsw_registration_status_changed', loadData);
    window.addEventListener('ifsw_abstracts_open_status_changed', loadData);
    return () => {
      window.removeEventListener('ifsw_auth_staff_changed', loadData);
      window.removeEventListener('ifsw_active_admin_changed', loadData);
      window.removeEventListener('ifsw_registration_admins_changed', loadData);
      window.removeEventListener('ifsw_registration_status_changed', loadData);
      window.removeEventListener('ifsw_abstracts_open_status_changed', loadData);
    };
  }, []);

  const handleConfChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setConfSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSaveConf = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSignOut = () => {
    logoutRegistrationStaff();
    navigate('/registration/login', { replace: true });
  };

  const settingsTabs = [
    { name: 'Officer Profile', icon: User },
    { name: 'Conference Parameters', icon: Settings2 },
    { name: 'Security & Privileges', icon: ShieldCheck },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col h-full animate-in fade-in duration-300">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading">
            Secretariat Settings & Officer Profile
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            View your authenticated credentials, authorized registration privileges, and conference parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={16} /> Parameters Updated!
            </span>
          )}
          <button 
            onClick={handleSignOut}
            className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-[260px] border-r border-gray-100 p-5 shrink-0 bg-gray-50/50">
          <nav className="space-y-1.5">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                    isActive 
                      ? 'bg-brand-green text-white font-bold shadow-xs' 
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span className="text-xs">{tab.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 text-xs space-y-2">
            <span className="font-bold text-gray-500 text-[10px] uppercase tracking-wider block">
              Administrative Control
            </span>
            <Link
              to="/admin/admins"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-brand-green font-bold text-xs hover:bg-emerald-100 transition-colors"
            >
              <span>Admin Console</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          
          {/* Officer Profile Tab */}
          {activeTab === 'Officer Profile' && (
            <div className="max-w-[780px] space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">
                  Authenticated Secretariat Officer
                </h2>
                <p className="text-gray-500 mt-1 text-xs">
                  Your credentials and registration operational permissions are provisioned centrally in the Admin Console.
                </p>
              </div>

              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-[#08281a] text-white border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-800 border-2 border-emerald-400/30 flex items-center justify-center font-black text-xl text-white shadow-xs">
                    {authAdmin.name ? authAdmin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-white">
                        {authAdmin.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-700/60 border border-emerald-400/40 text-emerald-200 text-[11px] font-mono font-bold">
                        @{authAdmin.username}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                      {authAdmin.role}
                    </p>
                    <p className="text-[11px] text-white/70 mt-1">
                      {authAdmin.department} · {authAdmin.location}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Account Status: {authAdmin.status || 'Active'}
                  </span>
                  <div className="text-[10px] text-white/50 mt-1">
                    Staff ID: {authAdmin.id}
                  </div>
                </div>
              </div>

              {/* Readonly Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                  <span className="text-[11px] font-bold text-gray-500 block">Username</span>
                  <span className="text-xs font-mono font-bold text-gray-900 mt-0.5 block">
                    @{authAdmin.username}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                  <span className="text-[11px] font-bold text-gray-500 block">Official Email</span>
                  <span className="text-xs font-medium text-gray-900 mt-0.5 block">
                    {authAdmin.email}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                  <span className="text-[11px] font-bold text-gray-500 block">Phone</span>
                  <span className="text-xs font-medium text-gray-900 mt-0.5 block">
                    {authAdmin.phone || 'Not specified'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                  <span className="text-[11px] font-bold text-gray-500 block">Station / Desk</span>
                  <span className="text-xs font-medium text-gray-900 mt-0.5 block">
                    {authAdmin.location || 'Lilongwe Secretariat HQ'}
                  </span>
                </div>
              </div>

              {/* Central Management Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield size={15} className="text-brand-green" />
                  <span>Centralized Account Management</span>
                </div>
                <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                  Profile information, username, password, and system permissions are created and managed by the Conference Administrator in the Admin Console. If you need to change your password or update your contact details, please contact Secretariat IT or open the Admin Console.
                </p>
                <div className="pt-1">
                  <Link
                    to="/admin/admins"
                    className="inline-flex items-center gap-1 font-bold text-xs text-brand-green hover:underline"
                  >
                    <span>Open Admin Console Directory</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2">
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Sign Out of Registration Portal</span>
                </button>
              </div>

            </div>
          )}

          {/* Conference Parameters */}
          {activeTab === 'Conference Parameters' && (
            <div className="max-w-[780px] space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">
                  Conference Parameters & Registration Gateway
                </h2>
                <p className="text-gray-500 mt-1 text-xs">
                  Configure registration open/closed status, deadlines, venue capacity, and admission model.
                </p>
              </div>

              {/* Live Registration Toggle Switch Card */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">Public Registration Gateway Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isRegOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {isRegOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isRegOpen 
                      ? 'Registration is currently OPEN. Prospective delegates can submit new profile applications.' 
                      : 'Registration is currently CLOSED. Public submissions are paused.'}
                  </p>
                </div>

                <button
                  id="settings-registration-toggle-btn"
                  onClick={() => {
                    const next = toggleRegistrationOpen();
                    setIsRegOpen(next);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 ${
                    isRegOpen
                      ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                      : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700'
                  }`}
                >
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
                    isRegOpen ? 'bg-emerald-600' : 'bg-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                      isRegOpen ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  <span>{isRegOpen ? 'Close Registration' : 'Open Registration'}</span>
                </button>
              </div>

              {/* Live Abstract Submission Toggle Switch Card */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">Abstract Submission Gateway Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isAbstractsOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {isAbstractsOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isAbstractsOpen 
                      ? 'Abstract submissions are currently OPEN. Prospective authors can submit new research papers.' 
                      : 'Abstract submissions are currently CLOSED. Public paper submissions are paused.'}
                  </p>
                </div>

                <button
                  id="settings-abstracts-toggle-btn"
                  onClick={() => {
                    const next = toggleAbstractSubmissionOpen();
                    setIsAbstractsOpen(next);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 ${
                    isAbstractsOpen
                      ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                      : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700'
                  }`}
                >
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
                    isAbstractsOpen ? 'bg-emerald-600' : 'bg-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                      isAbstractsOpen ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  <span>{isAbstractsOpen ? 'Close Submissions' : 'Open Submissions'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">Conference Title</label>
                  <input 
                    type="text" 
                    name="conferenceName"
                    value={confSettings.conferenceName}
                    onChange={handleConfChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">Main Conference Venue</label>
                  <input 
                    type="text" 
                    name="venue"
                    value={confSettings.venue}
                    onChange={handleConfChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Early-Bird Registration Cutoff</label>
                  <input 
                    type="date" 
                    name="earlyBirdDeadline"
                    value={confSettings.earlyBirdDeadline}
                    onChange={handleConfChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Final Registration Deadline</label>
                  <input 
                    type="date" 
                    name="standardDeadline"
                    value={confSettings.standardDeadline}
                    onChange={handleConfChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Maximum In-Person Capacity</label>
                  <input 
                    type="number" 
                    name="maxDelegates"
                    value={confSettings.maxDelegates}
                    onChange={handleConfChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Pricing & Admission Model</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Free Admission · 100% Sponsored for 2027</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={handleSaveConf}
                  className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-emerald-900 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>Save Conference Parameters</span>
                </button>
              </div>
            </div>
          )}

          {/* Security & Privileges */}
          {activeTab === 'Security & Privileges' && (
            <div className="max-w-[780px] space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">
                  Operational Permissions & Privileges
                </h2>
                <p className="text-gray-500 mt-1 text-xs">
                  Active capabilities granted to your account for the IFSW Africa 2027 Conference.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'approve_delegates', title: 'Approve Delegates', desc: 'Authorize accreditation and generate delegate registration numbers.' },
                  { id: 'reject_delegates', title: 'Decline / Reject Applications', desc: 'Mark delegate dossiers as declined with specific committee remarks.' },
                  { id: 'send_notices', title: 'Dispatch Official Letters', desc: 'Issue one-click acceptance letters, visa invitation attachments, and updates.' },
                  { id: 'export_reports', title: 'Export Delegate Data', desc: 'Download CSV reports of registered participants, travel manifests, and demographics.' },
                  { id: 'manage_admins', title: 'Manage Other Registration Admins', desc: 'Provision and audit other registration staff accounts in the Admin Console.' },
                  { id: 'system_config', title: 'Configure Conference Portal', desc: 'Adjust deadlines, capacities, and system settings.' },
                ].map((item) => {
                  const hasPerm = (authAdmin.permissions || []).includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                        hasPerm ? 'bg-emerald-50/60 border-emerald-200' : 'bg-gray-50/60 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        hasPerm ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                            hasPerm ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {hasPerm ? 'Granted' : 'Not Granted'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'Notifications' && (
            <div className="max-w-[780px] space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">
                  Notification Alerts & Dispatches
                </h2>
                <p className="text-gray-500 mt-1 text-xs">
                  Automate Secretariat alerts when new delegate applications arrive.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="notifyNewSubmission"
                    checked={confSettings.notifyNewSubmission}
                    onChange={handleConfChange}
                    className="mt-1 rounded text-brand-green focus:ring-brand-green w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Instant Alert on New Delegate Submission</span>
                    <span className="text-[11px] text-gray-500">Notify the secretariat inbox when an applicant completes their registration.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="notifyStatusChange"
                    checked={confSettings.notifyStatusChange}
                    onChange={handleConfChange}
                    className="mt-1 rounded text-brand-green focus:ring-brand-green w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Audit Log Notice on Acceptance / Rejection</span>
                    <span className="text-[11px] text-gray-500">Record a timestamped log whenever a delegate profile is approved or declined.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
