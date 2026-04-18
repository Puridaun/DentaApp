import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dtewmgsfjdbobxgtjpie.supabase.co'
const supabasePublishableKey = 'sb_publishable_o48eEv1_TyvWTO0ReabT0A_1sZ91X_o'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)