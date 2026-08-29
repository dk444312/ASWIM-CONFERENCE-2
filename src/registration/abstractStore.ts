import { supabase } from '../lib/supabase';
import { getCurrentActiveAdmin, logAdminActivity } from '../admin/adminStore';

export interface AbstractSubmission {
  id: string; // UUID or ID
  email: string;
  title?: string;
  firstName: string;
  surname: string;
  jobTitle?: string;
  institutionAffiliation: string; // Institution/Workplace/Affiliation and country
  themeSelection: string;
  proposalType: 'Individual paper' | 'Co-authored paper' | 'Poster presentation' | 'Workshop' | string;
  authorsAffiliation?: string;
  abstractTitle: string;
  abstractBody: string; // 250-300 words
  keywords: string; // 3-5 keywords
  fileUrl?: string; // uploaded abstract
  status: 'pending' | 'accepted' | 'rejected';
  statusNote?: string;
  statusUpdatedAt?: string;
  reviewedBy?: string;
  submittedAt: string; // ISO string
}

let inMemoryAbstracts: AbstractSubmission[] = [];
let isInitialized = false;

// Convert database row to AbstractSubmission
function rowToAbstract(row: any): AbstractSubmission {
  return {
    id: row.id,
    email: row.email,
    title: row.title,
    firstName: row.first_name,
    surname: row.surname,
    jobTitle: row.job_title,
    institutionAffiliation: row.institution_affiliation,
    themeSelection: row.theme_selection,
    proposalType: row.proposal_type,
    authorsAffiliation: row.authors_affiliation,
    abstractTitle: row.abstract_title,
    abstractBody: row.abstract_body,
    keywords: row.keywords,
    fileUrl: row.file_url,
    status: row.status || 'pending',
    statusNote: row.status_note,
    statusUpdatedAt: row.status_updated_at,
    reviewedBy: row.reviewed_by,
    submittedAt: row.submitted_at || new Date().toISOString()
  };
}

// Convert AbstractSubmission to database row
function abstractToRow(abs: AbstractSubmission): any {
  return {
    id: abs.id,
    email: abs.email,
    title: abs.title,
    first_name: abs.firstName,
    surname: abs.surname,
    job_title: abs.jobTitle,
    institution_affiliation: abs.institutionAffiliation,
    theme_selection: abs.themeSelection,
    proposal_type: abs.proposalType,
    authors_affiliation: abs.authorsAffiliation,
    abstract_title: abs.abstractTitle,
    abstract_body: abs.abstractBody,
    keywords: abs.keywords,
    file_url: abs.fileUrl,
    status: abs.status,
    status_note: abs.statusNote,
    status_updated_at: abs.statusUpdatedAt,
    reviewed_by: abs.reviewedBy,
    submitted_at: abs.submittedAt
  };
}

