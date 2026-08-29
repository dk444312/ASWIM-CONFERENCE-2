import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  LayoutDashboard, 
  ArrowRight, 
  Home, 
  RotateCcw, 
  Lock, 
  Loader2, 
  FileText, 
  AlertCircle,
  Users,
  Globe,
  GraduationCap,
  Briefcase,
  Monitor,
  Building,
  Plane,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Topbar } from '../components/Topbar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { addRegistration, RegistrationData, isRegistrationOpen } from '../registration/registrationStore';
import { uploadRegistrationAttachment } from '../lib/storage';

const INITIAL_REGISTRATION_DATA = {
  // Step 1: Category & Attendance Mode (First Step)
  category: 'IFSW Members',
  attendanceMode: 'In-Person',
  // IFSW Member details
  ifswName: 'ASWiM (Association of Social Workers in Malawi)',
  ifswCountry: 'Malawi',
  ifswNumber: '',
  ifswPosition: '',
  district: 'Lilongwe',
  localTransport: 'No',
  
  // Non-Member details
  timeZone: 'CAT (UTC+2)',
  virtualSessions: [] as string[],
  techReq: '',

  // International details
  arrivalDate: '',
  arrivalTime: '',
  arrivalFlight: '',
  depDate: '',
  depTime: '',
  depFlight: '',
  airportTransfer: 'No',
  accReq: 'No',
  hotelCat: '4-Star',
  roomPref: 'Single Occupancy',
  visaReq: 'No',
  passName: '',
  passNum: '',
  passExp: '',
  embassyName: '',
  embassyLoc: '',

  // Student details
  levelStudy: 'Undergraduate Degree',
  progStudy: 'Bachelor of Social Work',
  studentInst: '',
  studentIdFile: '',

  // Step 2: Personal Identification & Contact Details
  title: 'Mr',
  fullName: '',
  gender: 'Male',
  dob: '',
  nationality: 'Malawi',
  country: 'Malawi',
  org: '',
  dept: '',
  position: '',
  email: '',
  altEmail: '',
  phone: '',
  altPhone: '',
  emName: '',
  emRel: 'Colleague',
  emPhone: '',
  emEmail: '',

  // Step 3: Professional Profile & Interests
  profBackground: 'Social Work',
  yearsExp: '4–6 Years',
  profAssoc: '',
  isIfsw: 'Yes',
  areaPractice: [] as string[],
  interests: [] as string[],

  // Step 4: Special Roles
  isPresenter: false,
  isExhibitor: false,
  presTitle: '',
  presTrack: 'Decolonising Social Work Practice, Education & Research in Africa',
  presType: 'Oral Presentation',
  presBio: '',
  presCoauthors: '',
  presAv: [] as string[],
  presAbstractFile: '',
  exhibOrg: '',
  exhibNature: '',
  exhibBooth: 'Standard Shell Scheme',
  exhibStaff: '2',
  exhibElec: 'Standard 220V Socket',
  exhibInternet: 'Standard Wi-Fi',
  exhibAck: false,
  exhibPromoFile: '',

  // Step 5: Sessions & Consents
  workshops: [] as string[],
  parallelSessions: [] as string[],
  specialEvents: ['Networking Sessions', 'Cultural Performance Night'],
  gala: 'Yes',
  dietary: 'Standard / No Specific Needs',
  disability: [] as string[],
  medical: '',
  consentPhoto: true,
  consentCode: true,
  consentData: true
};

