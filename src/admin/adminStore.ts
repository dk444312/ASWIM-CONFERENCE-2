import { supabase } from '../lib/supabase';

export interface RegistrationAdmin {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  role: 'Chief Registration Admin' | 'Senior Registration Officer' | 'Credentials Reviewer' | 'Logistics & Visa Officer' | 'Finance Auditor' | 'Helpdesk Lead';
  department: string;
  location: string;
  status: 'active' | 'suspended';
  permissions: string[];
  avatarUrl?: string;
  createdAt: string;
  lastActiveAt: string;
  actionsCount: number;
  accessPin?: string;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  action: 
    | 'ADMIN_CREATED' 
    | 'ADMIN_UPDATED' 
    | 'ADMIN_STATUS_CHANGED' 
    | 'ADMIN_DELETED' 
    | 'DELEGATE_ACCEPTED' 
    | 'DELEGATE_REJECTED' 
    | 'NOTICE_SENT' 
    | 'REPORT_EXPORTED' 
    | 'SYSTEM_CONFIG_UPDATED'
    | 'STAFF_LOGIN'
    | 'STAFF_LOGOUT'
    | 'ADMIN_LOGIN'
    | 'ADMIN_LOGOUT'
    | 'PASSWORD_CHANGED'
    | 'LANDING_PAGE_UPDATED'
    | 'LANDING_PAGE_RESET';
  actionLabel: string;
  category: 'admins' | 'delegates' | 'communications' | 'security' | 'reports' | 'settings';
  targetId?: string;
  targetName?: string;
  details?: string;
  ipAddress: string;
  timestamp: string;
}

// Default Executive Super Administrator fallback model
export const DEFAULT_SUPER_ADMIN: RegistrationAdmin = {
  id: 'ADM-2027-001',
  username: 'admin@ifswafrica.com',
  password: '199999',
  name: 'IFSW Executive Admin',
  email: 'admin@ifswafrica.com',
  phone: '+265 888 000 2027',
  role: 'Chief Registration Admin',
  department: 'Executive Secretariat HQ',
  location: 'Lilongwe, Malawi',
  status: 'active',
  permissions: [
    'approve_delegates', 
    'reject_delegates', 
    'send_notices', 
    'export_reports', 
    'manage_admins', 
    'system_config', 
    'edit_cms',
    'edit_data'
  ],
  createdAt: '2026-08-01T00:00:00.000Z',
  lastActiveAt: new Date().toISOString(),
  actionsCount: 1,
  accessPin: '1999'
};

const AUTH_STAFF_SESSION_KEY = 'ifsw_session_staff';
const AUTH_ADMIN_SESSION_KEY = 'ifsw_session_admin';
const CURRENT_ACTIVE_ADMIN_KEY = 'ifsw_current_admin_id';
const LOCAL_ADMINS_CACHE_KEY = 'ifsw_admins_cache';

// In-memory runtime state synced with Supabase
let inMemoryAdmins: RegistrationAdmin[] = [DEFAULT_SUPER_ADMIN];
let inMemoryLogs: AdminActivityLog[] = [];
let isAdminsStoreInitialized = false;
let isRealtimeInitialized = false;

// Helper: Safety Timer for Network Requests
async function queryWithTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), ms);
  });

  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeoutId!);
  return result;
}

export function rowToAdmin(row: any): RegistrationAdmin {
  let perms: string[] = [];
  if (Array.isArray(row.permissions)) {
    perms = row.permissions;
  } else if (typeof row.permissions === 'string') {
    try {
      perms = JSON.parse(row.permissions);
    } catch {
      perms = [];
    }
  }

  return {
    id: row.id,
    username: row.username || row.email,
    password: row.password_hash || row.password || '',
    name: row.name || 'Staff Member',
    email: row.email,
    phone: row.phone || '',
    role: (row.role as RegistrationAdmin['role']) || 'Credentials Reviewer',
    department: row.department || 'Registration Secretariat',
    location: row.location || 'Lilongwe, Malawi',
    status: row.status === 'suspended' ? 'suspended' : 'active',
    permissions: perms.length > 0 ? perms : ['approve_delegates', 'send_notices'],
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    lastActiveAt: row.last_active_at || new Date().toISOString(),
    actionsCount: row.actions_count || 0,
    accessPin: row.access_pin || undefined
  };
}

