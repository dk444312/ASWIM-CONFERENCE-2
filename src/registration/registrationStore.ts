import { supabase } from '../lib/supabase';
import { getCurrentActiveAdmin, logAdminActivity } from '../admin/adminStore';

export interface RegistrationData {
  id: string;
  submittedAt: string; // ISO string
  status: 'pending' | 'accepted' | 'rejected';
  statusNote?: string;
  statusUpdatedAt?: string;

  // Step 1: Personal
  title: string;
  fullName: string;
  gender: string;
  dob: string;
  nationality: string;
  country: string;
  org: string;
  dept: string;
  position: string;
  email: string;
  altEmail?: string;
  phone: string;
  altPhone?: string;
  emName: string;
  emRel: string;
  emPhone: string;
  emEmail: string;

  // Step 2: Professional
  profBackground: string;
  areaPractice: string[];
  yearsExp: string;
  profAssoc: string;
  isIfsw: string;
  ifswName?: string;
  ifswCountry?: string;
  ifswNumber?: string;
  ifswPosition?: string;
  interests: string[];

  // Step 3: Category
  category: 'IFSW Members' | 'Non-Members' | 'International Delegate' | 'Student Delegate' | 'Malawian Delegate' | 'Virtual Participant' | string;
  attendanceMode?: 'In-Person' | 'Virtual' | string;
  feeAmount: number;
  // International
  arrivalDate?: string;
  arrivalTime?: string;
  arrivalFlight?: string;
  depDate?: string;
  depTime?: string;
  depFlight?: string;
  airportTransfer?: string;
  accReq?: string;
  hotelCat?: string;
  roomPref?: string;
  visaReq?: string;
  passName?: string;
  passNum?: string;
  passExp?: string;
  embassyName?: string;
  embassyLoc?: string;
  // Malawi
  district?: string;
  localTransport?: string;
  // Student
  levelStudy?: string;
  progStudy?: string;
  studentInst?: string;
  studentIdFile?: string;
  // Virtual
  timeZone?: string;
  virtualSessions?: string[];
  techReq?: string;

  // Step 4: Roles
  isPresenter: boolean;
  presTitle?: string;
  presTrack?: string;
  presType?: string;
  presBio?: string;
  presCoauthors?: string;
  presAv?: string[];
  presAbstractFile?: string;
  isExhibitor: boolean;
  exhibOrg?: string;
  exhibBooth?: string;
  exhibStaff?: string;
  exhibElec?: string;
  exhibInternet?: string;
  exhibNature?: string;
  exhibPromoFile?: string;

  // Step 5: Sessions
  workshops: string[];
  parallelSessions: string[];
  specialEvents: string[];
  gala: string;
  dietary: string;
  disability: string[];
  medical?: string;
}

export interface AdminProfile {
  name: string;
  title: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  organization: string;
  location: string;
  avatarUrl?: string;
}

export interface NoticeLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  type: 'accepted' | 'rejected' | 'reminder' | 'custom';
  subject: string;
  sentAt: string;
  deliveryStatus: 'delivered' | 'pending' | 'failed';
}

// In-memory runtime cache fed strictly from Supabase
let inMemoryRegistrations: RegistrationData[] = [];
let inMemoryNotices: NoticeLog[] = [];
let inMemoryRegistrationOpen: boolean = true;
let isInitialized = false;

