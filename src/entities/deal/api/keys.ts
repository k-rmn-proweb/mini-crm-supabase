/** Query-ключи сущности deal. */
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  byClient: (clientId: string) => [...dealKeys.all, 'byClient', clientId] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
}
