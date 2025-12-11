import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time when env vars are not available
    console.warn('Supabase environment variables not found. Using mocked client.');
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};