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
  // Step 1: Category & Attendance Mode (Sequential)
  category: '',
  attendanceMode: '',
  
  // IFSW & ASSWA Member details (Do not autofill - user inputs fresh data)
  memberType: '',
  ifswName: '',
  ifswCountry: '',
  ifswNumber: '',
  ifswPosition: '',
  asswaSchool: '',

  // Non-Member details
  orgType: '',
  practiceSector: '',

  // Student details
  levelStudy: '',
  progStudy: '',
  studentInst: '',
  studentIdFile: '',

  // Travel & Cross-Border (Board Suggestion: Applies to all categories)
  isInternationalTravel: '',
  arrivalDate: '',
  arrivalTime: '',
  arrivalFlight: '',
  depDate: '',
  depTime: '',
  depFlight: '',
  airportTransfer: 'Yes (Free Conference Shuttle from KIA to Conference Hotels)',
  accReq: '',
  hotelCat: '',
  roomPref: '',
  visaReq: '',
  passName: '',
  passNum: '',
  passExp: '',
  passCountry: '',
  embassyName: '',
  embassyLoc: '',

  // Malawi Local details
  district: '',
  localTransport: '',

  // Virtual details
  timeZone: '',
  virtualSessions: [] as string[],
  techReq: '',

  // Step 2: Personal Identification & Contact Details
  title: '',
  fullName: '',
  gender: '',
  dob: '',
  nationality: '',
  country: '',
  org: '',
  dept: '',
  position: '',
  email: '',
  altEmail: '',
  phone: '',
  altPhone: '',
  emName: '',
  emRel: '',
  emPhone: '',
  emEmail: '',

  // Step 3: Professional Profile & Interests
  profBackground: '',
  yearsExp: '',
  profAssoc: '',
  isIfsw: '',
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
    id: 'IFSW & ASSWA Members',
    title: '1. IFSW & ASSWA Members',
    tag: 'Accredited Member / School Rep',
    description: 'For registered members of IFSW Africa Region, national social work associations such as ASWiM, and members or representatives of ASSWA member schools of social work.',
    icon: ShieldCheck,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'Non-Members',
    title: '2. Non-Members',
    tag: 'Professional / Partner',
    description: 'For social workers, social development practitioners, NGO staff, government representatives and other professionals who are not registered members of IFSW, a national social work association or ASSWA.',
    icon: Users,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'Student Delegates',
    title: '3. Student Delegates',
    tag: 'Academic Track',
    description: 'For currently enrolled undergraduate, postgraduate and doctoral students in social work or related disciplines, with valid student identification.',
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
        alert('Please select a Delegate Category to proceed.');
        return false;
      }
      if (!data.attendanceMode) {
        alert('Please select your Attendance Mode (In-Person or Virtual).');
        return false;
      }
      if (data.attendanceMode === 'In-Person' && !data.isInternationalTravel) {
        alert('Please indicate whether you are traveling to Malawi from other countries.');
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
        category: data.category || 'IFSW & ASSWA Members',
        attendanceMode: data.attendanceMode || 'In-Person',
        country: data.country || (data.isInternationalTravel === 'Yes' ? (data.passCountry || data.ifswCountry || 'International') : 'Malawi'),
        org: data.org || (data.category === 'IFSW & ASSWA Members' ? (data.ifswName || data.asswaSchool || 'IFSW / ASSWA Member') : (data.studentInst || 'Social Work Professional'))
      });
      setSubmittedRecord(newRecord);
    } catch (e) {
      console.error('Submission error:', e);
      alert('An error occurred while submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google UI clear black design tokens
  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-[#1f1f1f] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1f1f1f] focus:border-[#1f1f1f] transition-all text-[14px] font-medium shadow-2xs";
  const labelClass = "block text-[13px] font-bold text-[#1f1f1f] ml-0.5 mb-1.5";

  const renderInput = (name: string, label: string, type="text", required=false, placeholder="") => (
    <div>
      <label className={labelClass}>{label} {required && <span className="text-red-600">*</span>}</label>
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
      <label className={labelClass}>{label} {required && <span className="text-red-600">*</span>}</label>
      <select name={name} value={data[name as keyof typeof data] as string} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} required={required}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const renderCheckboxes = (name: keyof typeof data, label: string, options: string[]) => (
    <div className="col-span-full">
      <label className="block text-[14px] font-bold text-[#1f1f1f] mb-2.5">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map(opt => {
          const isChecked = (data[name] as string[]).includes(opt);
          return (
            <label 
              key={opt} 
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                isChecked 
                  ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' 
                  : 'border-gray-200 hover:border-gray-400 bg-white'
              }`}
            >
              <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={(e) => handleMulti(name, opt, e.target.checked)} 
                className="mt-0.5 w-4 h-4 text-black rounded border-gray-400 focus:ring-black" 
              />
              <span className="text-[13px] text-[#1f1f1f] leading-tight font-medium">{opt}</span>
            </label>
          );
        })}
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
                Delegate registrations for the Joint IFSW Africa Region and ASSWA Conference 2027 are currently suspended. Please check back soon or contact the Secretariat.
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
                Thank you, <strong>{submittedRecord.title} {submittedRecord.fullName}</strong>. Your delegate registration has been logged and queued for review by the Joint IFSW Africa Region and ASSWA 2027 Secretariat.
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-[#1f1f1f]">
      {/* Top Navigation on Registration Form */}
      <Topbar />
      <Header />

      {/* Main Registration Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 flex items-start justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-[920px] flex flex-col overflow-hidden relative animate-in fade-in duration-300">
          
          {/* Header Banner - Google UI Clear Black & Dark Forest Clean Theme */}
          <div className="px-6 sm:px-10 py-7 border-b border-gray-200 bg-[#1f1f1f] text-white relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-wider mb-2 border border-white/15">
                  Joint IFSW Africa Region and ASSWA Conference 2027
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Delegate Registration Portal
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
                  {step === 1 && "Step 1: Select your Delegate Category & Attendance Mode"}
                  {step === 2 && "Step 2: Enter your Personal Identification & Contact Details"}
                  {step === 3 && "Step 3: Provide your Professional Background & Sub-theme Interests"}
                  {step === 4 && "Step 4: Special Roles (Presenter or Exhibitor Arrangements)"}
                  {step === 5 && "Step 5: Select Sessions, Logistics & Required Consents"}
                  {step === 6 && "Step 6: Review Application & Submit Registration"}
                </p>
              </div>

              <div className="self-start md:self-center shrink-0">
                <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1f1f1f] border border-gray-200 shadow-2xs">
                  Free Admission (Complimentary)
                </span>
              </div>
            </div>
          </div>

          {/* Progress Tracker Bar - Google Forms / Workspace Clean Style */}
          <div className="flex gap-2 px-6 sm:px-10 py-3.5 border-b border-gray-200 bg-[#f8f9fa] overflow-x-auto shrink-0 scrollbar-hide">
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
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all ${
                    isActive ? 'bg-[#1f1f1f] text-white shadow-2xs' : 
                    isPast ? 'bg-gray-200 text-[#1f1f1f] hover:bg-gray-300' : 
                    'bg-white border border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPast ? <Check size={13} className="stroke-[3]" /> : <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />}
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* ========================================================================= */}
            {/* STEP 1: SEQUENTIAL CATEGORY SELECTION & DEDICATED FIELDS */}
            {/* ========================================================================= */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* 1.1 Category Selection (FIRST INTERACTION) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] tracking-tight flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">1</span>
                        Choose Delegate Category
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Please select your delegate category below. The corresponding details and attendance options will unlock sequentially.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
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
                              isIfsw: cat.id === 'IFSW & ASSWA Members' ? 'Yes' : 'No'
                            }));
                          }}
                          className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between text-left relative ${
                            isSelected 
                              ? 'border-[#1f1f1f] bg-gray-50/90 ring-1 ring-[#1f1f1f] shadow-xs' 
                              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#1f1f1f] text-white' : 'bg-gray-100 text-gray-700'}`}>
                                <Icon size={18} />
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-[#1f1f1f] bg-[#1f1f1f] text-white' : 'border-gray-300'}`}>
                                {isSelected && <Check size={10} className="stroke-[3]" />}
                              </div>
                            </div>

                            <h4 className="font-bold text-sm text-[#1f1f1f] leading-tight">
                              {cat.title}
                            </h4>
                            
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border border-gray-300 bg-white text-[#1f1f1f] mt-1">
                              {cat.tag}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 leading-relaxed mt-2.5">
                            {cat.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PROMPT: IF CATEGORY IS NOT YET SELECTED */}
                {!data.category ? (
                  <div className="p-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center space-y-2 animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mx-auto">
                      <Users size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-[#1f1f1f]">Step 1.1: Please select a category above</h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Click on <strong>IFSW & ASSWA Members</strong>, <strong>Non-Members</strong>, or <strong>Student Delegates</strong> to reveal attendance mode and specialized registration questions.
                    </p>
                  </div>
                ) : (
                  /* SEQUENTIAL SECTION: UNFOLDS ONLY AFTER CATEGORY IS CHOSEN */
                  <div className="space-y-6 animate-in fade-in duration-300">

                    {/* 1.2 ATTENDANCE MODE (REVEALED AFTER CATEGORY IS CHOSEN) */}
                    <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-300 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#1f1f1f] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                          <h4 className="font-bold text-sm text-[#1f1f1f]">
                            Select Attendance Mode <span className="text-red-600">*</span>
                          </h4>
                        </div>
                        <span className="text-[11px] font-bold text-gray-500">
                          Physical (BICC Lilongwe) vs Virtual Live-Stream
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <label 
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            data.attendanceMode === 'In-Person' 
                              ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' 
                              : 'border-gray-200 hover:border-gray-400 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="attendanceMode"
                            value="In-Person"
                            checked={data.attendanceMode === 'In-Person'}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 text-black focus:ring-black border-gray-400"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Building size={16} className="text-[#1f1f1f]" />
                              <span className="font-bold text-xs text-[#1f1f1f]">In-Person Attendance</span>
                            </div>
                            <span className="text-[11px] text-gray-600 block mt-0.5">
                              Venue access at BICC Lilongwe, networking luncheons, field visits, and cultural gala.
                            </span>
                          </div>
                        </label>

                        <label 
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            data.attendanceMode === 'Virtual' 
                              ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' 
                              : 'border-gray-200 hover:border-gray-400 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="attendanceMode"
                            value="Virtual"
                            checked={data.attendanceMode === 'Virtual'}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 text-black focus:ring-black border-gray-400"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Monitor size={16} className="text-[#1f1f1f]" />
                              <span className="font-bold text-xs text-[#1f1f1f]">Virtual Participation (Online)</span>
                            </div>
                            <span className="text-[11px] text-gray-600 block mt-0.5">
                              Live streaming webcasts, digital Q&A sessions, virtual parallel tracks, and digital certificates.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* PROMPT: IF ATTENDANCE MODE NOT YET SELECTED */}
                    {!data.attendanceMode ? (
                      <div className="p-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center text-xs text-gray-600">
                        Please choose <strong>In-Person</strong> or <strong>Virtual</strong> above to proceed with the specific category fields.
                      </div>
                    ) : (
                      /* 1.3 DEDICATED FIELDS FOR SELECTED CATEGORY */
                      <div className="space-y-6 animate-in fade-in duration-300">

                        {/* CATEGORY 1: IFSW & ASSWA MEMBERS */}
                        {(data.category === 'IFSW & ASSWA Members' || data.category === 'IFSW Members') && (
                          <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-300 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                              <ShieldCheck size={18} className="text-[#1f1f1f]" />
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f]">
                                1.3 IFSW & ASSWA Institutional & Membership Details
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                {renderSelect('memberType', 'Membership / Affiliation Category', [
                                  'IFSW Africa Region National Association (e.g. ASWiM, SASWA, NASW)',
                                  'ASSWA Member School of Social Work (Faculty / Educator / Academic Representative)',
                                  'Direct IFSW Regional / International Member'
                                ], true)}
                              </div>

                              {data.memberType ? (
                                data.memberType.includes('ASSWA') ? (
                                  <>
                                    {renderInput('asswaSchool', 'ASSWA Member School / University Department', 'text', true, 'e.g., University of Malawi Social Work Department, Makerere University')}
                                    {renderSelect('ifswCountry', 'Country of University / School', ['Malawi', 'South Africa', 'Kenya', 'Zimbabwe', 'Uganda', 'Ghana', 'Nigeria', 'Tanzania', 'Zambia', 'Botswana', 'Rwanda', 'Other'], true)}
                                    {renderInput('ifswNumber', 'Faculty / Staff / Institutional ID No. (Optional)', 'text', false, 'e.g., UNIMA/SW/2026')}
                                    {renderInput('ifswPosition', 'Academic Designation / Departmental Role', 'text', false, 'e.g., Head of Department, Senior Lecturer, Dean')}
                                  </>
                                ) : (
                                  <>
                                    {renderInput('ifswName', 'Member Association Name', 'text', true, 'e.g., ASWiM (Malawi), SASWA (South Africa), NASW (Kenya)')}
                                    {renderSelect('ifswCountry', 'Association Country', ['Malawi', 'South Africa', 'Kenya', 'Zimbabwe', 'Uganda', 'Ghana', 'Nigeria', 'Tanzania', 'Zambia', 'Botswana', 'Rwanda', 'Other'], true)}
                                    {renderInput('ifswNumber', 'IFSW / National Association Membership No.', 'text', false, 'e.g., ASWIM/2026/042')}
                                    {renderInput('ifswPosition', 'Position Held in Association (Optional)', 'text', false, 'e.g., Executive Committee Member, General Member, President')}
                                  </>
                                )
                              ) : (
                                <div className="md:col-span-2 p-3.5 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-xs text-gray-600 text-center">
                                  Please choose your <strong>Membership / Affiliation Category</strong> above to input your institutional details.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CATEGORY 2: NON-MEMBERS */}
                        {data.category === 'Non-Members' && (
                          <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-300 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                              <Users size={18} className="text-[#1f1f1f]" />
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f]">
                                1.3 Non-Member Professional Profile & Practice Sector
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderInput('org', 'Organization / Employer Name', 'text', true, 'e.g., Ministry of Gender & Social Welfare, UNICEF, Save the Children, Kamuzu Central Hospital')}
                              {renderSelect('orgType', 'Type of Organization / Agency', [
                                'Government Ministry / Department / Statutory Body',
                                'Non-Governmental Organization (NGO)',
                                'International Development Agency / UN Agency',
                                'Hospital / Healthcare Facility / Medical Institution',
                                'Faith-Based Organization (FBO) / Community-Based Organization (CBO)',
                                'Private Practice / Independent Social Work Consultancy',
                                'Other Professional Sector'
                              ], true)}
                              {renderSelect('practiceSector', 'Primary Sector / Focus Area', [
                                'Child Protection & Family Welfare',
                                'Mental Health & Psychosocial Support (MHPSS)',
                                'Medical & Clinical Social Work',
                                'Climate Resilience, Disaster Relief & Green Social Work',
                                'Social Protection, Cash Transfers & Poverty Alleviation',
                                'Gender-Based Violence & Human Rights',
                                'Community Development & Rural Livelihoods',
                                'Social Work Education & Research',
                                'Other Specialized Area'
                              ], true)}
                              {renderInput('position', 'Job Title / Designation', 'text', true, 'e.g., Senior Social Welfare Officer, Project Lead')}
                            </div>
                          </div>
                        )}

                        {/* CATEGORY 3: STUDENT DELEGATES */}
                        {(data.category === 'Student Delegates' || data.category === 'Student Delegate') && (
                          <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-300 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                              <GraduationCap size={18} className="text-[#1f1f1f]" />
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f]">
                                1.3 Academic Enrollment & Student Verification
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {renderInput('studentInst', 'University / College / Training Institution', 'text', true, 'e.g., University of Malawi, Chancellor College, Catholic University')}
                              {renderInput('progStudy', 'Course / Programme of Study', 'text', true, 'e.g., Bachelor of Social Work (BSW), Master of Social Work (MSW)')}
                              {renderSelect('levelStudy', 'Degree / Qualification Level', [
                                'Undergraduate Degree (Bachelor\'s)',
                                'Postgraduate Diploma',
                                'Master\'s Degree (MSW / MSc / MA)',
                                'PhD / Doctoral Candidate',
                                'Certificate / Diploma'
                              ], true)}
                            </div>

                            <div className="space-y-2 pt-2 border-t border-gray-200">
                              <label className={labelClass}>
                                Upload Valid Student ID or University Clearance Letter (Required) <span className="text-red-600">*</span>
                              </label>
                              <div className="border-2 border-dashed border-gray-300 hover:border-black bg-gray-50 hover:bg-white rounded-xl p-5 transition-all flex flex-col items-center justify-center text-center gap-2">
                                {uploadingStudentId ? (
                                  <div className="flex items-center gap-2 text-[#1f1f1f] py-3">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="text-sm font-semibold">Uploading student verification...</span>
                                  </div>
                                ) : data.studentIdFile ? (
                                  <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-lg w-full justify-between">
                                    <div className="flex items-center gap-2 truncate">
                                      <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                                      <span className="text-xs font-bold truncate">{studentIdFileName || 'Student_ID_Verified.pdf'}</span>
                                    </div>
                                    <label className="text-xs font-bold text-[#1f1f1f] underline hover:text-black cursor-pointer shrink-0">
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
                                    <Upload className="text-gray-500" size={22} />
                                    <span className="text-xs font-bold text-[#1f1f1f]">Upload Student ID (PDF, JPG, PNG)</span>
                                    <span className="text-[11px] text-gray-500">Attach student card or endorsement letter from Dean / HOD (Max 20MB)</span>
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

                        {/* 1.4 TRAVEL & GEOGRAPHIC ORIGIN (FOR IN-PERSON ATTENDEES) */}
                        {data.attendanceMode === 'In-Person' ? (
                          <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-300 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Globe size={18} className="text-[#1f1f1f]" />
                                <div>
                                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f]">
                                    1.4 Travel Logistics & Geographic Origin
                                  </h4>
                                  <p className="text-[11px] text-gray-500">
                                    Required for airport reception, visa invitation clearances, and local accommodation coordination.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Travel Selection Toggle */}
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-[#1f1f1f]">
                                Are you traveling to Malawi from other countries? <span className="text-red-600">*</span>
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label 
                                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                                    data.isInternationalTravel === 'No' 
                                      ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' 
                                      : 'border-gray-200 hover:border-gray-400 bg-white'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="isInternationalTravel"
                                    value="No"
                                    checked={data.isInternationalTravel === 'No'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-black focus:ring-black border-gray-400"
                                  />
                                  <div>
                                    <span className="font-bold text-xs text-[#1f1f1f] block">No (Based in Malawi)</span>
                                    <span className="text-[11px] text-gray-500">Local Malawian delegate residing within Malawi</span>
                                  </div>
                                </label>

                                <label 
                                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                                    data.isInternationalTravel === 'Yes' 
                                      ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' 
                                      : 'border-gray-200 hover:border-gray-400 bg-white'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="isInternationalTravel"
                                    value="Yes"
                                    checked={data.isInternationalTravel === 'Yes'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-black focus:ring-black border-gray-400"
                                  />
                                  <div>
                                    <span className="font-bold text-xs text-[#1f1f1f] block">Yes, Traveling from Abroad</span>
                                    <span className="text-[11px] text-gray-600 font-medium">International delegate flying / traveling to Lilongwe</span>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* PROMPT IF TRAVEL NOT YET CHOSEN */}
                            {!data.isInternationalTravel ? (
                              <div className="p-4 rounded-lg bg-gray-50 text-xs text-gray-500 text-center border border-dashed border-gray-300">
                                Please indicate whether you are traveling from abroad or based in Malawi.
                              </div>
                            ) : data.isInternationalTravel === 'Yes' ? (
                              /* INTERNATIONAL TRAVEL QUESTIONS */
                              <div className="space-y-4 pt-3 border-t border-gray-200 animate-in fade-in duration-200">
                                {/* Flight Logistics */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f] flex items-center gap-1.5">
                                    <Plane size={14} className="text-[#1f1f1f]" /> Flight Itinerary & Airport Reception
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {renderInput('arrivalDate', 'Arrival Date in Malawi', 'date', true)}
                                    {renderInput('arrivalTime', 'Expected Arrival Time', 'time', true)}
                                    {renderInput('arrivalFlight', 'Arrival Flight No. & Airline', 'text', true, 'e.g., ET 876 (Ethiopian Airlines)')}
                                    {renderInput('depDate', 'Departure Date', 'date', true)}
                                    {renderInput('depTime', 'Expected Departure Time', 'time', true)}
                                    {renderInput('depFlight', 'Departure Flight No. & Airline', 'text', true, 'e.g., KQ 421 (Kenya Airways)')}
                                  </div>
                                  <div className="pt-2 border-t border-gray-200">
                                    {renderSelect('airportTransfer', 'Kamuzu International Airport (KIA) Reception Shuttle Needed?', [
                                      'Yes (Free Conference Shuttle from KIA to Conference Hotels)',
                                      'No (Self Arranged / Embassy Transport)'
                                    ], true)}
                                  </div>
                                </div>

                                {/* Accommodation Logistics */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f] flex items-center gap-1.5">
                                    <Building size={14} className="text-[#1f1f1f]" /> Accommodation Coordination in Lilongwe
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {renderSelect('accReq', 'Assistance with Negotiated Hotel Booking?', ['Yes', 'No (Already Booked / Self-Arranged)'], true)}
                                    {data.accReq.startsWith('Yes') && (
                                      <>
                                        {renderSelect('hotelCat', 'Preferred Hotel Class', [
                                          '5-Star (BICC / President Hotel Lilongwe)',
                                          '4-Star (Sunbird Capital Hotel / Lilongwe Hotel)',
                                          '3-Star / Budget Quality Guest House'
                                        ], true)}
                                        {renderSelect('roomPref', 'Room Type', ['Single Occupancy', 'Shared Twin Room', 'Executive Suite'], true)}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Official Visa Support */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f] flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-[#1f1f1f]" /> Official Visa Invitation Letter
                                  </h5>
                                  {renderSelect('visaReq', 'Do you require an Official Visa Invitation Letter from Joint IFSW & ASSWA Secretariat?', ['Yes', 'No (Visa-Free / Already have Visa)'], true)}
                                  {data.visaReq.startsWith('Yes') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                                      {renderInput('passName', 'Full Name as in Passport', 'text', true, 'e.g., Jane Phiri')}
                                      {renderInput('passNum', 'Passport Number', 'text', true, 'e.g., A12345678')}
                                      {renderInput('passExp', 'Passport Expiry Date', 'date', true)}
                                      {renderInput('passCountry', 'Passport Issuing Country', 'text', true, 'e.g., South Africa, Kenya, Nigeria')}
                                      <div className="md:col-span-2">
                                        {renderInput('embassyName', 'Malawi Embassy / Consular Mission to submit to', 'text', true, 'e.g., Malawi High Commission Pretoria / London / Online e-Visa')}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* LOCAL MALAWIAN QUESTIONS */
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200 animate-in fade-in duration-200">
                                {renderSelect('district', 'Duty Station / District in Malawi', [
                                  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi', 'Salima', 'Karonga', 'Dedza', 'Thyolo', 'Other District'
                                ], true)}
                                {renderSelect('localTransport', 'Local Commuter Shuttle Required within Lilongwe?', [
                                  'No (Self / Organization Commute)',
                                  'Yes (Designated Pickup Hotel to BICC Venue)'
                                ], true)}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* VIRTUAL MODE PARTICIPATION QUESTIONS */
                          <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-300 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                              <Monitor size={18} className="text-[#1f1f1f]" />
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1f1f1f]">
                                1.4 Virtual Access & Broadcast Logistics
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderSelect('timeZone', 'Participant Timezone', [
                                'CAT (UTC+2) — Central Africa Time (Malawi)',
                                'EAT (UTC+3) — East Africa Time',
                                'WAT (UTC+1) — West Africa Time',
                                'GMT / UTC — Greenwich Mean Time',
                                'EST / EDT (UTC-5 / -4) — Eastern Time',
                                'PST / PDT (UTC-8 / -7) — Pacific Time',
                                'Other Timezone'
                              ], true)}
                              {renderInput('techReq', 'Technical / Accessibility Accommodations', 'text', false, 'e.g., Low bandwidth stream, screen reader support, closed captions')}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: PERSONAL IDENTIFICATION & CONTACT DETAILS */}
            {/* ========================================================================= */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">2.1</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">2.2</span>
                    Institutional & Professional Affiliation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput('org', 'Organization / Employer', 'text', true, 'e.g., Ministry of Gender / NGO')}
                    {renderInput('dept', 'Department / Unit', 'text', false, 'e.g., Child Welfare Services')}
                    {renderInput('position', 'Job Title / Designation', 'text', true, 'e.g., Senior Social Worker')}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">2.3</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">2.4</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">3.1</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">3.2</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">4.1</span>
                    Special Conference Roles (Optional)
                  </h3>

                  {/* Presenter Checkbox */}
                  <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${data.isPresenter ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' : 'border-gray-200 hover:border-gray-400 bg-white'}`}>
                    <input 
                      type="checkbox" 
                      name="isPresenter" 
                      checked={data.isPresenter} 
                      onChange={handleChange} 
                      className="mt-1 w-5 h-5 text-black rounded border-gray-400 focus:ring-black" 
                    />
                    <div>
                      <span className="font-bold text-[#1f1f1f] text-sm block">I am presenting an Abstract, Paper, or Workshop</span>
                      <span className="text-xs text-gray-600">Tick if you are an oral speaker, poster presenter, or workshop facilitator.</span>
                    </div>
                  </label>

                  {data.isPresenter && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-300 space-y-4 animate-in fade-in duration-200">
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
                        <textarea name="presBio" value={data.presBio} onChange={handleChange} required className={`${inputClass} rounded-xl min-h-[90px] py-3`} placeholder="Short summary of presenter qualifications..." />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Co-authors (Names and Affiliations)</label>
                        <textarea name="presCoauthors" value={data.presCoauthors} onChange={handleChange} className={`${inputClass} rounded-xl min-h-[70px] py-3`} placeholder="e.g., Dr. Alice Tembo (Univ of Malawi)" />
                      </div>
                      {renderCheckboxes('presAv', 'Audio-Visual Requirements', ['HDMI Laptop Projector', 'Handheld Wireless Mic', 'Lapel / Lavalier Mic', 'Audio Speaker Output', 'Flipchart & Markers'])}
                    </div>
                  )}

                  {/* Exhibitor Checkbox */}
                  <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${data.isExhibitor ? 'border-[#1f1f1f] bg-gray-50 ring-1 ring-[#1f1f1f]' : 'border-gray-200 hover:border-gray-400 bg-white'}`}>
                    <input 
                      type="checkbox" 
                      name="isExhibitor" 
                      checked={data.isExhibitor} 
                      onChange={handleChange} 
                      className="mt-1 w-5 h-5 text-black rounded border-gray-400 focus:ring-black" 
                    />
                    <div>
                      <span className="font-bold text-[#1f1f1f] text-sm block">I am registering as an Organization Exhibitor / Booth Host</span>
                      <span className="text-xs text-gray-600">Tick if your organization will host an exhibition booth at the conference marketplace.</span>
                    </div>
                  </label>

                  {data.isExhibitor && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-300 space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('exhibOrg', 'Exhibiting Organization Name', 'text', true, 'e.g., UNICEF Malawi / ASWiM')}
                        {renderSelect('exhibBooth', 'Booth Type Requested', ['Standard Shell Scheme (3m x 3m)', 'Custom Space Only', 'Table-top Display'], true)}
                        {renderInput('exhibStaff', 'Number of Booth Staff Attending', 'number', true, '2')}
                        {renderSelect('exhibElec', 'Electricity Requirement', ['Standard 220V Single Phase', 'Heavy Duty Power', 'None Required'], true)}
                        {renderSelect('exhibInternet', 'Internet Connectivity', ['Standard Conference Wi-Fi', 'Dedicated LAN Connection'], true)}
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Nature of Organization Exhibition *</label>
                        <textarea name="exhibNature" value={data.exhibNature} onChange={handleChange} required className={`${inputClass} rounded-xl min-h-[80px] py-3`} placeholder="Describe publications, projects, or services displayed..." />
                      </div>
                      <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-300 cursor-pointer">
                        <input type="checkbox" name="exhibAck" checked={data.exhibAck} onChange={handleChange} className="w-5 h-5 text-black rounded border-gray-400 focus:ring-black" required />
                        <span className="text-xs font-bold text-[#1f1f1f]">I acknowledge and agree to the Exhibition Setup & Dismantling Schedule</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">5.1</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">5.2</span>
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
                    <textarea name="medical" value={data.medical} onChange={handleChange} className={`${inputClass} rounded-xl min-h-[70px] py-3`} placeholder="Any severe allergies or conditions conference first aiders should be aware of..." />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] border-b border-gray-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1f1f1f] text-white text-xs flex items-center justify-center font-bold">5.3</span>
                    Mandatory Consents & Code of Conduct
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-300">
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input type="checkbox" name="consentPhoto" checked={data.consentPhoto} onChange={handleChange} className="mt-1 w-5 h-5 text-black rounded border-gray-400 focus:ring-black" required />
                      <span className="text-xs text-[#1f1f1f] leading-snug font-medium">
                        I grant permission for photos and video recordings taken during the Joint IFSW Africa Region and ASSWA 2027 Conference to be published in conference proceedings, website, and promotional materials.
                      </span>
                    </label>
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input type="checkbox" name="consentCode" checked={data.consentCode} onChange={handleChange} className="mt-1 w-5 h-5 text-black rounded border-gray-400 focus:ring-black" required />
                      <span className="text-xs text-[#1f1f1f] leading-snug font-medium">
                        I have read and agree to adhere strictly to the Joint IFSW Africa Region and ASSWA Conference Professional Code of Conduct and Anti-Harassment Policy.
                      </span>
                    </label>
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input type="checkbox" name="consentData" checked={data.consentData} onChange={handleChange} className="mt-1 w-5 h-5 text-black rounded border-gray-400 focus:ring-black" required />
                      <span className="text-xs text-[#1f1f1f] leading-snug font-medium">
                        I consent to the secure storage and processing of my personal data by the Conference Secretariat for conference management, badges, and certification.
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
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-[#1f1f1f] border border-gray-300">
                  <CheckCircle2 size={32} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-[#1f1f1f] tracking-tight">
                    Review Your Registration Summary
                  </h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                    Please verify that all your details are accurate before transmitting your application to the conference secretariat.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-300 max-w-lg mx-auto text-left space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-600 font-bold">Selected Category:</span>
                    <span className="font-bold text-[#1f1f1f] text-sm">{data.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-600 font-bold">Attendance Mode:</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-gray-200 text-[#1f1f1f] border border-gray-300">
                      {data.attendanceMode || 'In-Person'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Delegate Full Name:</span>
                    <span className="font-bold text-[#1f1f1f]">{data.title} {data.fullName || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email Address:</span>
                    <span className="font-bold text-[#1f1f1f]">{data.email || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Mobile Phone:</span>
                    <span className="font-bold text-[#1f1f1f]">{data.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Organization / Affiliation:</span>
                    <span className="font-bold text-[#1f1f1f]">{data.org || 'Social Work Professional'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#1f1f1f] font-bold text-sm">Registration Fee:</span>
                    <span className="font-bold text-emerald-800 text-base">Free Admission (Complimentary)</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-xl border border-gray-300 max-w-lg mx-auto text-xs text-[#1f1f1f] font-medium flex items-center gap-3 text-left">
                  <ShieldCheck size={22} className="text-[#1f1f1f] shrink-0" />
                  <span>
                    Your registration will be officially logged in the conference database upon clicking submit. You will receive an instant assignment ID.
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions / Navigation Buttons - Google UI Clean Style */}
          <div className="bg-[#f8f9fa] p-5 sm:px-10 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div>
              <p className="font-bold text-[#1f1f1f] text-sm sm:text-base">
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
                  className="px-5 py-2.5 rounded-xl text-[#1f1f1f] font-bold bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-2xs flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}

              {step < 6 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="px-6 py-2.5 rounded-xl bg-[#1f1f1f] text-white font-bold hover:bg-black shadow-xs flex items-center gap-2 transition-colors text-xs sm:text-sm"
                >
                  <span>Next Step</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-[#1f1f1f] text-white font-bold hover:bg-black shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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
