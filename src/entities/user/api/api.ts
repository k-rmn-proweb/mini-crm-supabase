import { supabase } from '@/shared/api'
import type { Tables } from '@/shared/api'

/** Current user's profile (RLS returns only their own). */
export async function fetchProfile(userId: string): Promise<Tables<'profiles'>> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) {
    throw error
  }
  return data
}
