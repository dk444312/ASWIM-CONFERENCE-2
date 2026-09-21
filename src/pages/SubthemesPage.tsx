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
    document.title = "Conference Sub-themes | Joint IFSW Africa Region and ASSWA Conference 2027";
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
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans text-[#1f1f1f]" id="subthemes-page-root">
      <Topbar />
      <Header />

      {/* Hero Section with Clean Black Theme */}
      <section className="relative bg-[#18181b] text-white py-16 lg:py-24 overflow-hidden border-b border-neutral-800" id="subthemes-hero">
        <div className="container-custom relative z-10" id="hero-content-container">
          <div className="max-w-3xl" id="hero-heading-block">
            <div className="inline-flex items-center gap-2 uppercase tracking-widest text-[11px] font-black text-gray-300 mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20" id="subtheme-badge-id">
              <Sparkles size={12} />
              Conference Academic Tracks
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight" id="hero-main-title">
              Conference Sub-themes
            </h1>
            <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl" id="hero-intro-text">
              We welcome abstract proposals, academic research papers, and case studies that address but are not limited to the six critical pillars of contemporary social work in Africa.
            </p>
          </div>

          {/* Quick-list Down of the Subthemes */}
          <div className="mt-12 lg:mt-16" id="quick-list-subthemes-wrapper">
            <h2 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-6" id="quick-list-header-label">
              Core Sub-theme Directory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="subtheme-cards-grid">
              {subthemeData.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <div 
                    key={theme.id}
                    id={`quick-card-${theme.id}`}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4" id={`quick-card-top-${theme.id}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-white/10 text-white border border-white/20">
                          0{theme.num}
                        </div>
                        <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                      </div>
                      
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-gray-200 transition-colors" id={`quick-card-title-${theme.id}`}>
                        {theme.title}
                      </h3>
                      
                      <p className="mt-3 text-xs text-gray-300 line-clamp-3 leading-relaxed" id={`quick-card-summary-${theme.id}`}>
                        {theme.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between" id={`quick-card-actions-${theme.id}`}>
                      <button
                        onClick={() => handleScrollToDetail(theme.id)}
                        className="text-xs font-bold text-white hover:text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
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
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-100 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all duration-300 cursor-pointer group active:scale-95 uppercase tracking-wider"
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
            <aside className="hidden lg:block sticky top-28 self-start bg-white rounded-3xl p-6 border border-gray-200 shadow-xs" id="sticky-sidebar-nav">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4 px-1">
                Themes Index
              </h3>
              <nav className="space-y-1" id="sidebar-subtheme-links">
                {subthemeData.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleScrollToDetail(theme.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150 flex items-center gap-3 cursor-pointer group"
                    id={`sidebar-link-${theme.id}`}
                  >
                    <span className="shrink-0 font-black text-gray-400 group-hover:text-black">
                      0{theme.num}
                    </span>
                    <span className="truncate">{theme.title.split('Social Work')[1] || theme.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center" id="sidebar-cta-block">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Have a matching paper proposal or case study?
                </p>
                <a
                  href="/abstract-submission"
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#1f1f1f] hover:bg-black text-white font-extrabold text-[11px] rounded-xl transition-colors uppercase tracking-wider"
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
                    className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    {/* Header Strip */}
                    <div className="h-1.5 w-full bg-[#18181b]" id={`card-color-strip-${theme.id}`} />
                    
                    <div className="p-8 md:p-10" id={`card-inner-${theme.id}`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" id={`card-header-bar-${theme.id}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border bg-gray-50 text-gray-900 border-gray-200">
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 block">
                              Theme Track 0{theme.num}
                            </span>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mt-1" id={`detailed-title-${theme.id}`}>
                              {theme.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Broad Description Paragraph */}
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8" id={`description-box-${theme.id}`}>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-semibold">
                          {theme.description}
                        </p>
                      </div>

                      {/* Bulleted Sub-topics */}
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black text-gray-900 mb-4 flex items-center gap-2" id={`subtopics-label-${theme.id}`}>
                          <BookOpen className="w-4 h-4 text-gray-900" />
                          Sub-theme Key Focus Areas
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id={`bullets-grid-${theme.id}`}>
                          {theme.bulletPoints.map((bullet, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all"
                              id={`bullet-card-${theme.id}-${idx}`}
                            >
                              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                              </div>
                              <span className="text-xs text-gray-800 font-bold leading-normal">
                                {bullet}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action trigger links directly to abstracts */}
                      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`detailed-footer-${theme.id}`}>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                          <Calendar className="w-4 h-4 text-black" />
                          Abstract submission gate is open
                        </div>
                        <a
                          href={`/abstract-submission?theme=${theme.num}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1f1f1f] hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer group"
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
          <div className="mt-20 bg-[#18181b] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden border border-neutral-800" id="cta-submission-banner">
            <div className="relative z-10 max-w-2xl mx-auto" id="cta-banner-content">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight">
                Submit Your Proposal Today
              </h3>
              <p className="mt-4 text-xs md:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto font-medium">
                Whether you specialize in humanitarian aid, indigenous frameworks, policy formulation, or clinical practice systems, your knowledge is essential to the future of African social work.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/abstract-submission"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-100 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider"
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
