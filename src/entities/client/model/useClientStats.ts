import { useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClientStats } from '../api/api'

/** Clients for dashboard aggregates (status + created_at). */
export function useClientStats() {
  return useQuery({
    queryKey: clientKeys.stats(),
    queryFn: fetchClientStats,
  })
}
