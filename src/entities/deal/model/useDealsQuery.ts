import { useQuery } from '@tanstack/react-query'
import { dealKeys } from '../api/keys'
import { fetchDeals } from '../api/api'

/** All user deals — for the Kanban board. */
export function useDealsQuery() {
  return useQuery({
    queryKey: dealKeys.list(),
    queryFn: fetchDeals,
  })
}