export function rowToRegistration(row: any): RegistrationData {
  return {
    id: row.id,
    submittedAt: row.submitted_at || row.created_at || new Date().toISOString(),
    status: row.status || 'pending',
    statusNote: row.status_note || undefined,
    statusUpdatedAt: row.status_updated_at || undefined,

    // Step 1: Personal
    title: row.title || '',
    fullName: row.full_name || '',
    gender: row.gender || '',
    dob: row.dob || '',
    nationality: row.nationality || '',
    country: row.country || '',
    org: row.organization || '',
    dept: row.department || '',
    position: row.position || '',
    email: row.email || '',
    altEmail: row.alt_email || undefined,
    phone: row.phone || '',
    altPhone: row.alt_phone || undefined,
    emName: row.emergency_name || '',
    emRel: row.emergency_relationship || '',
    emPhone: row.emergency_phone || '',
    emEmail: row.emergency_email || '',

    // Step 2: Professional
    profBackground: row.prof_background || '',
    areaPractice: Array.isArray(row.area_practice) ? row.area_practice : [],
    yearsExp: row.years_exp || '',
    profAssoc: row.prof_assoc || '',
    isIfsw: row.is_ifsw || 'no',
    ifswName: row.ifsw_name || undefined,
    ifswCountry: row.ifsw_country || undefined,
    ifswNumber: row.ifsw_number || undefined,
    ifswPosition: row.ifsw_position || undefined,
    interests: Array.isArray(row.interests) ? row.interests : [],

    // Step 3: Category
    category: row.category || 'IFSW Members',
    attendanceMode: row.attendance_mode || (row.category === 'Virtual Participant' || row.time_zone ? 'Virtual' : 'In-Person'),
    feeAmount: Number(row.fee_amount || 0),
    arrivalDate: row.arrival_date || undefined,
    arrivalTime: row.arrival_time || undefined,
    arrivalFlight: row.arrival_flight || undefined,
    depDate: row.dep_date || undefined,
    depTime: row.dep_time || undefined,
    depFlight: row.dep_flight || undefined,
    airportTransfer: row.airport_transfer || undefined,
    accReq: row.acc_req || undefined,
    hotelCat: row.hotel_cat || undefined,
    roomPref: row.room_pref || undefined,
    visaReq: row.visa_req || undefined,
    passName: row.pass_name || undefined,
    passNum: row.pass_num || undefined,
    passExp: row.pass_exp || undefined,
    embassyName: row.embassy_name || undefined,
    embassyLoc: row.embassy_loc || undefined,
    district: row.district || undefined,
    localTransport: row.local_transport || undefined,
    levelStudy: row.level_study || undefined,
    progStudy: row.prog_study || undefined,
    studentInst: row.student_inst || undefined,
    studentIdFile: row.student_id_file_url || undefined,
    timeZone: row.time_zone || undefined,
    virtualSessions: Array.isArray(row.virtual_sessions) ? row.virtual_sessions : [],
    techReq: row.tech_req || undefined,

    // Step 4: Roles
    isPresenter: Boolean(row.is_presenter),
    presTitle: row.pres_title || undefined,
    presTrack: row.pres_track || undefined,
    presType: row.pres_type || undefined,
    presBio: row.pres_bio || undefined,
    presCoauthors: row.pres_coauthors || undefined,
    presAv: Array.isArray(row.pres_av) ? row.pres_av : [],
    presAbstractFile: row.pres_abstract_file_url || undefined,
    isExhibitor: Boolean(row.is_exhibitor),
    exhibOrg: row.exhib_org || undefined,
    exhibBooth: row.exhib_booth || undefined,
    exhibStaff: row.exhib_staff || undefined,
    exhibElec: row.exhib_elec || undefined,
    exhibInternet: row.exhib_internet || undefined,
    exhibNature: row.exhib_nature || undefined,
    exhibPromoFile: row.exhib_promo_file_url || undefined,

    // Step 5: Sessions
    workshops: Array.isArray(row.workshops) ? row.workshops : [],
    parallelSessions: Array.isArray(row.parallel_sessions) ? row.parallel_sessions : [],
    specialEvents: Array.isArray(row.special_events) ? row.special_events : [],
    gala: row.gala || 'No',
    dietary: row.dietary || '',
    disability: Array.isArray(row.disability) ? row.disability : [],
    medical: row.medical || undefined
  };
}

