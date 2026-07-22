import { useQuery } from '@tanstack/react-query'
import { dealKeys } from '../api/keys'
import { fetchDeals } from '../api/api'

/** Все сделки пользователя — для Kanban-доски. */
export function useDealsQuery() {
  return useQuery({
    queryKey: dealKeys.list(),
    queryFn: fetchDeals,
  })
}