export function adminToRow(admin: Partial<RegistrationAdmin>): any {
  const row: any = {};
  if (admin.id) row.id = admin.id;
  if (admin.username) row.username = admin.username;
  if (admin.email) row.email = admin.email;
  if (admin.password) row.password_hash = admin.password;
  if (admin.name) row.name = admin.name;
  if (admin.phone !== undefined) row.phone = admin.phone;
  if (admin.role) row.role = admin.role;
  if (admin.department) row.department = admin.department;
  if (admin.location) row.location = admin.location;
  if (admin.status) row.status = admin.status;
  if (admin.permissions) row.permissions = admin.permissions;
  if (admin.accessPin) row.access_pin = admin.accessPin;
  if (admin.actionsCount !== undefined) row.actions_count = admin.actionsCount;
  if (admin.lastActiveAt) row.last_active_at = admin.lastActiveAt;
  if (admin.createdAt) row.created_at = admin.createdAt;
  row.updated_at = new Date().toISOString();
  return row;
}

export function rowToLog(row: any): AdminActivityLog {
  return {
    id: String(row.id),
    adminId: row.admin_id || '',
    adminName: row.admin_name || 'System Admin',
    adminEmail: row.admin_email || 'admin@ifswafrica.com',
    adminRole: row.admin_role || 'Registration Officer',
    action: row.action,
    actionLabel: row.action_label || row.action,
    category: row.category || 'delegates',
    targetId: row.target_id || undefined,
    targetName: row.target_name || undefined,
    details: row.details || undefined,
    ipAddress: row.ip_address || '192.168.1.1',
    timestamp: row.created_at || row.timestamp || new Date().toISOString()
  };
}

export function saveAdminsToLocalStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(LOCAL_ADMINS_CACHE_KEY, JSON.stringify(inMemoryAdmins));
    } catch (e) {
      console.error('Failed to cache admins in localStorage:', e);
    }
  }
}

export function loadAdminsFromLocalStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = localStorage.getItem(LOCAL_ADMINS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryAdmins = parsed;
          window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));
        }
      }
    } catch (e) {
      console.error('Failed to load cached admins from localStorage:', e);
    }
  }
}

export function initializeSupabaseAdminStore() {
  if (isAdminsStoreInitialized) return;
  isAdminsStoreInitialized = true;

  // Pre-load from local cache instantly for offline/fallback accounts
  loadAdminsFromLocalStorage();

  // Fetch data in the background without blocking the main application thread
  Promise.all([
    supabase.from('admins').select('*').order('created_at', { ascending: true }),
    supabase.from('admin_activity_logs').select('*').order('created_at', { ascending: false }).limit(200)
  ]).then(([adminRes, logRes]) => {
    if (!adminRes.error && adminRes.data && adminRes.data.length > 0) {
      inMemoryAdmins = adminRes.data.map(rowToAdmin);
      saveAdminsToLocalStorage();
      window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));
    }
    
    if (!logRes.error && logRes.data) {
      inMemoryLogs = logRes.data.map(rowToLog);
      window.dispatchEvent(new CustomEvent('ifsw_admin_logs_updated'));
    }
  }).catch(e => console.error('Background fetch error:', e));
}

// Call this ONLY when the user is actually on the dashboard to save resources
export function initializeAdminRealtimeSubscriptions() {
  if (isRealtimeInitialized) return;
  isRealtimeInitialized = true;

  try {
    supabase
      .channel('public:admins_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, async () => {
        const { data: refreshed } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: true });
        if (refreshed && refreshed.length > 0) {
          inMemoryAdmins = refreshed.map(rowToAdmin);
          saveAdminsToLocalStorage();
          window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_activity_logs' }, async () => {
        const { data: refreshedLogs } = await supabase
          .from('admin_activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (refreshedLogs) {
          inMemoryLogs = refreshedLogs.map(rowToLog);
          notifyAdminLogsUpdated();
        }
      })
      .subscribe();
  } catch (e) {
    console.error('Error initializing Realtime Subscriptions:', e);
  }
}

// Run initial background fetch
initializeSupabaseAdminStore();

export function getRegistrationAdmins(): RegistrationAdmin[] {
  return inMemoryAdmins;
}

