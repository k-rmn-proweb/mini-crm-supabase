import { supabase } from '@/shared/api'
import type { Client } from '../model/types'
import type { ClientsPage, ClientsQueryParams, CreateClientDto, UpdateClientDto } from './dto'

/**
 * Server-side client list: search (ilike on name/company), status filter,
 * pagination (range) and total count. RLS returns only the user's own records.
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

/** All user clients as options (id + name) — for dropdowns. */
export async function fetchClientOptions(): Promise<Pick<Client, 'id' | 'name'>[]> {
  const { data, error } = await supabase.from('clients').select('id, name').order('name')
  if (error) {
    throw error
  }
  return data
}

/** Clients for dashboard aggregates (only status + created_at). */
export async function fetchClientStats(): Promise<Pick<Client, 'id' | 'status' | 'created_at'>[]> {
  const { data, error } = await supabase.from('clients').select('id, status, created_at')
  if (error) {
    throw error
  }
  return data
}

/** A single client by id. */
export async function fetchClientById(id: string): Promise<Client> {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
  if (error) {
    throw error
  }
  return data
}

/** Create a client. user_id is set from the current session (matches the RLS policy). */
export async function createClient(dto: CreateClientDto): Promise<Client> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) {
    throw new Error('No active session')
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

/** Update a client. */
export async function updateClient(id: string, dto: UpdateClientDto): Promise<Client> {
  const { data, error } = await supabase.from('clients').update(dto).eq('id', id).select().single()
  if (error) {
    throw error
  }
  return data
}

/** Delete a client (cascades to their deals and activities). */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) {
    throw error
  }
}