export function registrationToRow(data: Partial<RegistrationData>): any {
  const row: any = {};
  if (data.id) row.id = data.id;
  if (data.submittedAt) row.submitted_at = data.submittedAt;
  if (data.status) row.status = data.status;
  if (data.statusNote !== undefined) row.status_note = data.statusNote;
  if (data.statusUpdatedAt) row.status_updated_at = data.statusUpdatedAt;

  if (data.title !== undefined) row.title = data.title;
  if (data.fullName !== undefined) row.full_name = data.fullName;
  if (data.gender !== undefined) row.gender = data.gender;
  if (data.dob) row.dob = data.dob || null;
  if (data.nationality !== undefined) row.nationality = data.nationality;
  if (data.country !== undefined) row.country = data.country;
  if (data.org !== undefined) row.organization = data.org;
  if (data.dept !== undefined) row.department = data.dept;
  if (data.position !== undefined) row.position = data.position;
  if (data.email !== undefined) row.email = data.email;
  if (data.altEmail !== undefined) row.alt_email = data.altEmail || null;
  if (data.phone !== undefined) row.phone = data.phone;
  if (data.altPhone !== undefined) row.alt_phone = data.altPhone || null;
  if (data.emName !== undefined) row.emergency_name = data.emName;
  if (data.emRel !== undefined) row.emergency_relationship = data.emRel;
  if (data.emPhone !== undefined) row.emergency_phone = data.emPhone;
  if (data.emEmail !== undefined) row.emergency_email = data.emEmail || null;

  if (data.profBackground !== undefined) row.prof_background = data.profBackground;
  if (data.areaPractice !== undefined) row.area_practice = data.areaPractice;
  if (data.yearsExp !== undefined) row.years_exp = data.yearsExp;
  if (data.profAssoc !== undefined) row.prof_assoc = data.profAssoc;
  if (data.isIfsw !== undefined) row.is_ifsw = data.isIfsw;
  if (data.ifswName !== undefined) row.ifsw_name = data.ifswName || null;
  if (data.ifswCountry !== undefined) row.ifsw_country = data.ifswCountry || null;
  if (data.ifswNumber !== undefined) row.ifsw_number = data.ifswNumber || null;
  if (data.ifswPosition !== undefined) row.ifsw_position = data.ifswPosition || null;
  if (data.interests !== undefined) row.interests = data.interests;

  if (data.category !== undefined) row.category = data.category;
  if (data.attendanceMode !== undefined) row.attendance_mode = data.attendanceMode;
  if (data.feeAmount !== undefined) row.fee_amount = data.feeAmount;

  if (data.arrivalDate) row.arrival_date = data.arrivalDate || null;
  if (data.arrivalTime) row.arrival_time = data.arrivalTime || null;
  if (data.arrivalFlight !== undefined) row.arrival_flight = data.arrivalFlight || null;
  if (data.depDate) row.dep_date = data.depDate || null;
  if (data.depTime) row.dep_time = data.depTime || null;
  if (data.depFlight !== undefined) row.dep_flight = data.depFlight || null;
  if (data.airportTransfer !== undefined) row.airport_transfer = data.airportTransfer || null;
  if (data.accReq !== undefined) row.acc_req = data.accReq || null;
  if (data.hotelCat !== undefined) row.hotel_cat = data.hotelCat || null;
  if (data.roomPref !== undefined) row.room_pref = data.roomPref || null;
  if (data.visaReq !== undefined) row.visa_req = data.visaReq || null;
  if (data.passName !== undefined) row.pass_name = data.passName || null;
  if (data.passNum !== undefined) row.pass_num = data.passNum || null;
  if (data.passExp) row.pass_exp = data.passExp || null;
  if (data.embassyName !== undefined) row.embassy_name = data.embassyName || null;
  if (data.embassyLoc !== undefined) row.embassy_loc = data.embassyLoc || null;
  if (data.district !== undefined) row.district = data.district || null;
  if (data.localTransport !== undefined) row.local_transport = data.localTransport || null;
  if (data.levelStudy !== undefined) row.level_study = data.levelStudy || null;
  if (data.progStudy !== undefined) row.prog_study = data.progStudy || null;
  if (data.studentInst !== undefined) row.student_inst = data.studentInst || null;
  if (data.studentIdFile !== undefined) row.student_id_file_url = data.studentIdFile || null;
  if (data.timeZone !== undefined) row.time_zone = data.timeZone || null;
  if (data.virtualSessions !== undefined) row.virtual_sessions = data.virtualSessions;
  if (data.techReq !== undefined) row.tech_req = data.techReq || null;

  if (data.isPresenter !== undefined) row.is_presenter = data.isPresenter;
  if (data.presTitle !== undefined) row.pres_title = data.presTitle || null;
  if (data.presTrack !== undefined) row.pres_track = data.presTrack || null;
  if (data.presType !== undefined) row.pres_type = data.presType || null;
  if (data.presBio !== undefined) row.pres_bio = data.presBio || null;
  if (data.presCoauthors !== undefined) row.pres_coauthors = data.presCoauthors || null;
  if (data.presAv !== undefined) row.pres_av = data.presAv;
  if (data.presAbstractFile !== undefined) row.pres_abstract_file_url = data.presAbstractFile || null;

  if (data.isExhibitor !== undefined) row.is_exhibitor = data.isExhibitor;
  if (data.exhibOrg !== undefined) row.exhib_org = data.exhibOrg || null;
  if (data.exhibBooth !== undefined) row.exhib_booth = data.exhibBooth || null;
  if (data.exhibStaff !== undefined) row.exhib_staff = data.exhibStaff || null;
  if (data.exhibElec !== undefined) row.exhib_elec = data.exhibElec || null;
  if (data.exhibInternet !== undefined) row.exhib_internet = data.exhibInternet || null;
  if (data.exhibNature !== undefined) row.exhib_nature = data.exhibNature || null;
  if (data.exhibPromoFile !== undefined) row.exhib_promo_file_url = data.exhibPromoFile || null;

  if (data.workshops !== undefined) row.workshops = data.workshops;
  if (data.parallelSessions !== undefined) row.parallel_sessions = data.parallelSessions;
  if (data.specialEvents !== undefined) row.special_events = data.specialEvents;
  if (data.gala !== undefined) row.gala = data.gala;
  if (data.dietary !== undefined) row.dietary = data.dietary;
  if (data.disability !== undefined) row.disability = data.disability;
  if (data.medical !== undefined) row.medical = data.medical || null;

  return row;
}

