import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Nu aruncam: altfel createClient da throw la import si toata aplicatia
  // se randeaza ca pagina alba. Mai bine site-ul merge fara catalog.
  console.error(
    '[Supabase] Lipsesc VITE_SUPABASE_URL si/sau VITE_SUPABASE_ANON_KEY. ' +
      'Seteaza-le in Vercel > Project Settings > Environment Variables si redeploy.'
  );
}

// Placeholder valid ca sa nu explodeze constructorul cand config-ul lipseste.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
