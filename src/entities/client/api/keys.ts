import type { ClientsQueryParams } from './dto'

/** Query-ключи сущности client (единственное определение). */
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params: ClientsQueryParams) => [...clientKeys.lists(), params] as const,
  options: () => [...clientKeys.all, 'options'] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
}