// Initialize Supabase Sync & Realtime Listeners
export async function initializeSupabaseRegistrationStore() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    // 1. Fetch Registrations
    const { data: regRows, error: regError } = await supabase
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (!regError && regRows) {
      inMemoryRegistrations = regRows.map(rowToRegistration);
      window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));
    }

    // 2. Fetch System Config (Registration Gate status)
    const { data: configRow } = await supabase
      .from('system_config')
      .select('registration_open')
      .eq('id', 'default')
      .single();

    if (configRow) {
      inMemoryRegistrationOpen = configRow.registration_open ?? true;
      window.dispatchEvent(new CustomEvent('ifsw_registration_status_changed', { detail: { open: inMemoryRegistrationOpen } }));
    }

    // 3. Fetch Communications
    const { data: commRows } = await supabase
      .from('communications')
      .select('*')
      .order('sent_at', { ascending: false });

    if (commRows) {
      inMemoryNotices = commRows.map(row => ({
        id: row.id,
        recipientEmail: row.recipient_email,
        recipientName: row.recipient_name,
        type: row.type || 'custom',
        subject: row.subject,
        sentAt: row.sent_at,
        deliveryStatus: row.delivery_status || 'delivered'
      }));
      window.dispatchEvent(new CustomEvent('ifsw_notices_updated'));
    }

    // Realtime Supabase Channel
    supabase
      .channel('public:registrations_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, async () => {
        const { data: freshRows } = await supabase
          .from('registrations')
          .select('*')
          .order('submitted_at', { ascending: false });
        if (freshRows) {
          inMemoryRegistrations = freshRows.map(rowToRegistration);
          window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' }, async () => {
        const { data: cfg } = await supabase
          .from('system_config')
          .select('registration_open')
          .eq('id', 'default')
          .single();
        if (cfg) {
          inMemoryRegistrationOpen = cfg.registration_open ?? true;
          window.dispatchEvent(new CustomEvent('ifsw_registration_status_changed', { detail: { open: inMemoryRegistrationOpen } }));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'communications' }, async () => {
        const { data: freshComms } = await supabase
          .from('communications')
          .select('*')
          .order('sent_at', { ascending: false });
        if (freshComms) {
          inMemoryNotices = freshComms.map(row => ({
            id: row.id,
            recipientEmail: row.recipient_email,
            recipientName: row.recipient_name,
            type: row.type || 'custom',
            subject: row.subject,
            sentAt: row.sent_at,
            deliveryStatus: row.delivery_status || 'delivered'
          }));
          window.dispatchEvent(new CustomEvent('ifsw_notices_updated'));
        }
      })
      .subscribe();
  } catch (err) {
    console.error('Error initializing Supabase registration store:', err);
  }
}

