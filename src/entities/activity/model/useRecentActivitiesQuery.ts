import { useQuery } from '@tanstack/react-query'
import { activityKeys } from '../api/keys'
import { fetchRecentActivities } from '../api/api'

/** Последние активности по всем клиентам (лента дашборда). */
export function useRecentActivitiesQuery() {
  return useQuery({
    queryKey: activityKeys.recent(),
    queryFn: () => fetchRecentActivities(8),
  })
}
