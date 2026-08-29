import { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Shield, 
  FileSpreadsheet, 
  RefreshCw, 
  Trash2, 
  Info, 
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { 
  getAdminActivityLogs, 
  getRegistrationAdmins, 
  clearAdminLogs, 
  AdminActivityLog, 
  RegistrationAdmin 
} from './adminStore';

export function AdminLogsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [admins, setAdmins] = useState<RegistrationAdmin[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<string>(searchParams.get('admin') || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<AdminActivityLog | null>(null);

  const loadData = () => {
    setLogs(getAdminActivityLogs());
    setAdmins(getRegistrationAdmins());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ifsw_admin_logs_changed', loadData);
    window.addEventListener('ifsw_registration_admins_changed', loadData);
    return () => {
      window.removeEventListener('ifsw_admin_logs_changed', loadData);
      window.removeEventListener('ifsw_registration_admins_changed', loadData);
    };
  }, []);

  // Update filter if query parameter changes
  const adminParam = searchParams.get('admin');
  useEffect(() => {
    if (adminParam) {
      setSelectedAdminId(adminParam);
    }
  }, [adminParam]);

  // Filtered logs computation
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        log.adminName.toLowerCase().includes(q) ||
        log.actionLabel.toLowerCase().includes(q) ||
        (log.targetName && log.targetName.toLowerCase().includes(q)) ||
        (log.targetId && log.targetId.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        log.ipAddress.includes(q);

      const matchesAdmin = selectedAdminId === 'all' || log.adminId === selectedAdminId;
      const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;

      return matchesSearch && matchesAdmin && matchesCategory;
    });
  }, [logs, searchQuery, selectedAdminId, selectedCategory]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No logs to export.');
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'Admin Name', 'Admin Email', 'Admin Role', 'Action', 'Action Label', 'Target ID', 'Target Name', 'Details', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.id,
      new Date(l.timestamp).toISOString(),
      `"${l.adminName.replace(/"/g, '""')}"`,
      `"${l.adminEmail.replace(/"/g, '""')}"`,
      `"${l.adminRole.replace(/"/g, '""')}"`,
      l.action,
      `"${l.actionLabel.replace(/"/g, '""')}"`,
      l.targetId || '',
      `"${(l.targetName || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.ipAddress
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ifsw_admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedAdminProfile = admins.find(a => a.id === selectedAdminId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Complete, timestamped audit log of all decisions, approvals, notices, and admin creations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold transition-all shadow-2xs"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Clear all audit logs? This cannot be undone.')) {
                clearAdminLogs();
              }
            }}
            className="p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-red-50 text-gray-500 hover:text-red-700 transition-colors shadow-2xs"
            title="Clear all logs"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Admin Specific Banner if filtered */}
      {selectedAdminProfile && selectedAdminId !== 'all' && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
              {selectedAdminProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Filtered By Registration Admin
              </div>
              <div className="font-extrabold text-gray-900 text-xs">
                {selectedAdminProfile.name} · <span className="font-medium text-emerald-900">{selectedAdminProfile.role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedAdminId('all');
              setSearchParams({});
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            Show All Admins
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search logs by delegate name, reference, admin, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </div>

          {/* Admin Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-600 shrink-0">Admin:</label>
            <select
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="all">All Registration Admins</option>
              {admins.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-gray-100">
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'delegates', label: 'Delegate Decisions' },
            { id: 'communications', label: 'Notices Dispatched' },
            { id: 'admins', label: 'Admin Provisioning' },
            { id: 'security', label: 'Security & Access' },
            { id: 'reports', label: 'Reports & Exports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto text-xs text-gray-500 font-medium shrink-0">
            Showing <strong className="text-gray-900">{filteredLogs.length}</strong> log entries
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Registration Admin</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Description & Context</th>
                <th className="py-3.5 px-4">Target Ref</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                const isToday = new Date().toDateString() === dateObj.toDateString();

                return (
                  <tr 
                    key={log.id}
                    onClick={() => setSelectedLogForDetail(log)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Admin Name & Role */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                        <User size={13} className="text-emerald-700" />
                        <span>{log.adminName}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[160px]">
                        {log.adminRole}
                      </div>
                    </td>

                    {/* Action Type Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        log.action === 'DELEGATE_ACCEPTED' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' :
                        log.action === 'DELEGATE_REJECTED' ? 'bg-red-100 text-red-950 border border-red-300' :
                        log.action === 'NOTICE_SENT' ? 'bg-teal-100 text-teal-950 border border-teal-300' :
                        log.action === 'ADMIN_CREATED' ? 'bg-blue-100 text-blue-950 border border-blue-300' :
                        log.action === 'ADMIN_STATUS_CHANGED' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                        'bg-gray-200 text-gray-900 border border-gray-300'
                      }`}>
                        {log.action === 'DELEGATE_ACCEPTED' && <CheckCircle2 size={11} className="text-emerald-700" />}
                        {log.action === 'DELEGATE_REJECTED' && <XCircle size={11} className="text-red-700" />}
                        {log.action === 'NOTICE_SENT' && <Mail size={11} className="text-teal-700" />}
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-900 leading-snug max-w-md">
                        {log.actionLabel}
                      </div>
                      {log.details && (
                        <div className="text-[11px] text-gray-500 truncate max-w-md mt-0.5">
                          {log.details}
                        </div>
                      )}
                    </td>

                    {/* Target Ref */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                      {log.targetId ? (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold border border-gray-200">
                          {log.targetId}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Inspect details button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLogForDetail(log);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-xs">
                    <Activity className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="font-bold text-gray-700">No activity logs found</p>
                    <p className="text-gray-400 mt-1">Try clearing filters or click "Seed Sample Logs" above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL INSPECTION MODAL */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#08281a] to-[#0f3b27] text-white">
              <div>
                <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                  <Shield size={16} className="text-emerald-400" />
                  <span>Audit Record Inspection ({selectedLogForDetail.id})</span>
                </h3>
                <span className="text-[11px] text-emerald-200/80">
                  {new Date(selectedLogForDetail.timestamp).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedLogForDetail(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Action Overview
                </div>
                <div className="text-sm font-bold text-gray-950">
                  {selectedLogForDetail.actionLabel}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900">
                    {selectedLogForDetail.action}
                  </span>
                  <span className="text-gray-500 font-mono text-[11px]">
                    Category: {selectedLogForDetail.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Registration Admin</div>
                  <div className="font-extrabold text-gray-900 mt-0.5">{selectedLogForDetail.adminName}</div>
                  <div className="text-[11px] text-emerald-800">{selectedLogForDetail.adminRole}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{selectedLogForDetail.adminEmail}</div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Client Environment</div>
                  <div className="font-mono text-gray-900 font-bold mt-0.5">IP: {selectedLogForDetail.ipAddress}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Audit Record ID: {selectedLogForDetail.id}</div>
                </div>
              </div>

              {selectedLogForDetail.details && (
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Logged Details & Context
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed font-mono text-[11px]">
                    {selectedLogForDetail.details}
                  </div>
                </div>
              )}

              {selectedLogForDetail.targetId && (
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                  <span className="font-bold">Target Reference ID:</span>
                  <span className="font-mono font-extrabold">{selectedLogForDetail.targetId}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
