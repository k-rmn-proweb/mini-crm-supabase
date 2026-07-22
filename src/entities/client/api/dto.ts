import type { TablesInsert, TablesUpdate } from '@/shared/api'
import type { Client, ClientStatus } from '../model/types'

/** Поля, которые проставляет БД/сервер, форму не касаются. */
type ServerManaged = 'id' | 'user_id' | 'created_at' | 'updated_at'

export type CreateClientDto = Omit<TablesInsert<'clients'>, ServerManaged>
export type UpdateClientDto = Omit<TablesUpdate<'clients'>, ServerManaged>

/** Параметры серверного списка клиентов (поиск/фильтр/страница). */
export type ClientsQueryParams = {
  search: string
  status?: ClientStatus
  page: number
  pageSize: number
}

/** Страница списка клиентов + общее число (для пагинации). */
export type ClientsPage = {
  rows: Client[]
  total: number
}
