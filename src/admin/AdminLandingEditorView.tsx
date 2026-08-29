import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  Globe, 
  Layers, 
  Layout, 
  Users, 
  Calendar, 
  MapPin, 
  Award, 
  MessageSquareQuote, 
  Footprints, 
  Building2, 
  Plus, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  Check,
  Cloud,
  Upload,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getLandingContent, 
  saveLandingContent, 
  resetLandingContentToDefault, 
  DEFAULT_LANDING_CONTENT, 
  LandingContent, 
  LeaderMember 
} from '../landing/landingContentStore';
import { LeaderEditorCard } from './LeaderEditorCard';

type SectionKey = 
  | 'hero' 
  | 'about' 
  | 'stats' 
  | 'malawi' 
  | 'programme' 
  | 'ifswRegion' 
  | 'subcommittee' 
  | 'sponsors' 
  | 'organizers' 
  | 'cta' 
  | 'topbar' 
  | 'footer';

interface SectionConfig {
  key: SectionKey;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  { key: 'hero', label: '1. Hero & Welcome Banner', shortLabel: 'Hero Banner', icon: Sparkles, description: 'Main headline, sub-headline, dates, venue, and hero action button.' },
  { key: 'about', label: '2. About & Theme Vision', shortLabel: 'About Section', icon: MessageSquareQuote, description: 'Theme description, narrative paragraph, and highlighted callout quote.' },
  { key: 'stats', label: '3. Key Stats Bar', shortLabel: 'Stats Counter', icon: Layers, description: '4 highlighted numeric metrics and descriptive captions.' },
  { key: 'malawi', label: '4. Welcome to Malawi', shortLabel: 'Host Malawi', icon: MapPin, description: 'Host nation narrative, city badges, host dates, and destination title.' },
  { key: 'programme', label: '5. Conference Programme', shortLabel: 'Programme', icon: Calendar, description: 'Overview text, agenda callout, button label, and placeholder status.' },
  { key: 'ifswRegion', label: '6. IFSW Africa Region Leaders', shortLabel: 'IFSW Region', icon: Users, description: 'Section title, subtitle, and continental leadership executive profiles.' },
  { key: 'subcommittee', label: '7. Organizing Subcommittee', shortLabel: 'Subcommittee', icon: Award, description: 'Section header, team subtitle, and local organizing committee members.' },
  { key: 'sponsors', label: '8. Sponsors & Partners', shortLabel: 'Sponsors', icon: Building2, description: 'Sponsor heading, grateful description text, and partner subtext.' },
  { key: 'organizers', label: '9. Organizing Bodies', shortLabel: 'Organizers', icon: Globe, description: 'Co-hosting institutional heading and partnership explanation.' },
  { key: 'cta', label: '10. Call to Action (CTA)', shortLabel: 'CTA & Register', icon: Layout, description: 'Background watermark, invitation headline, body text, and register CTA.' },
  { key: 'topbar', label: '11. Topbar & Banner Info', shortLabel: 'Topbar', icon: Footprints, description: 'Top announcement title, event year, and location string.' },
  { key: 'footer', label: '12. Footer & Copyright', shortLabel: 'Footer', icon: FileEdit, description: 'Brand title, summary text, copyright notice, and Secretariat email.' },
];

