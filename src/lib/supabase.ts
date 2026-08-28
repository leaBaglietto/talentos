import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const hasValidConfig = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)

if (!hasValidConfig) {
  console.warn(
    '%c⚠️ Supabase no configurado',
    'color: #FF6B00; font-weight: bold;',
    '\nConfigurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local',
    '\nLa app funcionará en modo demo sin conexión a base de datos.'
  )
}

// Create client only if we have valid config, otherwise create a dummy that won't crash
export const supabase: SupabaseClient = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjA0NjU2MDAsImV4cCI6MTkzNjA0MTYwMH0.placeholder')

export const isSupabaseConfigured = hasValidConfig
