import { supabase } from '@/shared/api'
import type { Client } from '../model/types'
import type { CreateClientDto, UpdateClientDto } from './dto'

/** Список клиентов пользователя (RLS отдаёт только свои), новые сверху. */
export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Один клиент по id. */
export async function fetchClientById(id: string): Promise<Client> {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/** Создать клиента. user_id проставляется из текущей сессии (совпадает с RLS-политикой). */
export async function createClient(dto: CreateClientDto): Promise<Client> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('Нет активной сессии')

  const { data, error } = await supabase
    .from('clients')
    .insert({ ...dto, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Обновить клиента. */
export async function updateClient(id: string, dto: UpdateClientDto): Promise<Client> {
  const { data, error } = await supabase.from('clients').update(dto).eq('id', id).select().single()
  if (error) throw error
  return data
}

/** Удалить клиента (каскадно снесёт его сделки и активности). */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}
