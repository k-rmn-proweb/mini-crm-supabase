import type { TablesInsert } from '@/shared/api'

type ServerManaged = 'id' | 'user_id' | 'created_at'

export type CreateActivityDto = Omit<TablesInsert<'activities'>, ServerManaged>
