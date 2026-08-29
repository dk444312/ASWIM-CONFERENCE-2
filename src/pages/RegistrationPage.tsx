import React, { useState, useEffect } from 'react';
import { X, Check, ChevronRight, Upload, CheckCircle2, LayoutDashboard, ArrowRight, Home, RotateCcw, Lock, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { addRegistration, RegistrationData, isRegistrationOpen } from '../registration/registrationStore';
import { uploadRegistrationAttachment } from '../lib/storage';

const INITIAL_REGISTRATION_DATA = {
  // Step 1
  title: '', fullName: '', gender: '', dob: '', nationality: '', country: '',
  org: '', dept: '', position: '', email: '', altEmail: '', phone: '', altPhone: '',
  emName: '', emRel: '', emPhone: '', emEmail: '',
  // Step 2
  profBackground: '', areaPractice: [] as string[], yearsExp: '', profAssoc: '',
  isIfsw: '', ifswName: '', ifswCountry: '', ifswNumber: '', ifswPosition: '',
  interests: [] as string[],
  // Step 3
  category: '',
  arrivalDate: '', arrivalTime: '', arrivalFlight: '', depDate: '', depTime: '', depFlight: '',
  airportTransfer: '', accReq: '', hotelCat: '', roomPref: '',
  visaReq: '', passName: '', passNum: '', passExp: '', embassyName: '', embassyLoc: '',
  district: '', localTransport: '',
  levelStudy: '', progStudy: '', studentInst: '', studentIdFile: '',
  timeZone: '', virtualSessions: [] as string[], techReq: '',
  // Step 4
  isPresenter: false, isExhibitor: false,
  presTitle: '', presTrack: '', presType: '', presBio: '', presCoauthors: '', presAv: [] as string[], presAbstractFile: '',
  exhibOrg: '', exhibNature: '', exhibBooth: '', exhibStaff: '', exhibElec: '', exhibInternet: '', exhibAck: false, exhibPromoFile: '',
  // Step 5
  workshops: [] as string[], parallelSessions: [] as string[], specialEvents: [] as string[],
  gala: '', dietary: '', disability: [] as string[], medical: '',
  consentPhoto: true, consentCode: true, consentData: true
};

export function RegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submittedRecord, setSubmittedRecord] = useState<RegistrationData | null>(null);
  const [data, setData] = useState(INITIAL_REGISTRATION_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStatus, setOpenStatus] = useState(() => isRegistrationOpen());

  // Upload progress states
  const [uploadingStudentId, setUploadingStudentId] = useState(false);
  const [studentIdFileName, setStudentIdFileName] = useState('');
  const [uploadingAbstract, setUploadingAbstract] = useState(false);
  const [abstractFileName, setAbstractFileName] = useState('');
  const [uploadingPromo, setUploadingPromo] = useState(false);
  const [promoFileName, setPromoFileName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);


  useEffect(() => {
    const handleStatus = (e: any) => {
      if (e.detail && typeof e.detail.open === 'boolean') {
        setOpenStatus(e.detail.open);
      } else {
        setOpenStatus(isRegistrationOpen());
      }
    };
    window.addEventListener('ifsw_registration_status_changed', handleStatus);
    return () => window.removeEventListener('ifsw_registration_status_changed', handleStatus);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMulti = (field: keyof typeof data, value: string, checked: boolean) => {
    setData(prev => {
      const current = prev[field] as string[];
      return { ...prev, [field]: checked ? [...current, value] : current.filter(v => v !== value) };
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'student-id' | 'abstract' | 'exhibit',
    field: 'studentIdFile' | 'presAbstractFile' | 'exhibPromoFile',
    setLoading: (v: boolean) => void,
    setFileName: (v: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setUploadError(null);
    try {
      const res = await uploadRegistrationAttachment(file, type);
      if (res.success && res.url) {
        setData(prev => ({ ...prev, [field]: res.url }));
        setFileName(file.name);
      } else {
        throw new Error(res.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error(`Failed to upload ${type}:`, err);
      setUploadError(`Failed to upload ${file.name}: ${err?.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!data.fullName.trim()) {
      alert('Please fill in your Full Name in Step 1 before submitting.');
      setStep(1);
      return;
    }
    if (!data.email.trim()) {
      alert('Please fill in your Email Address in Step 1 before submitting.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const newRecord = await addRegistration({
        ...data,
        category: data.category || 'Malawian Delegate',
        country: data.country || 'Malawi',
        org: data.org || 'Independent Practitioner'
      });
      setSubmittedRecord(newRecord);
    } catch (e) {
      console.error('Submission error:', e);
      alert('An error occurred while submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!openStatus) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] py-16 px-4 sm:px-6 flex items-center justify-center font-sans text-[#1a2e22]">
        <div className="bg-white rounded-3xl shadow-lg border border-brand-line max-w-md w-full p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700 border border-amber-100 shadow-2xs">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-950 tracking-tight">
              Registration is Closed
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (submittedRecord) {
    return (
      <div className="min-h-screen bg-brand-sand/40 py-12 px-4 sm:px-6 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-xl w-full p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
            <CheckCircle2 size={44} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">
              Registration Transmitted to Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
              Application Successfully Submitted!
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Thank you, <strong>{submittedRecord.title} {submittedRecord.fullName}</strong>. Your delegate registration has been logged and queued for review by the IFSW Africa 2027 Secretariat.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-left space-y-2.5 text-xs text-gray-700">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Assigned Registration ID:</span>
              <span className="font-mono font-bold text-brand-green text-sm">{submittedRecord.id}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Submission Timestamp:</span>
              <span className="font-semibold text-gray-800">
                {new Date(submittedRecord.submittedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Delegate Category:</span>
              <span className="font-semibold text-gray-800">{submittedRecord.category}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Registration Admission Fee:</span>
              <span className="font-bold text-emerald-700">Free Admission (Complimentary)</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500 font-medium">Secretariat Review Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                Pending Verification
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/registration/dashboard"
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-green text-white font-bold hover:bg-brand-green-2 transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <LayoutDashboard size={18} />
              Open Registrations Dashboard Menu
            </Link>

            <Link
              to="/registration/delegates"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 text-sm"
            >
              View In Delegates Directory <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => {
                setSubmittedRecord(null);
                setStep(1);
                setData(INITIAL_REGISTRATION_DATA);
              }}
              className="w-full py-3 px-6 rounded-2xl border border-gray-300 text-gray-800 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-xs shadow-xs"
            >
              <RotateCcw size={14} />
              Register Another Delegate
            </button>

            <Link
              to="/"
              className="w-full py-2.5 px-6 rounded-2xl text-gray-500 hover:text-gray-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Home size={14} /> Back to Conference Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const inputClass = "w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-[14px] text-gray-800";
  const labelClass = "block text-[13px] font-semibold text-gray-700 ml-1 mb-1.5";

  const renderInput = (name: string, label: string, type="text", required=false) => (
    <div>
      <label className={labelClass}>{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} name={name} value={data[name as keyof typeof data] as string} onChange={handleChange} className={inputClass} required={required} />
    </div>
  );

  const renderSelect = (name: string, label: string, options: string[], required=false) => (
    <div>
      <label className={labelClass}>{label} {required && <span className="text-red-500">*</span>}</label>
      <select name={name} value={data[name as keyof typeof data] as string} onChange={handleChange} className={`${inputClass} appearance-none`} required={required}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const renderCheckboxes = (name: keyof typeof data, label: string, options: string[]) => (
    <div className="col-span-full">
      <label className="block text-[14px] font-semibold text-gray-800 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map(opt => (
          <label key={opt} className="flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:border-brand-green/30 bg-gray-50 hover:bg-brand-green/5 cursor-pointer transition-all">
            <input type="checkbox" checked={(data[name] as string[]).includes(opt)} onChange={(e) => handleMulti(name, opt, e.target.checked)} className="mt-0.5 w-4 h-4 text-brand-green rounded border-gray-300 focus:ring-brand-green" />
            <span className="text-[13px] text-gray-700 leading-tight">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-sand/30 py-8 px-4 sm:px-6 flex items-start justify-center">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[900px] flex flex-col overflow-hidden relative animate-in fade-in duration-300 mt-4 md:mt-10 mb-10">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink font-heading">
              {step === 1 && "Registration - Personal Details"}
              {step === 2 && "Registration - Professional Profile"}
              {step === 3 && "Registration - Delegate Category"}
              {step === 4 && "Registration - Special Roles"}
              {step === 5 && "Registration - Sessions & Consents"}
              {step === 6 && "Registration - Review & Payment"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Please complete all mandatory fields marked with an asterisk to ensure swift secretariat review.
            </p>
          </div>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800 self-end md:self-center" title="Back to Home">
            <X size={20} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="flex gap-2 px-6 sm:px-8 py-4 border-b border-gray-50 bg-gray-50/50 overflow-x-auto shrink-0 scrollbar-hide">
          {[
            "Personal", "Professional", "Category", "Roles", "Consents", "Review"
          ].map((label, index) => {
            const s = index + 1;
            const isActive = step === s;
            const isPast = step > s;
            return (
              <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                isActive ? 'bg-brand-green text-white shadow-md' : 
                isPast ? 'bg-brand-green/10 text-brand-green' : 
                'bg-white border border-gray-200 text-gray-400'
              }`}>
                {isPast ? <Check size={14} /> : <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-300'}`} />}
                {label}
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-h-[70vh]">
          <div className="max-w-[800px] mx-auto space-y-8">
            
            {step === 1 && (
              <>
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">1.1 Personal Identification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect('title', 'Title', ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Rev', 'Hon', 'Student', 'Other'], true)}
                    {renderInput('fullName', 'Full Name (As on ID)', 'text', true)}
                    {renderSelect('gender', 'Gender', ['Male', 'Female', 'Prefer Not to Say', 'Other'], true)}
                    {renderInput('dob', 'Date of Birth', 'date', true)}
                    {renderSelect('nationality', 'Nationality', ['Malawi', 'South Africa', 'Kenya', 'Nigeria', 'UK', 'USA', 'Other'], true)}
                    {renderSelect('country', 'Country of Residence', ['Malawi', 'South Africa', 'Kenya', 'Nigeria', 'UK', 'USA', 'Other'], true)}
                  </div>
                  <div>
                    <label className={labelClass}>Profile Photo Upload (Max 5MB)</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-brand-green/5 hover:border-brand-green/50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        </div>
                        <input type="file" className="hidden" accept=".jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>
                </section>
                
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">1.2 Institutional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('org', 'Organization / Institution', 'text', true)}
                    {renderInput('dept', 'Department / Faculty')}
                    {renderInput('position', 'Position / Designation', 'text', true)}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">1.3 Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('email', 'Email Address', 'email', true)}
                    {renderInput('altEmail', 'Alternative Email', 'email')}
                    {renderInput('phone', 'Mobile Phone', 'tel', true)}
                    {renderInput('altPhone', 'Alternative Phone', 'tel')}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">1.4 Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('emName', 'Emergency Contact Name', 'text', true)}
                    {renderSelect('emRel', 'Relationship', ['Parent', 'Spouse', 'Sibling', 'Child', 'Relative', 'Friend', 'Colleague', 'Guardian', 'Other'], true)}
                    {renderInput('emPhone', 'Emergency Phone', 'tel', true)}
                    {renderInput('emEmail', 'Emergency Email', 'email', true)}
                  </div>
                </section>
              </>
            )}

            {step === 2 && (
              <>
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">2.1 Professional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect('profBackground', 'Professional Background', ['Social Work', 'Academia', 'Research', 'Mental Health', 'Public Health', 'NGO/CSO Sector', 'Government', 'Student', 'Other'], true)}
                    {renderSelect('yearsExp', 'Years of Experience', ['< 1 Year', '1–3 Years', '4–6 Years', '7–10 Years', '> 10 Years', 'Student/NA'], true)}
                    {renderInput('profAssoc', 'Professional Association Membership')}
                  </div>
                  {renderCheckboxes('areaPractice', 'Area of Practice', ['Child Protection', 'Mental Health', 'Medical Social Work', 'School Social Work', 'Community Development', 'Criminal Justice', 'Disability Services', 'Gender-Based Violence', 'Youth Work', 'Policy Advocacy', 'Research', 'Humanitarian Response', 'Other'])}
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">2.2 IFSW Affiliation</h3>
                  <div className="space-y-2">
                    <label className="block text-[14px] font-semibold text-gray-800">Are you affiliated with IFSW?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 cursor-pointer transition-all ${data.isIfsw === opt ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="isIfsw" value={opt} checked={data.isIfsw === opt} onChange={handleChange} className="w-4 h-4 text-brand-green focus:ring-brand-green" />
                          <span className="font-bold text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {data.isIfsw === 'Yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-4">
                      {renderInput('ifswName', 'Name of Member Association', 'text', true)}
                      {renderSelect('ifswCountry', 'Country of Association', ['Malawi', 'South Africa', 'Kenya', 'Other'], true)}
                      {renderInput('ifswNumber', 'Membership Number')}
                      {renderInput('ifswPosition', 'Position Held')}
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">2.3 Conference Interests</h3>
                  {renderCheckboxes('interests', 'Areas of Interest', ['Mental Health', 'Climate Change', 'Migration', 'Child Justice', 'Social Policy', 'Community Development', 'Gender Equality', 'Youth Empowerment', 'Disability Inclusion', 'Social Protection', 'Human Rights', 'Digital Social Work', 'Research', 'Other'])}
                </section>
              </>
            )}

            {step === 3 && (
              <>
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Delegate Category</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['International Delegate', 'Malawian Delegate', 'Student Delegate', 'Virtual Participant'].map(cat => (
                        <label key={cat} className={`flex items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.category === cat ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-brand-green/30 hover:bg-gray-50'}`}>
                          <input type="radio" name="category" value={cat} checked={data.category === cat} onChange={handleChange} className="w-5 h-5 text-brand-green focus:ring-brand-green border-gray-300" />
                          <span className="font-bold text-gray-800">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {data.category === 'International Delegate' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="p-6 bg-brand-sand/20 rounded-3xl border border-brand-sand/50 space-y-6">
                        <h4 className="font-bold text-brand-ink text-lg">A.1 Travel Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput('arrivalDate', 'Arrival Date', 'date', true)}
                          {renderInput('arrivalTime', 'Arrival Time', 'time', true)}
                          {renderInput('arrivalFlight', 'Arrival Flight Number', 'text', true)}
                          {renderInput('depDate', 'Departure Date', 'date', true)}
                          {renderInput('depTime', 'Departure Time', 'time', true)}
                          {renderInput('depFlight', 'Departure Flight Number', 'text', true)}
                          {renderSelect('airportTransfer', 'Airport Transfer Required?', ['Yes', 'No'], true)}
                        </div>
                      </div>
                      
                      <div className="p-6 bg-brand-sand/20 rounded-3xl border border-brand-sand/50 space-y-6">
                        <h4 className="font-bold text-brand-ink text-lg">A.2 Accommodation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderSelect('accReq', 'Accommodation Required?', ['Yes', 'No'], true)}
                          {data.accReq === 'Yes' && (
                            <>
                              {renderSelect('hotelCat', 'Preferred Hotel Category', ['5-Star', '4-Star', '3-Star', 'Budget/Guest House'], true)}
                              {renderSelect('roomPref', 'Room Preference', ['Single Occupancy', 'Shared Double Room', 'Suite'], true)}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-6 bg-brand-sand/20 rounded-3xl border border-brand-sand/50 space-y-6">
                        <h4 className="font-bold text-brand-ink text-lg">A.3 Visa Support</h4>
                        {renderSelect('visaReq', 'Visa Support Required?', ['Yes', 'No'], true)}
                        {data.visaReq === 'Yes' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-brand-sand">
                            {renderInput('passName', 'Passport Name Spelling', 'text', true)}
                            {renderInput('passNum', 'Passport Number', 'text', true)}
                            {renderInput('passExp', 'Passport Expiry Date', 'date', true)}
                            {renderInput('embassyName', 'Embassy Name', 'text', true)}
                            {renderInput('embassyLoc', 'Embassy Location', 'text', true)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {data.category === 'Malawian Delegate' && (
                    <div className="p-6 bg-brand-sand/20 rounded-3xl border border-brand-sand/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="font-bold text-brand-ink text-lg">B. Malawian Delegate Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect('district', 'District of Operation', ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Other'], true)}
                        {renderSelect('localTransport', 'Local Transport Assistance Needed?', ['Yes', 'No'], true)}
                      </div>
                    </div>
                  )}

                  {data.category === 'Student Delegate' && (
                    <div className="p-6 bg-brand-sand/20 rounded-3xl border border-brand-sand/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="font-bold text-brand-ink text-lg">C. Student Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSelect('levelStudy', 'Level of Study', ['Certificate', 'Diploma', 'Undergraduate Degree', 'Master\'s Degree', 'PhD / Doctoral'], true)}
                        {renderInput('progStudy', 'Programme of Study', 'text', true)}
                        {renderInput('studentInst', 'Student Institution', 'text', true)}
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Student Identification Upload (Required)</label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-brand-green bg-white rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center gap-2">
                          {uploadingStudentId ? (
                            <div className="flex items-center gap-2 text-brand-green py-3">
                              <Loader2 className="animate-spin" size={20} />
                              <span className="text-sm font-semibold">Uploading to secure storage...</span>
                            </div>
                          ) : data.studentIdFile ? (
                            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl w-full justify-between">
                              <div className="flex items-center gap-2 truncate">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                <span className="text-xs font-semibold truncate">{studentIdFileName || 'Student_ID_Uploaded'}</span>
                              </div>
                              <label className="text-xs font-bold text-brand-green hover:underline cursor-pointer shrink-0">
                                Replace
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileUpload(e, 'student-id', 'studentIdFile', setUploadingStudentId, setStudentIdFileName)}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-1 w-full py-2">
                              <Upload className="text-gray-400" size={24} />
                              <span className="text-xs font-bold text-brand-green">Choose file or drag & drop</span>
                              <span className="text-[11px] text-gray-500">PDF, JPG, or PNG (Max 20MB)</span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required={!data.studentIdFile}
                                onChange={(e) => handleFileUpload(e, 'student-id', 'studentIdFile', setUploadingStudentId, setStudentIdFileName)}
                              />
                            </label>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Clear photo/scan of current Student ID card or official university clearance letter.</p>
                      </div>
                    </div>
                  )}

                  {data.category === 'Virtual Participant' && (
                    <div className="p-6 bg-brand-sand/20 rounded-3xl border border-brand-sand/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="font-bold text-brand-ink text-lg">D. Virtual Details</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {renderSelect('timeZone', 'Participant Time Zone', ['GMT', 'UTC', 'CAT', 'EST', 'PST', 'Other'], true)}
                        {renderCheckboxes('virtualSessions', 'Preferred Virtual Sessions', ['Keynote Addresses', 'Plenary Discussions', 'Parallel Paper Presentations', 'Virtual Networking Lounges'])}
                        <div className="space-y-1">
                          <label className={labelClass}>Technical & Accessibility Requirements</label>
                          <textarea name="techReq" value={data.techReq} onChange={handleChange} className={`${inputClass} rounded-2xl min-h-[100px] py-4`} placeholder="Specify bandwidth constraints, screen reader accommodations..." />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}

            {step === 4 && (
              <section className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">4.1 Special Roles (Optional)</h3>
                  
                  <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.isPresenter ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="checkbox" name="isPresenter" checked={data.isPresenter} onChange={handleChange} className="w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" />
                    <span className="font-bold text-gray-800">I am presenting a paper, poster, or workshop</span>
                  </label>

                  {data.isPresenter && (
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('presTitle', 'Presentation Title', 'text', true)}
                        {renderSelect('presTrack', 'Abstract Category / Track', ['Mental Health', 'Policy', 'Climate', 'Education'], true)}
                        {renderSelect('presType', 'Presentation Type', ['Oral Presentation', 'Poster Presentation', 'Workshop Facilitation', 'Panel Discussion'], true)}
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Presenter Biography (Max 250 words) *</label>
                        <textarea name="presBio" value={data.presBio} onChange={handleChange} required className={`${inputClass} rounded-2xl min-h-[100px] py-4`} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Co-author Information (Optional)</label>
                        <textarea name="presCoauthors" value={data.presCoauthors} onChange={handleChange} className={`${inputClass} rounded-2xl min-h-[80px] py-4`} placeholder="Names, affiliations, and emails" />
                      </div>
                      {renderCheckboxes('presAv', 'Equipment & AV Requirements', ['Projector/HDMI', 'Audio Mic', 'Flipchart', 'Laptop Audio', 'Custom AV'])}
                      <div className="space-y-2">
                        <label className={labelClass}>Abstract Submission Upload (*.doc, *.pdf) *</label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-brand-green bg-white rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center gap-2">
                          {uploadingAbstract ? (
                            <div className="flex items-center gap-2 text-brand-green py-3">
                              <Loader2 className="animate-spin" size={20} />
                              <span className="text-sm font-semibold">Uploading abstract file...</span>
                            </div>
                          ) : data.presAbstractFile ? (
                            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl w-full justify-between">
                              <div className="flex items-center gap-2 truncate">
                                <FileText size={18} className="text-emerald-600 shrink-0" />
                                <span className="text-xs font-semibold truncate">{abstractFileName || 'Abstract_Document_Uploaded'}</span>
                              </div>
                              <label className="text-xs font-bold text-brand-green hover:underline cursor-pointer shrink-0">
                                Replace
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".doc,.docx,.pdf"
                                  onChange={(e) => handleFileUpload(e, 'abstract', 'presAbstractFile', setUploadingAbstract, setAbstractFileName)}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-1 w-full py-2">
                              <Upload className="text-gray-400" size={24} />
                              <span className="text-xs font-bold text-brand-green">Upload abstract document</span>
                              <span className="text-[11px] text-gray-500">Word (.doc, .docx) or PDF (Max 20MB)</span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".doc,.docx,.pdf"
                                required={!data.presAbstractFile}
                                onChange={(e) => handleFileUpload(e, 'abstract', 'presAbstractFile', setUploadingAbstract, setAbstractFileName)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.isExhibitor ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="checkbox" name="isExhibitor" checked={data.isExhibitor} onChange={handleChange} className="w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" />
                    <span className="font-bold text-gray-800">I am registering as an exhibitor or organization host</span>
                  </label>

                  {data.isExhibitor && (
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('exhibOrg', 'Exhibiting Organization Name', 'text', true)}
                        {renderSelect('exhibBooth', 'Booth Requirements', ['Standard Shell Scheme', 'Custom Space Only', 'Table Top Display'], true)}
                        {renderInput('exhibStaff', 'Number of Exhibition Staff', 'number', true)}
                        {renderSelect('exhibElec', 'Electricity Requirements', ['Standard 220V Socket', 'High Power Output', 'None'], true)}
                        {renderSelect('exhibInternet', 'Internet Requirements', ['Standard Wi-Fi', 'Dedicated Ethernet Line'], true)}
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Nature of Exhibition *</label>
                        <textarea name="exhibNature" value={data.exhibNature} onChange={handleChange} required className={`${inputClass} rounded-2xl min-h-[80px] py-4`} />
                      </div>
                      <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                        <input type="checkbox" name="exhibAck" checked={data.exhibAck} onChange={handleChange} className="w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                        <span className="text-sm font-medium">I acknowledge the Setup & Breakdown Schedule</span>
                      </label>
                      <div className="space-y-2">
                        <label className={labelClass}>Promotional Material Upload (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-brand-green bg-white rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center gap-2">
                          {uploadingPromo ? (
                            <div className="flex items-center gap-2 text-brand-green py-3">
                              <Loader2 className="animate-spin" size={20} />
                              <span className="text-sm font-semibold">Uploading exhibition material...</span>
                            </div>
                          ) : data.exhibPromoFile ? (
                            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl w-full justify-between">
                              <div className="flex items-center gap-2 truncate">
                                <FileText size={18} className="text-emerald-600 shrink-0" />
                                <span className="text-xs font-semibold truncate">{promoFileName || 'Promotional_Material_Uploaded'}</span>
                              </div>
                              <label className="text-xs font-bold text-brand-green hover:underline cursor-pointer shrink-0">
                                Replace
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.zip,.png,.jpg,.jpeg"
                                  onChange={(e) => handleFileUpload(e, 'exhibit', 'exhibPromoFile', setUploadingPromo, setPromoFileName)}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-1 w-full py-2">
                              <Upload className="text-gray-400" size={24} />
                              <span className="text-xs font-bold text-brand-green">Upload promotional material</span>
                              <span className="text-[11px] text-gray-500">PDF, ZIP, or images (Max 20MB)</span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.zip,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload(e, 'exhibit', 'exhibPromoFile', setUploadingPromo, setPromoFileName)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </section>
            )}

            {step === 5 && (
              <>
                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">5.1 Sessions & Social Events</h3>
                  {renderCheckboxes('workshops', 'Workshop Selection', ['Workshop A: Policy', 'Workshop B: Clinical Practice', 'Workshop C: Technology'])}
                  {renderCheckboxes('parallelSessions', 'Parallel Session Selection', ['Track 1: Migration', 'Track 2: Child Protection', 'Track 3: Climate Action'])}
                  {renderCheckboxes('specialEvents', 'Special Events Participation', ['Networking Sessions', 'Cultural Performance Night', 'Field Visits', 'Exhibition Viewing'])}
                  {renderSelect('gala', 'Gala Dinner Attendance', ['Yes', 'No'], true)}
                </section>

                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">5.2 Accessibility & Medical</h3>
                  {renderSelect('dietary', 'Dietary Requirements', ['Standard / No Specific Needs', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Diabetic', 'Lactose Intolerant', 'Other'], true)}
                  {renderCheckboxes('disability', 'Disability or Accessibility Needs', ['Wheelchair Ramp Access', 'Sign Language Interpreter', 'Hearing Assistance Device', 'Visual Assistance', 'Accessible Front Seating', 'Personal Assistant Access', 'None'])}
                  <div className="space-y-1">
                    <label className={labelClass}>Medical Considerations (Optional)</label>
                    <textarea name="medical" value={data.medical} onChange={handleChange} className={`${inputClass} rounded-2xl min-h-[80px] py-4`} placeholder="Optional medical info for emergency response teams." />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">5.3 Mandatory Consents</h3>
                  <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" name="consentPhoto" checked={data.consentPhoto} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                      <span className="text-sm text-gray-700 leading-snug font-medium">I grant permission for photos/videos captured during the event to be used in conference materials.</span>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" name="consentCode" checked={data.consentCode} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                      <span className="text-sm text-gray-700 leading-snug font-medium">I have read and agree to abide by the IFSW Conference Code of Conduct.</span>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" name="consentData" checked={data.consentData} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                      <span className="text-sm text-gray-700 leading-snug font-medium">I consent to the collection, storage, and processing of my personal data for conference administration purposes.</span>
                    </label>
                  </div>
                </section>
              </>
            )}

            {step === 6 && (
              <section className="space-y-8 text-center py-8">
                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-brand-green" />
                </div>
                <h3 className="text-3xl font-extrabold text-brand-ink">Ready to Register!</h3>
                <p className="text-gray-600 max-w-md mx-auto text-[15px]">
                  Please review your details carefully. By clicking submit, your delegate profile will be logged and submitted for Secretariat accreditation. Conference registration is completely free of charge.
                </p>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 max-w-md mx-auto text-left space-y-3">
                  <p className="text-sm flex justify-between"><span className="text-gray-500 font-medium">Name:</span> <span className="font-bold text-gray-900">{data.fullName || '-'}</span></p>
                  <p className="text-sm flex justify-between"><span className="text-gray-500 font-medium">Email:</span> <span className="font-bold text-gray-900">{data.email || '-'}</span></p>
                  <p className="text-sm flex justify-between"><span className="text-gray-500 font-medium">Category:</span> <span className="font-bold text-gray-900">{data.category || '-'}</span></p>
                  <p className="text-sm flex justify-between pt-3 border-t border-gray-200"><span className="text-gray-500 font-medium">Registration Admission Fee:</span> <span className="font-bold text-brand-green text-base">Free Admission (Sponsored)</span></p>
                </div>
              </section>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-brand-sand/30 p-6 border-t border-brand-line/50 flex justify-between items-center shrink-0">
          <div>
            <p className="font-bold text-brand-ink text-lg">
              {step === 6 ? 'Final Review' : `Step ${step} of 6`}
            </p>
            {step < 6 && <p className="text-[13px] text-gray-600 font-medium hidden sm:block">Please complete all required fields</p>}
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-full text-brand-ink font-bold bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                Back
              </button>
            )}
            {step < 6 ? (
              <button onClick={() => setStep(s => s + 1)} className="px-6 py-3 rounded-full bg-brand-green text-white font-bold hover:bg-brand-green-2 shadow-md flex items-center gap-2 transition-colors">
                Next Step <ChevronRight size={18}/>
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full bg-brand-green text-white font-bold hover:bg-brand-green-2 shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting to Database...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Registration</span>
                    <Check size={18}/>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
