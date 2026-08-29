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

  const reload = async () => {
    const list = getAbstracts();
    setAbstracts(list);
    if (selectedAbstract) {
      const updated = list.find(a => a.id === selectedAbstract.id);
      if (updated) setSelectedAbstract(updated);
    }
  };

  useEffect(() => {
    reload();
    fetchFreshAbstracts().then(setAbstracts);

    window.addEventListener('ifsw_abstracts_updated', reload);
    return () => window.removeEventListener('ifsw_abstracts_updated', reload);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'accepted' | 'rejected' | 'pending') => {
    setIsUpdatingStatus(true);
    try {
      await updateAbstractStatus(id, newStatus, reviewNote);
      setReviewNote('');
      // Refresh current selection
      const list = getAbstracts();
      const updated = list.find(a => a.id === id);
      if (updated) setSelectedAbstract(updated);
      alert(`Abstract proposal status updated to ${newStatus.toUpperCase()} successfully.`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating abstract status.');
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
    <div className="max-w-[1360px] mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Abstract Proposals Review Board
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Receive and evaluate abstract submissions, workshops, paper outlines, and uploads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/abstract-submission"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-all shadow-xs active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Submit Proposal Form</span>
          </Link>
          <button
            onClick={handleExportCSV}
            disabled={abstracts.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-bold hover:bg-gray-50 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Submitted</div>
            <div className="text-2xl font-black text-gray-950 mt-1">{abstracts.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-brand-green/10 text-brand-green">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Pending Review</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Accepted</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{acceptedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Rejected</div>
            <div className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200/50">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {abstracts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto border border-brand-green/20">
            <FileText size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-gray-900">
              No Abstract Submissions Logged
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              As soon as researchers and practitioners submit their abstracts through the conference portal, they will appear in this review ledger for evaluation.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by ID, applicant name, title, keywords, or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Proposal Type Filter */}
              <select
                value={proposalTypeFilter}
                onChange={(e) => setProposalTypeFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              >
                <option value="all">All Types of Proposals</option>
                <option value="Individual paper">Individual paper</option>
                <option value="Co-authored paper">Co-authored paper</option>
                <option value="Poster presentation">Poster presentation</option>
                <option value="Workshop">Workshop</option>
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
              >
                <ArrowUpDown size={14} />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* List/Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Abstract Ref</th>
                    <th className="px-6 py-4">Submitted Date</th>
                    <th className="px-6 py-4">Author / Presenter</th>
                    <th className="px-6 py-4">Proposal Type & Title</th>
                    <th className="px-6 py-4">Keywords</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
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
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedAbstract(abs)}
                      >
                        {/* Ref ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-extrabold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                            {abs.id}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                          {submitDate}
                        </td>

                        {/* Author */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm">
                            {abs.title} {abs.firstName} {abs.surname}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{abs.email}</div>
                          <div className="text-[11px] text-gray-500 truncate max-w-[200px]" title={abs.institutionAffiliation}>
                            {abs.institutionAffiliation}
                          </div>
                        </td>

                        {/* Proposal Details */}
                        <td className="px-6 py-4 max-w-[300px]">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-green/10 text-brand-green border border-brand-green/25 mb-1">
                            {abs.proposalType}
                          </span>
                          <div className="font-extrabold text-gray-900 text-xs truncate" title={abs.abstractTitle}>
                            {abs.abstractTitle}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate" title={abs.themeSelection}>
                            {abs.themeSelection}
                          </div>
                        </td>

                        {/* Keywords */}
                        <td className="px-6 py-4 text-xs font-mono">
                          <span className="text-gray-600 line-clamp-1" title={abs.keywords}>
                            {abs.keywords}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {abs.status === 'accepted' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                            </span>
                          )}
                          {abs.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                              <Clock size={12} className="text-amber-700" /> Pending
                            </span>
                          )}
                          {abs.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-300">
                              <XCircle size={12} className="text-red-700" /> Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAbstract(abs);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-green hover:text-brand-green-2 group-hover:underline px-3 py-1 rounded-lg hover:bg-brand-green/10 transition-colors"
                          >
                            <Eye size={13} />
                            <span>Evaluate</span>
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
                No abstracts matched the selected filter query.
              </div>
            )}
          </div>
        </>
      )}

      {/* ABS EVALUATION MODAL & SIDE DRAWER */}
      {selectedAbstract && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-3xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#042619] text-white p-6 sm:p-8 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold bg-brand-gold/20 text-brand-gold px-2.5 py-0.5 rounded-md border border-brand-gold/30">
                    {selectedAbstract.id}
                  </span>
                  <span className="text-xs text-emerald-200 font-bold">
                    Submitted {new Date(selectedAbstract.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-heading">
                  Abstract Submission Review Dossier
                </h2>
              </div>
              <button 
                onClick={() => {
                  setSelectedAbstract(null);
                  setReviewNote('');
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              
              {/* Proposal Header */}
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-green/10 text-brand-green border border-brand-green/20">
                  {selectedAbstract.proposalType}
                </span>
                <h3 className="text-lg font-black tracking-tight text-gray-950 font-heading">
                  {selectedAbstract.abstractTitle}
                </h3>
                <p className="text-xs text-gray-600 font-semibold flex items-center gap-1.5">
                  <Tag size={13} className="text-brand-green" />
                  <span>Theme: {selectedAbstract.themeSelection}</span>
                </p>
              </div>

              {/* Presenter Information */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-black tracking-wider text-gray-400 font-sans">Presenter</div>
                  <div className="text-xs font-bold text-gray-900">
                    {selectedAbstract.title || ''} {selectedAbstract.firstName} {selectedAbstract.surname}
                  </div>
                  {selectedAbstract.jobTitle && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Briefcase size={12} className="text-gray-400" />
                      <span>{selectedAbstract.jobTitle}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 font-mono">{selectedAbstract.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-black tracking-wider text-gray-400 font-sans">Affiliation & Institution</div>
                  <div className="text-xs font-bold text-gray-900">
                    {selectedAbstract.institutionAffiliation}
                  </div>
                  {selectedAbstract.authorsAffiliation && (
                    <div className="text-[11px] text-gray-500 leading-relaxed">
                      <strong>Co-authors:</strong> {selectedAbstract.authorsAffiliation}
                    </div>
                  )}
                </div>
              </div>

              {/* Abstract Body Block */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">Abstract Proposal Body</span>
                  <span className="text-xs font-mono font-bold text-gray-500">
                    {selectedAbstract.abstractBody.split(/\s+/).length} words
                  </span>
                </div>
                <div className="text-xs text-gray-700 font-sans leading-relaxed bg-brand-cream/20 p-5 rounded-2xl border border-brand-line/50 whitespace-pre-wrap">
                  {selectedAbstract.abstractBody}
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-black tracking-wider text-gray-400">Keywords</div>
                <div className="text-xs text-gray-800 font-mono">
                  {selectedAbstract.keywords}
                </div>
              </div>

              {/* Uploaded File Format downloads */}
              {selectedAbstract.fileUrl ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Formatted Abstract Document</div>
                      <div className="text-[10px] text-emerald-700">Uploaded for offline/alternative format evaluation</div>
                    </div>
                  </div>
                  <a
                    href={selectedAbstract.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-700 text-white px-3.5 py-2 rounded-xl hover:bg-emerald-800 transition-colors"
                  >
                    <Download size={14} />
                    <span>Download File</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
                  No additional document upload file was attached for offline evaluation.
                </div>
              )}

              {/* Status note & reviewed details if accepted/rejected */}
              {selectedAbstract.status !== 'pending' && (
                <div className={`p-4 rounded-2xl border ${
                  selectedAbstract.status === 'accepted' 
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                    : 'bg-red-50/50 border-red-200 text-red-950'
                } text-xs space-y-1.5`}>
                  <p className="font-extrabold flex items-center gap-1.5 capitalize">
                    {selectedAbstract.status === 'accepted' ? <CheckCircle2 size={14} className="text-emerald-700" /> : <XCircle size={14} className="text-red-700" />}
                    <span>Proposal Decision: {selectedAbstract.status}</span>
                  </p>
                  {selectedAbstract.statusNote && (
                    <p className="italic font-medium leading-relaxed bg-white/60 p-3 rounded-xl">
                      &ldquo;{selectedAbstract.statusNote}&rdquo;
                    </p>
                  )}
                  {selectedAbstract.statusUpdatedAt && (
                    <p className="text-[10px] text-gray-500 font-bold">
                      Decision timestamp: {new Date(selectedAbstract.statusUpdatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Evaluation Form Decision Control Panel */}
              <div className="pt-4 border-t border-gray-100 space-y-3.5">
                <div className="text-xs font-black uppercase tracking-wider text-gray-500">Review Decision & Appraisal</div>
                
                <textarea
                  placeholder="Insert reviewer assessment, comments, or feedback for the applicant here..."
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAbstract.id, 'accepted')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-extrabold text-xs px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <Check size={14} />
                    <span>Accept Abstract</span>
                  </button>

                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAbstract.id, 'rejected')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 text-white font-extrabold text-xs px-4 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
                  >
                    <X size={14} />
                    <span>Reject / Decline</span>
                  </button>

                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAbstract.id, 'pending')}
                    className="inline-flex items-center justify-center gap-1.5 border border-gray-300 bg-white text-gray-700 font-extrabold text-xs px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Clock size={14} />
                    <span>Set to Pending</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => {
                  setSelectedAbstract(null);
                  setReviewNote('');
                }}
                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
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
