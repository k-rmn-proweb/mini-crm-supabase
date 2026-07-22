import { supabase } from '@/shared/api'
import type { Deal, DealStage } from '../model/types'
import type { CreateDealDto, UpdateDealDto } from './dto'

/** All user deals (for the Kanban board), newest first. */
export async function fetchDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    throw error
  }
  return data
}

/** Client deals, newest first. */
export async function fetchDealsByClient(clientId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) {
    throw error
  }
  return data
}

/** Create a deal. user_id is set from the current session. */
export async function createDeal(dto: CreateDealDto): Promise<Deal> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) {
    throw new Error('No active session')
  }

  const { data, error } = await supabase
    .from('deals')
    .insert({ ...dto, user_id: userId })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

/** Update a deal. */
export async function updateDeal(id: string, dto: UpdateDealDto): Promise<Deal> {
  const { data, error } = await supabase.from('deals').update(dto).eq('id', id).select().single()
  if (error) {
    throw error
  }
  return data
}

/** Change deal stage (drag & drop in the pipeline). */
export async function updateDealStage(id: string, stage: DealStage): Promise<Deal> {
  return updateDeal(id, { stage })
}

/** Delete a deal. */
export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) {
    throw error
  }
}
