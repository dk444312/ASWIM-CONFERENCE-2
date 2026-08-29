import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logAdminActivity, getCurrentActiveAdmin } from '../admin/adminStore';

export interface LeaderMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface LandingContent {
  topbar: {
    badgeText: string;
    subtitle: string;
    dates: string;
    location: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    description: string;
    dates: string;
    location: string;
    buttonText: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    description: string;
    quote: string;
  };
  stats: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  malawi: {
    eyebrow: string;
    heading: string;
    description: string;
    hostCity: string;
    hostCityLabel: string;
    conferenceDates: string;
    conferenceDatesLabel: string;
    hostCountry: string;
    hostCountryLabel: string;
  };
  programme: {
    eyebrow: string;
    heading: string;
    description: string;
    buttonText: string;
    statusBanner: string;
  };
  ifswRegion: {
    heading: string;
    description?: string;
    members: LeaderMember[];
  };
  subcommittee: {
    heading: string;
    description: string;
    members: LeaderMember[];
  };
  sponsors: {
    heading: string;
    description: string;
    sponsorName: string;
    sponsorSubtext: string;
  };
  organizers: {
    heading: string;
    description: string;
  };
  cta: {
    watermark: string;
    eyebrow: string;
    heading: string;
    description: string;
    buttonText: string;
  };
  footer: {
    brandTitle: string;
    brandTagline: string;
    copyrightText: string;
    locationTagline: string;
    contactEmail: string;
  };
}

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  topbar: {
    badgeText: "IFSW AFRICA 2027",
    subtitle: "Regional Conference",
    dates: "26–31 October 2027",
    location: "Lilongwe, Malawi"
  },
  hero: {
    badge: "IFSW Africa Region Conference · 2027",
    titlePart1: "Advancing",
    titleHighlight: "social justice",
    titlePart2: "for Africa.",
    description: "A continental gathering of social workers, scholars, policymakers, communities and partners committed to building a more just, inclusive and sustainable Africa.",
    dates: "26–31 October 2027",
    location: "Lilongwe, Malawi",
    buttonText: "Register Now →"
  },
  about: {
    eyebrow: "A continental platform",
    heading: "Where Africa's social work community meets.",
    description: "The IFSW Africa Region Conference 2027 brings together professionals and stakeholders from across Africa and beyond for dialogue, knowledge exchange, collaboration and collective action around social justice.",
    quote: "“Advancing social justice for Africa” is a call to move from conversation to meaningful action."
  },
  stats: {
    stat1Value: "2027",
    stat1Label: "Conference year",
    stat2Value: "5+",
    stat2Label: "Days of dialogue",
    stat3Value: "Africa",
    stat3Label: "Continental focus",
    stat4Value: "∞",
    stat4Label: "Possibilities for action"
  },
  malawi: {
    eyebrow: "Welcome to Malawi",
    heading: "A warm heart for a continental conversation.",
    description: "Malawi provides a powerful setting for dialogue and unified action. Its communities, landscapes and spirit of uMunthu offer a natural backdrop for a conference centred on solidarity, dignity and collective responsibility.",
    hostCity: "Lilongwe",
    hostCityLabel: "Host city",
    conferenceDates: "26–31 Oct",
    conferenceDatesLabel: "2027 conference dates",
    hostCountry: "Malawi",
    hostCountryLabel: "Host country"
  },
  programme: {
    eyebrow: "Conference programme",
    heading: "From dialogue to action.",
    description: "Showcase the keynote sessions, plenaries, panels, workshops, exhibitions and networking moments that will shape the week.",
    buttonText: "View full programme →",
    statusBanner: "Programme TBA"
  },
  ifswRegion: {
    heading: "IFSW Africa Region",
    description: "Meet the executive regional leadership steering continental social work governance.",
    members: [
      { id: "ifsw-1", name: "Oluwatoni Adeleke", role: "President", image: "/ifsw/Oluwatoni Adeleke.jpg" },
      { id: "ifsw-2", name: "Abib Ndiaye", role: "Vice President", image: "/ifsw/Abib Ndiaye.jpg" }
    ]
  },
  subcommittee: {
    heading: "Organizing Subcommittee",
    description: "Meet the dedicated team working to bring IFSW Africa 2027 to life.",
    members: [
      { id: "sub-1", name: "Jacqueline Nambala", role: "Publicity Subcommittee", image: "/subcommittee/Jacqueline Nambala.jpg" },
      { id: "sub-2", name: "Joseph Kalelo", role: "Finance Subcommittee", image: "/subcommittee/Joseph Kalelo.jpg" },
      { id: "sub-3", name: "Magret Mwale", role: "Registration Subcommittee", image: "/subcommittee/Magret Mwale.jpg" },
      { id: "sub-4", name: "Itaye Tsogolo", role: "Scientific Subcommittee", image: "/subcommittee/MS Tsogolo.jpg" },
      { id: "sub-5", name: "Hard Chatsika", role: "Local Organizing Subcommittee", image: "/subcommittee/MR HARD.jpg" },
      { id: "sub-6", name: "Felix Kakowa", role: "Chairperson", image: "/subcommittee/Felix Kakowa.jpg" }
    ]
  },
  sponsors: {
    heading: "Our Sponsors",
    description: "We are grateful for the support of our generous sponsors and national partners.",
    sponsorName: "Government of Malawi",
    sponsorSubtext: "Official Host Partner"
  },
  organizers: {
    heading: "Organizing Bodies",
    description: "Co-hosted by the International Federation of Social Workers and the Association of Social Workers in Malawi."
  },
  cta: {
    watermark: "AFRICA",
    eyebrow: "Join the 2027 conference",
    heading: "Be part of advancing social justice for Africa.",
    description: "Bring your practice, research, ideas and lived experience to a continental platform for meaningful dialogue and action.",
    buttonText: "Register Now →"
  },
  footer: {
    brandTitle: "IFSW Africa 2027 Conference",
    brandTagline: "Advancing social justice for Africa through professional solidarity, knowledge exchange and collective action.",
    copyrightText: "© 2027 IFSW Africa Region Conference",
    locationTagline: "Advancing social justice for Africa · Lilongwe, Malawi",
    contactEmail: "info@ifsw-africa2027.org"
  }
};

