import { createClient, SupabaseClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = rawUrl?.trim().replace(/^["']|["']$/g, '') || '';
const supabaseAnonKey = rawAnonKey?.trim().replace(/^["']|["']$/g, '') || '';

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const hasValidConfig = Boolean(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));

if (!hasValidConfig) {
  console.warn(
    '%c⚠️ Supabase no configurado o URL inválida',
    'color: #FF6B00; font-weight: bold;',
    '\nURL recibida:', supabaseUrl ? `"${supabaseUrl}"` : 'VACÍA',
    '\nAnonKey recibida:', supabaseAnonKey ? 'PRESENTE' : 'VACÍA'
  );
} else {
  console.log('%c✅ Supabase conectado correctamente', 'color: #00FF88; font-weight: bold;', supabaseUrl);
}

// Create client only if we have valid config, otherwise create a dummy that won't crash
export const supabase: SupabaseClient = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjA0NjU2MDAsImV4cCI6MTkzNjA0MTYwMH0.placeholder')

export const isSupabaseConfigured = hasValidConfig
