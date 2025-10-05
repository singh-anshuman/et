import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// Create a typed Supabase client
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
