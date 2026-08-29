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
    <div id="submissions-view-root" className="max-w-[1360px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div id="submissions-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-[#06291a] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Audit Trail
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-heading mt-1">
            Submissions Audit Ledger
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
            Chronological register tracking raw database registrations with immutable submission timestamps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/register"
            id="submissions-btn-launch"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06291a] text-white text-xs font-extrabold uppercase tracking-widest hover:bg-[#0a452c] transition-all duration-200 shadow-sm active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Launch Form</span>
          </Link>
          <button
            onClick={handleExportCSV}
            disabled={submissions.length === 0}
            id="submissions-btn-export"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-extrabold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div id="submissions-empty-card" className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#06291a] flex items-center justify-center mx-auto border border-emerald-100">
            <Calendar size={30} className="stroke-[2]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">
              No Submissions Logged Yet
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All mock registrations are fully cleared. Once a delegate applies, their submission will log in real time with exact timezone timestamps.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06291a] hover:bg-[#0a452c] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={15} />
              <span>Submit Test Delegate Application</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div id="submissions-controls-bar" className="bg-white rounded-2xl p-4.5 border border-gray-200/80 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="submissions-search-input"
                type="text"
                placeholder="Search ledger by transaction ID, candidate name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 focus:bg-white rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                id="submissions-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all"
              >
                <option value="all">All Categories</option>
                <option value="IFSW Members">IFSW Members</option>
                <option value="Non-Members">Non-Members</option>
                <option value="International Delegate">International Delegate</option>
                <option value="Student Delegate">Student Delegate</option>
              </select>

              {/* Status Tabs */}
              <div id="submissions-status-filters" className="flex p-1 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200">
                {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      statusFilter === st 
                        ? 'bg-[#06291a] text-white shadow-xs' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Sort Order */}
              <button
                id="submissions-sort-toggle"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
                title="Toggle Timestamp Sort Order"
              >
                <ArrowUpDown size={14} className="text-gray-500" />
                <span className="uppercase tracking-wider text-[10px]">{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div id="submissions-table-card" className="bg-white rounded-3xl border border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/75 text-[10px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4.5">ID</th>
                    <th className="px-6 py-4.5">Submitted timestamp</th>
                    <th className="px-6 py-4.5">Candidate / Contact</th>
                    <th className="px-6 py-4.5">Category</th>
                    <th className="px-6 py-4.5">Institution & Country</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedAndFiltered.map((sub) => {
                    const { dateStr, timeStr } = formatDateTime(sub.submittedAt);
                    return (
                      <tr 
                        key={sub.id} 
                        id={`submission-row-${sub.id}`}
                        className="hover:bg-emerald-50/20 transition-all duration-150 group cursor-pointer"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[10px] font-black text-emerald-950 bg-emerald-50/70 px-2 py-1 rounded-md border border-emerald-100/40">
                            {sub.id}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-950">
                            <Calendar size={13} className="text-gray-400" />
                            {dateStr}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mt-1">
                            <Clock size={12} className="text-gray-400" />
                            {timeStr}
                          </div>
                        </td>

                        {/* Delegate */}
                        <td className="px-6 py-4">
                          <div className="font-black text-gray-900 text-sm">
                            {sub.title} {sub.fullName}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold font-mono mt-0.5">{sub.email}</div>
                          {sub.isPresenter && (
                            <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-950 border border-purple-200">
                              Presenter
                            </span>
                          )}
                        </td>

                        {/* Category & Admission */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gray-100 border border-gray-200 text-gray-700">
                            {sub.category}
                          </span>
                          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mt-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Cleared</span>
                          </div>
                        </td>

                        {/* Institution */}
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-950 truncate max-w-[180px]">
                            {sub.org}
                          </div>
                          <div className="text-[11px] font-medium text-gray-400 mt-0.5">{sub.country}</div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sub.status === 'accepted' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-950 border border-emerald-200">
                              <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                            </span>
                          )}
                          {sub.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-950 border border-amber-200">
                              <Clock size={12} className="text-amber-700" /> Reviewing
                            </span>
                          )}
                          {sub.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-950 border border-red-200/50">
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
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#06291a] hover:text-[#0a452c] px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                            <ChevronRight size={13} className="text-[#06291a]/60 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sortedAndFiltered.length === 0 && (
              <div className="p-16 text-center text-gray-500 text-xs font-bold uppercase tracking-widest bg-gray-50/50 border-t border-gray-100">
                No matching transactional logs found
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