// Run initial fetch immediately
initializeSupabaseRegistrationStore();

export function isRegistrationOpen(): boolean {
  return inMemoryRegistrationOpen;
}

export async function setRegistrationOpen(open: boolean): Promise<void> {
  inMemoryRegistrationOpen = open;
  window.dispatchEvent(new CustomEvent('ifsw_registration_status_changed', { detail: { open } }));

  try {
    await supabase
      .from('system_config')
      .update({ registration_open: open, updated_at: new Date().toISOString() })
      .eq('id', 'default');

    // Log admin activity to Supabase
    const admin = getCurrentActiveAdmin();
    logAdminActivity({
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      adminRole: admin.role,
      action: 'SYSTEM_CONFIG_UPDATED',
      actionLabel: open ? 'Turned ON public delegate registration gateway' : 'Turned OFF public delegate registration gateway',
      category: 'security',
      targetId: 'registration_gateway',
      targetName: open ? 'Public Registration Opened' : 'Public Registration Closed',
      details: open 
        ? 'Public registration portal was turned ON (opened) for delegate applications in Supabase.' 
        : 'Public registration portal was turned OFF (closed) to new delegate applications in Supabase.'
    });
  } catch (e) {
    console.error('Failed to update registration open status in Supabase:', e);
  }
}

export function toggleRegistrationOpen(): boolean {
  const current = isRegistrationOpen();
  const next = !current;
  setRegistrationOpen(next);
  return next;
}

export function getStoredRegistrations(): RegistrationData[] {
  return inMemoryRegistrations;
}

export async function fetchFreshRegistrations(): Promise<RegistrationData[]> {
  try {
    const { data: rows, error } = await supabase
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (!error && rows) {
      inMemoryRegistrations = rows.map(rowToRegistration);
      window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));
    }
  } catch (e) {
    console.error('Error fetching registrations from Supabase:', e);
  }
  return inMemoryRegistrations;
}

export async function addRegistration(data: Omit<RegistrationData, 'id' | 'submittedAt' | 'status' | 'feeAmount'>): Promise<RegistrationData> {
  // Generate sequential identifier
  const existing = inMemoryRegistrations;
  const idNumbers = existing
    .map(r => {
      const match = r.id.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const maxId = idNumbers.length > 0 ? Math.max(...idNumbers) : 0;
  const nextNum = maxId + 1;
  const id = `REG-2027-${String(nextNum).padStart(3, '0')}`;
  
  const feeAmount = 0;
  const submittedAt = new Date().toISOString();

  const newReg: RegistrationData = {
    ...data,
    id,
    submittedAt,
    status: 'pending',
    feeAmount
  };

  // Optimistically update memory
  inMemoryRegistrations = [newReg, ...inMemoryRegistrations];
  window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));

  // Persist directly to Supabase
  try {
    const row = registrationToRow(newReg);
    const { error } = await supabase
      .from('registrations')
      .insert([row]);

    if (error) {
      console.error('Supabase error inserting registration:', error);
    }
  } catch (e) {
    console.error('Failed saving registration to Supabase:', e);
  }

  return newReg;
}