const CATEGORIES = [
  {
    id: 'IFSW Members',
    title: 'IFSW Members',
    tag: 'Accredited Member',
    description: 'For registered members of IFSW Africa and national associations (e.g. ASWiM, SASWA, NASW).',
    icon: ShieldCheck,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'Non-Members',
    title: 'Non-Members',
    tag: 'General Practitioner',
    description: 'For independent practitioners, social development workers, NGO staff, and allied professionals.',
    icon: Users,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'International Delegate',
    title: 'International Delegate',
    tag: 'Global Participant',
    description: 'For delegates traveling from outside Malawi requiring visa, flight, and airport accommodation logistics.',
    icon: Globe,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    id: 'Student Delegate',
    title: 'Student Delegate',
    tag: 'Academic Track',
    description: 'For enrolled undergraduate, postgraduate, or doctoral students with student identification.',
    icon: GraduationCap,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  }
];

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

  const validateStep = () => {
    if (step === 1) {
      if (!data.category) {
        alert('Please select your Delegate Category.');
        return false;
      }
      if (!data.attendanceMode) {
        alert('Please select your Attendance Mode (In-Person or Virtual).');
        return false;
      }
    } else if (step === 2) {
      if (!data.fullName.trim()) {
        alert('Please enter your Full Name.');
        return false;
      }
      if (!data.email.trim()) {
        alert('Please enter your Email Address.');
        return false;
      }
      if (!data.phone.trim()) {
        alert('Please enter your Mobile Phone Number.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 6));
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!data.fullName.trim()) {
      alert('Please fill in your Full Name in Step 2 before submitting.');
      setStep(2);
      return;
    }
    if (!data.email.trim()) {
      alert('Please fill in your Email Address in Step 2 before submitting.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const newRecord = await addRegistration({
        ...data,
        category: data.category || 'IFSW Members',
        attendanceMode: data.attendanceMode || 'In-Person',
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

  const inputClass = "w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-[14px] text-gray-800";
  const labelClass = "block text-[13px] font-bold text-gray-700 ml-1 mb-1.5";

  const renderInput = (name: string, label: string, type="text", required=false, placeholder="") => (
    <div>
      <label className={labelClass}>{label} {required && <span className="text-red-500">*</span>}</label>
      <input 
        type={type} 
        name={name} 
        value={data[name as keyof typeof data] as string} 
        onChange={handleChange} 
        className={inputClass} 
        required={required} 
        placeholder={placeholder}
      />
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
      <label className="block text-[14px] font-bold text-gray-800 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map(opt => (
          <label key={opt} className="flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:border-brand-green/30 bg-gray-50 hover:bg-brand-green/5 cursor-pointer transition-all">
            <input type="checkbox" checked={(data[name] as string[]).includes(opt)} onChange={(e) => handleMulti(name, opt, e.target.checked)} className="mt-0.5 w-4 h-4 text-brand-green rounded border-gray-300 focus:ring-brand-green" />
            <span className="text-[13px] text-gray-700 leading-tight font-medium">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (!openStatus) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex flex-col font-sans text-[#1a2e22]">
        <Topbar />
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="bg-white rounded-3xl shadow-lg border border-brand-line max-w-md w-full p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700 border border-amber-100 shadow-2xs">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                Registration is Currently Closed
              </h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Delegate registrations for IFSW Africa Regional Conference 2027 are currently suspended. Please check back soon or contact the Secretariat.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-white text-xs font-bold rounded-xl hover:bg-brand-green-2 transition-all w-full shadow-xs"
            >
              <Home size={15} /> Return to Conference Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submittedRecord) {
    return (
      <div className="min-h-screen bg-brand-sand/30 flex flex-col font-sans">
        <Topbar />
        <Header />
        <main className="flex-1 py-12 px-4 sm:px-6 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-xl w-full p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 size={44} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">
                Registration Transmitted Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                Application Submitted!
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
                <span className="text-gray-500 font-medium">Delegate Category:</span>
                <span className="font-bold text-gray-900">{submittedRecord.category}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Attendance Mode:</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${
                  submittedRecord.attendanceMode === 'Virtual' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {submittedRecord.attendanceMode || 'In-Person'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Registration Fee:</span>
                <span className="font-bold text-emerald-700">Free Admission (Complimentary)</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500 font-medium">Secretariat Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  Pending Verification
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setSubmittedRecord(null);
                  setStep(1);
                  setData(INITIAL_REGISTRATION_DATA);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-green text-white font-bold hover:bg-brand-green-2 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <RotateCcw size={16} />
                Register Another Delegate
              </button>

              <Link
                to="/"
                className="w-full py-3 px-6 rounded-2xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 text-xs shadow-xs"
              >
                <Home size={14} /> Back to Conference Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] flex flex-col font-sans">
      {/* Top Navigation on Registration Form */}
      <Topbar />
      <Header />

      {/* Main Registration Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 flex items-start justify-center">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-[960px] flex flex-col overflow-hidden relative animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="px-6 sm:px-10 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-900 via-[#06291a] to-emerald-950 text-white relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-gold text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-white/10">
                  <Sparkles size={12} /> IFSW Africa Regional Conference 2027
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
                  Delegate Registration Portal
                </h1>
                <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl">
                  {step === 1 && "Step 1: Select your Delegate Category & Attendance Mode"}
                  {step === 2 && "Step 2: Enter your Personal Identification & Contact Details"}
                  {step === 3 && "Step 3: Provide your Professional Background & Sub-theme Interests"}
                  {step === 4 && "Step 4: Special Roles (Presenter or Exhibitor Arrangements)"}
                  {step === 5 && "Step 5: Select Sessions, Logistics & Required Consents"}
                  {step === 6 && "Step 6: Review Application & Submit Registration"}
                </p>
              </div>

              <div className="self-start md:self-center shrink-0">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-brand-gold text-gray-950 shadow-xs">
                  Free Admission (Sponsored)
                </span>
              </div>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="flex gap-2 px-6 sm:px-10 py-4 border-b border-gray-100 bg-gray-50/70 overflow-x-auto shrink-0 scrollbar-hide">
            {[
              { num: 1, label: "1. Category" },
              { num: 2, label: "2. Personal" },
              { num: 3, label: "3. Professional" },
              { num: 4, label: "4. Special Roles" },
              { num: 5, label: "5. Consents" },
              { num: 6, label: "6. Review" }
            ].map(({ num, label }) => {
              const isActive = step === num;
              const isPast = step > num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (num < step) setStep(num);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-extrabold whitespace-nowrap transition-all ${
                    isActive ? 'bg-brand-green text-white shadow-md' : 
                    isPast ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20' : 
                    'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPast ? <Check size={14} className="stroke-[3]" /> : <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-300'}`} />}
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* ========================================================================= */}
            {/* STEP 1: CATEGORY SELECTION & DEDICATED FIELDS (WITH ATTENDANCE MODE FIRST) */}
            {/* ========================================================================= */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* 1.1 Category Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">1</span>
                        Choose Delegate Category
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Click on a category to immediately open and view its dedicated registration fields.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CATEGORIES.map(cat => {
                      const isSelected = data.category === cat.id;
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setData(prev => ({
                              ...prev,
                              category: cat.id,
                              // Set smart default association/district if switching
                              isIfsw: cat.id === 'IFSW Members' ? 'Yes' : prev.isIfsw
                            }));
                          }}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left relative ${
                            isSelected 
                              ? 'border-brand-green bg-emerald-50/40 ring-2 ring-brand-green/20 shadow-md' 
                              : 'border-gray-200 hover:border-brand-green/40 hover:bg-gray-50/80 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'}`}>
                                <Icon size={20} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                                  {cat.title}
                                </h4>
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mt-0.5 ${cat.badgeColor}`}>
                                  {cat.tag}
                                </span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-brand-green bg-brand-green text-white' : 'border-gray-300'}`}>
                              {isSelected && <Check size={12} className="stroke-[3]" />}
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-600 leading-relaxed mt-2">
                            {cat.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 1.2 Dedicated Form Fields for Selected Category */}
                <div className="p-6 sm:p-7 bg-[#fbfbfa] rounded-3xl border border-gray-200/90 shadow-2xs space-y-6">
                  
                  {/* Category Header Banner */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></span>
                      <h3 className="font-black text-gray-950 text-base tracking-tight">
                        Dedicated Registration Fields: <span className="text-brand-green">{data.category}</span>
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      Mandatory Section
                    </span>
                  </div>

                  {/* FIELD #1: ATTENDANCE MODE (FIRST FIELD REQUIRED BY USER) */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                    <label className="block text-xs font-black uppercase tracking-wider text-brand-green">
                      1. Attendance Mode (First Selection) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-600">
                      Please select whether you will attend the conference physically in Lilongwe, Malawi, or via the interactive virtual live stream.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          data.attendanceMode === 'In-Person' 
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/10' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="attendanceMode"
                          value="In-Person"
                          checked={data.attendanceMode === 'In-Person'}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Building size={15} className="text-emerald-700" />
                            <span className="font-extrabold text-xs text-gray-900">In-Person Attendance</span>
                          </div>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            Physical venue access at BICC Lilongwe, networking luncheons, field visits, and gala dinner.
                          </span>
                        </div>
                      </label>

                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          data.attendanceMode === 'Virtual' 
                            ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/10' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="attendanceMode"
                          value="Virtual"
                          checked={data.attendanceMode === 'Virtual'}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-600 border-gray-300"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Monitor size={15} className="text-purple-700" />
                            <span className="font-extrabold text-xs text-gray-900">Virtual Participation (Online)</span>
                          </div>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            Live streaming webcasts, digital Q&A sessions, virtual parallel tracks, and digital certificates.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* DEDICATED FIELDS FOR IFSW MEMBERS */}
                  {data.category === 'IFSW Members' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('ifswName', 'Member Association Name', 'text', true, 'e.g., ASWiM, SASWA, NASW')}
                        {renderSelect('ifswCountry', 'Association Country', ['Malawi', 'South Africa', 'Kenya', 'Zimbabwe', 'Uganda', 'Ghana', 'Nigeria', 'Tanzania', 'Zambia', 'Other'], true)}
                        {renderInput('ifswNumber', 'IFSW Membership / License Number', 'text', false, 'e.g., ASWIM/2026/042')}
                        {renderInput('ifswPosition', 'Position Held in Association (Optional)', 'text', false, 'e.g., Executive Member, Member')}
                      </div>

                      {data.attendanceMode === 'In-Person' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                          {renderSelect('district', 'Duty Station / District in Malawi', ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi', 'Salima', 'Karonga', 'Other'], true)}
                          {renderSelect('localTransport', 'Local Commuter Shuttle Required within Lilongwe?', ['No', 'Yes (Hotel to BICC Venue)'], true)}
                        </div>
                      )}

                      {data.attendanceMode === 'Virtual' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                          {renderSelect('timeZone', 'Your Current Timezone', ['CAT (UTC+2)', 'GMT / UTC', 'EAT (UTC+3)', 'WAT (UTC+1)', 'EST / EDT', 'Other'], true)}
                          {renderInput('techReq', 'Virtual Live-Stream Accommodations (Optional)', 'text', false, 'e.g., Low bandwidth stream, closed captions')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DEDICATED FIELDS FOR NON-MEMBERS */}
                  {data.category === 'Non-Members' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('org', 'Organization / Practice Sector', 'text', true, 'e.g., Ministry, NGO, Hospital, Private Practice')}
                        {renderInput('position', 'Job Title / Designation', 'text', true, 'e.g., Social Development Officer')}
                      </div>

                      {data.attendanceMode === 'Virtual' ? (
                        <div className="space-y-4 pt-2 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderSelect('timeZone', 'Participant Timezone', ['CAT (UTC+2)', 'GMT / UTC', 'EAT (UTC+3)', 'WAT (UTC+1)', 'EST / EDT', 'PST / PDT', 'Other'], true)}
                            {renderInput('techReq', 'Technical / Accessibility Requests', 'text', false, 'e.g., Live transcription, screen reader support')}
                          </div>
                          {renderCheckboxes('virtualSessions', 'Preferred Virtual Session Tracks', ['Keynote Addresses', 'Decolonising Practice Track', 'Child & Youth Welfare', 'Climate & Social Protection', 'Interactive Live Q&A'])}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                          {renderSelect('district', 'Primary District / City of Residence', ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'International / Overseas', 'Other'], true)}
                          {renderSelect('localTransport', 'Local Commuter Transport Needed?', ['No', 'Yes (Within Lilongwe)'], true)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DEDICATED FIELDS FOR INTERNATIONAL DELEGATES */}
                  {data.category === 'International Delegate' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Flight Details */}
                      <div className="p-4 bg-white rounded-2xl border border-gray-200/90 space-y-4">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                          <Plane size={15} className="text-sky-600" /> Travel & Flight Logistics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {renderInput('arrivalDate', 'Arrival Date in Malawi', 'date', true)}
                          {renderInput('arrivalTime', 'Arrival Time', 'time', true)}
                          {renderInput('arrivalFlight', 'Arrival Flight No.', 'text', true, 'e.g., ET 876')}
                          {renderInput('depDate', 'Departure Date', 'date', true)}
                          {renderInput('depTime', 'Departure Time', 'time', true)}
                          {renderInput('depFlight', 'Departure Flight No.', 'text', true, 'e.g., KQ 421')}
                        </div>
                        {renderSelect('airportTransfer', 'Kamuzu International Airport (KIA) Reception Shuttle Needed?', ['Yes (Free Conference Shuttle)', 'No (Self Arranged)'], true)}
                      </div>

                      {/* Accommodation */}
                      <div className="p-4 bg-white rounded-2xl border border-gray-200/90 space-y-4">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                          <Building size={15} className="text-emerald-600" /> Accommodation Coordination
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {renderSelect('accReq', 'Assistance with Hotel Booking?', ['Yes', 'No'], true)}
                          {data.accReq === 'Yes' && (
                            <>
                              {renderSelect('hotelCat', 'Preferred Hotel Class', ['5-Star (BICC/President)', '4-Star (Sunbird Capital/Lilongwe Hotel)', '3-Star / Budget Guest House'], true)}
                              {renderSelect('roomPref', 'Room Type', ['Single Occupancy', 'Shared Twin Room', 'Executive Suite'], true)}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Visa Support */}
                      <div className="p-4 bg-white rounded-2xl border border-gray-200/90 space-y-4">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                          <ShieldCheck size={15} className="text-amber-600" /> Official Visa Support Letter
                        </h4>
                        {renderSelect('visaReq', 'Do you require an Official Visa Invitation Letter from ASWiM / IFSW?', ['Yes', 'No'], true)}
                        {data.visaReq === 'Yes' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-gray-100">
                            {renderInput('passName', 'Full Name as in Passport', 'text', true)}
                            {renderInput('passNum', 'Passport Number', 'text', true)}
                            {renderInput('passExp', 'Passport Expiry Date', 'date', true)}
                            {renderInput('embassyName', 'Malawi Embassy / Consular Mission to submit to', 'text', true, 'e.g., Malawi High Commission London')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DEDICATED FIELDS FOR STUDENT DELEGATES */}
                  {data.category === 'Student Delegate' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderInput('studentInst', 'University / College Name', 'text', true, 'e.g., University of Malawi, Chancellor College')}
                        {renderInput('progStudy', 'Course / Programme of Study', 'text', true, 'e.g., Bachelor of Social Work')}
                        {renderSelect('levelStudy', 'Degree Level', ['Certificate / Diploma', 'Undergraduate Degree', 'Master\'s Degree', 'PhD / Doctoral'], true)}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <label className={labelClass}>
                          Upload Student ID or University Clearance Letter (Required) <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-brand-green bg-white rounded-2xl p-5 transition-all flex flex-col items-center justify-center text-center gap-2">
                          {uploadingStudentId ? (
                            <div className="flex items-center gap-2 text-brand-green py-3">
                              <Loader2 className="animate-spin" size={20} />
                              <span className="text-sm font-semibold">Uploading student verification...</span>
                            </div>
                          ) : data.studentIdFile ? (
                            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl w-full justify-between">
                              <div className="flex items-center gap-2 truncate">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                <span className="text-xs font-bold truncate">{studentIdFileName || 'Student_ID_Verified.pdf'}</span>
                              </div>
                              <label className="text-xs font-bold text-brand-green hover:underline cursor-pointer shrink-0">
                                Replace File
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
                              <span className="text-xs font-bold text-brand-green">Upload Student ID (PDF, JPG, PNG)</span>
                              <span className="text-[11px] text-gray-500">Max file size 20MB</span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(e, 'student-id', 'studentIdFile', setUploadingStudentId, setStudentIdFileName)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: PERSONAL IDENTIFICATION & CONTACT DETAILS */}
            {/* ========================================================================= */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">2.1</span>
                    Personal Identification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderSelect('title', 'Title', ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Rev', 'Hon', 'Student', 'Other'], true)}
                    <div className="md:col-span-2">
                      {renderInput('fullName', 'Full Name (As shown on Passport / National ID)', 'text', true, 'e.g., Dr. Jane Phiri')}
                    </div>
                    {renderSelect('gender', 'Gender', ['Male', 'Female', 'Prefer Not to Say', 'Other'], true)}
                    {renderInput('dob', 'Date of Birth', 'date', true)}
                    {renderSelect('nationality', 'Nationality', ['Malawi', 'South Africa', 'Kenya', 'Zimbabwe', 'Nigeria', 'Uganda', 'UK', 'USA', 'Other'], true)}
                    {renderSelect('country', 'Country of Residence', ['Malawi', 'South Africa', 'Kenya', 'Zimbabwe', 'Nigeria', 'Uganda', 'UK', 'USA', 'Other'], true)}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">2.2</span>
                    Institutional & Professional Affiliation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput('org', 'Organization / Employer', 'text', true, 'e.g., Ministry of Gender / NGO')}
                    {renderInput('dept', 'Department / Unit', 'text', false, 'e.g., Child Welfare Services')}
                    {renderInput('position', 'Job Title / Designation', 'text', true, 'e.g., Senior Social Worker')}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">2.3</span>
                    Primary Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('email', 'Email Address (For Confirmation & Badge)', 'email', true, 'delegate@example.com')}
                    {renderInput('altEmail', 'Alternative Email (Optional)', 'email', false, 'alternate@example.com')}
                    {renderInput('phone', 'Mobile Phone Number (WhatsApp Enabled)', 'tel', true, '+265 999 123 456')}
                    {renderInput('altPhone', 'Alternative Phone / Office Tel', 'tel', false, '+265 1 770 000')}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">2.4</span>
                    Emergency Contact Person
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('emName', 'Emergency Contact Name', 'text', true, 'e.g., John Banda')}
                    {renderSelect('emRel', 'Relationship', ['Spouse', 'Parent', 'Sibling', 'Colleague', 'Friend', 'Guardian', 'Other'], true)}
                    {renderInput('emPhone', 'Emergency Phone Number', 'tel', true, '+265 888 654 321')}
                    {renderInput('emEmail', 'Emergency Email Address', 'email', true, 'emergency@example.com')}
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: PROFESSIONAL PROFILE & SUB-THEME INTERESTS */}
            {/* ========================================================================= */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">3.1</span>
                    Professional Background & Experience
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderSelect('profBackground', 'Primary Discipline', ['Social Work', 'Social Policy & Planning', 'Community Development', 'Public Health', 'Psychology / Mental Health', 'Human Rights Law', 'Academia & Research', 'Other'], true)}
                    {renderSelect('yearsExp', 'Years in Practice', ['< 1 Year', '1–3 Years', '4–6 Years', '7–10 Years', '> 10 Years', 'Student / Trainee'], true)}
                    {renderInput('profAssoc', 'Professional Registration / Council Body', 'text', false, 'e.g., Malawi Social Work Council')}
                  </div>

                  {renderCheckboxes('areaPractice', 'Areas of Specialized Practice', [
                    'Child Protection & Welfare',
                    'Mental Health Interventions',
                    'Medical & Clinical Social Work',
                    'Climate & Environmental Social Work',
                    'Gender-Based Violence (GBV)',
                    'Youth & Adolescent Empowerment',
                    'Social Protection & Cash Transfers',
                    'Disability Inclusion',
                    'Migration & Refugee Services',
                    'Criminal Justice & Corrections',
                    'Digital Social Work & AI'
                  ])}
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">3.2</span>
                    Conference Sub-themes of Interest
                  </h3>
                  {renderCheckboxes('interests', 'Select Conference Sub-themes you wish to attend:', [
                    'Decolonising Social Work Practice, Education & Research in Africa',
                    'Strengthening Social Protection Systems & Poverty Reduction Strategies',
                    'Child Welfare, Youth Empowerment & Family Development',
                    'Climate Change, Disaster Response & Environmental Social Work',
                    'Healthcare Interventions, Mental Health & Disability Rights',
                    'Professional Standards, Decent Work Conditions & Ethics',
                    'Digital Technology, Social Innovation & Emerging Trends'
                  ])}
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: SPECIAL ROLES (PRESENTER / EXHIBITOR) */}
            {/* ========================================================================= */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">4.1</span>
                    Special Conference Roles (Optional)
                  </h3>

                  {/* Presenter Checkbox */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.isPresenter ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="checkbox" 
                      name="isPresenter" 
                      checked={data.isPresenter} 
                      onChange={handleChange} 
                      className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" 
                    />
                    <div>
                      <span className="font-extrabold text-gray-900 text-sm block">I am presenting an Abstract, Paper, or Workshop</span>
                      <span className="text-xs text-gray-500">Tick if you are an oral speaker, poster presenter, or workshop facilitator.</span>
                    </div>
                  </label>

                  {data.isPresenter && (
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('presTitle', 'Presentation Title', 'text', true, 'Title of your paper')}
                        {renderSelect('presTrack', 'Conference Track', [
                          'Decolonising Social Work Practice, Education & Research in Africa',
                          'Strengthening Social Protection Systems & Poverty Reduction Strategies',
                          'Child Welfare, Youth Empowerment & Family Development',
                          'Climate Change, Disaster Response & Environmental Social Work',
                          'Healthcare Interventions, Mental Health & Disability Rights',
                          'Professional Standards, Decent Work Conditions & Ethics',
                          'Digital Technology, Social Innovation & Emerging Trends'
                        ], true)}
                        {renderSelect('presType', 'Presentation Format', ['Oral Presentation (15 mins)', 'Poster Presentation', 'Workshop Facilitation (60 mins)', 'Panel Discussion'], true)}
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Presenter Biography (Max 150 words) *</label>
                        <textarea name="presBio" value={data.presBio} onChange={handleChange} required className={`${inputClass} rounded-2xl min-h-[90px] py-3`} placeholder="Short summary of presenter qualifications..." />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Co-authors (Names and Affiliations)</label>
                        <textarea name="presCoauthors" value={data.presCoauthors} onChange={handleChange} className={`${inputClass} rounded-2xl min-h-[70px] py-3`} placeholder="e.g., Dr. Alice Tembo (Univ of Malawi)" />
                      </div>
                      {renderCheckboxes('presAv', 'Audio-Visual Requirements', ['HDMI Laptop Projector', 'Handheld Wireless Mic', 'Lapel / Lavalier Mic', 'Audio Speaker Output', 'Flipchart & Markers'])}
                    </div>
                  )}

                  {/* Exhibitor Checkbox */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.isExhibitor ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="checkbox" 
                      name="isExhibitor" 
                      checked={data.isExhibitor} 
                      onChange={handleChange} 
                      className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" 
                    />
                    <div>
                      <span className="font-extrabold text-gray-900 text-sm block">I am registering as an Organization Exhibitor / Booth Host</span>
                      <span className="text-xs text-gray-500">Tick if your organization will host an exhibition booth at the conference marketplace.</span>
                    </div>
                  </label>

                  {data.isExhibitor && (
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('exhibOrg', 'Exhibiting Organization Name', 'text', true, 'e.g., UNICEF Malawi / ASWiM')}
                        {renderSelect('exhibBooth', 'Booth Type Requested', ['Standard Shell Scheme (3m x 3m)', 'Custom Space Only', 'Table-top Display'], true)}
                        {renderInput('exhibStaff', 'Number of Booth Staff Attending', 'number', true, '2')}
                        {renderSelect('exhibElec', 'Electricity Requirement', ['Standard 220V Single Phase', 'Heavy Duty Power', 'None Required'], true)}
                        {renderSelect('exhibInternet', 'Internet Connectivity', ['Standard Conference Wi-Fi', 'Dedicated LAN Connection'], true)}
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Nature of Organization Exhibition *</label>
                        <textarea name="exhibNature" value={data.exhibNature} onChange={handleChange} required className={`${inputClass} rounded-2xl min-h-[80px] py-3`} placeholder="Describe publications, projects, or services displayed..." />
                      </div>
                      <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer">
                        <input type="checkbox" name="exhibAck" checked={data.exhibAck} onChange={handleChange} className="w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                        <span className="text-xs font-bold text-gray-800">I acknowledge and agree to the Exhibition Setup & Dismantling Schedule</span>
                      </label>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 5: SESSIONS, ACCESSIBILITY & MANDATORY CONSENTS */}
            {/* ========================================================================= */}
            {step === 5 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-6">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">5.1</span>
                    Social Events & Sessions
                  </h3>
                  {renderCheckboxes('specialEvents', 'Social & Networking Activities', [
                    'Welcome Cocktail Reception',
                    'Gala Dinner & Awards Night',
                    'Malawian Cultural Extravaganza',
                    'Community Social Work Field Visits',
                    'Youth & Students Networking Lounge'
                  ])}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect('gala', 'Will you attend the Conference Gala Dinner?', ['Yes', 'No'], true)}
                    {renderSelect('dietary', 'Dietary Preference', ['Standard / No Specific Needs', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Diabetic', 'Lactose Intolerant', 'Other'], true)}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">5.2</span>
                    Accessibility & Medical Accommodations
                  </h3>
                  {renderCheckboxes('disability', 'Accessibility Accommodations Needed', [
                    'Wheelchair Ramp Access',
                    'Sign Language Interpreter',
                    'Hearing Assistance Device',
                    'Visual Assistance / Large Print',
                    'Accessible Front Seating',
                    'None Required'
                  ])}
                  <div className="space-y-1">
                    <label className={labelClass}>Confidential Medical Notes (Optional for First Aid Response)</label>
                    <textarea name="medical" value={data.medical} onChange={handleChange} className={`${inputClass} rounded-2xl min-h-[70px] py-3`} placeholder="Any severe allergies or conditions conference first aiders should be aware of..." />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">5.3</span>
                    Mandatory Consents & Code of Conduct
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input type="checkbox" name="consentPhoto" checked={data.consentPhoto} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                      <span className="text-xs text-gray-700 leading-snug font-medium">
                        I grant permission for photos and video recordings taken during the IFSW 2027 Conference to be published in conference proceedings, website, and promotional materials.
                      </span>
                    </label>
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input type="checkbox" name="consentCode" checked={data.consentCode} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                      <span className="text-xs text-gray-700 leading-snug font-medium">
                        I have read and agree to adhere strictly to the IFSW Africa Regional Conference Professional Code of Conduct and Anti-Harassment Policy.
                      </span>
                    </label>
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input type="checkbox" name="consentData" checked={data.consentData} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-green rounded border-gray-300 focus:ring-brand-green" required />
                      <span className="text-xs text-gray-700 leading-snug font-medium">
                        I consent to the secure storage and processing of my personal data by the IFSW Secretariat for conference management, badges, and certification.
                      </span>
                    </label>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 6: FINAL REVIEW & APPLICATION SUBMISSION */}
            {/* ========================================================================= */}
            {step === 6 && (
              <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto text-brand-green">
                  <CheckCircle2 size={36} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-brand-ink tracking-tight">
                    Review Your Registration Summary
                  </h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                    Please verify that all your details are accurate before transmitting your application to the conference secretariat.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 max-w-lg mx-auto text-left space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-500 font-bold">Selected Category:</span>
                    <span className="font-black text-brand-green text-sm">{data.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-500 font-bold">Attendance Mode:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                      data.attendanceMode === 'Virtual' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {data.attendanceMode || 'In-Person'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Delegate Full Name:</span>
                    <span className="font-bold text-gray-900">{data.title} {data.fullName || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Email Address:</span>
                    <span className="font-bold text-gray-900">{data.email || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Mobile Phone:</span>
                    <span className="font-bold text-gray-900">{data.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Organization / Affiliation:</span>
                    <span className="font-bold text-gray-900">{data.org || 'Independent Practitioner'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-700 font-extrabold text-sm">Registration Fee:</span>
                    <span className="font-black text-emerald-700 text-base">Free Admission (Complimentary)</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-lg mx-auto text-xs text-emerald-800 font-medium flex items-center gap-3 text-left">
                  <ShieldCheck size={24} className="text-emerald-700 shrink-0" />
                  <span>
                    Your registration will be officially logged in the IFSW database upon clicking submit. You will receive an instant assignment ID.
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions / Navigation Buttons */}
          <div className="bg-brand-sand/30 p-6 sm:px-10 border-t border-brand-line/50 flex justify-between items-center shrink-0">
            <div>
              <p className="font-extrabold text-brand-ink text-sm sm:text-base">
                {step === 6 ? 'Final Confirmation' : `Step ${step} of 6`}
              </p>
              <p className="text-[12px] text-gray-500 hidden sm:block">
                {step === 1 && "Category & Mode Selection"}
                {step === 2 && "Personal Details"}
                {step === 3 && "Professional Background"}
                {step === 4 && "Special Roles"}
                {step === 5 && "Consents & Logistics"}
                {step === 6 && "Ready to transmit registration"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={handleBack} 
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-brand-ink font-bold bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}

              {step < 6 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-brand-green text-white font-extrabold hover:bg-brand-green-2 shadow-md flex items-center gap-2 transition-colors text-xs sm:text-sm"
                >
                  <span>Next Step</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-full bg-brand-green text-white font-extrabold hover:bg-brand-green-2 shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Submitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <Check size={16} className="stroke-[3]" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
