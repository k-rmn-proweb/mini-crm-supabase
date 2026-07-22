import type { TablesInsert, TablesUpdate } from '@/shared/api'

/** Поля, которые проставляет БД/сервер, форму не касаются. */
type ServerManaged = 'id' | 'user_id' | 'created_at' | 'updated_at'

export type CreateClientDto = Omit<TablesInsert<'clients'>, ServerManaged>
export type UpdateClientDto = Omit<TablesUpdate<'clients'>, ServerManaged>
