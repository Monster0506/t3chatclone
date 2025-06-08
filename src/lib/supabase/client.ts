import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppqmycyrstmdkvbqxysm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcW15Y3lyc3RtZGt2YnF4eXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjAxMTAsImV4cCI6MjA2NDI5NjExMH0.qiO-j1t5a4XJPpPG7AoDiRPEDRf-4bsaTbPfENmCSgw";

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