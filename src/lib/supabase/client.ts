import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

const SUPABASE_URL = "https://ynxsgcqtlktxjerxtsqo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueHNnY3F0bGt0eGplcnh0c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDcxMzIsImV4cCI6MjA2NDkyMzEzMn0.0Q6wQBa9pztTGYk7wXIi8fvZDnf26mGqPlHo7pu9xxs";
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
}); 