// Get from Local Storage if Supabase fails or as a cache
const LOCAL_STORAGE_KEY = 'ifsw_local_abstract_submissions';
function getLocalStorageAbstracts(): AbstractSubmission[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalStorageAbstracts(list: AbstractSubmission[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed saving abstracts to LocalStorage:', e);
  }
}

// Initialize Supabase Sync & Realtime Listeners
export async function initializeAbstractStore() {
  if (isInitialized) return;
  isInitialized = true;

  // Load from local storage initially as fallback
  inMemoryAbstracts = getLocalStorageAbstracts();

  try {
    const { data: rows, error } = await supabase
      .from('abstract_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (!error && rows) {
      inMemoryAbstracts = rows.map(rowToAbstract);
      saveLocalStorageAbstracts(inMemoryAbstracts);
      window.dispatchEvent(new CustomEvent('ifsw_abstracts_updated'));
    }

    // Load abstract submissions gate status from system_config metadata
    const { data: configRow } = await supabase
      .from('system_config')
      .select('metadata')
      .eq('id', 'default')
      .single();

    if (configRow && configRow.metadata) {
      const is_open = configRow.metadata.abstracts_open !== false;
      localStorage.setItem(ABSTRACTS_OPEN_KEY, String(is_open));
      window.dispatchEvent(new CustomEvent('ifsw_abstracts_open_status_changed', { detail: { open: is_open } }));
    }

    // Subscribe to realtime changes
    supabase
      .channel('public:abstract_submissions_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'abstract_submissions' }, async () => {
        const { data: freshRows } = await supabase
          .from('abstract_submissions')
          .select('*')
          .order('submitted_at', { ascending: false });
        if (freshRows) {
          inMemoryAbstracts = freshRows.map(rowToAbstract);
          saveLocalStorageAbstracts(inMemoryAbstracts);
          window.dispatchEvent(new CustomEvent('ifsw_abstracts_updated'));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, async () => {
        const { data: cfg } = await supabase
          .from('system_config')
          .select('metadata')
          .eq('id', 'default')
          .single();
        if (cfg && cfg.metadata) {
          const is_open = cfg.metadata.abstracts_open !== false;
          localStorage.setItem(ABSTRACTS_OPEN_KEY, String(is_open));
          window.dispatchEvent(new CustomEvent('ifsw_abstracts_open_status_changed', { detail: { open: is_open } }));
        }
      })
      .subscribe();
  } catch (err) {
    console.warn('Error connecting to abstract_submissions table, using local storage:', err);
  }
}

// Auto init
initializeAbstractStore();

const ABSTRACTS_OPEN_KEY = 'ifsw_local_abstracts_open';

export function isAbstractSubmissionOpen(): boolean {
  try {
    const val = localStorage.getItem(ABSTRACTS_OPEN_KEY);
    return val !== 'false'; // Default to open (true)
  } catch (e) {
    return true;
  }
}

export async function setAbstractSubmissionOpen(open: boolean): Promise<void> {
  try {
    localStorage.setItem(ABSTRACTS_OPEN_KEY, String(open));
  } catch (e) {}

  window.dispatchEvent(new CustomEvent('ifsw_abstracts_open_status_changed', { detail: { open } }));

  try {
    const { data: config } = await supabase
      .from('system_config')
      .select('metadata')
      .eq('id', 'default')
      .single();

    const existingMetadata = config?.metadata || {};
    const updatedMetadata = { ...existingMetadata, abstracts_open: open };

    await supabase
      .from('system_config')
      .update({ metadata: updatedMetadata, updated_at: new Date().toISOString() })
      .eq('id', 'default');

    const admin = getCurrentActiveAdmin();
    if (admin) {
      logAdminActivity({
        adminId: admin.id,
        adminName: admin.name,
        adminEmail: admin.email,
        adminRole: admin.role,
        action: 'SYSTEM_CONFIG_UPDATED',
        actionLabel: open ? 'Turned ON public abstract submissions gateway' : 'Turned OFF public abstract submissions gateway',
        category: 'security',
        targetId: 'abstract_gateway',
        targetName: open ? 'Abstract Submissions Opened' : 'Abstract Submissions Closed',
        details: open
          ? 'Public abstract submissions gateway was opened to the public in system_config metadata.'
          : 'Public abstract submissions gateway was closed to the public in system_config metadata.'
      });
    }
  } catch (e) {
    console.warn('Failed to update abstract submissions status in Supabase metadata:', e);
  }
}

export function toggleAbstractSubmissionOpen(): boolean {
  const current = isAbstractSubmissionOpen();
  const next = !current;
  setAbstractSubmissionOpen(next);
  return next;
}

export function getAbstracts(): AbstractSubmission[] {
  return inMemoryAbstracts;
}

export async function fetchFreshAbstracts(): Promise<AbstractSubmission[]> {
  try {
    const { data: rows, error } = await supabase
      .from('abstract_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (!error && rows) {
      inMemoryAbstracts = rows.map(rowToAbstract);
      saveLocalStorageAbstracts(inMemoryAbstracts);
      window.dispatchEvent(new CustomEvent('ifsw_abstracts_updated'));
    }
  } catch (e) {
    console.error('Error fetching abstracts from Supabase:', e);
  }
  return inMemoryAbstracts;
}

export async function submitAbstract(data: Omit<AbstractSubmission, 'id' | 'submittedAt' | 'status'>): Promise<AbstractSubmission> {
  const existing = inMemoryAbstracts;
  const nextNum = existing.length + 1;
  const id = `ABS-2027-${String(nextNum).padStart(3, '0')}`;
  const submittedAt = new Date().toISOString();

  const newAbs: AbstractSubmission = {
    ...data,
    id,
    submittedAt,
    status: 'pending'
  };

  // Optimistic save
  inMemoryAbstracts = [newAbs, ...inMemoryAbstracts];
  saveLocalStorageAbstracts(inMemoryAbstracts);
  window.dispatchEvent(new CustomEvent('ifsw_abstracts_updated'));

  // Save to Supabase
  try {
    const row = abstractToRow(newAbs);
    const { error } = await supabase
      .from('abstract_submissions')
      .insert([row]);

    if (error) {
      console.warn('Supabase error inserting abstract_submissions, falling back to local storage:', error);
    }
  } catch (e) {
    console.warn('Failed saving abstract submission to Supabase, falling back to local storage:', e);
  }

  return newAbs;
}

export async function updateAbstractStatus(
  id: string,
  status: 'accepted' | 'rejected' | 'pending',
  note?: string
): Promise<void> {
  const index = inMemoryAbstracts.findIndex(a => a.id === id);
  let applicantName = id;
  const now = new Date().toISOString();

  if (index !== -1) {
    applicantName = `${inMemoryAbstracts[index].firstName} ${inMemoryAbstracts[index].surname}`;
    inMemoryAbstracts[index].status = status;
    if (note !== undefined) {
      inMemoryAbstracts[index].statusNote = note;
    }
    inMemoryAbstracts[index].statusUpdatedAt = now;
    saveLocalStorageAbstracts(inMemoryAbstracts);
    window.dispatchEvent(new CustomEvent('ifsw_abstracts_updated'));
  }

  // Update in Supabase
  try {
    const admin = getCurrentActiveAdmin();
    const updatePayload: any = {
      status,
      status_updated_at: now,
      status_note: note || null,
      reviewed_by: admin?.id || null,
      updated_at: now
    };

    const { error } = await supabase
      .from('abstract_submissions')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.warn('Supabase error updating abstract status:', error);
    }

    if (admin) {
      logAdminActivity({
        adminId: admin.id,
        adminName: admin.name,
        adminEmail: admin.email,
        adminRole: admin.role,
        action: status === 'accepted' ? 'DELEGATE_ACCEPTED' : status === 'rejected' ? 'DELEGATE_REJECTED' : 'SYSTEM_CONFIG_UPDATED',
        actionLabel: `Set abstract status of ${applicantName} to ${status.toUpperCase()}`,
        category: 'delegates',
        targetId: id,
        targetName: applicantName,
        details: `Abstract ${id} was updated to status: ${status}. Review notes: "${note || 'None'}".`
      });
    }
  } catch (e) {
    console.warn('Failed to update abstract status in Supabase:', e);
  }
}
