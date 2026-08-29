import { useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Globe2, 
  GraduationCap, 
  HeartHandshake, 
  Users, 
  FileText, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Header } from '../components/Header';
import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';

interface SubthemeDetail {
  id: string;
  num: number;
  title: string;
  summary: string;
  description: string;
  icon: any; // Lucide icon
  bulletPoints: string[];
  color: string;
}

const subthemeData: SubthemeDetail[] = [
  {
    id: "humanitarian-climate",
    num: 1,
    title: "Social Work in Humanitarian, Crisis and Climate Contexts",
    summary: "Dedicated to human rights, preventing and responding to human suffering, and promoting resilience in disaster zones.",
    description: "As a humanitarian profession social work is dedicated to human rights and social justice, including preventing and responding to human suffering and promoting recovery and resilience.",
    icon: ShieldAlert,
    color: "emerald",
    bulletPoints: [
      "Preparedness, humanitarian response and recovery",
      "Ethical practice in emergencies and conflict",
      "Climate resilience, ecological justice and disaster risk reduction",
      "Gender, vulnerability and social justice in humanitarian and climate contexts"
    ]
  },
  {
    id: "indigenous-decolonial",
    num: 2,
    title: "African-Centred, Indigenous and Decolonial Social Work Practice",
    summary: "Transformative approaches integrating cultural knowledge and dismantling colonial thought to empower indigenous solutions.",
    description: "African-centred and decolonial social work practice transformative approach is required to integrate knowledge, values and culturally relevant and contextually relevant interventions to dismantling colonialism and colonial thinking to create a space for indigenous social work.",
    icon: Globe2,
    color: "gold",
    bulletPoints: [
      "Indigenous knowledge systems",
      "Humanity/Ubuntu and African philosophies",
      "Decolonising social work education, research and practice",
      "Culturally responsive and locally grounded interventions"
    ]
  },
  {
    id: "systems-innovation",
    num: 3,
    title: "Strengthening Social Work Systems, Education and Innovation",
    summary: "Critical skills development, academic advancement, professional regulation, and ethical digital transformation.",
    description: "New challenges require critical knowledge and skills for a transformative role and enabling environment for social workers and social work as an innovative field of practice and an academic discipline.",
    icon: GraduationCap,
    color: "emerald",
    bulletPoints: [
      "Social work workforce development",
      "Education, professional regulation and leadership",
      "Digital transformation, AI and ethical innovation",
      "Human-centred and resilient social service systems"
    ]
  },
  {
    id: "protection-wellbeing",
    num: 4,
    title: "Social Protection, Family Strengthening and Inclusive Community Wellbeing",
    summary: "Protecting the most vulnerable, bolstering family resilience, and tackling multidimensional poverty.",
    description: "Social work has a key responsibility in strengthening the enabling environment for inclusive transformational social protection that protects the most vulnerable, enhancing the social status and rights of the marginalised, and addressing the multidimensional nature of poverty and vulnerability.",
    icon: HeartHandshake,
    color: "gold",
    bulletPoints: [
      "Transformative social protection",
      "Child protection and safeguarding vulnerable adults",
      "Family strengthening and community resilience",
      "Mental health, psychosocial support, trauma-informed care and community wellbeing"
    ]
  },
  {
    id: "participation-justice",
    num: 5,
    title: "Community Participation, Social Justice and Sustainable Development",
    summary: "Co-designing social and environmental protection and empowering grassroots leadership to advocate for equality.",
    description: "Social workers work within communities to co-design and co-build social and environmental protection. They provide a multifaceted contribution to empowering communities and advocating for policies that promote rights and social justice.",
    icon: Users,
    color: "emerald",
    bulletPoints: [
      "Community engagement and participation",
      "Grassroots leadership and social accountability",
      "Inclusive development and resilient livelihoods",
      "Partnerships for social justice and sustainable development",
      "Ecological justice, green social work, climate action and resilient communities"
    ]
  },
  {
    id: "research-evidence",
    num: 6,
    title: "Research, Evidence, Policy and Future Directions for African Social Work",
    summary: "Ethically inclusive, contextually responsive knowledge creation to unlock Africa's sustainable and prosperous potential.",
    description: "Research, evidence and policy for social work must be ethically inclusive, culturally relevant and context responsive. Structured partnerships can enable collaboration, co-creation and innovation. Transformation is crucial for Africa to overcome challenges and barriers and unlock its full potential to support a just, sustainable and prosperous future.",
    icon: FileText,
    color: "gold",
    bulletPoints: [
      "Research and evidence-informed practice",
      "Policy development and implementation",
      "Monitoring, evaluation and knowledge management",
      "Innovation, partnerships and the future of African social work"
    ]
  }
];

