import { useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClientById } from '../api/api'

/** Один клиент по id (для карточки клиента). */
export function useClientQuery(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => fetchClientById(id),
  })
}
