import { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown, 
  Eye, 
  PlusCircle, 
  AlertCircle, 
  Mail, 
  Building, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';
import { getStoredRegistrations, RegistrationData } from './registrationStore';
import { DelegateProfileModal } from './DelegateProfileModal';
import { Link } from 'react-router-dom';

export function SubmissionsView() {
  const [submissions, setSubmissions] = useState<RegistrationData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedSubmission, setSelectedSubmission] = useState<RegistrationData | null>(null);

  const reload = () => {
    const list = getStoredRegistrations();
    setSubmissions(list);
    setSelectedSubmission(current => {
      if (!current) return null;
      return list.find(s => s.id === current.id) || null;
    });
  };

  useEffect(() => {
    reload();
    window.addEventListener('ifsw_registrations_updated', reload);
    return () => window.removeEventListener('ifsw_registrations_updated', reload);
  }, []);

  const sortedAndFiltered = submissions
    .filter(s => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const timeA = new Date(a.submittedAt).getTime();
      const timeB = new Date(b.submittedAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const handleExportCSV = () => {
    const headers = [
      'Submission ID',
      'Submitted Date',
      'Submitted Time (UTC)',
      'Full Name',
      'Title',
      'Email',
      'Phone',
      'Country',
      'Organization',
      'Delegate Category',
      'Admission Fee',
      'Status',
      'Presenter',
      'Exhibitor',
      'Visa Requested'
    ];

    const rows = sortedAndFiltered.map(s => {
      const d = new Date(s.submittedAt);
      return [
        `"${s.id}"`,
        `"${d.toISOString().slice(0, 10)}"`,
        `"${d.toTimeString().slice(0, 8)}"`,
        `"${s.fullName}"`,
        `"${s.title}"`,
        `"${s.email}"`,
        `"${s.phone}"`,
        `"${s.country}"`,
        `"${s.org.replace(/"/g, '""')}"`,
        `"${s.category}"`,
        `"Free Admission"`,
        `"${s.status}"`,
        s.isPresenter ? 'Yes' : 'No',
        s.isExhibitor ? 'Yes' : 'No',
        s.visaReq || 'No'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IFSW_Africa_2027_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const dateStr = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  return (
    <div className="max-w-[1360px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Submissions Audit Ledger
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Chronological log of all submitted registration records with exact date, time, and verification status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-all shadow-xs active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Test New Submission</span>
          </Link>
          <button
            onClick={handleExportCSV}
            disabled={submissions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-bold hover:bg-gray-50 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto border border-brand-green/20">
            <Calendar size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-gray-900">
              No Submissions Logged Yet
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              All mock registrations have been cleared. As soon as delegates apply through the conference registration portal, each submission will be recorded here with millisecond timestamps and full profile details.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-2 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={16} />
              <span>Submit Test Delegate Application</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by ID, name, email, or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              >
                <option value="all">All Categories</option>
                <option value="International Delegate">International Delegate</option>
                <option value="Malawian Delegate">Malawian Delegate</option>
                <option value="Student Delegate">Student Delegate</option>
                <option value="Virtual Participant">Virtual Participant</option>
              </select>

              {/* Status Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-xl text-xs font-bold border border-gray-200">
                {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      statusFilter === st 
                        ? 'bg-white text-gray-950 shadow-xs' 
                        : 'text-gray-600 hover:text-gray-950'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-xs"
                title="Toggle Timestamp Sort Order"
              >
                <ArrowUpDown size={14} />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Submission Ref</th>
                    <th className="px-6 py-4">Submitted Date & Time</th>
                    <th className="px-6 py-4">Applicant / Delegate</th>
                    <th className="px-6 py-4">Category & Admission</th>
                    <th className="px-6 py-4">Institution & Country</th>
                    <th className="px-6 py-4">Verification Status</th>
                    <th className="px-6 py-4 text-right">Inspect Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedAndFiltered.map((sub) => {
                    const { dateStr, timeStr } = formatDateTime(sub.submittedAt);
                    return (
                      <tr 
                        key={sub.id} 
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-extrabold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                            {sub.id}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                            <Calendar size={13} className="text-gray-400" />
                            {dateStr}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono mt-0.5">
                            <Clock size={12} className="text-gray-400" />
                            {timeStr}
                          </div>
                        </td>

                        {/* Delegate */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm">
                            {sub.title} {sub.fullName}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{sub.email}</div>
                          {sub.isPresenter && (
                            <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                              Presenter
                            </span>
                          )}
                        </td>

                        {/* Category & Admission */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                            {sub.category}
                          </span>
                          <div className="text-[11px] font-extrabold text-emerald-800 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Free Admission</span>
                          </div>
                        </td>

                        {/* Institution */}
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                            {sub.org}
                          </div>
                          <div className="text-xs text-gray-500">{sub.country}</div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sub.status === 'accepted' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                            </span>
                          )}
                          {sub.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                              <Clock size={12} className="text-amber-700" /> Pending Review
                            </span>
                          )}
                          {sub.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-300">
                              <XCircle size={12} className="text-red-700" /> Rejected
                            </span>
                          )}
                        </td>

                        {/* Action inside profile */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            id={`inspect-sub-${sub.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubmission(sub);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-green hover:text-brand-green-2 group-hover:underline px-3 py-1 rounded-lg hover:bg-brand-green/10 transition-colors"
                          >
                            <Eye size={13} />
                            <span>Inspect Profile</span>
                            <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sortedAndFiltered.length === 0 && (
              <div className="p-12 text-center text-gray-500 text-xs font-semibold">
                No submissions found matching your search and filter criteria.
              </div>
            )}
          </div>
        </>
      )}

      {/* FULL SUBMITTED PROFILE DOSSIER MODAL WITH ACTION BUTTONS INSIDE */}
      {selectedSubmission && (
        <DelegateProfileModal 
          delegate={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)}
          onStatusUpdated={reload}
        />
      )}
    </div>
  );
}
