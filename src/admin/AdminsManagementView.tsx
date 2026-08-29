import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  Check, 
  X, 
  Clock, 
  Activity, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  AtSign,
  KeyRound
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getRegistrationAdmins, 
  createRegistrationAdmin, 
  toggleAdminStatus, 
  deleteRegistrationAdmin, 
  changeAdminPassword,
  RegistrationAdmin, 
  getCurrentActiveAdmin, 
  setCurrentActiveAdmin 
} from './adminStore';

export function AdminsManagementView({ 
  isCreateOpen, 
  onCloseCreate, 
  onOpenCreate 
}: { 
  isCreateOpen: boolean; 
  onCloseCreate: () => void; 
  onOpenCreate: () => void; 
}) {
  const [admins, setAdmins] = useState<RegistrationAdmin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [currentActive, setCurrentActive] = useState<RegistrationAdmin>(getCurrentActiveAdmin());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password visibility map for admin cards
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Password reset modal state
  const [passwordResetAdmin, setPasswordResetAdmin] = useState<RegistrationAdmin | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);

  // Form State for creating a registration admin (Minimalist: username, password, email)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    setAdmins(getRegistrationAdmins());
    setCurrentActive(getCurrentActiveAdmin());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ifsw_registration_admins_changed', loadData);
    window.addEventListener('ifsw_active_admin_changed', loadData);
    return () => {
      window.removeEventListener('ifsw_registration_admins_changed', loadData);
      window.removeEventListener('ifsw_active_admin_changed', loadData);
    };
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanUsername = formData.username.trim().toLowerCase();
    if (!cleanUsername) {
      setFormError('Please enter a username for this administrator.');
      return;
    }
    if (cleanUsername.length < 3) {
      setFormError('Username must be at least 3 characters long.');
      return;
    }
    if (!formData.password.trim() || formData.password.trim().length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFormError('Please provide a valid official email address.');
      return;
    }

    const res = await createRegistrationAdmin({
      username: cleanUsername,
      password: formData.password.trim(),
      email: cleanEmail
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to create registration admin.');
      return;
    }

    onCloseCreate();
    setFormData({
      username: '',
      password: '',
      email: ''
    });
    setToastMessage(`Registration Admin @${cleanUsername} created successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
    loadData();
  };

  const handleToggleStatus = (id: string, name: string) => {
    toggleAdminStatus(id);
    setToastMessage(`Admin status for "${name}" was updated.`);
    setTimeout(() => setToastMessage(null), 3000);
    loadData();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete registration admin "${name}"? This action will be logged in the audit trail.`)) {
      deleteRegistrationAdmin(id);
      setToastMessage(`Registration Admin "${name}" was removed.`);
      setTimeout(() => setToastMessage(null), 3000);
      loadData();
    }
  };

  const handleSwitchActive = (admin: RegistrationAdmin) => {
    setCurrentActiveAdmin(admin.id);
    setCurrentActive(admin);
    setToastMessage(`Switched session to ${admin.name} (@${admin.username}).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePasswordVisibility = (adminId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetAdmin) return;
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    changeAdminPassword(passwordResetAdmin.id, newPasswordInput.trim());
    setToastMessage(`Password for @${passwordResetAdmin.username} has been reset.`);
    setTimeout(() => setToastMessage(null), 4000);
    setPasswordResetAdmin(null);
    setNewPasswordInput('');
    loadData();
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      admin.name.toLowerCase().includes(q) ||
      admin.username.toLowerCase().includes(q) ||
      admin.email.toLowerCase().includes(q) ||
      admin.id.toLowerCase().includes(q) ||
      admin.role.toLowerCase().includes(q) ||
      admin.department.toLowerCase().includes(q);

    const matchesRole = selectedRoleFilter === 'all' || admin.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'all' || admin.status === selectedStatusFilter;

    return matchesQuery && matchesRole && matchesStatus;
  });

  const activeCount = admins.filter(a => a.status === 'active').length;
  const suspendedCount = admins.filter(a => a.status === 'suspended').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-ink font-heading flex items-center gap-2.5">
            <Users className="text-brand-green" size={24} />
            <span>Registration Admins Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Provision, manage login credentials (username and password), and audit all officers authorized to review delegate applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-emerald-900 text-white text-xs font-extrabold transition-all shadow-xs active:scale-95"
          >
            <UserPlus size={16} />
            <span>Create Registration Admin</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-700" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-500 hover:text-gray-900">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Admins</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{admins.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Officers</span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Suspended</span>
          <div className="text-2xl font-extrabold text-red-700 mt-1">{suspendedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Authentication Mode</span>
          <div className="text-xs font-extrabold text-gray-800 mt-2 flex items-center gap-1">
            <Lock size={13} className="text-brand-green" /> Username & Password
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by username (@username), name, email, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="all">All Roles</option>
            <option value="Chief Registration Admin">Chief Registration Admin</option>
            <option value="Senior Registration Officer">Senior Registration Officer</option>
            <option value="Credentials Reviewer">Credentials Reviewer</option>
            <option value="Logistics & Visa Officer">Logistics & Visa Officer</option>
            <option value="Finance Auditor">Finance Auditor</option>
            <option value="Helpdesk Lead">Helpdesk Lead</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>

          <button
            onClick={loadData}
            className="p-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAdmins.map((admin) => {
          const isCurrent = currentActive?.id === admin.id;
          const isPasswordVisible = !!visiblePasswords[admin.id];

          return (
            <div 
              key={admin.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all space-y-4 flex flex-col justify-between ${
                isCurrent 
                  ? 'border-brand-green ring-2 ring-emerald-600/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#08281a] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs border border-white/10">
                      {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-extrabold text-sm text-gray-900 truncate">
                        {admin.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-brand-green border border-emerald-200/80 font-mono text-[11px] font-bold">
                          @{admin.username}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 truncate mt-1">
                        {admin.role}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    admin.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}>
                    {admin.status}
                  </span>
                </div>

                {/* Login Credentials Box */}
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                    <span>Portal Credentials</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordResetAdmin(admin);
                        setNewPasswordInput('');
                      }}
                      className="text-brand-green hover:underline flex items-center gap-1"
                    >
                      <KeyRound size={11} />
                      <span>Reset Password</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-gray-600">User:</span>
                    <span className="font-bold text-gray-900">@{admin.username}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-gray-600">Pass:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">
                        {isPasswordVisible ? admin.password : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(admin.id)}
                        className="text-gray-400 hover:text-gray-700 p-0.5"
                        title={isPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {isPasswordVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact & Station Details */}
                <div className="mt-3 space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  {admin.phone && (
                    <div className="flex items-center gap-2 truncate">
                      <Phone size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{admin.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 truncate">
                    <Building size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{admin.department}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{admin.location}</span>
                  </div>
                </div>

                {/* Permissions Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {admin.permissions.map((p) => (
                    <span 
                      key={p} 
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[10px] font-semibold"
                    >
                      {p.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 font-bold text-gray-800">
                    <Activity size={12} className="text-brand-green" />
                    {admin.actionsCount || 0} actions recorded
                  </span>
                  <span>
                    Created: {new Date(admin.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to={`/admin/logs?admin=${encodeURIComponent(admin.id)}`}
                    className="w-full py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>See Logs</span>
                    <ExternalLink size={13} />
                  </Link>

                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-brand-green text-white text-xs font-bold flex items-center justify-center gap-1 opacity-90 cursor-default"
                    >
                      <Check size={13} />
                      <span>Active Session</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSwitchActive(admin)}
                      className="w-full py-2 px-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Act As Admin</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <button
                    onClick={() => handleToggleStatus(admin.id, admin.name)}
                    className="text-gray-500 hover:text-gray-900 font-bold transition-colors"
                  >
                    {admin.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                  </button>

                  <button
                    onClick={() => handleDelete(admin.id, admin.name)}
                    className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {/* Clean Empty State */}
        {admins.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-brand-green">
              <Users size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-gray-900">
                No Registration Admins Created Yet
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                All mock administrator records have been removed. Create official Registration Admin accounts with a unique username and password so staff can authenticate and access the Registration Management Portal.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenCreate}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green hover:bg-emerald-900 text-white text-xs font-extrabold transition-all shadow-xs"
              >
                <UserPlus size={16} />
                <span>Create First Registration Admin</span>
              </button>
            </div>
          </div>
        )}

        {admins.length > 0 && filteredAdmins.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
            <Users className="mx-auto text-gray-400" size={36} />
            <h3 className="font-extrabold text-sm text-gray-900">
              No matching administrators
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No administrators match your current query or role filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRoleFilter('all'); setSelectedStatusFilter('all'); }}
              className="text-xs font-bold text-brand-green hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* CREATE REGISTRATION ADMIN MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#08281a] text-white flex items-center justify-between border-b border-emerald-900/50">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-2 font-heading">
                  <UserPlus className="text-emerald-300" size={20} />
                  <span>Create Registration Admin Account</span>
                </h2>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Set up official login credentials (username and password) and assign role permissions.
                </p>
              </div>
              <button 
                onClick={onCloseCreate}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="px-6 py-3 bg-red-50 border-b border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Minimalist Modal Form (Three Fields: Username, Password, Email) */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-[11px]">Minimalist Admin Onboarding</p>
                  <p className="text-[10px] text-emerald-900/80 leading-normal">
                    Enter username, password, and email. The officer will be granted direct sign-in access to the Registration Portal.
                  </p>
                </div>
              </div>

              {/* Field 1: Username */}
              <div>
                <label className="block text-gray-800 font-bold mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. mwai.admin"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '') })}
                    className="w-full pl-8 pr-3.5 py-3 bg-white border border-gray-300 rounded-xl font-mono font-bold text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Unique login handle used to sign in.</p>
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="block text-gray-800 font-bold mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-3 bg-white border border-gray-300 rounded-xl font-mono text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    title={showCreatePassword ? 'Hide password' : 'Show password'}
                  >
                    {showCreatePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Credentials used for authentication.</p>
              </div>

              {/* Field 3: Email */}
              <div>
                <label className="block text-gray-800 font-bold mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. m.admin@ifswafrica2027.mw"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Official Secretariat correspondence email address.</p>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseCreate}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-emerald-900 text-white font-extrabold transition-all shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <UserPlus size={15} />
                  <span>Create Registration Admin</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {passwordResetAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
            <div className="px-6 py-5 bg-[#08281a] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <KeyRound className="text-emerald-300" size={18} />
                  <span>Reset Admin Password</span>
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Update credentials for @{passwordResetAdmin.username} ({passwordResetAdmin.name})
                </p>
              </div>
              <button 
                onClick={() => setPasswordResetAdmin(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewPassword} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter at least 6 characters"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showModalPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordResetAdmin(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-green hover:bg-emerald-900 text-white font-extrabold transition-all shadow-xs"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
