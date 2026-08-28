import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Crea una cuenta de administrador en Supabase Auth utilizando un cliente aislado.
 * Al usar `persistSession: false`, no interfiere ni sobreescribe la sesión del administrador que está navegando.
 */
export async function createAdminAccount(email: string, password: string, fullName?: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: new Error('Supabase no está configurado.') };
  }

  const isolatedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const redirectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/admin/login`
    : undefined;

  const { data, error } = await isolatedClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName?.trim() || '',
      },
    },
  });

  return { data, error };
}
