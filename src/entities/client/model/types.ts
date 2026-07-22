import type { Enums, Tables } from '@/shared/api'

/** Доменный тип клиента. */
export type Client = Tables<'clients'>

/** Статус клиента: 'lead' | 'active' | 'inactive'. */
export type ClientStatus = Enums<'client_status'>
