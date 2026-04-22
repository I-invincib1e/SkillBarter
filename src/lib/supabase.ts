import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const msg =
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel project settings, then redeploy.';
  if (typeof document !== 'undefined') {
    document.body.innerHTML = `<div style="font-family:system-ui;padding:2rem;max-width:640px;margin:4rem auto;border:2px solid #dc2626;background:#fef2f2;color:#7f1d1d;border-radius:8px;line-height:1.5"><h1 style="margin:0 0 .5rem;font-size:1.25rem">Configuration error</h1><p style="margin:0">${msg}</p></div>`;
  }
  throw new Error(msg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
