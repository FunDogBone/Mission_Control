import { createClient } from '@supabase/supabase-js';

// This is the Supabase client for The Bloc dashboard
const url: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in environment variables');
}

export const supabase = createClient(url, key);
