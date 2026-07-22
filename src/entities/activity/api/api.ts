import { supabase } from '@/shared/api'
import type { Activity } from '../model/types'
import type { CreateActivityDto } from './dto'

/** Client activities, newest first. */
export async function fetchActivitiesByClient(clientId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) {
    throw error
  }
  return data
}

/** Recent activities across all clients (dashboard feed). */
export async function fetchRecentActivities(limit = 8): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    throw error
  }
  return data
}

/** Create an activity. user_id is set from the current session. */
export async function createActivity(dto: CreateActivityDto): Promise<Activity> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) {
    throw new Error('No active session')
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({ ...dto, user_id: userId })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}
