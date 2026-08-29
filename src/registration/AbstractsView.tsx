import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  BookOpen,
  Check,
  X,
  FileCheck,
  Tag,
  Briefcase
} from 'lucide-react';
import { getAbstracts, updateAbstractStatus, AbstractSubmission, fetchFreshAbstracts } from './abstractStore';
import { Link } from 'react-router-dom';

export function AbstractsView() {
  const [abstracts, setAbstracts] = useState<AbstractSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [proposalTypeFilter, setProposalTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedAbstract, setSelectedAbstract] = useState<AbstractSubmission | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const reload = () => {
    const list = getAbstracts();
    setAbstracts(list);
    setSelectedAbstract(current => {
      if (!current) return null;
      return list.find(a => a.id === current.id) || null;
    });
  };

  useEffect(() => {
    setAbstracts(getAbstracts());
    fetchFreshAbstracts();

    const handleUpdate = () => {
      reload();
    };

    window.addEventListener('ifsw_abstracts_updated', handleUpdate);
    return () => window.removeEventListener('ifsw_abstracts_updated', handleUpdate);
  }, []);

  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: 'accepted' | 'rejected' | 'pending') => {
    setIsUpdatingStatus(true);
    try {
      await updateAbstractStatus(id, newStatus, reviewNote);
      setReviewNote('');
      // Refresh current selection
      const list = getAbstracts();
      const updated = list.find(a => a.id === id);
      if (updated) setSelectedAbstract(updated);
      setActionSuccessMessage(`Abstract proposal status updated to ${newStatus.toUpperCase()} successfully.`);
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Failed to update status:', err);
      setActionSuccessMessage('Error updating abstract status.');
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const sortedAndFiltered = abstracts
    .filter(a => {
      const matchesSearch =
        a.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.abstractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.institutionAffiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesProposal = proposalTypeFilter === 'all' || a.proposalType === proposalTypeFilter;
      return matchesSearch && matchesStatus && matchesProposal;
    })
    .sort((a, b) => {
      const timeA = new Date(a.submittedAt).getTime();
      const timeB = new Date(b.submittedAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const pendingCount = abstracts.filter(a => a.status === 'pending').length;
  const acceptedCount = abstracts.filter(a => a.status === 'accepted').length;
  const rejectedCount = abstracts.filter(a => a.status === 'rejected').length;

  const handleExportCSV = () => {
    const headers = [
      'Abstract ID',
      'Submitted Date',
      'Email',
      'Title',
      'First Name',
      'Surname',
      'Job Title',
      'Institution & Country',
      'Theme Selection',
      'Proposal Type',
      'Abstract Title',
      'Abstract Body',
      'Keywords',
      'File URL',
      'Status'
    ];

    const rows = sortedAndFiltered.map(a => {
      const d = new Date(a.submittedAt);
      return [
        `"${a.id}"`,
        `"${d.toISOString().slice(0, 10)}"`,
        `"${a.email}"`,
        `"${a.title || ''}"`,
        `"${a.firstName}"`,
        `"${a.surname}"`,
        `"${a.jobTitle || ''}"`,
        `"${a.institutionAffiliation.replace(/"/g, '""')}"`,
        `"${a.themeSelection.replace(/"/g, '""')}"`,
        `"${a.proposalType}"`,
        `"${a.abstractTitle.replace(/"/g, '""')}"`,
        `"${a.abstractBody.replace(/"/g, '""').slice(0, 500)}..."`,
        `"${a.keywords.replace(/"/g, '""')}"`,
        `"${a.fileUrl || ''}"`,
        `"${a.status}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IFSW_Africa_2027_Abstracts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="abstracts-view-root" className="max-w-[1360px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div id="abstracts-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-[#06291a] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Research Dossiers
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-heading mt-1">
            Abstract Proposals Review Board
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
            Evaluate scholarly presentations, run selection audits, and dispatch status review declarations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/abstract-submission"
            id="abstracts-btn-launch"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06291a] text-white text-xs font-extrabold uppercase tracking-widest hover:bg-[#0a452c] transition-all duration-200 shadow-sm active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Submit Proposal</span>
          </Link>
          <button
            onClick={handleExportCSV}
            disabled={abstracts.length === 0}
            id="abstracts-btn-export"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-extrabold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div id="abstracts-success-alert" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="p-1 text-emerald-700 hover:text-emerald-950 transition-colors rounded-lg hover:bg-emerald-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats row */}
      <div id="abstracts-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Submitted</div>
            <div className="text-3xl font-black text-gray-950 mt-1">{abstracts.length}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 text-[#06291a] border border-emerald-100/50">
            <BookOpen size={18} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pending Review</div>
            <div className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/40">
            <Clock size={18} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Accepted</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">{acceptedCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/40">
            <CheckCircle2 size={18} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rejected</div>
            <div className="text-3xl font-black text-red-600 mt-1">{rejectedCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 text-red-600 border border-red-200/40">
            <XCircle size={18} className="stroke-[2.5]" />
          </div>
        </div>
      </div>

      {abstracts.length === 0 ? (
        <div id="abstracts-empty-card" className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#06291a] flex items-center justify-center mx-auto border border-emerald-100">
            <FileText size={30} className="stroke-[2]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">
              No Abstract Submissions Logged
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              As soon as researchers and practitioners submit their abstracts through the conference portal, they will appear in this review ledger for evaluation.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div id="abstracts-controls-bar" className="bg-white rounded-2xl p-4.5 border border-gray-200/80 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="abstracts-search-input"
                type="text"
                placeholder="Search by ID, applicant name, title, keywords, or institution Affiliation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 focus:bg-white rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Proposal Type Filter */}
              <select
                id="abstracts-proposal-select"
                value={proposalTypeFilter}
                onChange={(e) => setProposalTypeFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all"
              >
                <option value="all">All Types of Proposals</option>
                <option value="Individual paper">Individual paper</option>
                <option value="Co-authored paper">Co-authored paper</option>
                <option value="Poster presentation">Poster presentation</option>
                <option value="Workshop">Workshop</option>
              </select>

              {/* Status Tabs */}
              <div id="abstracts-status-filters" className="flex p-1 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200">
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
                id="abstracts-sort-toggle"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
              >
                <ArrowUpDown size={14} className="text-gray-500" />
                <span className="uppercase tracking-wider text-[10px]">{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* List/Table */}
          <div id="abstracts-table-card" className="bg-white rounded-3xl border border-gray-200/95 shadow-[0_4px_16px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/75 text-[10px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4.5">Abstract Ref</th>
                    <th className="px-6 py-4.5">Submitted Date</th>
                    <th className="px-6 py-4.5">Author / Presenter</th>
                    <th className="px-6 py-4.5">Proposal Type & Title</th>
                    <th className="px-6 py-4.5">Keywords</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedAndFiltered.map((abs) => {
                    const submitDate = new Date(abs.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                    return (
                      <tr 
                        key={abs.id} 
                        id={`abstract-row-${abs.id}`}
                        className="hover:bg-emerald-50/20 transition-all duration-150 group cursor-pointer"
                        onClick={() => setSelectedAbstract(abs)}
                      >
                        {/* Ref ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[10px] font-black text-emerald-950 bg-emerald-50/70 px-2.5 py-1 rounded-md border border-emerald-100/40">
                            {abs.id}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-950">
                          {submitDate}
                        </td>

                        {/* Author */}
                        <td className="px-6 py-4">
                          <div className="font-black text-gray-900 text-sm">
                            {abs.title} {abs.firstName} {abs.surname}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold font-mono mt-0.5">{abs.email}</div>
                          <div className="text-[11px] text-gray-400 font-medium truncate max-w-[180px]" title={abs.institutionAffiliation}>
                            {abs.institutionAffiliation}
                          </div>
                        </td>

                        {/* Proposal Details */}
                        <td className="px-6 py-4 max-w-[300px]">
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-950 border border-emerald-200 mb-1.5">
                            {abs.proposalType}
                          </span>
                          <div className="font-black text-gray-950 text-xs truncate" title={abs.abstractTitle}>
                            {abs.abstractTitle}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5" title={abs.themeSelection}>
                            {abs.themeSelection}
                          </div>
                        </td>

                        {/* Keywords */}
                        <td className="px-6 py-4 text-xs font-mono">
                          <span className="text-gray-500 line-clamp-1 font-semibold" title={abs.keywords}>
                            {abs.keywords}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {abs.status === 'accepted' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-950 border border-emerald-200">
                              <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                            </span>
                          )}
                          {abs.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-950 border border-amber-200">
                              <Clock size={12} className="text-amber-700" /> Pending
                            </span>
                          )}
                          {abs.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-950 border border-red-200/50">
                              <XCircle size={12} className="text-red-700" /> Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            id={`inspect-abs-${abs.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAbstract(abs);
                            }}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#06291a] hover:text-[#0a452c] px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Evaluate</span>
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
                No matching scholarly proposals found
              </div>
            )}
          </div>
        </>
      )}

      {/* ABS EVALUATION MODAL & SIDE DRAWER */}
      {selectedAbstract && (
        <div id="abstract-eval-modal" className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-3xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#06291a] text-white p-6 sm:p-8 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black bg-emerald-950 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-800">
                    {selectedAbstract.id}
                  </span>
                  <span className="text-xs text-emerald-100/80 font-semibold tracking-wider uppercase">
                    Received {new Date(selectedAbstract.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-black font-heading tracking-tight">
                  Abstract Submission Review Dossier
                </h2>
              </div>
              <button 
                onClick={() => {
                  setSelectedAbstract(null);
                  setReviewNote('');
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              
              {/* Proposal Header */}
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#06291a] border border-emerald-200">
                  {selectedAbstract.proposalType}
                </span>
                <h3 className="text-lg font-black tracking-tight text-gray-950 font-heading leading-snug">
                  {selectedAbstract.abstractTitle}
                </h3>
                <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                  <Tag size={13} className="text-[#06291a]" />
                  <span>Theme Cluster: {selectedAbstract.themeSelection}</span>
                </p>
              </div>

              {/* Presenter Information */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150/50 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-black tracking-widest text-gray-400">Presenter</div>
                  <div className="text-xs font-black text-gray-950">
                    {selectedAbstract.title || ''} {selectedAbstract.firstName} {selectedAbstract.surname}
                  </div>
                  {selectedAbstract.jobTitle && (
                    <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Briefcase size={12} className="text-gray-400 shrink-0" />
                      <span>{selectedAbstract.jobTitle}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 font-mono">{selectedAbstract.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-black tracking-widest text-gray-400">Affiliation & Institution</div>
                  <div className="text-xs font-black text-gray-950 leading-relaxed">
                    {selectedAbstract.institutionAffiliation}
                  </div>
                  {selectedAbstract.authorsAffiliation && (
                    <div className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                      <span className="text-gray-400 uppercase tracking-widest text-[9px] block">Co-authors</span>
                      {selectedAbstract.authorsAffiliation}
                    </div>
                  )}
                </div>
              </div>

              {/* Abstract Body Block */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Abstract Proposal Body</span>
                  <span className="text-[10px] font-mono font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    {selectedAbstract.abstractBody.split(/\s+/).length} WORDS
                  </span>
                </div>
                <div className="text-xs text-gray-700 font-medium font-sans leading-relaxed bg-gray-50/50 p-5 rounded-2xl border border-gray-200/80 whitespace-pre-wrap">
                  {selectedAbstract.abstractBody}
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <div className="text-[9px] uppercase font-black tracking-widest text-gray-400">Keywords</div>
                <div className="text-xs text-gray-800 font-mono font-semibold">
                  {selectedAbstract.keywords}
                </div>
              </div>

              {/* Uploaded File Format downloads */}
              {selectedAbstract.fileUrl ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#06291a] rounded-xl text-white">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-emerald-950 uppercase tracking-wider">Formatted Abstract Document</div>
                      <div className="text-[10px] text-emerald-700 font-medium">Uploaded for offline peer-review validation</div>
                    </div>
                  </div>
                  <a
                    href={selectedAbstract.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest bg-[#06291a] text-white px-4 py-2.5 rounded-xl hover:bg-[#0a452c] transition-colors"
                  >
                    <Download size={14} />
                    <span>Download File</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  No supplementary document was attached.
                </div>
              )}

              {/* Status note & reviewed details if accepted/rejected */}
              {selectedAbstract.status !== 'pending' && (
                <div className={`p-4 rounded-2xl border ${
                  selectedAbstract.status === 'accepted' 
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                    : 'bg-red-50/50 border-red-200 text-red-950'
                } text-xs space-y-2`}>
                  <p className="font-black flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    {selectedAbstract.status === 'accepted' ? <CheckCircle2 size={14} className="text-emerald-700" strokeWidth={2.5} /> : <XCircle size={14} className="text-red-700" strokeWidth={2.5} />}
                    <span>Proposal Decision: {selectedAbstract.status}</span>
                  </p>
                  {selectedAbstract.statusNote && (
                    <p className="italic font-semibold leading-relaxed bg-white/70 p-3.5 rounded-xl border border-gray-100">
                      &ldquo;{selectedAbstract.statusNote}&rdquo;
                    </p>
                  )}
                  {selectedAbstract.statusUpdatedAt && (
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      Decision timestamp: {new Date(selectedAbstract.statusUpdatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Evaluation Form Decision Control Panel */}
              <div className="pt-5 border-t border-gray-100 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Review Decision & Appraisal</div>
                
                <textarea
                  placeholder="Insert reviewer assessment, peer-review remarks, or revision feedback here..."
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all bg-gray-50/40"
                />

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAbstract.id, 'accepted')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#06291a] text-white font-black uppercase tracking-widest text-xs px-4 py-3 rounded-2xl hover:bg-[#0a452c] transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  >
                    <Check size={14} className="stroke-[2.5]" />
                    <span>Accept Abstract</span>
                  </button>

                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAbstract.id, 'rejected')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-800 text-white font-black uppercase tracking-widest text-xs px-4 py-3 rounded-2xl hover:bg-red-900 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  >
                    <X size={14} className="stroke-[2.5]" />
                    <span>Reject / Decline</span>
                  </button>

                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAbstract.id, 'pending')}
                    className="inline-flex items-center justify-center gap-1.5 border border-gray-200 bg-white text-gray-700 font-black uppercase tracking-widest text-xs px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  >
                    <Clock size={14} />
                    <span>Pending</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => {
                  setSelectedAbstract(null);
                  setReviewNote('');
                }}
                className="px-5 py-2.5 border border-gray-200 bg-white text-gray-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