export async function updateRegistrationStatus(id: string, status: 'accepted' | 'rejected' | 'pending', note?: string) {
  const index = inMemoryRegistrations.findIndex(r => r.id === id);
  let delegateName = id;
  const now = new Date().toISOString();

  if (index !== -1) {
    delegateName = inMemoryRegistrations[index].fullName;
    inMemoryRegistrations[index].status = status;
    if (note !== undefined) {
      inMemoryRegistrations[index].statusNote = note;
    }
    inMemoryRegistrations[index].statusUpdatedAt = now;
    window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));
  }

  // Update in Supabase
  try {
    const updatePayload: any = {
      status,
      status_updated_at: now,
      updated_at: now
    };
    if (note !== undefined) {
      updatePayload.status_note = note;
    }

    const { error } = await supabase
      .from('registrations')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating registration status in Supabase:', error);
    }

    // Log admin activity in Supabase
    const activeAdmin = getCurrentActiveAdmin();
    const actionType = status === 'accepted' ? 'DELEGATE_ACCEPTED' : status === 'rejected' ? 'DELEGATE_REJECTED' : 'ADMIN_UPDATED';
    logAdminActivity({
      adminId: activeAdmin.id,
      adminName: activeAdmin.name,
      adminEmail: activeAdmin.email,
      adminRole: activeAdmin.role,
      action: actionType as any,
      actionLabel: `${status === 'accepted' ? 'Approved' : status === 'rejected' ? 'Declined' : 'Updated status of'} delegate ${delegateName} (${id})`,
      category: 'delegates',
      targetId: id,
      targetName: delegateName,
      details: note ? `Decision note: ${note}` : `Status marked as ${status} in Supabase.`
    });
  } catch (e) {
    console.error('Failed to update registration status in Supabase:', e);
  }
}

export async function deleteRegistration(id: string) {
  inMemoryRegistrations = inMemoryRegistrations.filter(r => r.id !== id);
  window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));

  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting registration from Supabase:', error);
    }
  } catch (e) {
    console.error('Failed deleting registration from Supabase:', e);
  }
}

export function clearAllRegistrationData() {
  inMemoryRegistrations = [];
  inMemoryNotices = [];
  window.dispatchEvent(new CustomEvent('ifsw_registrations_updated'));
  window.dispatchEvent(new CustomEvent('ifsw_notices_updated'));
}

export function getStoredNotices(): NoticeLog[] {
  return inMemoryNotices;
}

export async function addNoticeLog(notice: Omit<NoticeLog, 'id' | 'sentAt' | 'deliveryStatus'>): Promise<NoticeLog> {
  const newNotice: NoticeLog = {
    ...notice,
    id: `NOT-${Date.now().toString().slice(-4)}`,
    sentAt: new Date().toISOString(),
    deliveryStatus: 'delivered'
  };

  inMemoryNotices = [newNotice, ...inMemoryNotices];
  window.dispatchEvent(new CustomEvent('ifsw_notices_updated'));

  try {
    await supabase
      .from('communications')
      .insert([{
        recipient_email: notice.recipientEmail,
        recipient_name: notice.recipientName,
        type: notice.type,
        subject: notice.subject,
        body: `Notice sent to ${notice.recipientName}`,
        delivery_status: 'delivered',
        sent_at: newNotice.sentAt
      }]);

    const activeAdmin = getCurrentActiveAdmin();
    logAdminActivity({
      adminId: activeAdmin.id,
      adminName: activeAdmin.name,
      adminEmail: activeAdmin.email,
      adminRole: activeAdmin.role,
      action: 'NOTICE_SENT',
      actionLabel: `Dispatched ${notice.type} notice to ${notice.recipientName} (${notice.recipientEmail})`,
      category: 'communications',
      targetName: notice.recipientName,
      details: `Subject: ${notice.subject}`
    });
  } catch (e) {
    console.error('Failed saving notice log to Supabase:', e);
  }

  return newNotice;
}
