import { createClient } from '@supabase/supabase-js';

// Support both Vite and Create React App environment variables
const supabaseUrl = import.meta.env ? (import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL) : process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY) : process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided as environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