// In-memory cache backed by Supabase
let inMemoryLandingContent: LandingContent = DEFAULT_LANDING_CONTENT;
let isLandingStoreInitialized = false;

export function rowToLandingContent(row: any): LandingContent {
  return {
    topbar: { ...DEFAULT_LANDING_CONTENT.topbar, ...(row.topbar || {}) },
    hero: { ...DEFAULT_LANDING_CONTENT.hero, ...(row.hero || {}) },
    about: { ...DEFAULT_LANDING_CONTENT.about, ...(row.about || {}) },
    stats: { ...DEFAULT_LANDING_CONTENT.stats, ...(row.stats || {}) },
    malawi: { ...DEFAULT_LANDING_CONTENT.malawi, ...(row.malawi || {}) },
    programme: { ...DEFAULT_LANDING_CONTENT.programme, ...(row.programme || {}) },
    ifswRegion: { ...DEFAULT_LANDING_CONTENT.ifswRegion, ...(row.ifsw_region || {}) },
    subcommittee: { ...DEFAULT_LANDING_CONTENT.subcommittee, ...(row.subcommittee || {}) },
    sponsors: { ...DEFAULT_LANDING_CONTENT.sponsors, ...(row.sponsors || {}) },
    organizers: { ...DEFAULT_LANDING_CONTENT.organizers, ...(row.organizers || {}) },
    cta: { ...DEFAULT_LANDING_CONTENT.cta, ...(row.cta || {}) },
    footer: { ...DEFAULT_LANDING_CONTENT.footer, ...(row.footer || {}) }
  };
}

export function landingContentToRow(content: LandingContent): any {
  return {
    id: 'current',
    topbar: content.topbar,
    hero: content.hero,
    about: content.about,
    stats: content.stats,
    malawi: content.malawi,
    programme: content.programme,
    ifsw_region: content.ifswRegion,
    subcommittee: content.subcommittee,
    sponsors: content.sponsors,
    organizers: content.organizers,
    cta: content.cta,
    footer: content.footer,
    updated_at: new Date().toISOString()
  };
}

export async function initializeSupabaseLandingStore() {
  if (isLandingStoreInitialized) return;
  isLandingStoreInitialized = true;

  try {
    const { data: row, error } = await supabase
      .from('landing_content')
      .select('*')
      .eq('id', 'current')
      .single();

    if (!error && row) {
      inMemoryLandingContent = rowToLandingContent(row);
      window.dispatchEvent(new CustomEvent('ifsw_landing_content_updated', { detail: inMemoryLandingContent }));
    }

    // Realtime Supabase Channel
    supabase
      .channel('public:landing_content_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'landing_content' }, async (payload) => {
        if (payload.new) {
          inMemoryLandingContent = rowToLandingContent(payload.new);
          window.dispatchEvent(new CustomEvent('ifsw_landing_content_updated', { detail: inMemoryLandingContent }));
        }
      })
      .subscribe();
  } catch (e) {
    console.error('Error initializing Landing Content Supabase Store:', e);
  }
}

