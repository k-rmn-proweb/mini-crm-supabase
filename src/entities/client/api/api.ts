import { supabase } from '@/shared/api'
import type { Client } from '../model/types'
import type { ClientsPage, ClientsQueryParams, CreateClientDto, UpdateClientDto } from './dto'

/**
 * Серверный список клиентов: поиск (ilike по имени/компании), фильтр по статусу,
 * пагинация (range) и общее число (count). RLS отдаёт только свои записи.
 */
export async function fetchClients(params: ClientsQueryParams): Promise<ClientsPage> {
  const { search, status, page, pageSize } = params
  const from = page * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) {
    query = query.eq('status', status)
  }

  const term = search.replace(/[%,()]/g, ' ').trim()
  if (term) {
    query = query.or(`name.ilike.%${term}%,company.ilike.%${term}%`)
  }

  const { data, error, count } = await query
  if (error) {
    throw error
  }
  return { rows: data, total: count ?? 0 }
}

/** Все клиенты пользователя как опции (id + name) — для выпадающих списков. */
export async function fetchClientOptions(): Promise<Pick<Client, 'id' | 'name'>[]> {
  const { data, error } = await supabase.from('clients').select('id, name').order('name')
  if (error) {
    throw error
  }
  return data
}

/** Один клиент по id. */
export async function fetchClientById(id: string): Promise<Client> {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
  if (error) {
    throw error
  }
  return data
}

/** Создать клиента. user_id проставляется из текущей сессии (совпадает с RLS-политикой). */
export async function createClient(dto: CreateClientDto): Promise<Client> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) {
    throw new Error('Нет активной сессии')
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({ ...dto, user_id: userId })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

/** Обновить клиента. */
export async function updateClient(id: string, dto: UpdateClientDto): Promise<Client> {
  const { data, error } = await supabase.from('clients').update(dto).eq('id', id).select().single()
  if (error) {
    throw error
  }
  return data
}

/** Удалить клиента (каскадно снесёт его сделки и активности). */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) {
    throw error
  }
}
