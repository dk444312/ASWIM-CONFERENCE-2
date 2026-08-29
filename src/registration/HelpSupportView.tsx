import { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  FileText, 
  Mail, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  ShieldCheck,
  Send,
  Plane,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function HelpSupportView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const guideSections = [
    {
      title: '1. Dashboard Overview & Analytics',
      icon: Users,
      desc: 'Understand live KPI counters, revenue calculations, and attendance breakdowns.',
      steps: [
        'KPI cards at the top show real-time totals of received submissions, accepted delegates, pending reviews, and total conference fees in USD.',
        'The Delegate Category Breakdown pie chart displays proportional share across International, Malawian, Student, and Virtual delegates.',
        'The Application Review Status donut chart visualizes committee review clearance progress.'
      ]
    },
    {
      title: '2. Delegate Verification & Profiles Review',
      icon: CheckCircle2,
      desc: 'How to examine full submitted profiles and execute Accept or Reject decisions.',
      steps: [
        'Go to the Delegates menu to see all applicant cards. Use the Search bar to find people by name, email, country, or registration ID.',
        'Click the "Accept" or "Reject" button directly on any delegate card, or click "View All Submitted Details" to open the full modal.',
        'The modal presents all 5 sections of submitted data: Personal details, Professional background & IFSW affiliation, Category flight/visa/student data, Special presenter/exhibitor roles, and Workshop/Gala/Dietary preferences.',
        'Clicking "Accept Application" or "Reject Application" instantly updates the applicant record and recalculates all dashboard KPIs.'
      ]
    },
    {
      title: '3. Tracking Submissions Date & Time Logs',
      icon: Clock,
      desc: 'View chronological audit trails and export delegate spreadsheets.',
      steps: [
        'The Submissions menu lists every registered application sorted chronologically.',
        'Every row displays the exact calendar date, exact UTC/local time (e.g., 02:45 PM), and relative time (e.g., "12 mins ago").',
        'Click "Export to CSV" at the top right to download a formatted spreadsheet for the finance committee or border immigration control.'
      ]
    },
    {
      title: '4. Communications & Official Notices',
      icon: Mail,
      desc: 'Dispatch official email letters and invitation documents to delegates.',
      steps: [
        'Navigate to the Communications menu to see all submitted delegate emails.',
        'Choose a draft message template: "Accepted Draft Message" or "Rejected Draft Message" with clean, ready-to-read text and no placeholder brackets.',
        'Select any submitted email to address them directly, or send in bulk to all submitted delegates.',
        'Click "Send" to dispatch the notice and record it in the delivery log.'
      ]
    },
    {
      title: '5. Managing Dashboard Profile & Preferences',
      icon: Settings,
      desc: 'Customize administrator information, organization details, and conference rules.',
      steps: [
        'Visit the Settings menu to update the Secretariat administrator name, role, email, and phone.',
        'Update organization credentials and conference address in Lilongwe, Malawi.',
        'Changes saved in Settings immediately update the sidebar administrator display.'
      ]
    }
  ];

  const faqs = [
    {
      q: 'How does new registration data appear in this dashboard?',
      a: 'When an attendee completes the 6-step form on the public /register page, their submission is assigned a unique ID (e.g. REG-2027-008), timestamped with the exact date and minute, and instantly pushed to the dashboard database.'
    },
    {
      q: 'Can I change an application from Rejected back to Accepted?',
      a: 'Yes. Open the Delegates menu, filter by "Rejected", click the delegate card or details, and click "Accept Application". The status and all corresponding KPI cards will update immediately.'
    },
    {
      q: 'How are visa support letters handled for international delegates?',
      a: 'In the Delegates menu, filter for International Delegates. Each delegate who toggled "Visa Required" will display their passport number, expiry date, and embassy location in their profile modal, allowing the Secretariat to verify and issue official visa recommendation letters.'
    },
    {
      q: 'Where do I find presenters and paper abstracts?',
      a: 'Presenters are marked with a purple "Presenter" badge on their delegate card. Their full abstract title, conference thematic track, presentation type (Oral/Poster/Keynote), bio, and audio-visual requirements are displayed inside the details modal.'
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Guide & Help Support
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Step-by-step documentation on managing registrations, reviewing delegates, and dispatching notices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/registration/dashboard"
            className="px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-colors shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="text-brand-green" size={20} />
          Standard Operating Procedures & Dashboard Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guideSections.map((sec, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                  <sec.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{sec.title}</h3>
                  <p className="text-xs text-gray-500">{sec.desc}</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                {sec.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="text-brand-green" size={20} />
          Frequently Asked Questions (Admin & Registration Committee)
        </h2>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-gray-900 hover:text-brand-green transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-brand-green shrink-0 ml-2" /> : <ChevronDown size={18} className="text-gray-400 shrink-0 ml-2" />}
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Support Contact Card */}
      <div className="bg-gradient-to-r from-brand-sand/40 via-white to-brand-green/10 rounded-3xl p-6 sm:p-8 border border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-brand-ink">Need Direct Assistance from the Organizing Committee?</h3>
          <p className="text-xs text-gray-600 mt-1 max-w-xl">
            Contact the IFSW Africa 2027 Secretariat Secretariat in Lilongwe, Malawi or submit a priority ticket for delegate database synchronization.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-700 font-semibold">
            <span>Email: secretariat@ifsw-africa2027.org</span>
            <span>•</span>
            <span>Helpline: +265 (0) 1 773 200</span>
          </div>
        </div>
        <a
          href="mailto:secretariat@ifsw-africa2027.org"
          className="px-5 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-2 transition-colors shadow-sm shrink-0"
        >
          Email Support Team
        </a>
      </div>
    </div>
  );
}
