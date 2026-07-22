import { supabase } from '@/shared/api'
import type { Deal } from '../model/types'

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
