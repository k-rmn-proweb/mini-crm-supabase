import { useQuery } from '@tanstack/react-query'
import { activityKeys } from '../api/keys'
import { fetchRecentActivities } from '../api/api'

/** Recent activities across all clients (dashboard feed). */
export function useRecentActivitiesQuery() {
  return useQuery({
    queryKey: activityKeys.recent(),
    queryFn: () => fetchRecentActivities(8),
  })
}
