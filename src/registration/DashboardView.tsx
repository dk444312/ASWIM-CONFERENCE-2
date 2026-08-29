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
    'International Delegate': '#0d4e32',
    'Malawian Delegate': '#15803d',
    'Student Delegate': '#c59c34',
    'Virtual Participant': '#4f46e5',
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
    <div id="dashboard-view-root" className="max-w-[1360px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Panel & Actions */}
      <div id="dashboard-header-container" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black bg-[#06291a] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Control Center
            </span>
            <span className="text-xs font-bold text-gray-400">
              ID: {authStaff ? authStaff.id : 'N/A'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-heading leading-tight mt-1">
            Registration Management Console
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
            Real-time delegate review, continental representation statistics, research abstracts clearance, and system configurations.
          </p>
        </div>

        {/* Action button pairings */}
        <div id="dashboard-quick-actions" className="flex flex-wrap items-center gap-3">
          <Link
            to="/register"
            id="action-btn-test-reg"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06291a] text-white text-xs font-extrabold uppercase tracking-widest hover:bg-[#0a452c] transition-all duration-200 shadow-sm active:scale-95 group"
          >
            <PlusCircle size={15} className="transition-transform group-hover:rotate-90" />
            <span>Launch Form</span>
          </Link>
          <Link
            to="/registration/delegates"
            id="action-btn-review-list"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-extrabold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm active:scale-95"
          >
            <Filter size={15} />
            <span>Review Queue</span>
          </Link>
        </div>
      </div>

      {/* Live Public Portal Gateways Hardware-Style Control Switches */}
      <div id="dashboard-gateways-container" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Registration Toggle Switch */}
        <div id="gateway-reg-card" className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:border-emerald-200">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors duration-300 ${
              isOpen ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'
            }`}>
              <UserPlus size={22} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-black text-gray-900 leading-none">Registration Portal Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  isOpen ? 'bg-emerald-100/60 text-emerald-950 border-emerald-300/40' : 'bg-amber-100/60 text-amber-950 border-amber-300/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`} />
                  {isOpen ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                Allows practitioners to submit registration details and documents.
              </p>
            </div>
          </div>

          <button
            id="dashboard-reg-toggle-btn"
            onClick={() => {
              const next = toggleRegistrationOpen();
              setIsOpen(next);
            }}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer active:scale-95 shrink-0 select-none ${
              isOpen
                ? 'bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-950 hover:bg-amber-100/50'
                : 'bg-[#06291a] border-emerald-950 text-white hover:bg-[#0a452c]'
            }`}
          >
            <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 relative flex items-center ${
              isOpen ? 'bg-emerald-600' : 'bg-gray-300'
            }`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-3.5' : 'translate-x-0'
              }`} />
            </div>
            <span>{isOpen ? 'Close Gate' : 'Open Gate'}</span>
          </button>
        </div>

        {/* Abstract Submissions Toggle Switch */}
        <div id="gateway-abstracts-card" className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:border-emerald-200">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors duration-300 ${
              isAbstractsOpen ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'
            }`}>
              <BookOpen size={22} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-black text-gray-900 leading-none">Abstract Submission Gate</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  isAbstractsOpen ? 'bg-emerald-100/60 text-emerald-950 border-emerald-300/40' : 'bg-amber-100/60 text-amber-950 border-amber-300/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAbstractsOpen ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`} />
                  {isAbstractsOpen ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                Enables scholars to submit abstracts for active conference research tracks.
              </p>
            </div>
          </div>

          <button
            id="dashboard-abstracts-toggle-btn"
            onClick={() => {
              const next = toggleAbstractSubmissionOpen();
              setIsAbstractsOpen(next);
            }}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer active:scale-95 shrink-0 select-none ${
              isAbstractsOpen
                ? 'bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-950 hover:bg-amber-100/50'
                : 'bg-[#06291a] border-emerald-950 text-white hover:bg-[#0a452c]'
            }`}
          >
            <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 relative flex items-center ${
              isAbstractsOpen ? 'bg-emerald-600' : 'bg-gray-300'
            }`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                isAbstractsOpen ? 'translate-x-3.5' : 'translate-x-0'
              }`} />
            </div>
            <span>{isAbstractsOpen ? 'Close Gate' : 'Open Gate'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div id="dashboard-kpis-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Submissions */}
        <div id="kpi-total" className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Ingested</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-100 shrink-0">
              <Users size={16} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-5 space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-gray-900">{total}</span>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md border border-emerald-200/40">
                Live Data
              </span>
            </div>
            <p className="text-xs text-gray-400 font-semibold leading-tight">Submitted applications in database</p>
          </div>
        </div>

        {/* Accepted Applications */}
        <div id="kpi-accepted" className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Accepted Delegates</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle2 size={16} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-5 space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-emerald-800">{accepted}</span>
              <span className="text-[10px] font-bold text-gray-500">
                ({total > 0 ? Math.round((accepted / total) * 100) : 0}% clearance)
              </span>
            </div>
            <p className="text-xs text-gray-400 font-semibold leading-tight">Cleared by subcommittee reviewers</p>
          </div>
        </div>

        {/* Pending Review */}
        <div id="kpi-pending" className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pending Review</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100 shrink-0">
              <Clock size={16} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-5 space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-amber-700">{pending}</span>
              {pending > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100/60 text-amber-950 rounded-md border border-amber-200/40 animate-pulse">
                  Awaiting Action
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-semibold leading-tight">Requires dossier and voucher audit</p>
          </div>
        </div>

        {/* Admission Fee Status Card */}
        <div id="kpi-sponsored" className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Admission Fee Model</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
              <Sparkles size={16} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-5 space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-[#06291a]">Free / Sponsored</span>
            </div>
            <p className="text-xs text-gray-400 font-semibold leading-tight">Complimentary admission for 2027</p>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div id="dashboard-micro-metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-100 shrink-0">
            <Mic2 size={18} className="stroke-[2.5]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Research Presenters</div>
            <div className="text-sm font-black text-gray-900">{presentersCount} Scholars Submitted</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-100 shrink-0">
            <Globe size={18} className="stroke-[2.5]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visa Support Requests</div>
            <div className="text-sm font-black text-gray-900">{visaRequestsCount} Assistance Needed</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
            <ShieldCheck size={18} className="stroke-[2.5]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Local Database Engine</div>
            <div className="text-sm font-black text-emerald-800">Clean & Operational</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div id="dashboard-charts-row" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">Delegate Category Distribution</h2>
              <p className="text-xs text-gray-500 mt-1">Breakdown across International, Malawian, Student, and Virtual cohorts</p>
            </div>
            <span className="text-[10px] font-black bg-gray-100 text-gray-800 px-3 py-1 rounded-md">
              {total} Total
            </span>
          </div>

          {total === 0 ? (
            <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl my-2">
              <Users size={32} className="text-gray-300 mb-2" />
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">No Submissions Ingested</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Once delegates register, real-time statistics will compile and populate here.
              </p>
            </div>
          ) : (
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
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
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] text-gray-600 font-extrabold uppercase tracking-wide">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Review Status Donut Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">Application Review Pipeline</h2>
              <p className="text-xs text-gray-500 mt-1">Acceptance and verification progression status metrics</p>
            </div>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-950 border border-emerald-200 px-3 py-1 rounded-md">
              {accepted} Approved
            </span>
          </div>

          {total === 0 ? (
            <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl my-2">
              <Clock size={32} className="text-gray-300 mb-2" />
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Waiting for Applications</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Registration reviews will automatically populate the clearance metrics graph.
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
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] text-gray-600 font-extrabold uppercase tracking-wide">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Track & Practice Area Bar Chart */}
      <div id="dashboard-bar-chart" className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">Thematic Conference Interests</h2>
            <p className="text-xs text-gray-500 mt-1">Most represented social work practice tracks among registered delegates</p>
          </div>
          <Link to="/registration/delegates" className="text-xs font-black uppercase tracking-wider text-[#06291a] hover:text-[#c59c34] transition-colors flex items-center gap-1.5 self-start sm:self-center">
            <span>View All Delegates</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {topPracticeData.length === 0 ? (
          <div className="h-[200px] w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">No Practice Tracks Registered Yet</span>
            <span className="text-[11px] text-gray-400 mt-1">Submitted track interests will display as a bar chart frequency chart here.</span>
          </div>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPracticeData} margin={{ top: 10, right: 20, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="track" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                <Tooltip 
                  formatter={(val: any) => [`${val} Delegates`, 'Practice Track']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#0d4e32" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Submissions Ledger Table */}
      <div id="dashboard-ledger-table" className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">Recent Submissions Ledger</h2>
            <p className="text-xs text-gray-500 mt-1">Inspect profiles and credentials to authorize delegate admission.</p>
          </div>
          <div>
            <Link
              to="/registration/submissions"
              id="action-btn-submissions-ledger"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-2xl border border-emerald-300 bg-emerald-50/60 text-emerald-950 text-xs font-extrabold uppercase tracking-widest hover:bg-emerald-100 hover:border-emerald-400 transition-all duration-200"
            >
              <span>View Full Ledger</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <AlertCircle size={36} className="text-gray-300 mx-auto" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Database Ledger is Empty</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              No registration records found. Submit your first test registration to test out approval pipelines.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#06291a] text-white text-xs font-extrabold uppercase tracking-widest hover:bg-[#0a452c] transition-all shadow-xs"
            >
              <PlusCircle size={14} /> Submit Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200/80 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Submission ID</th>
                  <th className="px-6 py-4">Applicant / Delegate</th>
                  <th className="px-6 py-4">Country & Org</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.slice(0, 6).map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#fcfdfc] transition-all duration-150">
                    <td className="px-6 py-4.5 font-mono text-xs font-black text-emerald-900 bg-emerald-50/10">
                      {reg.id}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="font-extrabold text-gray-900 text-sm leading-tight">{reg.title} {reg.fullName}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">{reg.email}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="text-gray-900 font-extrabold text-xs">{reg.country}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[200px] mt-0.5 font-medium">{reg.org}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide bg-gray-50 border border-gray-200 text-gray-800">
                        {reg.category}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-[11px] text-gray-600 whitespace-nowrap">
                      <div className="font-semibold text-gray-700">{new Date(reg.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <div className="text-gray-400 font-mono mt-0.5">{new Date(reg.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      {reg.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-950 border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                        </span>
                      )}
                      {reg.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-950 border border-amber-200">
                          <Clock size={12} className="text-amber-700" /> Pending Review
                        </span>
                      )}
                      {reg.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50/60 text-red-950 border border-red-200/50">
                          <XCircle size={12} className="text-red-700" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right whitespace-nowrap">
                      <button
                        id={`review-submission-${reg.id}`}
                        onClick={() => setSelectedDelegate(reg)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-[#06291a] hover:text-white hover:border-emerald-950 text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs"
                      >
                        <Eye size={13} className="stroke-[2.5]" />
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
