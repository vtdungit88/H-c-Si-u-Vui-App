import { createClient } from '@supabase/supabase-js';

// Frontend uses ONLY the project URL and the publishable key (safe to expose; protected by RLS).
// Never put a service-role/secret key in a VITE_ variable.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = createClient(url ?? 'https://not-configured.invalid', key ?? 'not-configured', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
