import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  FileText, 
  Home, 
  Check, 
  FileCheck,
  Briefcase,
  Globe,
  Tag,
  BookOpen,
  UserCheck,
  Lock
} from 'lucide-react';
import { Topbar } from '../components/Topbar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { submitAbstract, isAbstractSubmissionOpen } from '../registration/abstractStore';
import { uploadRegistrationAttachment } from '../lib/storage';

const CONFERENCES_THEMES = [
  'Decolonising Social Work Practice, Education & Research in Africa',
  'Strengthening Social Protection Systems & Poverty Reduction Strategies',
  'Child Welfare, Youth Empowerment & Family Development',
  'Climate Change, Disaster Response & Environmental Social Work',
  'Healthcare Interventions, Mental Health & Disability Rights',
  'Professional Standards, Decent Work Conditions & Ethics',
  'Digital Technology, Social Innovation & Emerging Trends'
];

export function AbstractSubmissionPage() {
  const navigate = useNavigate();
  const [openStatus, setOpenStatus] = useState(() => isAbstractSubmissionOpen());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRecord, setSuccessRecord] = useState<any | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const handleStatus = (e: any) => {
      if (e.detail && typeof e.detail.open === 'boolean') {
        setOpenStatus(e.detail.open);
      } else {
        setOpenStatus(isAbstractSubmissionOpen());
      }
    };
    window.addEventListener('ifsw_abstracts_open_status_changed', handleStatus);
    return () => window.removeEventListener('ifsw_abstracts_open_status_changed', handleStatus);
  }, []);

  // Form Fields State
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [institutionAffiliation, setInstitutionAffiliation] = useState('');
  const [themeSelection, setThemeSelection] = useState('');
  const [proposalType, setProposalType] = useState('');
  const [authorsAffiliation, setAuthorsAffiliation] = useState('');
  const [abstractTitle, setAbstractTitle] = useState('');
  const [abstractBody, setAbstractBody] = useState('');
  const [keywords, setKeywords] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // Count words helper
  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const wordCount = getWordCount(abstractBody);

  if (!openStatus) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbfa] text-[#1a2e22]">
        <Topbar />
        <Header />
        <main className="flex-1 py-16 px-4 sm:px-6 flex items-center justify-center font-sans">
          <div className="bg-white rounded-3xl shadow-lg border border-brand-line max-w-md w-full p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700 border border-amber-100 shadow-2xs">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                Abstract Submission is Closed
              </h2>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadError(null);

    try {
      const res = await uploadRegistrationAttachment(file, 'abstract');
      if (res.success && res.url) {
        setFileUrl(res.url);
        setUploadedFileName(file.name);
      } else {
        throw new Error(res.error || 'File upload failed');
      }
    } catch (err: any) {
      console.error('Failed uploading abstract:', err);
      setUploadError(`Failed to upload ${file.name}: ${err?.message || 'Please try again.'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !surname || !institutionAffiliation || !themeSelection || !proposalType || !abstractTitle || !abstractBody || !keywords) {
      alert('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    if (wordCount < 250 || wordCount > 350) {
      if (!confirm(`Your abstract body contains ${wordCount} words. We highly recommend a length of 250-300 words. Do you still wish to proceed?`)) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await submitAbstract({
        email,
        title,
        firstName,
        surname,
        jobTitle,
        institutionAffiliation,
        themeSelection,
        proposalType,
        authorsAffiliation,
        abstractTitle,
        abstractBody,
        keywords,
        fileUrl
      });
      setSuccessRecord(result);
    } catch (err) {
      console.error('Failed submitting abstract:', err);
      alert('An error occurred while submitting your abstract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProposalGuidance = () => {
    if (proposalType === 'Workshop') {
      return 'Guidance for Workshop: What is the rationale for your Workshop? Learning Objectives? Your target audience? Interactive methodology – please provide a brief description of the activities or tools you will use to engage the participants.';
    }
    return 'Guidance for papers and poster: Background to your work – why is it important? What are you addressing? What is the purpose of your research/topic? What is your methodology/approach to the topic in collecting your evidence? What are the results/key ideas and/or themes? What is your conclusion? Why are they important? What are the implications for service users, Vulnerable people, communities and/or others? What are the implications for social work?';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa] text-[#1a2e22]">
      <Topbar />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container-custom max-w-4xl">
          {/* Back Action */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-green-2 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>

          {!successRecord ? (
            <div className="bg-white rounded-3xl border border-brand-line shadow-lg overflow-hidden">
              {/* Header block */}
              <div className="bg-[#042619] text-white p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 space-y-3">
                  <div className="px-3.5 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] font-black tracking-wider uppercase inline-block">
                    IFSW Africa 2027
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
                    Call for Abstracts
                  </h1>
                  <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
                    Submit your research proposals, workshop outlines, or poster ideas to share your valuable knowledge and experiences with Africa's social work community in Lilongwe, Malawi.
                  </p>
                </div>
              </div>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
                
                {/* 1. Presenter Details Block */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-lg bg-brand-green/10 text-brand-green">
                      <UserCheck size={18} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">
                      Presenter Personal Profile
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address - will be used for all correspondence"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>

                    {/* Personal Title */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Title
                      </label>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      >
                        <option value="">Select Title (e.g. Mr, Dr, Prof, Ms)</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Rev.">Rev.</option>
                        <option value="Other">Other / Preferred</option>
                      </select>
                    </div>

                    {/* Placeholder space or empty */}
                    <div className="hidden sm:block"></div>

                    {/* First name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>

                    {/* Surname */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Surname <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Your surname"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>

                    {/* Job Title */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Job Title / Profession
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Your profession"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>

                    {/* Institution & Country */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Institution / Workplace / Affiliation and Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={institutionAffiliation}
                        onChange={(e) => setInstitutionAffiliation(e.target.value)}
                        placeholder="e.g. University of Malawi, Malawi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Proposal Classification Block */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-lg bg-brand-green/10 text-brand-green">
                      <Globe size={18} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">
                      Theme & Proposal Classification
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Theme select */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Theme Selection <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={themeSelection}
                        onChange={(e) => setThemeSelection(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      >
                        <option value="">-- Select the conference theme your proposal relates to --</option>
                        {CONFERENCES_THEMES.map((theme, i) => (
                          <option key={i} value={theme}>{theme}</option>
                        ))}
                      </select>
                    </div>

                    {/* Proposal Type */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Type of Proposal <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        Please select the option for your submission.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                        {[
                          { id: 'Individual paper', label: 'Individual paper' },
                          { id: 'Co-authored paper', label: 'Co-authored paper' },
                          { id: 'Poster presentation', label: 'Poster presentation' },
                          { id: 'Workshop', label: 'Workshop' }
                        ].map((opt) => (
                          <label 
                            key={opt.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              proposalType === opt.id 
                                ? 'border-brand-green bg-brand-green/5 text-brand-green font-extrabold' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="proposalType"
                              required
                              checked={proposalType === opt.id}
                              onChange={() => setProposalType(opt.id)}
                              className="accent-brand-green"
                            />
                            <span className="text-xs tracking-tight">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Abstract Details Block */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-lg bg-brand-green/10 text-brand-green">
                      <BookOpen size={18} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">
                      Information about the Abstract
                    </h2>
                  </div>

                  <div className="bg-amber-50/70 rounded-2xl border border-amber-200/50 p-5 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 leading-relaxed space-y-1.5">
                        <p className="font-bold">Abstract Body Submission Rules</p>
                        <p>
                          The abstract body should include: the background to your area; its purpose; your methodology/approach; the results/conclusion and practice implications for social workers.
                        </p>
                        <p className="font-semibold text-amber-950">
                          Please submit the material in English or French only. Note that the maximum number of words allowed for the abstract item is 250-300 words.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Authors and affiliations */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Author(s) and their Affiliation
                      </label>
                      <p className="text-xs text-gray-500">
                        List all contributing authors and their institutions in the format they should appear on the certificate/schedule.
                      </p>
                      <input
                        type="text"
                        value={authorsAffiliation}
                        onChange={(e) => setAuthorsAffiliation(e.target.value)}
                        placeholder="e.g. Dr. Jane Doe (University of Lilongwe), Prof. John Smith (Amlas)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>

                    {/* Title of Abstract */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Title of the Abstract <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        A clear and descriptive title that summarises your proposed topic.
                      </p>
                      <input
                        type="text"
                        required
                        value={abstractTitle}
                        onChange={(e) => setAbstractTitle(e.target.value)}
                        placeholder="Enter abstract proposal title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all font-bold"
                      />
                    </div>

                    {/* Abstract Body */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                          Abstract Body (250-300 words) <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          wordCount >= 250 && wordCount <= 300 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {wordCount} words
                        </span>
                      </div>

                      {/* Proposal Specific Guidance Indicator */}
                      <p className="text-xs text-brand-green font-bold bg-brand-green/5 p-3 rounded-lg border border-brand-green/10">
                        {getProposalGuidance()}
                      </p>

                      <textarea
                        required
                        rows={10}
                        value={abstractBody}
                        onChange={(e) => setAbstractBody(e.target.value)}
                        placeholder="Paste or write your abstract body here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all font-sans leading-relaxed"
                      />
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-700">
                        Key Words <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        Please insert 3-5 keywords separated by commas.
                      </p>
                      <input
                        type="text"
                        required
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g. social justice, decolonisation, community practice, Malawi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Supporting Document Upload */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-lg bg-brand-green/10 text-brand-green">
                      <Upload size={18} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">
                      Supporting Document Format upload
                    </h2>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    You can optionally upload your abstract or outline in a standard document format (PDF, Word doc, Docx, or ZIP). This helps the reviewing committee evaluate your visual structures or complex formatting if applicable.
                  </p>

                  <div className="space-y-4">
                    <div className="relative border-2 border-dashed border-gray-300 hover:border-brand-green transition-all rounded-2xl p-6 text-center bg-gray-50 hover:bg-brand-green/[0.02]">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.zip,.x-zip-compressed"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingFile}
                      />
                      <div className="space-y-2.5">
                        <div className="w-11 h-11 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto border border-brand-green/20">
                          {uploadingFile ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <FileText size={20} />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-gray-800">
                            {uploadingFile ? 'Uploading abstract document...' : 'Click or Drag document file to upload'}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Acceptable formats: PDF, MS Word, DOCX, ZIP (Max size: 20MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {uploadedFileName && (
                      <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs font-semibold">
                        <FileCheck size={16} className="text-emerald-700 shrink-0" />
                        <span className="flex-1 truncate">{uploadedFileName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                          UPLOADED
                        </span>
                      </div>
                    )}

                    {uploadError && (
                      <div className="flex items-start gap-2.5 p-3.5 bg-red-50 rounded-xl border border-red-200 text-red-950 text-xs">
                        <AlertCircle size={16} className="text-red-700 shrink-0 mt-0.5" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Submit Action Buttons */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <Link
                    to="/"
                    className="text-xs font-extrabold uppercase tracking-wide text-gray-500 hover:text-gray-800 py-3"
                  >
                    Cancel submission
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingFile}
                    className="w-full sm:w-auto px-8 py-4 bg-brand-green text-white font-extrabold rounded-xl hover:bg-brand-green-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting proposal...</span>
                      </>
                    ) : (
                      <span>Submit Abstract Proposal →</span>
                    )}
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Submission Success Screen */
            <div className="bg-white rounded-3xl border border-brand-line shadow-lg p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-black tracking-tight text-gray-900 font-heading">
                  Abstract Submitted Successfully!
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Thank you for submitting your abstract for the IFSW Africa Regional Conference 2027. Your proposal has been recorded in our conference database under the reference code below.
                </p>
              </div>

              <div className="max-w-xs mx-auto p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center font-mono">
                <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">SUBMISSION REF</div>
                <div className="text-xl font-black text-brand-green mt-1">
                  {successRecord.id}
                </div>
              </div>

              <div className="max-w-md mx-auto border-t border-gray-100 pt-6 text-left space-y-3.5 text-xs text-gray-600 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                <p className="font-extrabold text-emerald-950">Next Steps & Guidance:</p>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-emerald-900">
                  <li>An automated confirmation email has been sent to <strong className="text-emerald-950 font-bold">{successRecord.email}</strong>.</li>
                  <li>Our technical subcommittee will review your abstract on its methodology, relevance to conference themes, and practice implications.</li>
                  <li>Final abstract selection announcements will be made on or before <strong className="text-emerald-950 font-bold">April 30th, 2027</strong>.</li>
                </ul>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button
                  onClick={() => {
                    setSuccessRecord(null);
                    setEmail('');
                    setTitle('');
                    setFirstName('');
                    setSurname('');
                    setJobTitle('');
                    setInstitutionAffiliation('');
                    setThemeSelection('');
                    setProposalType('');
                    setAuthorsAffiliation('');
                    setAbstractTitle('');
                    setAbstractBody('');
                    setKeywords('');
                    setFileUrl('');
                    setUploadedFileName('');
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Submit Another Abstract
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-5 py-3 bg-brand-green text-white text-xs font-bold rounded-xl hover:bg-brand-green-2 transition-all flex items-center justify-center gap-1.5"
                >
                  <Home size={14} />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
