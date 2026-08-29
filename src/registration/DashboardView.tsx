import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  Globe, 
  ArrowUpRight, 
  Filter, 
  Eye, 
  FileCheck, 
  UserPlus, 
  Sparkles, 
  PlusCircle, 
  Mic2, 
  ShieldCheck, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Link } from 'react-router-dom';
import { 
  getStoredRegistrations, 
  RegistrationData,
  isRegistrationOpen,
  toggleRegistrationOpen
} from './registrationStore';
import {
  isAbstractSubmissionOpen,
  toggleAbstractSubmissionOpen
} from './abstractStore';
import { 
  getAuthenticatedStaff, 
  getCurrentActiveAdmin, 
  RegistrationAdmin 
} from '../admin/adminStore';
import { DelegateProfileModal } from './DelegateProfileModal';

export function DashboardView() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [authStaff, setAuthStaff] = useState<RegistrationAdmin | null>(getAuthenticatedStaff() || getCurrentActiveAdmin());
  const [selectedDelegate, setSelectedDelegate] = useState<RegistrationData | null>(null);
  const [isOpen, setIsOpen] = useState(() => isRegistrationOpen());
  const [isAbstractsOpen, setIsAbstractsOpen] = useState(() => isAbstractSubmissionOpen());

  const refresh = () => {
    setRegistrations(getStoredRegistrations());
    const staff = getAuthenticatedStaff();
    setAuthStaff(staff || getCurrentActiveAdmin());
    setIsOpen(isRegistrationOpen());
    setIsAbstractsOpen(isAbstractSubmissionOpen());
  };

  useEffect(() => {
    refresh();
    window.addEventListener('ifsw_registrations_updated', refresh);
    window.addEventListener('ifsw_auth_staff_changed', refresh);
    window.addEventListener('ifsw_active_admin_changed', refresh);
    window.addEventListener('ifsw_registration_status_changed', refresh);
    window.addEventListener('ifsw_abstracts_open_status_changed', refresh);
    return () => {
      window.removeEventListener('ifsw_registrations_updated', refresh);
      window.removeEventListener('ifsw_auth_staff_changed', refresh);
      window.removeEventListener('ifsw_active_admin_changed', refresh);
      window.removeEventListener('ifsw_registration_status_changed', refresh);
      window.removeEventListener('ifsw_abstracts_open_status_changed', refresh);
    };
  }, []);

  const total = registrations.length;
  const accepted = registrations.filter(r => r.status === 'accepted').length;
  const pending = registrations.filter(r => r.status === 'pending').length;
  const rejected = registrations.filter(r => r.status === 'rejected').length;
  const totalRevenue = registrations
    .filter(r => r.status !== 'rejected')
    .reduce((acc, r) => acc + (r.feeAmount || 0), 0);

  // Category counts for Pie Chart
  const categoryCounts = registrations.reduce((acc, r) => {
    const cat = r.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryPieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const CATEGORY_COLORS: Record<string, string> = {
    'International Delegate': '#0f766e',
    'Malawian Delegate': '#15803d',
    'Student Delegate': '#d97706',
    'Virtual Participant': '#6366f1',
    'Other': '#64748b'
  };

  // Status Donut Data
  const statusPieData = [
    { name: 'Accepted', value: accepted, color: '#16a34a' },
    { name: 'Pending Review', value: pending, color: '#eab308' },
    { name: 'Rejected', value: rejected, color: '#dc2626' }
  ].filter(d => d.value > 0);

  // Practice tracks Bar Chart
  const practiceCounts = registrations.reduce((acc, r) => {
    (r.areaPractice || []).forEach(area => {
      acc[area] = (acc[area] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topPracticeData = Object.entries(practiceCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5)
    .map(([track, count]) => ({ track, count }));

  // Presenters & Exhibitors
  const presentersCount = registrations.filter(r => r.isPresenter).length;
  const visaRequestsCount = registrations.filter(r => r.visaReq === 'Yes').length;

  return (
    <div className="max-w-[1360px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading">
            Registration Management Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time delegate submissions, verification analytics, and continental attendance metrics for IFSW Africa 2027.
          </p>
        </div>

        {authStaff && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-gray-200 shadow-2xs self-start sm:self-center">
            <div className="w-9 h-9 rounded-xl bg-[#08281a] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
              {authStaff.name ? authStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <div className="text-xs font-extrabold text-gray-900 leading-tight">
                {authStaff.name}
              </div>
              <div className="text-[11px] font-bold text-brand-green">
                @{authStaff.username} · {authStaff.role}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-extrabold hover:bg-brand-green-2 transition-all shadow-sm active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Test Registration Form</span>
          </Link>
          <Link
            to="/registration/delegates"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-bold hover:bg-gray-50 transition-all shadow-xs"
          >
            <Filter size={16} />
            <span>Review Delegates</span>
          </Link>
        </div>
      </div>

      {/* Live Public Portal Gateways Control Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Registration Toggle Switch */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <UserPlus size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-950">Registration Portal Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Control whether delegates can submit new registrations. Toggle to temporarily close the application form.
              </p>
            </div>
          </div>

          <button
            id="dashboard-reg-toggle-btn"
            onClick={() => {
              const next = toggleRegistrationOpen();
              setIsOpen(next);
            }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 select-none ${
              isOpen
                ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700'
            }`}
          >
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
              isOpen ? 'bg-emerald-600' : 'bg-gray-400'
            }`}>
              <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                isOpen ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </div>
            <span>{isOpen ? 'Close Registration' : 'Open Registration'}</span>
          </button>
        </div>

        {/* Abstract Submissions Toggle Switch */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isAbstractsOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <BookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-950">Abstract Submission Gate</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isAbstractsOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isAbstractsOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Control the gateway for academic and case abstract submissions. Toggle to block/allow new research paper entries.
              </p>
            </div>
          </div>

          <button
            id="dashboard-abstracts-toggle-btn"
            onClick={() => {
              const next = toggleAbstractSubmissionOpen();
              setIsAbstractsOpen(next);
            }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 select-none ${
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
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Total Submissions</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-950">{total}</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Live Ingest
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Received via delegate registration form</p>
        </div>

        {/* Accepted Applications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Accepted Delegates</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800">{accepted}</span>
            <span className="text-xs font-semibold text-gray-500">
              ({total > 0 ? Math.round((accepted / total) * 100) : 0}% clearance)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Cleared by secretariat committee</p>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Pending Review</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{pending}</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
              Awaiting Action
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Profiles waiting for committee review</p>
        </div>

        {/* Admission Fee Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Admission Fee Model</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-950">Free Admission</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200">
              Sponsored
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">All delegate categories complimentary for 2027</p>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
            <Mic2 size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">Paper Presenters</div>
            <div className="text-lg font-extrabold text-gray-900">{presentersCount} Abstracts Submitted</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 shrink-0">
            <Globe size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">Visa Support Letters</div>
            <div className="text-lg font-extrabold text-gray-900">{visaRequestsCount} Required</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">Database Status</div>
            <div className="text-lg font-extrabold text-emerald-700">Clean & Synchronized</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Delegate Category Breakdown</h2>
              <p className="text-xs text-gray-500">Distribution across International, Malawian, Student, and Virtual</p>
            </div>
            <span className="text-xs font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
              {total} Total
            </span>
          </div>

          {total === 0 ? (
            <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl my-2">
              <Users size={36} className="text-gray-300 mb-2" />
              <h4 className="text-xs font-extrabold text-gray-800">No Submissions Received Yet</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Submit your first registration form to see real-time category distributions.
              </p>
              <Link
                to="/register"
                className="mt-3 text-xs font-bold text-brand-green hover:underline inline-flex items-center gap-1"
              >
                Open Registration Form →
              </Link>
            </div>
          ) : (
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name] || '#64748b'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} Delegates (${Math.round(Number(value) / total * 100)}%)`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '13px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs text-gray-700 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Review Status Donut Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Application Review Status</h2>
              <p className="text-xs text-gray-500">Acceptance pipeline and verification progression</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              {accepted} Approved
            </span>
          </div>

          {total === 0 ? (
            <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl my-2">
              <Clock size={36} className="text-gray-300 mb-2" />
              <h4 className="text-xs font-extrabold text-gray-800">Awaiting Applications</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                As registrations arrive, review status breakdowns (Accepted, Pending, Rejected) will populate automatically.
              </p>
            </div>
          ) : (
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} Applications`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '13px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs text-gray-700 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Track & Practice Area Bar Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Primary Practice Areas & Conference Interests</h2>
            <p className="text-xs text-gray-500">Most represented thematic tracks among registered practitioners and scholars</p>
          </div>
          <Link to="/registration/delegates" className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1">
            <span>View All Delegates</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {topPracticeData.length === 0 ? (
          <div className="h-[200px] w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl">
            <span className="text-xs font-bold text-gray-500">No practice track data available yet</span>
            <span className="text-[11px] text-gray-400 mt-1">Submitted interest tags will render as a bar frequency chart here.</span>
          </div>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPracticeData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="track" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val: any) => [`${val} Delegates`, 'Interest']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '13px' }}
                />
                <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Submissions Ledger Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Recently Received Delegate Submissions</h2>
            <p className="text-xs text-gray-500">Inspect full profiles, accept, or decline applications directly.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/registration/submissions"
              className="text-xs font-bold text-brand-green hover:text-brand-green-2 px-3.5 py-1.5 rounded-xl border border-brand-green/30 hover:bg-brand-green/5 transition-colors"
            >
              View Full Submissions Ledger →
            </Link>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle size={36} className="text-gray-300 mx-auto" />
            <h4 className="text-sm font-extrabold text-gray-800">No Submissions Ingested</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              The registrations database is ready and clean. Use the registration form to submit your own test applications.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-all shadow-xs"
            >
              <PlusCircle size={14} /> Submit Test Registration
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Submission ID</th>
                  <th className="px-6 py-3.5">Applicant / Delegate</th>
                  <th className="px-6 py-3.5">Country & Org</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action Inside Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.slice(0, 6).map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">
                      {reg.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{reg.title} {reg.fullName}</div>
                      <div className="text-xs text-gray-500 font-mono">{reg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">{reg.country}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{reg.org}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                        {reg.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 whitespace-nowrap">
                      <div>{new Date(reg.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <div className="text-gray-400 font-mono">{new Date(reg.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4">
                      {reg.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                        </span>
                      )}
                      {reg.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                          <Clock size={12} className="text-amber-700" /> Pending Review
                        </span>
                      )}
                      {reg.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-300">
                          <XCircle size={12} className="text-red-700" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        id={`review-submission-${reg.id}`}
                        onClick={() => setSelectedDelegate(reg)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-green/10 hover:bg-brand-green hover:text-white text-brand-green text-xs font-extrabold transition-all active:scale-95"
                      >
                        <Eye size={13} />
                        <span>Inspect Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL SUBMITTED PROFILE DOSSIER MODAL WITH ACTION BUTTONS INSIDE */}
      {selectedDelegate && (
        <DelegateProfileModal 
          delegate={selectedDelegate} 
          onClose={() => setSelectedDelegate(null)}
          onStatusUpdated={refresh}
        />
      )}
    </div>
  );
}