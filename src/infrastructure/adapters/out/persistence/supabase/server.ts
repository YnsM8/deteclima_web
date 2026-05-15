import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente Supabase privilegiado para ser usado en el servidor (API Routes / Server Actions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
