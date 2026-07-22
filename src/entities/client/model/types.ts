import type { Enums, Tables } from '@/shared/api'

/** Client domain type. */
export type Client = Tables<'clients'>

/** Client status: 'lead' | 'active' | 'inactive'. */
export type ClientStatus = Enums<'client_status'>
