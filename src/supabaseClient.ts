import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// Define TypeScript types for your tables
export type Transaction = {
  id: number;
  category: string;
  amount: number;
  split: string;
  transaction_date: Date;
  nehu_owns_anshu: string;
  item_details: string;
  is_expense: boolean;
};

// Create a typed Supabase client
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
