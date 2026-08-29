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
    <div className="max-w-[1360px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Delegates Directory & Profile Review
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review full submitted delegate profiles, process verification decisions, and dispatch notices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-all shadow-sm active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Test New Registration</span>
          </Link>
          <Link
            to="/registration/communications"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-bold hover:bg-gray-50 transition-all shadow-xs"
          >
            <Mail size={16} />
            <span>Communications</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
            <X size={16} />
          </button>
        </div>
      )}

      {/* When delegates list is totally empty */}
      {delegates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto border border-brand-green/20">
            <UserCheck size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-gray-900">
              No Registered Delegates Yet
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              All mock profiles have been cleared. Submit your own test application using the public registration form to test the end-to-end pipeline, profile dossier review, and status actions.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-2 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={16} />
              <span>Submit Your First Test Registration</span>
            </Link>
            <Link
              to="/registration/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all"
            >
              <Settings size={15} />
              <span>Configure Admin Profile</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search delegates by name, email, institution, country, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
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

              {/* Category Dropdown */}
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
            </div>
          </div>

          {/* Delegates List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDelegates.map((delegate) => {
              const isAccepted = delegate.status === 'accepted';
              const isPending = delegate.status === 'pending';
              const isRejected = delegate.status === 'rejected';

              return (
                <div 
                  key={delegate.id} 
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top: ID & Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-extrabold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                        {delegate.id}
                      </span>
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <CheckCircle2 size={13} className="text-emerald-700" /> Accepted
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                          <Clock size={13} className="text-amber-700" /> Pending Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-300">
                          <XCircle size={13} className="text-red-700" /> Rejected
                        </span>
                      )}
                    </div>

                    {/* Profile Avatar & Header */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-green text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                        {delegate.fullName ? delegate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ID'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h3 className="text-base font-extrabold text-gray-950 truncate">
                          {delegate.title} {delegate.fullName}
                        </h3>
                        <p className="text-xs font-semibold text-gray-600 truncate mt-0.5">
                          {delegate.position || 'Delegate'}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {delegate.category}
                        </span>
                      </div>
                    </div>

                    {/* Compact Details Checklist */}
                    <div className="space-y-2 text-xs text-gray-700 mb-4 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 truncate">
                        <Building size={14} className="text-gray-500 shrink-0" />
                        <span className="truncate font-medium">{delegate.org}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500 shrink-0" />
                        <span className="font-semibold text-gray-900">{delegate.country}</span>
                        {delegate.district && <span className="text-gray-500">({delegate.district})</span>}
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={14} className="text-gray-500 shrink-0" />
                        <span className="truncate font-mono text-[11px]">{delegate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500 shrink-0" />
                        <span className="font-mono text-[11px]">{delegate.phone}</span>
                      </div>
                    </div>

                    {/* Special Roles badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {delegate.isPresenter && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          Presenter
                        </span>
                      )}
                      {delegate.isExhibitor && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                          Exhibitor
                        </span>
                      )}
                      {delegate.gala === 'Yes' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Gala Ticket
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS INSIDE THE PROFILE CARD */}
                  <div className="border-t border-gray-200 pt-3.5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id={`accept-delegate-${delegate.id}`}
                        onClick={() => handleStatusChange(delegate.id, 'accepted')}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                          isAccepted
                            ? 'bg-emerald-700 text-white cursor-default'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-300'
                        }`}
                      >
                        <Check size={14} /> {isAccepted ? 'Accepted' : 'Accept'}
                      </button>

                      <button
                        id={`reject-delegate-${delegate.id}`}
                        onClick={() => handleStatusChange(delegate.id, 'rejected')}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                          isRejected
                            ? 'bg-red-700 text-white cursor-default'
                            : 'bg-red-50 text-red-800 hover:bg-red-600 hover:text-white border border-red-300'
                        }`}
                      >
                        <X size={14} /> {isRejected ? 'Rejected' : 'Reject'}
                      </button>
                    </div>

                    <button
                      id={`view-profile-btn-${delegate.id}`}
                      onClick={() => setSelectedDelegate(delegate)}
                      className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
                    >
                      <FileText size={14} /> Inspect Full Submitted Profile
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredDelegates.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200 p-8">
                <AlertCircle size={36} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-extrabold text-gray-900">No delegates match your filters</h3>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                  Try clearing the search text or adjusting the status and category filter selections.
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
