import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/config'
import type { Database } from './database.types'

/**
 * Single typed Supabase client.
 * The anon key is public — security is enforced via RLS on the database side.
 */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
