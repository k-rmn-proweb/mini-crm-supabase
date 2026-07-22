import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/config'
import type { Database } from './database.types'

/**
 * Единый типизированный Supabase-клиент.
 * Anon key публичный — безопасность обеспечивается через RLS на стороне БД.
 */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