export function SubthemesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = "Conference Sub-themes | IFSW Africa 2027";
  }, []);

  const handleScrollToDetail = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 95;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 95;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-brand-cream/40 min-h-screen flex flex-col font-sans" id="subthemes-page-root">
      <Topbar />
      <Header />

      {/* Hero Section with Beautiful SVG Banner */}
      <section className="relative bg-brand-deep text-white py-16 lg:py-24 overflow-hidden border-b border-brand-line/10" id="subthemes-hero">
        {/* SVG Decorative Banner Canvas Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none select-none z-0" id="subthemes-hero-svg-bg">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120C120 180 240 180 360 120C480 60 600 60 720 120C840 180 960 180 1080 120C1200 60 1320 60 1440 120V600H0V120Z" fill="url(#waveGrad1)" />
            <path d="M0 240C150 280 300 200 450 240C600 280 750 320 900 240C1050 160 1200 200 1350 240C1400 253.3 1420 260 1440 265V600H0V240Z" fill="url(#waveGrad2)" opacity="0.6" />
            <path d="M0 450C200 380 400 520 600 450C800 380 1000 480 1200 450C1320 432 1380 410 1440 395V600H0V450Z" fill="#d8a72c" opacity="0.15" />
            
            {/* Elegant African-inspired tribal geometric lines */}
            <g stroke="#ffffff" strokeWidth="2" strokeDasharray="10 15" opacity="0.4">
              <path d="M-100 200 L1600 200" />
              <path d="M-100 350 L1600 350" />
              <path d="M-100 500 L1600 500" />
            </g>
            <g fill="#d8a72c" opacity="0.3">
              <circle cx="200" cy="150" r="15" />
              <circle cx="600" cy="80" r="25" />
              <circle cx="1100" cy="180" r="10" />
              <circle cx="1300" cy="90" r="30" />
            </g>

            <defs>
              <linearGradient id="waveGrad1" x1="720" y1="60" x2="720" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#075b3a" />
                <stop offset="1" stopColor="#062e20" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="720" y1="180" x2="720" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d8a72c" />
                <stop offset="1" stopColor="#075b3a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container-custom relative z-10" id="hero-content-container">
          <div className="max-w-3xl" id="hero-heading-block">
            <div className="inline-flex items-center gap-2 uppercase tracking-widest text-[11px] font-black text-brand-gold mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10" id="subtheme-badge-id">
              <Sparkles size={12} />
              Conference Academic Tracks
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight" id="hero-main-title">
              Conference Sub-themes
            </h1>
            <p className="mt-6 text-base md:text-lg lg:text-xl text-brand-line/90 leading-relaxed max-w-2xl" id="hero-intro-text">
              We welcome abstract proposals, academic research papers, and case studies that address but are not limited to the six critical pillars of contemporary social work in Africa.
            </p>
          </div>

          {/* Quick-list Down of the Subthemes */}
          <div className="mt-12 lg:mt-16" id="quick-list-subthemes-wrapper">
            <h2 className="text-xs uppercase tracking-widest font-black text-brand-gold/80 mb-6" id="quick-list-header-label">
              Core Sub-theme Directory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="subtheme-cards-grid">
              {subthemeData.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <div 
                    key={theme.id}
                    id={`quick-card-${theme.id}`}
                    className="group bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-brand-gold/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4" id={`quick-card-top-${theme.id}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          theme.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                        }`}>
                          0{theme.num}
                        </div>
                        <IconComponent className={`w-5 h-5 ${theme.color === 'emerald' ? 'text-emerald-400' : 'text-brand-gold'}`} />
                      </div>
                      
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-brand-gold transition-colors" id={`quick-card-title-${theme.id}`}>
                        {theme.title}
                      </h3>
                      
                      <p className="mt-3 text-xs text-brand-line/75 line-clamp-3 leading-relaxed" id={`quick-card-summary-${theme.id}`}>
                        {theme.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between" id={`quick-card-actions-${theme.id}`}>
                      <button
                        onClick={() => handleScrollToDetail(theme.id)}
                        className="text-xs font-bold text-brand-gold hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
                        id={`btn-see-detail-${theme.id}`}
                      >
                        See Full Details
                        <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global Smooth Scroll Button */}
            <div className="mt-10 flex justify-center" id="global-scroll-cta-container">
              <button
                onClick={() => handleScrollToSection('detailed-themes-section')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-white hover:text-brand-deep text-brand-deep font-extrabold text-xs rounded-xl shadow-lg transition-all duration-300 cursor-pointer group active:scale-95 uppercase tracking-wider"
                id="btn-scroll-to-details"
              >
                <span>Browse Interactive Deep Dives</span>
                <ChevronRight size={16} className="transform group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Subthemes Segment */}
      <section className="py-20 lg:py-28" id="detailed-themes-section">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start" id="detailed-grid-wrapper">
            
            {/* Sticky Navigation Sidebar */}
            <aside className="hidden lg:block sticky top-28 self-start bg-white rounded-3xl p-6 border border-brand-line shadow-xs" id="sticky-sidebar-nav">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-brand-muted mb-4 px-1">
                Themes Index
              </h3>
              <nav className="space-y-1" id="sidebar-subtheme-links">
                {subthemeData.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleScrollToDetail(theme.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-brand-ink/70 hover:text-brand-green hover:bg-brand-cream/50 transition-all duration-150 flex items-center gap-3 cursor-pointer group"
                    id={`sidebar-link-${theme.id}`}
                  >
                    <span className="shrink-0 font-black text-brand-muted group-hover:text-brand-green">
                      0{theme.num}
                    </span>
                    <span className="truncate">{theme.title.split('Social Work')[1] || theme.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-brand-line text-center" id="sidebar-cta-block">
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  Have a matching paper proposal or case study?
                </p>
                <a
                  href="/abstract-submission"
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2.5 bg-brand-green hover:bg-brand-green-2 text-white font-extrabold text-[11px] rounded-xl transition-colors uppercase tracking-wider"
                  id="sidebar-abstract-cta-btn"
                >
                  Submit Abstract
                </a>
              </div>
            </aside>

            {/* Detailed Cards List */}
            <div className="space-y-16" id="detailed-subthemes-cards-stack">
              {subthemeData.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <div 
                    key={theme.id}
                    id={theme.id}
                    className="bg-white rounded-3xl border border-brand-line shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    {/* Header Strip with color coordinate */}
                    <div className={`h-2 w-full ${theme.color === 'emerald' ? 'bg-brand-green' : 'bg-brand-gold'}`} id={`card-color-strip-${theme.id}`} />
                    
                    <div className="p-8 md:p-10" id={`card-inner-${theme.id}`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" id={`card-header-bar-${theme.id}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                            theme.color === 'emerald' ? 'bg-emerald-50/50 text-brand-green border-emerald-100' : 'bg-amber-50/50 text-brand-gold border-amber-100'
                          }`}>
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-brand-muted block">
                              Theme Track 0{theme.num}
                            </span>
                            <h2 className="text-xl md:text-2xl font-black text-brand-ink leading-snug mt-1" id={`detailed-title-${theme.id}`}>
                              {theme.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Broad Description Paragraph */}
                      <div className="bg-brand-cream/40 rounded-2xl p-6 border border-brand-line/50 mb-8" id={`description-box-${theme.id}`}>
                        <p className="text-sm md:text-base text-[#3f4943] leading-relaxed font-semibold">
                          {theme.description}
                        </p>
                      </div>

                      {/* Bulleted Sub-topics */}
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black text-brand-ink/90 mb-4 flex items-center gap-2" id={`subtopics-label-${theme.id}`}>
                          <BookOpen className="w-4 h-4 text-brand-green" />
                          Sub-theme Key Focus Areas
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id={`bullets-grid-${theme.id}`}>
                          {theme.bulletPoints.map((bullet, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 rounded-xl border border-brand-line/60 bg-white hover:border-brand-green/30 transition-all"
                              id={`bullet-card-${theme.id}-${idx}`}
                            >
                              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                              </div>
                              <span className="text-xs text-brand-ink/80 font-bold leading-normal">
                                {bullet}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action trigger links directly to abstracts */}
                      <div className="mt-8 pt-6 border-t border-brand-line flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`detailed-footer-${theme.id}`}>
                        <div className="flex items-center gap-2 text-xs text-brand-muted font-bold">
                          <Calendar className="w-4 h-4 text-brand-green" />
                          Abstract submission gate is open
                        </div>
                        <a
                          href={`/abstract-submission?theme=${theme.num}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-green hover:bg-brand-green-2 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer group"
                          id={`action-submit-${theme.id}`}
                        >
                          <span>Propose Abstract for Theme 0{theme.num}</span>
                          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Large bottom CTA banner */}
          <div className="mt-20 bg-brand-deep rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-brand border border-white/5" id="cta-submission-banner">
            <div className="absolute inset-0 opacity-10 pointer-events-none" id="cta-banner-bg-pattern">
              <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10%" cy="50%" r="20%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
                <circle cx="90%" cy="50%" r="30%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
              </svg>
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto" id="cta-banner-content">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight">
                Submit Your Proposal Today
              </h3>
              <p className="mt-4 text-xs md:text-sm text-brand-line/85 leading-relaxed max-w-xl mx-auto font-medium">
                Whether you specialize in humanitarian aid, indigenous frameworks, policy formulation, or clinical practice systems, your knowledge is essential to the future of African social work.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/abstract-submission"
                  className="w-full sm:w-auto px-6 py-3.5 bg-brand-gold hover:bg-white hover:text-brand-deep text-brand-deep font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider"
                  id="cta-primary-btn"
                >
                  Go to Abstract Submission
                </a>
                <a
                  href="/#about"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs rounded-xl transition-all active:scale-95 uppercase tracking-wider"
                  id="cta-secondary-btn"
                >
                  About the Conference
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
