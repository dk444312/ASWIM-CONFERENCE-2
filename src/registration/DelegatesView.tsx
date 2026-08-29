import { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  FileText, 
  Check, 
  X, 
  UserCheck, 
  PlusCircle, 
  Settings, 
  AlertCircle 
} from 'lucide-react';
import { 
  getStoredRegistrations, 
  updateRegistrationStatus, 
  RegistrationData 
} from './registrationStore';
import { DelegateProfileModal } from './DelegateProfileModal';
import { Link } from 'react-router-dom';

export function DelegatesView() {
  const [delegates, setDelegates] = useState<RegistrationData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Selected delegate modal state
  const [selectedDelegate, setSelectedDelegate] = useState<RegistrationData | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const reload = () => {
    const list = getStoredRegistrations();
    setDelegates(list);
    setSelectedDelegate(current => {
      if (!current) return null;
      return list.find(d => d.id === current.id) || null;
    });
  };

  useEffect(() => {
    reload();
    window.addEventListener('ifsw_registrations_updated', reload);
    return () => window.removeEventListener('ifsw_registrations_updated', reload);
  }, []);

  const handleStatusChange = (id: string, newStatus: 'accepted' | 'rejected' | 'pending') => {
    updateRegistrationStatus(id, newStatus, newStatus === 'accepted' ? 'Approved by registration committee' : 'Declined during review');
    setActionSuccessMessage(`Delegate ${id} marked as ${newStatus.toUpperCase()}`);
    setTimeout(() => setActionSuccessMessage(null), 3500);
    reload();
  };

  // Filter delegates
  const filteredDelegates = delegates.filter(d => {
    const matchesSearch = 
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div id="delegates-view-root" className="max-w-[1360px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div id="delegates-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-[#06291a] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Review Board
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-heading mt-1">
            Delegates Directory & Dossiers
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
            Authorize regional delegate admission credentials, issue clearance letters, and check proof-of-payment receipts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/register"
            id="delegates-btn-launch-form"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06291a] text-white text-xs font-extrabold uppercase tracking-widest hover:bg-[#0a452c] transition-all duration-200 shadow-sm active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Launch Form</span>
          </Link>
          <Link
            to="/registration/communications"
            id="delegates-btn-comms"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-extrabold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm active:scale-95"
          >
            <Mail size={15} />
            <span>Broadcasts</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div id="delegates-success-alert" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="p-1 text-emerald-700 hover:text-emerald-950 transition-colors rounded-lg hover:bg-emerald-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* When delegates list is totally empty */}
      {delegates.length === 0 ? (
        <div id="delegates-empty-card" className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#06291a] flex items-center justify-center mx-auto border border-emerald-100">
            <UserCheck size={30} className="stroke-[2]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">
              No Registered Delegates Yet
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              The database directory is fully clean. Submit an application form to start reviewing credentials, documents, and proof uploads.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06291a] hover:bg-[#0a452c] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={15} />
              <span>Submit Registration</span>
            </Link>
            <Link
              to="/registration/settings"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs uppercase tracking-widest transition-all"
            >
              <Settings size={15} />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div id="delegates-filter-bar" className="bg-white rounded-2xl p-4.5 border border-gray-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="delegates-search-input"
                type="text"
                placeholder="Search delegates by name, email, institution, country, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 focus:bg-white rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Tabs */}
              <div id="delegates-status-filters" className="flex p-1 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200">
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

              {/* Category Dropdown */}
              <select
                id="delegates-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#06291a]/10 focus:border-[#06291a] transition-all"
              >
                <option value="all">All Categories</option>
                <option value="International Delegate">International Delegate</option>
                <option value="Malawian Delegate">Malawian Delegate</option>
                <option value="Student Delegate">Student Delegate</option>
                <option value="Virtual Participant">Virtual Participant</option>
              </select>
            </div>
          </div>

          {/* Delegates List Grid */}
          <div id="delegates-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDelegates.map((delegate) => {
              const isAccepted = delegate.status === 'accepted';
              const isPending = delegate.status === 'pending';
              const isRejected = delegate.status === 'rejected';

              return (
                <div 
                  key={delegate.id} 
                  id={`delegate-card-${delegate.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top: ID & Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] font-black text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/40">
                        {delegate.id}
                      </span>
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-950 border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-700" /> Accepted
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-950 border border-amber-200">
                          <Clock size={12} className="text-amber-700" /> Pending Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-950 border border-red-200/50">
                          <XCircle size={12} className="text-red-700" /> Rejected
                        </span>
                      )}
                    </div>

                    {/* Profile Avatar & Header */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#06291a] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs border border-emerald-950/20 group-hover:scale-105 transition-transform">
                        {delegate.fullName ? delegate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ID'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h3 className="text-sm font-black text-gray-950 truncate leading-snug">
                          {delegate.title} {delegate.fullName}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">
                          {delegate.position || 'Delegate'}
                        </p>
                        <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-950">
                          {delegate.category}
                        </span>
                      </div>
                    </div>

                    {/* Compact Details Checklist */}
                    <div className="space-y-2 text-xs text-gray-700 mb-4 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 truncate">
                        <Building size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate font-medium">{delegate.org}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="font-extrabold text-gray-900">{delegate.country}</span>
                        {delegate.district && <span className="text-gray-500 text-[11px] font-medium">({delegate.district})</span>}
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate font-mono text-[11px] font-medium">{delegate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400 shrink-0" />
                        <span className="font-mono text-[11px] font-medium">{delegate.phone}</span>
                      </div>
                    </div>

                    {/* Special Roles badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {delegate.isPresenter && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-950 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                          Presenter
                        </span>
                      )}
                      {delegate.isExhibitor && (
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-950 text-[10px] font-black uppercase tracking-wider border border-sky-200">
                          Exhibitor
                        </span>
                      )}
                      {delegate.gala === 'Yes' && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-950 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                          Gala Dinner
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS INSIDE THE PROFILE CARD */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id={`accept-delegate-${delegate.id}`}
                        onClick={() => handleStatusChange(delegate.id, 'accepted')}
                        className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                          isAccepted
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-950 hover:bg-[#06291a] hover:text-white border border-emerald-200 hover:border-emerald-950'
                        }`}
                      >
                        <Check size={14} className="stroke-[2.5]" /> <span>{isAccepted ? 'Accepted' : 'Accept'}</span>
                      </button>

                      <button
                        id={`reject-delegate-${delegate.id}`}
                        onClick={() => handleStatusChange(delegate.id, 'rejected')}
                        className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                          isRejected
                            ? 'bg-red-800 text-white shadow-xs'
                            : 'bg-red-50 text-red-950 hover:bg-red-800 hover:text-white border border-red-200 hover:border-red-800'
                        }`}
                      >
                        <X size={14} className="stroke-[2.5]" /> <span>{isRejected ? 'Rejected' : 'Reject'}</span>
                      </button>
                    </div>

                    <button
                      id={`view-profile-btn-${delegate.id}`}
                      onClick={() => setSelectedDelegate(delegate)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-[#06291a] hover:text-white text-gray-900 text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 border border-gray-200/80 cursor-pointer"
                    >
                      <FileText size={14} /> <span>Inspect Dossier</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredDelegates.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                <AlertCircle size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">No matching records found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Try clearing your search query or adjusting status and category filters.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* FULL SUBMITTED PROFILE DOSSIER MODAL WITH ACTION BUTTONS INSIDE */}
      {selectedDelegate && (
        <DelegateProfileModal 
          delegate={selectedDelegate} 
          onClose={() => setSelectedDelegate(null)}
          onStatusUpdated={reload}
        />
      )}
    </div>
  );
}

