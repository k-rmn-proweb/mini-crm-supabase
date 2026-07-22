import type { TablesInsert, TablesUpdate } from '@/shared/api'
import type { Client, ClientStatus } from '../model/types'

/** Fields set by the DB/server; not touched by the form. */
type ServerManaged = 'id' | 'user_id' | 'created_at' | 'updated_at'

export type CreateClientDto = Omit<TablesInsert<'clients'>, ServerManaged>
export type UpdateClientDto = Omit<TablesUpdate<'clients'>, ServerManaged>

/** Server-side client list parameters (search/filter/page). */
export type ClientsQueryParams = {
  search: string
  status?: ClientStatus
  page: number
  pageSize: number
}

/** A page of the client list + total count (for pagination). */
export type ClientsPage = {
  rows: Client[]
  total: number
}