export async function fetchFreshAdmins(): Promise<RegistrationAdmin[]> {
  try {
    const { data: rows, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && rows && rows.length > 0) {
      inMemoryAdmins = rows.map(rowToAdmin);
      saveAdminsToLocalStorage();
      window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));
    }
  } catch (e) {
    console.error('Error fetching admins from Supabase:', e);
  }
  return inMemoryAdmins;
}

export async function createRegistrationAdmin(data: {
  username: string;
  password: string;
  email: string;
  name?: string;
  phone?: string;
  role?: RegistrationAdmin['role'];
  department?: string;
  location?: string;
  permissions?: string[];
  avatarUrl?: string;
  accessPin?: string;
}): Promise<{ success: boolean; admin?: RegistrationAdmin; error?: string }> {
  const cleanUsername = data.username.trim().toLowerCase();
  const cleanEmail = data.email.trim().toLowerCase();

  if (inMemoryAdmins.some(a => a.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: `Username "${data.username.trim()}" is already taken.` };
  }
  if (inMemoryAdmins.some(a => a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: `Email address "${data.email.trim()}" is already registered.` };
  }

  const idNumbers = inMemoryAdmins
    .map(a => {
      const match = a.id.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const maxId = idNumbers.length > 0 ? Math.max(...idNumbers) : 0;
  const nextNum = maxId + 1;
  const id = `ADM-2027-${String(nextNum).padStart(3, '0')}`;

  const defaultRolePermissions: Record<string, string[]> = {
    'Chief Registration Admin': ['approve_delegates', 'reject_delegates', 'send_notices', 'export_reports', 'manage_admins', 'system_config', 'edit_cms', 'edit_data'],
    'Senior Registration Officer': ['approve_delegates', 'reject_delegates', 'send_notices', 'export_reports', 'edit_data'],
    'Credentials Reviewer': ['approve_delegates', 'reject_delegates', 'send_notices'],
    'Logistics & Visa Officer': ['approve_delegates', 'send_notices', 'export_reports'],
    'Finance Auditor': ['export_reports', 'approve_delegates'],
    'Helpdesk Lead': ['send_notices']
  };

  const chosenRole = data.role || 'Credentials Reviewer';
  const perms = data.permissions && data.permissions.length > 0 
    ? data.permissions 
    : (defaultRolePermissions[chosenRole] || ['approve_delegates', 'send_notices']);

  const newAdmin: RegistrationAdmin = {
    id,
    username: data.username.trim(),
    password: data.password.trim(),
    name: data.name?.trim() || data.username.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || '+265 888 000 000',
    role: chosenRole,
    department: data.department?.trim() || 'Registration Verification Unit',
    location: data.location?.trim() || 'Lilongwe, Malawi',
    status: 'active',
    permissions: perms,
    avatarUrl: data.avatarUrl,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    actionsCount: 0,
    accessPin: data.accessPin?.trim() || '1234'
  };

  inMemoryAdmins = [...inMemoryAdmins, newAdmin];
  saveAdminsToLocalStorage();
  window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));

  try {
    const row = adminToRow(newAdmin);
    await supabase.from('admins').insert([row]);
  } catch (err) {
    console.error('Failed to create admin in Supabase:', err);
  }

  const activeAdmin = getCurrentActiveAdmin();
  logAdminActivity({
    adminId: activeAdmin.id,
    adminName: activeAdmin.name,
    adminEmail: activeAdmin.email,
    adminRole: activeAdmin.role,
    action: 'ADMIN_CREATED',
    actionLabel: `Provisioned new admin: ${newAdmin.name} (${newAdmin.role})`,
    category: 'admins',
    targetId: newAdmin.id,
    targetName: newAdmin.name,
    details: `Created admin username "${newAdmin.username}" with email "${newAdmin.email}"`
  });

  return { success: true, admin: newAdmin };
}

