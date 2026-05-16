import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Ensure createClient doesn't throw immediate "required" error if variables are missing
// by providing fallback strings if necessary, though they won't authenticate.
// However, the error message 'supabaseUrl is required' comes from createClient itself.
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
