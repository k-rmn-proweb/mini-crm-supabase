import { useQuery } from '@tanstack/react-query'
import { activityKeys } from '../api/keys'
import { fetchActivitiesByClient } from '../api/api'

/** Activities of a specific client (for the feed on the card). */
export function useClientActivitiesQuery(clientId: string) {
  return useQuery({
    queryKey: activityKeys.byClient(clientId),
    queryFn: () => fetchActivitiesByClient(clientId),
  })
}