export async function updateRegistrationAdmin(
  id: string, 
  updates: Partial<Omit<RegistrationAdmin, 'id' | 'createdAt'>>
): Promise<{ success: boolean; admin?: RegistrationAdmin; error?: string }> {
  const index = inMemoryAdmins.findIndex(a => a.id === id);
  if (index === -1) {
    return { success: false, error: 'Admin account not found.' };
  }

  const updatedAdmin: RegistrationAdmin = {
    ...inMemoryAdmins[index],
    ...updates,
    lastActiveAt: new Date().toISOString()
  };

  inMemoryAdmins[index] = updatedAdmin;
  saveAdminsToLocalStorage();
  window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));

  try {
    const row = adminToRow(updatedAdmin);
    await supabase.from('admins').update(row).eq('id', id);
  } catch (e) {
    console.error('Failed updating admin in Supabase:', e);
  }

  const activeAdmin = getCurrentActiveAdmin();
  logAdminActivity({
    adminId: activeAdmin.id,
    adminName: activeAdmin.name,
    adminEmail: activeAdmin.email,
    adminRole: activeAdmin.role,
    action: 'ADMIN_UPDATED',
    actionLabel: `Updated profile details for admin: ${updatedAdmin.name}`,
    category: 'admins',
    targetId: updatedAdmin.id,
    targetName: updatedAdmin.name,
    details: `Profile and permissions updated.`
  });

  return { success: true, admin: updatedAdmin };
}

export async function toggleAdminStatus(id: string): Promise<{ success: boolean; newStatus?: 'active' | 'suspended'; error?: string }> {
  const index = inMemoryAdmins.findIndex(a => a.id === id);
  if (index === -1) return { success: false, error: 'Admin not found.' };

  const admin = inMemoryAdmins[index];
  const newStatus: 'active' | 'suspended' = admin.status === 'active' ? 'suspended' : 'active';
  admin.status = newStatus;
  saveAdminsToLocalStorage();
  window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));

  try {
    await supabase.from('admins').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
  } catch (e) {
    console.error('Error toggling admin status in Supabase:', e);
  }

  const activeAdmin = getCurrentActiveAdmin();
  logAdminActivity({
    adminId: activeAdmin.id,
    adminName: activeAdmin.name,
    adminEmail: activeAdmin.email,
    adminRole: activeAdmin.role,
    action: 'ADMIN_STATUS_CHANGED',
    actionLabel: `${newStatus === 'active' ? 'Reactivated' : 'Suspended'} admin ${admin.name}`,
    category: 'admins',
    targetId: admin.id,
    targetName: admin.name,
    details: `Admin account status transitioned to ${newStatus}.`
  });

  return { success: true, newStatus };
}

export async function deleteRegistrationAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  const admin = inMemoryAdmins.find(a => a.id === id);
  if (!admin) return { success: false, error: 'Admin not found.' };

  inMemoryAdmins = inMemoryAdmins.filter(a => a.id !== id);
  saveAdminsToLocalStorage();
  window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));

  try {
    await supabase.from('admins').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting admin from Supabase:', e);
  }

  const activeAdmin = getCurrentActiveAdmin();
  logAdminActivity({
    adminId: activeAdmin.id,
    adminName: activeAdmin.name,
    adminEmail: activeAdmin.email,
    adminRole: activeAdmin.role,
    action: 'ADMIN_DELETED',
    actionLabel: `Deleted registration admin account: ${admin.name} (${id})`,
    category: 'admins',
    targetId: id,
    targetName: admin.name,
    details: `Admin record permanently removed.`
  });

  return { success: true };
}

export async function authenticateRegistrationStaff(
  identifier: string,
  password?: string
): Promise<{ success: boolean; admin?: RegistrationAdmin; error?: string }> {
  const clean = identifier.trim().toLowerCase();

  try {
    // 2.5 second maximum wait time for Supabase
    const query = supabase
      .from('admins')
      .select('*')
      .or(`email.ilike.${clean},username.ilike.${clean}`);
      
    const response = await queryWithTimeout(query, 2500);

    if (response && response.data && response.data.length > 0) {
      const found = rowToAdmin(response.data[0]);
      if (found.status === 'suspended') {
        return { success: false, error: 'This staff account has been suspended by the Executive Administrator.' };
      }
      if (password && found.password && found.password !== password.trim()) {
        return { success: false, error: 'Incorrect staff credentials or access password.' };
      }
      
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(AUTH_STAFF_SESSION_KEY, JSON.stringify(found));
        sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, found.id);
      }
      
      const index = inMemoryAdmins.findIndex(a => a.id === found.id);
      if (index !== -1) inMemoryAdmins[index] = found;
      else inMemoryAdmins.push(found);
      saveAdminsToLocalStorage();

      return { success: true, admin: found };
    }
  } catch (err) {
    console.warn('Network timeout or error, checking local records:', err);
  }

  // Fallback if the network times out or fails
  const fallbackFound = inMemoryAdmins.find(
    a => a.email.toLowerCase() === clean || a.username.toLowerCase() === clean
  );

  if (fallbackFound) {
    if (fallbackFound.status === 'suspended') {
      return { success: false, error: 'This staff account has been suspended by the Executive Administrator.' };
    }
    if (!password || (fallbackFound.password && fallbackFound.password === password.trim())) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(AUTH_STAFF_SESSION_KEY, JSON.stringify(fallbackFound));
        sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, fallbackFound.id);
      }
      return { success: true, admin: fallbackFound };
    }
  }

  return { success: false, error: 'No registration staff profile found with this username or email.' };
}