// Fetch immediately on load
initializeSupabaseLandingStore();

export function getLandingContent(): LandingContent {
  return inMemoryLandingContent;
}

export async function fetchFreshLandingContent(): Promise<LandingContent> {
  try {
    const { data: row, error } = await supabase
      .from('landing_content')
      .select('*')
      .eq('id', 'current')
      .single();

    if (!error && row) {
      inMemoryLandingContent = rowToLandingContent(row);
      window.dispatchEvent(new CustomEvent('ifsw_landing_content_updated', { detail: inMemoryLandingContent }));
    }
  } catch (e) {
    console.error('Error fetching landing content from Supabase:', e);
  }
  return inMemoryLandingContent;
}

export async function saveLandingContent(newContent: LandingContent, sectionName?: string): Promise<LandingContent> {
  inMemoryLandingContent = newContent;
  window.dispatchEvent(new CustomEvent('ifsw_landing_content_updated', { detail: newContent }));

  try {
    const row = landingContentToRow(newContent);
    const admin = getCurrentActiveAdmin();
    // Admin foreign key in admins table is admin.id (e.g. 'ADM-2027-001')
    row.last_modified_by = admin?.id || null;

    let { error } = await supabase
      .from('landing_content')
      .upsert(row, { onConflict: 'id' });

    // If the admin ID is not yet in the DB admins table or violates FK constraint, gracefully fallback to null
    if (error && (error.code === '23503' || error.message?.includes('foreign key constraint') || error.message?.includes('last_modified_by'))) {
      row.last_modified_by = null;
      const retryResult = await supabase
        .from('landing_content')
        .upsert(row, { onConflict: 'id' });
      error = retryResult.error;
    }

    if (error) {
      console.error('Supabase error saving landing content:', error);
    }

    logAdminActivity({
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      adminRole: admin.role,
      action: 'LANDING_PAGE_UPDATED',
      actionLabel: sectionName ? `Updated Landing Page Section: ${sectionName}` : 'Updated Landing Page Content',
      category: 'settings',
      targetId: 'landing_cms',
      targetName: sectionName || 'Landing Page Texts',
      details: sectionName ? `Modified content texts in the "${sectionName}" section in Supabase.` : 'Saved custom text edits for the public landing page in Supabase.'
    });
  } catch (e) {
    console.error('Failed to save landing content to Supabase:', e);
  }

  return newContent;
}

export async function updateLandingSection<K extends keyof LandingContent>(
  section: K, 
  sectionData: LandingContent[K],
  humanSectionName?: string
): Promise<LandingContent> {
  const current = getLandingContent();
  const updated: LandingContent = {
    ...current,
    [section]: sectionData
  };
  return saveLandingContent(updated, humanSectionName || String(section));
}

export async function resetLandingContentToDefault(): Promise<LandingContent> {
  inMemoryLandingContent = DEFAULT_LANDING_CONTENT;
  window.dispatchEvent(new CustomEvent('ifsw_landing_content_updated', { detail: DEFAULT_LANDING_CONTENT }));
  
  try {
    const row = landingContentToRow(DEFAULT_LANDING_CONTENT);
    const admin = getCurrentActiveAdmin();
    row.last_modified_by = admin?.id || null;

    let { error } = await supabase
      .from('landing_content')
      .upsert(row, { onConflict: 'id' });

    if (error && (error.code === '23503' || error.message?.includes('foreign key constraint') || error.message?.includes('last_modified_by'))) {
      row.last_modified_by = null;
      await supabase
        .from('landing_content')
        .upsert(row, { onConflict: 'id' });
    }

    logAdminActivity({
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      adminRole: admin.role,
      action: 'LANDING_PAGE_RESET',
      actionLabel: 'Reset Landing Page Texts to Default',
      category: 'settings',
      targetId: 'landing_cms',
      targetName: 'Landing Page CMS',
      details: 'Restored all original default copy and text across all landing page sections in Supabase.'
    });
  } catch (e) {
    console.error('Failed to reset landing content in Supabase:', e);
  }

  return DEFAULT_LANDING_CONTENT;
}

export function useLandingContent(): LandingContent {
  const [content, setContent] = useState<LandingContent>(() => getLandingContent());

  useEffect(() => {
    // Initial fetch from Supabase
    fetchFreshLandingContent().then(fresh => setContent(fresh));

    const handleUpdate = () => {
      setContent(getLandingContent());
    };
    window.addEventListener('ifsw_landing_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('ifsw_landing_content_updated', handleUpdate);
    };
  }, []);

  return content;
}