export function AdminLandingEditorView() {
  const [content, setContent] = useState<LandingContent>(() => getLandingContent());
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [isSectionDirty, setIsSectionDirty] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setContent(getLandingContent());
    };
    window.addEventListener('ifsw_landing_content_updated', handleUpdate);
    return () => window.removeEventListener('ifsw_landing_content_updated', handleUpdate);
  }, []);

  const handleFieldChange = (section: SectionKey, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
    setIsSectionDirty(true);
  };

  const handleMemberChange = (
    section: 'ifswRegion' | 'subcommittee', 
    index: number, 
    field: keyof LeaderMember, 
    value: string
  ) => {
    setContent(prev => {
      const list = [...(prev[section].members || [])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          members: list
        }
      };
    });
    setIsSectionDirty(true);
  };

  const handleAddMember = (section: 'ifswRegion' | 'subcommittee') => {
    const newMember: LeaderMember = {
      id: `${section}-${Date.now()}`,
      name: 'New Member',
      role: 'Subcommittee Member',
      image: '/subcommittee/Felix Kakowa.jpg'
    };
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        members: [...(prev[section].members || []), newMember]
      }
    }));
    setIsSectionDirty(true);
  };

  const handleRemoveMember = (section: 'ifswRegion' | 'subcommittee', index: number) => {
    setContent(prev => {
      const list = prev[section].members.filter((_, i) => i !== index);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          members: list
        }
      };
    });
    setIsSectionDirty(true);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentSectionConfig = SECTIONS.find(s => s.key === activeSection);
      await saveLandingContent(content, currentSectionConfig?.shortLabel || activeSection);
      setIsSectionDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Save error:', e);
      alert('Failed to save to Supabase. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSection = () => {
    const defaultSec = DEFAULT_LANDING_CONTENT[activeSection];
    setContent(prev => ({
      ...prev,
      [activeSection]: defaultSec
    }));
    setIsSectionDirty(true);
  };

  const handleResetAll = () => {
    const reset = resetLandingContentToDefault();
    setContent(reset);
    setIsSectionDirty(false);
    setResetConfirmOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentSectionConfig = SECTIONS.find(s => s.key === activeSection)!;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <FileEdit size={13} />
              <span>Landing Page CMS</span>
            </span>
            {isSectionDirty && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                Unsaved Edits
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 font-heading">
            Landing Page Content Editor
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Edit and customize all headlines, sub-paragraphs, statistical counters, speaker names, and footer texts across the entire conference landing page in real time.
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
          >
            <Eye size={15} className="text-gray-500" />
            <span>View Live Landing Page</span>
            <ExternalLink size={13} className="text-gray-400" />
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save All Edits</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-2 duration-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>Landing page texts updated and saved to live site instantly!</span>
          </div>
          <Link 
            to="/" 
            target="_blank" 
            className="underline hover:text-emerald-700 flex items-center gap-1 font-extrabold"
          >
            <span>See live changes</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {/* Main Grid Layout: Section Navigation Sidebar + Form Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sections List Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-xs">
            <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Landing Page Sections
            </div>
            
            <nav className="space-y-1 mt-2">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.key;
                return (
                  <button
                    key={sec.key}
                    onClick={() => {
                      setActiveSection(sec.key);
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl transition-all flex items-start gap-3 text-xs font-bold cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-800 text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-950'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="truncate flex-1">
                      <div className="truncate leading-tight font-extrabold">{sec.label}</div>
                      <div className={`text-[10px] truncate mt-0.5 font-normal ${
                        isActive ? 'text-emerald-100' : 'text-gray-400'
                      }`}>
                        {sec.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Reset All Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 text-center space-y-3">
            <div className="text-xs font-bold text-gray-700">Need to restore original texts?</div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Resetting restores all default conference wording, committee names, and statistics.
            </p>
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-white text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <RotateCcw size={14} className="text-gray-500" />
              <span>Reset All Sections to Default</span>
            </button>
          </div>
        </div>

        {/* Right Column: Active Section Form Editor (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            
            {/* Active Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Editing Section
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">#{activeSection}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-1.5 font-heading">
                  {currentSectionConfig.label}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentSectionConfig.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetSection}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset this section to original default"
                >
                  <RotateCcw size={13} />
                  <span>Reset Section</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Save size={13} />
                  <span>Save Section</span>
                </button>
              </div>
            </div>

            {/* SECTION-SPECIFIC FORMS */}
            
            {/* 1. HERO SECTION */}
            {activeSection === 'hero' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                    <span>Eyebrow Badge Tagline</span>
                    <span className="text-[10px] text-gray-400 font-normal">Appears above the title</span>
                  </label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) => handleFieldChange('hero', 'badge', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="e.g. IFSW Africa Region Conference · 2027"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Title Line 1 (Prefix)</label>
                    <input
                      type="text"
                      value={content.hero.titlePart1}
                      onChange={(e) => handleFieldChange('hero', 'titlePart1', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Advancing"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">
                      <span className="text-amber-700 font-black">Title Highlight (Gold)</span>
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) => handleFieldChange('hero', 'titleHighlight', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="e.g. social justice"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Title Line 2 (Suffix)</label>
                    <input
                      type="text"
                      value={content.hero.titlePart2}
                      onChange={(e) => handleFieldChange('hero', 'titlePart2', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. for Africa."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                    <span>Main Hero Subtitle / Narrative</span>
                    <span className="text-[10px] text-gray-400 font-normal">{content.hero.description.length} chars</span>
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) => handleFieldChange('hero', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Event Dates Badge</label>
                    <input
                      type="text"
                      value={content.hero.dates}
                      onChange={(e) => handleFieldChange('hero', 'dates', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="26–31 October 2027"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Venue / Location Badge</label>
                    <input
                      type="text"
                      value={content.hero.location}
                      onChange={(e) => handleFieldChange('hero', 'location', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Lilongwe, Malawi"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">CTA Button Text</label>
                    <input
                      type="text"
                      value={content.hero.buttonText}
                      onChange={(e) => handleFieldChange('hero', 'buttonText', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Register Now →"
                    />
                  </div>
                </div>

                {/* Hero Mini Preview */}
                <div className="bg-[#042619] p-5 rounded-2xl border border-emerald-900 text-white space-y-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#f1d36b]">
                    {content.hero.badge}
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-heading leading-tight">
                    {content.hero.titlePart1} <span className="text-[#e5bb42]">{content.hero.titleHighlight}</span> {content.hero.titlePart2}
                  </div>
                  <p className="text-xs text-white/70 max-w-xl leading-relaxed">
                    {content.hero.description}
                  </p>
                </div>
              </div>
            )}

            {/* 2. ABOUT SECTION */}
            {activeSection === 'about' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Eyebrow Tagline</label>
                  <input
                    type="text"
                    value={content.about.eyebrow}
                    onChange={(e) => handleFieldChange('about', 'eyebrow', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="A continental platform"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Section Main Heading</label>
                  <input
                    type="text"
                    value={content.about.heading}
                    onChange={(e) => handleFieldChange('about', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Where Africa's social work community meets."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Main Descriptive Narrative</label>
                  <textarea
                    rows={4}
                    value={content.about.description}
                    onChange={(e) => handleFieldChange('about', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                    <MessageSquareQuote size={14} className="text-amber-600" />
                    <span>Callout Quote / Theme Motto</span>
                  </label>
                  <input
                    type="text"
                    value={content.about.quote}
                    onChange={(e) => handleFieldChange('about', 'quote', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="“Advancing social justice for Africa” is a call to move from conversation to meaningful action."
                  />
                </div>
              </div>
            )}

            {/* 3. STATS SECTION */}
            {activeSection === 'stats' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <p className="text-xs text-gray-500">
                  Update the 4 prominent stat numbers and their respective labels displayed on the landing page band.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stat 1 */}
                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2.5">
                    <div className="text-xs font-bold text-gray-700">Metric 1</div>
                    <input
                      type="text"
                      value={content.stats.stat1Value}
                      onChange={(e) => handleFieldChange('stats', 'stat1Value', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="e.g. 2027"
                    />
                    <input
                      type="text"
                      value={content.stats.stat1Label}
                      onChange={(e) => handleFieldChange('stats', 'stat1Label', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                      placeholder="e.g. Conference year"
                    />
                  </div>

                  {/* Stat 2 */}
                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2.5">
                    <div className="text-xs font-bold text-gray-700">Metric 2</div>
                    <input
                      type="text"
                      value={content.stats.stat2Value}
                      onChange={(e) => handleFieldChange('stats', 'stat2Value', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="e.g. 5+"
                    />
                    <input
                      type="text"
                      value={content.stats.stat2Label}
                      onChange={(e) => handleFieldChange('stats', 'stat2Label', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                      placeholder="e.g. Days of dialogue"
                    />
                  </div>

                  {/* Stat 3 */}
                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2.5">
                    <div className="text-xs font-bold text-gray-700">Metric 3</div>
                    <input
                      type="text"
                      value={content.stats.stat3Value}
                      onChange={(e) => handleFieldChange('stats', 'stat3Value', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="e.g. Africa"
                    />
                    <input
                      type="text"
                      value={content.stats.stat3Label}
                      onChange={(e) => handleFieldChange('stats', 'stat3Label', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                      placeholder="e.g. Continental focus"
                    />
                  </div>

                  {/* Stat 4 */}
                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2.5">
                    <div className="text-xs font-bold text-gray-700">Metric 4</div>
                    <input
                      type="text"
                      value={content.stats.stat4Value}
                      onChange={(e) => handleFieldChange('stats', 'stat4Value', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="e.g. ∞"
                    />
                    <input
                      type="text"
                      value={content.stats.stat4Label}
                      onChange={(e) => handleFieldChange('stats', 'stat4Label', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                      placeholder="e.g. Possibilities for action"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. MALAWI SECTION */}
            {activeSection === 'malawi' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={content.malawi.eyebrow}
                    onChange={(e) => handleFieldChange('malawi', 'eyebrow', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Welcome to Malawi"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Section Title</label>
                  <input
                    type="text"
                    value={content.malawi.heading}
                    onChange={(e) => handleFieldChange('malawi', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="A warm heart for a continental conversation."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Destination Description</label>
                  <textarea
                    rows={4}
                    value={content.malawi.description}
                    onChange={(e) => handleFieldChange('malawi', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-700" />
                      <span>Host City Badge</span>
                    </div>
                    <input
                      type="text"
                      value={content.malawi.hostCity}
                      onChange={(e) => handleFieldChange('malawi', 'hostCity', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="Lilongwe"
                    />
                    <input
                      type="text"
                      value={content.malawi.hostCityLabel}
                      onChange={(e) => handleFieldChange('malawi', 'hostCityLabel', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-600"
                      placeholder="Host city"
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Calendar size={14} className="text-emerald-700" />
                      <span>Dates Badge</span>
                    </div>
                    <input
                      type="text"
                      value={content.malawi.conferenceDates}
                      onChange={(e) => handleFieldChange('malawi', 'conferenceDates', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="26–31 Oct"
                    />
                    <input
                      type="text"
                      value={content.malawi.conferenceDatesLabel}
                      onChange={(e) => handleFieldChange('malawi', 'conferenceDatesLabel', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-600"
                      placeholder="2027 conference dates"
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Globe size={14} className="text-emerald-700" />
                      <span>Host Country Badge</span>
                    </div>
                    <input
                      type="text"
                      value={content.malawi.hostCountry}
                      onChange={(e) => handleFieldChange('malawi', 'hostCountry', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="Malawi"
                    />
                    <input
                      type="text"
                      value={content.malawi.hostCountryLabel}
                      onChange={(e) => handleFieldChange('malawi', 'hostCountryLabel', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-600"
                      placeholder="Host country"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. PROGRAMME SECTION */}
            {activeSection === 'programme' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={content.programme.eyebrow}
                    onChange={(e) => handleFieldChange('programme', 'eyebrow', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Conference programme"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Programme Title</label>
                  <input
                    type="text"
                    value={content.programme.heading}
                    onChange={(e) => handleFieldChange('programme', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="From dialogue to action."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Programme Summary Narrative</label>
                  <textarea
                    rows={3}
                    value={content.programme.description}
                    onChange={(e) => handleFieldChange('programme', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Button Label</label>
                    <input
                      type="text"
                      value={content.programme.buttonText}
                      onChange={(e) => handleFieldChange('programme', 'buttonText', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="View full programme →"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Right Stage Banner Notice</label>
                    <input
                      type="text"
                      value={content.programme.statusBanner}
                      onChange={(e) => handleFieldChange('programme', 'statusBanner', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Programme TBA"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. IFSW REGION LEADERS */}
            {activeSection === 'ifswRegion' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                  <Cloud size={18} className="text-emerald-700 mt-0.5 shrink-0" />
                  <div className="text-xs text-emerald-950 space-y-1">
                    <p className="font-bold">Supabase Storage Integration</p>
                    <p className="text-emerald-800 leading-relaxed">
                      Leader profile pictures can be uploaded directly to your Supabase Storage bucket (<code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[11px]">leader-photos/ifsw</code>). Click &ldquo;Upload Photo&rdquo; or drag-and-drop an image onto any profile card below.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Section Heading</label>
                  <input
                    type="text"
                    value={content.ifswRegion.heading}
                    onChange={(e) => handleFieldChange('ifswRegion', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="IFSW Africa Region"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-extrabold text-gray-800">Regional Executive Leaders ({content.ifswRegion.members.length})</label>
                  <button
                    type="button"
                    onClick={() => handleAddMember('ifswRegion')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Leader Profile</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {content.ifswRegion.members.map((member, index) => (
                    <LeaderEditorCard
                      key={member.id || `ifsw-${index}`}
                      member={member}
                      index={index}
                      section="ifswRegion"
                      sectionLabel="IFSW Region Leader"
                      defaultFallbackImage="/ifsw/Oluwatoni Adeleke.jpg"
                      onChange={(idx, field, val) => handleMemberChange('ifswRegion', idx, field, val)}
                      onRemove={(idx) => handleRemoveMember('ifswRegion', idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 7. SUBCOMMITTEE */}
            {activeSection === 'subcommittee' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                  <Cloud size={18} className="text-emerald-700 mt-0.5 shrink-0" />
                  <div className="text-xs text-emerald-950 space-y-1">
                    <p className="font-bold">Supabase Storage Integration</p>
                    <p className="text-emerald-800 leading-relaxed">
                      Subcommittee member photos are uploaded and stored directly in your Supabase Storage bucket (<code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[11px]">leader-photos/subcommittee</code>). Upload new portraits or drag-and-drop images anytime.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Section Title</label>
                  <input
                    type="text"
                    value={content.subcommittee.heading}
                    onChange={(e) => handleFieldChange('subcommittee', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Organizing Subcommittee"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Subtitle / Team Description</label>
                  <input
                    type="text"
                    value={content.subcommittee.description}
                    onChange={(e) => handleFieldChange('subcommittee', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Meet the dedicated team working to bring IFSW Africa 2027 to life."
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-extrabold text-gray-800">Subcommittee Team Members ({content.subcommittee.members.length})</label>
                  <button
                    type="button"
                    onClick={() => handleAddMember('subcommittee')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Subcommittee Member</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                  {content.subcommittee.members.map((member, index) => (
                    <LeaderEditorCard
                      key={member.id || `sub-${index}`}
                      member={member}
                      index={index}
                      section="subcommittee"
                      sectionLabel="Subcommittee Member"
                      defaultFallbackImage="/subcommittee/Felix Kakowa.jpg"
                      onChange={(idx, field, val) => handleMemberChange('subcommittee', idx, field, val)}
                      onRemove={(idx) => handleRemoveMember('subcommittee', idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 8. SPONSORS */}
            {activeSection === 'sponsors' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Section Heading</label>
                  <input
                    type="text"
                    value={content.sponsors.heading}
                    onChange={(e) => handleFieldChange('sponsors', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Our Sponsors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Appreciation Note</label>
                  <textarea
                    rows={2}
                    value={content.sponsors.description}
                    onChange={(e) => handleFieldChange('sponsors', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="We are grateful for the support of our generous sponsors."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Lead Sponsor Label</label>
                    <input
                      type="text"
                      value={content.sponsors.sponsorName}
                      onChange={(e) => handleFieldChange('sponsors', 'sponsorName', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                      placeholder="Government of Malawi"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Sponsorship Tier Subtext</label>
                    <input
                      type="text"
                      value={content.sponsors.sponsorSubtext}
                      onChange={(e) => handleFieldChange('sponsors', 'sponsorSubtext', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                      placeholder="Official Host Partner"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 9. ORGANIZERS */}
            {activeSection === 'organizers' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Section Title</label>
                  <input
                    type="text"
                    value={content.organizers.heading}
                    onChange={(e) => handleFieldChange('organizers', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Organizing Bodies"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Organizing Bodies Description</label>
                  <textarea
                    rows={3}
                    value={content.organizers.description}
                    onChange={(e) => handleFieldChange('organizers', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Co-hosted by the International Federation of Social Workers and the Association of Social Workers in Malawi."
                  />
                </div>
              </div>
            )}

            {/* 10. CTA */}
            {activeSection === 'cta' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Background Watermark Word</label>
                  <input
                    type="text"
                    value={content.cta.watermark}
                    onChange={(e) => handleFieldChange('cta', 'watermark', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-black uppercase tracking-widest text-emerald-950"
                    placeholder="AFRICA"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Eyebrow Tagline</label>
                  <input
                    type="text"
                    value={content.cta.eyebrow}
                    onChange={(e) => handleFieldChange('cta', 'eyebrow', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Join the 2027 conference"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Main Call-to-Action Headline</label>
                  <input
                    type="text"
                    value={content.cta.heading}
                    onChange={(e) => handleFieldChange('cta', 'heading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Be part of advancing social justice for Africa."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Invitation Body Paragraph</label>
                  <textarea
                    rows={3}
                    value={content.cta.description}
                    onChange={(e) => handleFieldChange('cta', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">CTA Action Button Label</label>
                  <input
                    type="text"
                    value={content.cta.buttonText}
                    onChange={(e) => handleFieldChange('cta', 'buttonText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-bold text-amber-950"
                    placeholder="Register Now →"
                  />
                </div>
              </div>
            )}

            {/* 11. TOPBAR */}
            {activeSection === 'topbar' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Banner Brand Badge</label>
                  <input
                    type="text"
                    value={content.topbar.badgeText}
                    onChange={(e) => handleFieldChange('topbar', 'badgeText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                    placeholder="IFSW AFRICA 2027"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Subtitle Suffix</label>
                  <input
                    type="text"
                    value={content.topbar.subtitle}
                    onChange={(e) => handleFieldChange('topbar', 'subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                    placeholder="Regional Conference"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Dates String</label>
                    <input
                      type="text"
                      value={content.topbar.dates}
                      onChange={(e) => handleFieldChange('topbar', 'dates', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                      placeholder="26–31 October 2027"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Location String</label>
                    <input
                      type="text"
                      value={content.topbar.location}
                      onChange={(e) => handleFieldChange('topbar', 'location', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                      placeholder="Lilongwe, Malawi"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 12. FOOTER */}
            {activeSection === 'footer' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Brand Title</label>
                  <input
                    type="text"
                    value={content.footer.brandTitle}
                    onChange={(e) => handleFieldChange('footer', 'brandTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                    placeholder="IFSW Africa 2027 Conference"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Footer Mission Statement</label>
                  <textarea
                    rows={3}
                    value={content.footer.brandTagline}
                    onChange={(e) => handleFieldChange('footer', 'brandTagline', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Copyright Line</label>
                    <input
                      type="text"
                      value={content.footer.copyrightText}
                      onChange={(e) => handleFieldChange('footer', 'copyrightText', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                      placeholder="© 2027 IFSW Africa Region Conference"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Secretariat Email</label>
                    <input
                      type="text"
                      value={content.footer.contactEmail}
                      onChange={(e) => handleFieldChange('footer', 'contactEmail', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                      placeholder="info@ifsw-africa2027.org"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Bottom Location Tagline</label>
                  <input
                    type="text"
                    value={content.footer.locationTagline}
                    onChange={(e) => handleFieldChange('footer', 'locationTagline', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                    placeholder="Advancing social justice for Africa · Lilongwe, Malawi"
                  />
                </div>
              </div>
            )}

            {/* Bottom Save Bar */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-[11px] text-gray-400">
                All saved modifications are live across the public site instantly.
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save All Edits</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
              <AlertCircle size={28} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900 font-heading">
                Reset All Landing Page Texts?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                This will overwrite any customized text across all sections (Hero, About, Malawi, Stats, Leaders, Sponsors, and Footer) back to the official default conference copy.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