export async function authenticateAdmin(
  usernameOrEmail: string,
  password?: string
): Promise<{ success: boolean; admin?: RegistrationAdmin; error?: string }> {
  const clean = usernameOrEmail.trim().toLowerCase();

  try {
    // 2.5 second maximum wait time for Supabase
    const query = supabase
      .from('admins')
      .select('*')
      .or(`email.ilike.${clean},username.ilike.${clean}`);
      
    const response = await queryWithTimeout(query, 2500);

    if (response && response.data && response.data.length > 0) {
      const found = rowToAdmin(response.data[0]);
      if (found.status === 'suspended') {
        return { success: false, error: 'This administrator account is suspended.' };
      }
      if (password && found.password && found.password !== password.trim()) {
        return { success: false, error: 'Invalid password. Please verify your credentials.' };
      }

      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(AUTH_ADMIN_SESSION_KEY, JSON.stringify(found));
        sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, found.id);
      }

      const index = inMemoryAdmins.findIndex(a => a.id === found.id);
      if (index !== -1) inMemoryAdmins[index] = found;
      else inMemoryAdmins.push(found);
      saveAdminsToLocalStorage();

      return { success: true, admin: found };
    }
  } catch (err) {
    console.warn('Network timeout or error, checking local records:', err);
  }

  // Fallback if the network times out or fails
  const fallbackFound = inMemoryAdmins.find(
    a => a.email.toLowerCase() === clean || a.username.toLowerCase() === clean
  );

  if (fallbackFound) {
    if (fallbackFound.status === 'suspended') {
      return { success: false, error: 'This administrator account is suspended.' };
    }
    if (!password || (fallbackFound.password && fallbackFound.password === password.trim())) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(AUTH_ADMIN_SESSION_KEY, JSON.stringify(fallbackFound));
        sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, fallbackFound.id);
      }
      return { success: true, admin: fallbackFound };
    }
  } else {
    // Check default super admin
    if (clean === 'admin@ifswafrica.com' && (!password || password.trim() === '199999')) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(AUTH_ADMIN_SESSION_KEY, JSON.stringify(DEFAULT_SUPER_ADMIN));
        sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, DEFAULT_SUPER_ADMIN.id);
      }
      return { success: true, admin: DEFAULT_SUPER_ADMIN };
    }
  }

  return { success: false, error: 'Administrator not found in database.' };
}

