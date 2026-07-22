import { supabase } from '@/shared/api'
import type { Deal, DealStage } from '../model/types'
import type { CreateDealDto, UpdateDealDto } from './dto'

/** Все сделки пользователя (для Kanban-доски), новые сверху. */
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

/** Сделки клиента, новые сверху. */
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

/** Создать сделку. user_id проставляется из текущей сессии. */
export async function createDeal(dto: CreateDealDto): Promise<Deal> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) {
    throw new Error('Нет активной сессии')
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

/** Обновить сделку. */
export async function updateDeal(id: string, dto: UpdateDealDto): Promise<Deal> {
  const { data, error } = await supabase.from('deals').update(dto).eq('id', id).select().single()
  if (error) {
    throw error
  }
  return data
}

/** Сменить этап сделки (drag&drop в воронке). */
export async function updateDealStage(id: string, stage: DealStage): Promise<Deal> {
  return updateDeal(id, { stage })
}

/** Удалить сделку. */
export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) {
    throw error
  }
}
