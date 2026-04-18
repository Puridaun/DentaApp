import { createClient } from '@supabase/supabase-js'

// Codul va încerca să ia datele din Environment Variables (Vercel sau .env local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificare rapidă: dacă lipsesc, te anunță în consolă
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("⚠️ Lipsesc cheile Supabase! Verifică variabilele de mediu.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)