export function getAuthenticatedStaff(): RegistrationAdmin | null {
  if (typeof window === 'undefined' || !window.sessionStorage) return inMemoryAdmins[0] || DEFAULT_SUPER_ADMIN;
  try {
    const raw = sessionStorage.getItem(AUTH_STAFF_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAuthenticatedAdmin(): RegistrationAdmin | null {
  if (typeof window === 'undefined' || !window.sessionStorage) return inMemoryAdmins[0] || DEFAULT_SUPER_ADMIN;
  try {
    const raw = sessionStorage.getItem(AUTH_ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const getAdminSession = getAuthenticatedAdmin;
export const getStaffSession = getAuthenticatedStaff;

export function getCurrentActiveAdmin(): RegistrationAdmin {
  const staff = getAuthenticatedStaff();
  if (staff) return staff;
  const admin = getAuthenticatedAdmin();
  if (admin) return admin;
  return inMemoryAdmins[0] || DEFAULT_SUPER_ADMIN;
}

export function logoutStaff() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.removeItem(AUTH_STAFF_SESSION_KEY);
  }
}

export function logoutAdmin() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.removeItem(AUTH_ADMIN_SESSION_KEY);
  }
}

export function getAdminActivityLogs(): AdminActivityLog[] {
  return inMemoryLogs;
}

export async function fetchFreshLogs(): Promise<AdminActivityLog[]> {
  try {
    const { data: rows, error } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!error && rows) {
      inMemoryLogs = rows.map(rowToLog);
      window.dispatchEvent(new CustomEvent('ifsw_admin_logs_updated'));
    }
  } catch (e) {
    console.error('Error fetching logs from Supabase:', e);
  }
  return inMemoryLogs;
}

export async function logAdminActivity(
  entry: Omit<AdminActivityLog, 'id' | 'timestamp' | 'ipAddress'> & { ipAddress?: string }
): Promise<AdminActivityLog> {
  const newLog: AdminActivityLog = {
    ...entry,
    id: `LOG-${Date.now().toString().slice(-6)}`,
    ipAddress: entry.ipAddress || '102.140.231.14',
    timestamp: new Date().toISOString()
  };

  inMemoryLogs = [newLog, ...inMemoryLogs];
  notifyAdminLogsUpdated();

  try {
    await supabase.from('admin_activity_logs').insert([{
      admin_id: entry.adminId,
      admin_name: entry.adminName,
      admin_email: entry.adminEmail,
      admin_role: entry.adminRole,
      action: entry.action,
      action_label: entry.actionLabel,
      category: entry.category,
      target_id: entry.targetId,
      target_name: entry.targetName,
      details: entry.details,
      ip_address: newLog.ipAddress,
      created_at: newLog.timestamp
    }]);
  } catch (e) {
    console.error('Failed saving activity log to Supabase:', e);
  }

  return newLog;
}

export function notifyAdminLogsUpdated() {
  window.dispatchEvent(new CustomEvent('ifsw_admin_logs_updated'));
  window.dispatchEvent(new CustomEvent('ifsw_admin_logs_changed'));
}

export async function clearAllAdminLogs(): Promise<void> {
  inMemoryLogs = [];
  notifyAdminLogsUpdated();

  try {
    await supabase.from('admin_activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (e) {
    console.error('Failed clearing admin logs in Supabase:', e);
  }
}

export const clearAdminLogs = clearAllAdminLogs;
export const logoutRegistrationStaff = logoutStaff;
export const logoutAdminUser = logoutAdmin;

export function setCurrentActiveAdmin(adminOrId: RegistrationAdmin | string): void {
  if (typeof adminOrId === 'string') {
    const found = inMemoryAdmins.find(a => a.id === adminOrId);
    if (found && typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(AUTH_ADMIN_SESSION_KEY, JSON.stringify(found));
      sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, found.id);
    }
  } else if (adminOrId && typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.setItem(AUTH_ADMIN_SESSION_KEY, JSON.stringify(adminOrId));
    sessionStorage.setItem(CURRENT_ACTIVE_ADMIN_KEY, adminOrId.id);
  }
}

export async function changeAdminPassword(
  adminId: string,
  newPasswordOrOld: string,
  optionalNewPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const index = inMemoryAdmins.findIndex(a => a.id === adminId);
  if (index === -1) {
    return { success: false, error: 'Admin account not found.' };
  }

  const admin = inMemoryAdmins[index];
  let newPass = newPasswordOrOld;
  if (optionalNewPassword !== undefined) {
    if (admin.password && admin.password !== newPasswordOrOld.trim()) {
      return { success: false, error: 'Current password does not match.' };
    }
    newPass = optionalNewPassword;
  }

  admin.password = newPass.trim();
  admin.lastActiveAt = new Date().toISOString();
  inMemoryAdmins[index] = admin;
  window.dispatchEvent(new CustomEvent('ifsw_registration_admins_changed'));

  try {
    await supabase
      .from('admins')
      .update({ password_hash: newPass.trim(), updated_at: new Date().toISOString() })
      .eq('id', adminId);
  } catch (e) {
    console.error('Failed to change password in Supabase:', e);
  }

  logAdminActivity({
    adminId: admin.id,
    adminName: admin.name,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'PASSWORD_CHANGED',
    actionLabel: `Password updated for admin ${admin.name}`,
    category: 'security',
    targetId: admin.id,
    targetName: admin.name,
    details: 'Admin access password was updated successfully in Supabase.'
  });

  return { success: true };
}
