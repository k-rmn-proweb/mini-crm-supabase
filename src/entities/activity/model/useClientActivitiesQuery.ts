import { useQuery } from '@tanstack/react-query'
import { activityKeys } from '../api/keys'
import { fetchActivitiesByClient } from '../api/api'

/** Активности конкретного клиента (для ленты на карточке). */
export function useClientActivitiesQuery(clientId: string) {
  return useQuery({
    queryKey: activityKeys.byClient(clientId),
    queryFn: () => fetchActivitiesByClient(clientId),
  })
}
