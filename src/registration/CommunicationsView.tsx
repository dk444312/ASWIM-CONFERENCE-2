import { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Users, 
  X, 
  PlusCircle, 
  RefreshCw, 
  Inbox 
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  getStoredRegistrations, 
  getStoredNotices, 
  addNoticeLog, 
  RegistrationData, 
  NoticeLog 
} from './registrationStore';

export function CommunicationsView() {
  const [searchParams] = useSearchParams();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [notices, setNotices] = useState<NoticeLog[]>([]);

  // Email filtering & selection
  const [emailSearch, setEmailSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'pending' | 'rejected'>('all');
  const [selectedEmail, setSelectedEmail] = useState<string>('all'); // 'all' or specific email

  // Message draft state
  const [draftType, setDraftType] = useState<'accepted' | 'rejected'>('accepted');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // UI state
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const reloadData = () => {
    setRegistrations(getStoredRegistrations());
    setNotices(getStoredNotices());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('ifsw_registrations_updated', reloadData);
    window.addEventListener('ifsw_notices_updated', reloadData);
    return () => {
      window.removeEventListener('ifsw_registrations_updated', reloadData);
      window.removeEventListener('ifsw_notices_updated', reloadData);
    };
  }, []);

  // Filter submitted emails
  const filteredEmails = useMemo(() => {
    return registrations.filter(r => {
      const q = emailSearch.toLowerCase();
      const matchesSearch = 
        r.email.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.org.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, emailSearch, statusFilter]);

  // Find currently selected single delegate if one is chosen
  const selectedDelegate = useMemo(() => {
    if (selectedEmail === 'all') return null;
    return registrations.find(r => r.email.toLowerCase() === selectedEmail.toLowerCase()) || null;
  }, [registrations, selectedEmail]);

  // Load clean draft message based on type and selected delegate (no curly brackets)
  const generateDraft = (type: 'accepted' | 'rejected', delegate: RegistrationData | null) => {
    if (type === 'accepted') {
      const recipientGreeting = delegate ? `Dear ${delegate.title ? `${delegate.title} ` : ''}${delegate.fullName},` : 'Dear Delegate,';
      const categoryLine = delegate ? `\n- Delegate Category: ${delegate.category}\n- Registration Code: ${delegate.id}` : '';

      return {
        subject: delegate 
          ? `Official Acceptance: IFSW Africa 2027 Conference - ${delegate.fullName}` 
          : 'Official Acceptance: IFSW Africa 2027 Regional Conference',
        body: `${recipientGreeting}

We are pleased to formally confirm that your registration for the IFSW Africa 2027 Regional Conference has been accepted by the Organizing Committee.

Conference Details:
- Dates: July 14 – 17, 2027
- Venue: Bingu International Conference Centre (BICC), Lilongwe, Malawi${categoryLine}

Next Steps:
1. Your conference credentials and access pass have been confirmed.
2. If you requested an official visa support letter, please check your registration dossier.
3. Hotel booking and flight shuttle information will be sent in our next logistics advisory.

We look forward to welcoming you to the Warm Heart of Africa.

Warm regards,
Registration & Credentials Committee
IFSW Africa 2027 Regional Conference
Lilongwe, Malawi`
      };
    } else {
      const recipientGreeting = delegate ? `Dear ${delegate.title ? `${delegate.title} ` : ''}${delegate.fullName},` : 'Dear Delegate,';
      const refLine = delegate ? ` (Reference: ${delegate.id})` : '';

      return {
        subject: delegate 
          ? `Registration Update: IFSW Africa 2027 Conference - ${delegate.fullName}` 
          : 'Registration Update: IFSW Africa 2027 Regional Conference',
        body: `${recipientGreeting}

Thank you for your application to attend the IFSW Africa 2027 Regional Conference in Lilongwe, Malawi${refLine}.

Due to venue capacity limits and category verification quotas, we regret to inform you that we are unable to approve your application for in-person attendance during this review cycle.

Virtual Attendance Option:
You are cordially invited to participate as a Virtual Participant, which gives you complete live access to all keynote sessions, plenaries, and digital paper presentations.

If you have questions or would like our secretariat to re-evaluate your application, please reply directly to this message.

Sincerely,
Registration Review Secretariat
IFSW Africa 2027 Regional Conference
Lilongwe, Malawi`
      };
    }
  };

  // Initial load from URL parameters or defaults
  const recipientParam = searchParams.get('recipient');
  useEffect(() => {
    if (recipientParam) {
      setSelectedEmail(recipientParam);
      const found = registrations.find(r => r.email.toLowerCase() === recipientParam.toLowerCase()) || null;
      const initialType = found?.status === 'rejected' ? 'rejected' : 'accepted';
      setDraftType(initialType);
      const draft = generateDraft(initialType, found);
      setSubject(draft.subject);
      setMessageBody(draft.body);
    } else {
      const draft = generateDraft(draftType, selectedDelegate);
      setSubject(draft.subject);
      setMessageBody(draft.body);
    }
  }, [recipientParam, registrations.length]);

  // When switching draft type (Accepted vs Rejected)
  const handleSelectDraftType = (type: 'accepted' | 'rejected') => {
    setDraftType(type);
    const draft = generateDraft(type, selectedDelegate);
    setSubject(draft.subject);
    setMessageBody(draft.body);
  };

  // When picking an individual email from the list
  const handleSelectEmail = (email: string) => {
    setSelectedEmail(email);
    const found = email === 'all' ? null : registrations.find(r => r.email.toLowerCase() === email.toLowerCase()) || null;
    
    // Automatically match draft type if delegate already has a status
    let type = draftType;
    if (found?.status === 'rejected') type = 'rejected';
    else if (found?.status === 'accepted') type = 'accepted';
    
    setDraftType(type);
    const draft = generateDraft(type, found);
    setSubject(draft.subject);
    setMessageBody(draft.body);
  };

  // Determine recipients for sending
  const targetRecipients: { email: string; name: string; id: string }[] = useMemo(() => {
    if (selectedEmail !== 'all') {
      const found = registrations.find(r => r.email.toLowerCase() === selectedEmail.toLowerCase());
      if (found) return [{ email: found.email, name: found.fullName, id: found.id }];
      return [{ email: selectedEmail, name: 'Registered Delegate', id: 'CUSTOM' }];
    }
    // If 'all' is selected, targets filtered emails matching current draft category or all
    if (draftType === 'accepted') {
      const acceptedList = registrations.filter(r => r.status === 'accepted');
      return acceptedList.length > 0 
        ? acceptedList.map(r => ({ email: r.email, name: r.fullName, id: r.id }))
        : registrations.map(r => ({ email: r.email, name: r.fullName, id: r.id }));
    } else {
      const rejectedList = registrations.filter(r => r.status === 'rejected');
      return rejectedList.length > 0 
        ? rejectedList.map(r => ({ email: r.email, name: r.fullName, id: r.id }))
        : registrations.map(r => ({ email: r.email, name: r.fullName, id: r.id }));
    }
  }, [selectedEmail, registrations, draftType]);

  // Send handler
  const handleSendMessage = () => {
    if (targetRecipients.length === 0) {
      setNotification({ text: 'Please select at least one submitted email to send.', type: 'error' });
      return;
    }
    if (!subject.trim()) {
      setNotification({ text: 'Please enter a message subject.', type: 'error' });
      return;
    }
    if (!messageBody.trim()) {
      setNotification({ text: 'Please enter a message body.', type: 'error' });
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      targetRecipients.forEach(recipient => {
        addNoticeLog({
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          type: draftType,
          subject: subject
        });
      });

      setIsSending(false);
      const msg = targetRecipients.length === 1 
        ? `Message sent to ${targetRecipients[0].email}`
        : `Message sent to ${targetRecipients.length} submitted emails`;
      setNotification({ text: msg, type: 'success' });
      setTimeout(() => setNotification(null), 4000);
      reloadData();
    }, 450);
  };

  return (
    <div className="max-w-[1360px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Communications
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View all submitted delegate emails and send official accepted or rejected messages with zero placeholder tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-all shadow-xs active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Test Registration</span>
          </Link>
          <button
            onClick={reloadData}
            className="p-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh submissions and notice logs"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div 
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' 
              : 'bg-red-50 border border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-700" />
            ) : (
              <XCircle size={18} className="text-red-700" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-gray-900">
            <X size={16} />
          </button>
        </div>
      )}

      {/* When no registrations exist */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto border border-brand-green/20">
            <Mail size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-gray-900">
              No Submitted Emails Yet
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              All mock registrations have been cleared. As soon as delegates apply through the conference registration portal, their emails will appear here ready for one-click notice dispatch.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-2 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={16} />
              <span>Submit A Test Application</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 5 COLS: ALL SUBMITTED EMAILS DIRECTORY */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              
              {/* Directory Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="text-brand-green" size={18} />
                  <h2 className="text-sm font-extrabold text-gray-900">
                    All Submitted Emails
                  </h2>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                  {registrations.length} Total
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter by email or applicant name..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />
              </div>

              {/* Status filter tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl text-[11px] font-bold border border-gray-200">
                {(['all', 'accepted', 'pending', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`py-1 rounded-lg capitalize text-center transition-all ${
                      statusFilter === st 
                        ? 'bg-white text-gray-950 shadow-xs font-extrabold' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* "Select All" Option button */}
              <button
                onClick={() => handleSelectEmail('all')}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  selectedEmail === 'all'
                    ? 'bg-brand-green/10 border-brand-green text-brand-green font-extrabold shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-800 font-bold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Send to All {statusFilter !== 'all' ? `${statusFilter.toUpperCase()} ` : ''}Submitted Emails</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700 font-bold">
                  {filteredEmails.length}
                </span>
              </button>

              {/* Scrollable list of each submitted email */}
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredEmails.map((delegate) => {
                  const isSelected = selectedEmail.toLowerCase() === delegate.email.toLowerCase();
                  const noticesSent = notices.filter(n => n.recipientEmail.toLowerCase() === delegate.email.toLowerCase()).length;

                  return (
                    <div
                      key={delegate.id}
                      onClick={() => handleSelectEmail(delegate.email)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                        isSelected
                          ? 'border-brand-green bg-emerald-50/50 shadow-xs ring-1 ring-brand-green/30'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 bg-white'
                      }`}
                    >
                      {/* Top row: Email & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-extrabold text-gray-950 truncate flex items-center gap-1.5">
                          <Mail size={13} className={isSelected ? 'text-brand-green' : 'text-gray-400'} />
                          {delegate.email}
                        </span>

                        {delegate.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                            <CheckCircle2 size={10} className="text-emerald-700" /> Accepted
                          </span>
                        )}
                        {delegate.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                            <Clock size={10} className="text-amber-700" /> Pending
                          </span>
                        )}
                        {delegate.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-900 border border-red-300 shrink-0">
                            <XCircle size={10} className="text-red-700" /> Rejected
                          </span>
                        )}
                      </div>

                      {/* Name & ID */}
                      <div className="flex items-center justify-between text-gray-600 text-[11px]">
                        <span className="font-bold text-gray-900 truncate">
                          {delegate.title} {delegate.fullName}
                        </span>
                        <span className="font-mono text-gray-500 shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">
                          {delegate.id}
                        </span>
                      </div>

                      {/* Institution / Category */}
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                        <span className="truncate max-w-[200px]">{delegate.org}</span>
                        <span className="text-emerald-800 font-semibold">{delegate.category}</span>
                      </div>

                      {/* Notice dispatched history indicator */}
                      {noticesSent > 0 && (
                        <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 pt-1 border-t border-gray-100">
                          <CheckCircle2 size={11} /> {noticesSent} notice{noticesSent > 1 ? 's' : ''} previously sent
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredEmails.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-xs font-medium">
                    No submitted emails found matching "{emailSearch}".
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT 7 COLS: DRAFT MESSAGE (ACCEPTED / REJECTED) & SEND BUTTON */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-6">
              
              {/* Draft Message Type Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Draft Message Template
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Plain text notice with no code tags
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectDraftType('accepted')}
                    className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border shadow-xs ${
                      draftType === 'accepted'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50/60 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>Accepted Draft Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDraftType('rejected')}
                    className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border shadow-xs ${
                      draftType === 'rejected'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-red-50/60 text-red-800 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    <XCircle size={16} />
                    <span>Rejected Draft Message</span>
                  </button>
                </div>
              </div>

              {/* Recipient Destination Bar */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-1">
                  Recipient Destination
                </div>
                <div className="font-extrabold text-gray-950 flex items-center gap-2">
                  <Mail size={14} className="text-brand-green shrink-0" />
                  {selectedEmail === 'all' ? (
                    <span>
                      Bulk Notice to <strong className="text-brand-green">{targetRecipients.length}</strong> submitted email{targetRecipients.length === 1 ? '' : 's'}
                    </span>
                  ) : (
                    <span>
                      {selectedDelegate ? `${selectedDelegate.fullName} (${selectedEmail})` : selectedEmail}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Message Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                  placeholder="Enter notice subject..."
                />
              </div>

              {/* Message Body Textarea (Clean, no curly brackets) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Message Content
                </label>
                <textarea
                  rows={13}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-y shadow-2xs"
                  placeholder="Draft message body..."
                />
              </div>

              {/* Send Button & Action Area */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  Ready to send to <strong className="text-gray-950 font-bold">{targetRecipients.length}</strong> recipient(s)
                </div>

                <button
                  id="send-notice-btn"
                  onClick={handleSendMessage}
                  disabled={isSending || targetRecipients.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-green hover:bg-brand-green-2 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                  <span>{isSending ? 'Sending...' : 'Send'}</span>
                </button>
              </div>

            </div>

            {/* Dispatched Notices History Log */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="text-brand-green" size={16} />
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Recent Dispatched Notices ({notices.length})
                  </h3>
                </div>
                {notices.length > 0 && (
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Delivery
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {notices.slice(0, 10).map((n) => (
                  <div 
                    key={n.id} 
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-950 truncate">{n.recipientName}</span>
                        <span className="font-mono text-gray-500 text-[11px] truncate">({n.recipientEmail})</span>
                      </div>
                      <div className="text-gray-600 text-[11px] truncate mt-0.5">{n.subject}</div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        n.type === 'accepted' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        n.type === 'rejected' ? 'bg-red-100 text-red-900 border border-red-300' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {n.type}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {notices.length === 0 && (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No notices sent yet. Select an email above and click Send.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
