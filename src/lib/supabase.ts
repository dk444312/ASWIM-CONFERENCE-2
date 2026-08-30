import { createClient } from '@supabase/supabase-js';

// Supabase configuration provided for the IFSW Africa 2027 Platform
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://bgqdnsunllnylectwnlk.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

// Initialized Supabase Client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
