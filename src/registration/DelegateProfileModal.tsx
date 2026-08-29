import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Building, 
  MapPin, 
  Phone, 
  Plane, 
  GraduationCap, 
  Monitor, 
  Mic2, 
  Store, 
  Calendar, 
  FileText, 
  Printer, 
  User, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegistrationData, updateRegistrationStatus } from './registrationStore';

interface DelegateProfileModalProps {
  delegate: RegistrationData;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export function DelegateProfileModal({ delegate, onClose, onStatusUpdated }: DelegateProfileModalProps) {
  const [note, setNote] = useState(delegate.statusNote || '');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleAction = (newStatus: 'accepted' | 'rejected' | 'pending', actionNote?: string) => {
    const finalNote = actionNote !== undefined ? actionNote : note;
    updateRegistrationStatus(delegate.id, newStatus, finalNote);
    setStatusMessage(`Application ${delegate.id} successfully updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setStatusMessage(null), 3000);
    if (onStatusUpdated) onStatusUpdated();
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    updateRegistrationStatus(delegate.id, delegate.status, note);
    setTimeout(() => {
      setIsSavingNote(false);
      setStatusMessage('Secretariat note updated');
      setTimeout(() => setStatusMessage(null), 2500);
      if (onStatusUpdated) onStatusUpdated();
    }, 200);
  };

  return (
    <div 
      id="delegate-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="delegate-profile-dossier"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden text-gray-900"
      >
        {/* Modal Top Dossier Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-green text-white font-extrabold text-xl flex items-center justify-center shadow-md border border-white/20 shrink-0">
              {delegate.fullName
                ? delegate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'ID'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {delegate.title} {delegate.fullName}
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-emerald-300 font-bold border border-white/10">
                  {delegate.id}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>{delegate.position || 'Delegate'}</span>
                <span>•</span>
                <span>{delegate.org}</span>
                <span>({delegate.country})</span>
              </p>
              <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-green/30 text-emerald-300 border border-brand-green/40">
                  {delegate.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Submitted: {new Date(delegate.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <button
            id="close-profile-modal-button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            title="Close Profile"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body - Scrollable Submitted Details */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-800 flex-1 bg-[#fcfcfd]">
          {/* Action Notification Alert */}
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* ACTION BUTTONS PANEL INSIDE PROFILE HEADER */}
          <div 
            id="profile-action-controls-panel"
            className="p-5 rounded-2xl bg-white border-2 border-brand-green/20 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                  Secretariat Review Decision
                </span>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {delegate.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Accepted & Cleared
                    </span>
                  )}
                  {delegate.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <Clock size={14} className="text-amber-600" /> Pending Subcommittee Review
                    </span>
                  )}
                  {delegate.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      <XCircle size={14} className="text-red-600" /> Application Declined
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Admission: Free
                  </span>
                </div>
              </div>

              {/* DIRECT ACTION BUTTONS */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="profile-action-accept-btn"
                  onClick={() => handleAction('accepted')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    delegate.status === 'accepted'
                      ? 'bg-emerald-700 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Check size={16} />
                  <span>Accept Application</span>
                </button>

                <button
                  id="profile-action-reject-btn"
                  onClick={() => handleAction('rejected')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    delegate.status === 'rejected'
                      ? 'bg-red-700 text-white cursor-default'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <X size={16} />
                  <span>Reject Application</span>
                </button>

                {delegate.status !== 'pending' && (
                  <button
                    id="profile-action-pending-btn"
                    onClick={() => handleAction('pending')}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <Clock size={14} />
                    <span>Reset to Pending</span>
                  </button>
                )}
              </div>
            </div>

            {/* Internal Decision Note Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Internal Reviewer Note / Decision Rationale:</span>
                <span className="text-[11px] text-gray-400 font-normal">Visible to Secretariat Committee</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter audit note (e.g. Visa letter issued, flight confirmed, or reason for decline)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  {isSavingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Personal Details */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs">
            <h3 className="text-xs font-extrabold text-brand-green uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Step 1: Personal Details & Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block font-medium">Full Legal Name</span>
                <span className="font-bold text-gray-900 text-sm">{delegate.title} {delegate.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Gender / Date of Birth</span>
                <span className="font-semibold text-gray-900">{delegate.gender || 'Not stated'} • {delegate.dob || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Nationality & Country</span>
                <span className="font-semibold text-gray-900">{delegate.nationality || '-'} / {delegate.country}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Primary Email</span>
                <span className="font-semibold text-gray-900 break-all">{delegate.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Primary Phone</span>
                <span className="font-semibold text-gray-900">{delegate.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Alternative Contact</span>
                <span className="font-semibold text-gray-900">{delegate.altEmail || delegate.altPhone || 'None provided'}</span>
              </div>
              <div className="sm:col-span-3 border-t border-gray-100 pt-3">
                <span className="text-gray-500 block font-medium">Emergency Contact Person</span>
                <span className="font-semibold text-gray-900">
                  {delegate.emName ? `${delegate.emName} (${delegate.emRel || 'Contact'}) — ${delegate.emPhone || ''} • ${delegate.emEmail || ''}` : 'None provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Profile */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs">
            <h3 className="text-xs font-extrabold text-brand-green uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Step 2: Professional Profile & IFSW Membership
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block font-medium">Organization / Employer</span>
                <span className="font-bold text-gray-900">{delegate.org}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Department & Position</span>
                <span className="font-semibold text-gray-900">{delegate.dept || '-'} / {delegate.position || 'Practitioner'}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Professional Background</span>
                <span className="font-semibold text-gray-900">{delegate.profBackground || 'Social Work'} ({delegate.yearsExp || 'N/A'})</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 block font-medium">Professional Association</span>
                <span className="font-semibold text-gray-900">{delegate.profAssoc || 'None specified'}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">IFSW Member Status</span>
                <span className="font-semibold text-gray-900">
                  {delegate.isIfsw === 'Yes' 
                    ? `Yes (${delegate.ifswName || delegate.ifswCountry || 'Member'}) ${delegate.ifswNumber ? `— #${delegate.ifswNumber}` : ''}`
                    : 'Non-IFSW Member'}
                </span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-gray-500 block font-medium mb-1.5">Practice Areas & Thematic Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {[...(delegate.areaPractice || []), ...(delegate.interests || [])].length > 0 ? (
                    [...(delegate.areaPractice || []), ...(delegate.interests || [])].map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">No specific tracks selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Delegate Category Logistics */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs">
            <h3 className="text-xs font-extrabold text-brand-green uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Step 3: Category Selection & Logistics ({delegate.category})
            </h3>

            {delegate.category === 'International Delegate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">Arrival Schedule</span>
                  <span className="font-semibold text-gray-900">
                    {delegate.arrivalDate || 'TBD'} {delegate.arrivalTime && `at ${delegate.arrivalTime}`} {delegate.arrivalFlight && `(Flight: ${delegate.arrivalFlight})`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Departure Schedule</span>
                  <span className="font-semibold text-gray-900">
                    {delegate.depDate || 'TBD'} {delegate.depTime && `at ${delegate.depTime}`} {delegate.depFlight && `(Flight: ${delegate.depFlight})`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Airport Shuttle Transfer</span>
                  <span className="font-semibold text-gray-900">{delegate.airportTransfer || 'No'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Accommodation Requested</span>
                  <span className="font-semibold text-gray-900">
                    {delegate.accReq || 'No'} {delegate.hotelCat && `(${delegate.hotelCat} — ${delegate.roomPref || 'Standard'})`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Visa Support Letter</span>
                  <span className="font-semibold text-gray-900">{delegate.visaReq || 'No'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Passport Credentials</span>
                  <span className="font-semibold text-gray-900">
                    {delegate.passNum ? `${delegate.passNum} (Exp: ${delegate.passExp || 'N/A'})` : 'Not provided'}
                  </span>
                </div>
              </div>
            )}

            {delegate.category === 'Malawian Delegate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">District of Origin / Station</span>
                  <span className="font-bold text-gray-900">{delegate.district || 'Lilongwe'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Local Commuter Transport Needed</span>
                  <span className="font-semibold text-gray-900">{delegate.localTransport || 'No'}</span>
                </div>
              </div>
            )}

            {delegate.category === 'Student Delegate' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">Level of Study</span>
                  <span className="font-bold text-gray-900">{delegate.levelStudy || 'Undergraduate'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Program of Study</span>
                  <span className="font-semibold text-gray-900">{delegate.progStudy || 'Social Work'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Institution / University</span>
                  <span className="font-semibold text-gray-900">{delegate.studentInst || 'Registered University'}</span>
                </div>
              </div>
            )}

            {delegate.category === 'Virtual Participant' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">Delegate Timezone</span>
                  <span className="font-bold text-gray-900">{delegate.timeZone || 'UTC+2'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Technical Access Requirements</span>
                  <span className="font-semibold text-gray-900">{delegate.techReq || 'Standard Webcast Stream'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Special Roles (Presenter / Exhibitor) */}
          {(delegate.isPresenter || delegate.isExhibitor) && (
            <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs">
              <h3 className="text-xs font-extrabold text-brand-green uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                Step 4: Special Conference Roles
              </h3>

              {delegate.isPresenter && (
                <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 mb-3 space-y-2 text-xs">
                  <div className="font-bold text-purple-900 text-sm flex items-center gap-2">
                    <Mic2 size={16} /> Paper / Presentation: {delegate.presTitle}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700">
                    <div><span className="font-medium text-gray-500">Track:</span> {delegate.presTrack || 'General'}</div>
                    <div><span className="font-medium text-gray-500">Format:</span> {delegate.presType || 'Oral Presentation'}</div>
                    <div><span className="font-medium text-gray-500">Co-authors:</span> {delegate.presCoauthors || 'None'}</div>
                  </div>
                  {delegate.presBio && (
                    <p className="text-gray-700 text-xs italic pt-1 border-t border-purple-200">
                      Bio / Abstract: {delegate.presBio}
                    </p>
                  )}
                </div>
              )}

              {delegate.isExhibitor && (
                <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2 text-xs">
                  <div className="font-bold text-sky-900 text-sm flex items-center gap-2">
                    <Store size={16} /> Exhibition Booth: {delegate.exhibOrg || delegate.org}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700">
                    <div><span className="font-medium text-gray-500">Booth Format:</span> {delegate.exhibBooth || 'Standard Booth'}</div>
                    <div><span className="font-medium text-gray-500">Staff Count:</span> {delegate.exhibStaff || '2'}</div>
                    <div><span className="font-medium text-gray-500">Power / Internet:</span> {delegate.exhibElec || 'Yes'} / {delegate.exhibInternet || 'Yes'}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 5: Sessions, Meals & Arrangements */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs">
            <h3 className="text-xs font-extrabold text-brand-green uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Step 5: Sessions, Gala & Special Needs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block font-medium">Gala Dinner Attendance</span>
                <span className="font-semibold text-gray-900">{delegate.gala || 'No'}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Dietary Requirements</span>
                <span className="font-semibold text-gray-900">{delegate.dietary || 'Standard'}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium">Disability & Accessibility</span>
                <span className="font-semibold text-gray-900">{delegate.disability?.join(', ') || 'None specified'}</span>
              </div>
              {delegate.workshops?.length > 0 && (
                <div className="sm:col-span-3">
                  <span className="text-gray-500 block font-medium mb-1">Enrolled Workshops & Masterclasses</span>
                  <span className="font-semibold text-gray-900">{delegate.workshops.join(' • ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions INSIDE the Profile */}
        <div className="bg-gray-50 p-4 px-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to={`/registration/communications?recipient=${encodeURIComponent(delegate.email)}&name=${encodeURIComponent(delegate.fullName)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 text-xs font-bold hover:bg-gray-100 transition-colors shadow-xs w-full sm:w-auto justify-center"
          >
            <Mail size={15} />
            <span>Send Official Notice Email</span>
          </Link>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              Close Profile
            </button>
            {delegate.status !== 'accepted' && (
              <button
                onClick={() => {
                  handleAction('accepted');
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-2 text-white text-xs font-extrabold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Check size={15} />
                <span>Confirm Acceptance</span>
              </button>
            )}
            {delegate.status !== 'rejected' && (
              <button
                onClick={() => {
                  handleAction('rejected');
                }}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <X size={15} />
                <span>Reject</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
