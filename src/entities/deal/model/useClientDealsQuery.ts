import { useQuery } from '@tanstack/react-query'
import { dealKeys } from '../api/keys'
import { fetchDealsByClient } from '../api/api'

/** Сделки конкретного клиента (для карточки клиента). */
export function useClientDealsQuery(clientId: string) {
  return useQuery({
    queryKey: dealKeys.byClient(clientId),
    queryFn: () => fetchDealsByClient(clientId),
  })
}
