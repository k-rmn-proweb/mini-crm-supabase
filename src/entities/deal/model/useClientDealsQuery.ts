import { useQuery } from '@tanstack/react-query'
import { dealKeys } from '../api/keys'
import { fetchDealsByClient } from '../api/api'

/** Deals of a specific client (for the client card). */
export function useClientDealsQuery(clientId: string) {
  return useQuery({
    queryKey: dealKeys.byClient(clientId),
    queryFn: () => fetchDealsByClient(clientId),
  })
}
