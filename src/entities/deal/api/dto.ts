import type { TablesInsert, TablesUpdate } from '@/shared/api'

type ServerManaged = 'id' | 'user_id' | 'created_at' | 'updated_at'

export type CreateDealDto = Omit<TablesInsert<'deals'>, ServerManaged>
export type UpdateDealDto = Omit<TablesUpdate<'deals'>, ServerManaged>
