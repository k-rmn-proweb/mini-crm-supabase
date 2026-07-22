import { useSession } from '@/entities/user'
import { useClientsRealtime } from '@/entities/client'
import { useDealsRealtime } from '@/entities/deal'
import { useActivitiesRealtime } from '@/entities/activity'

/** Headless component: enables Realtime subscriptions for the current user's data. */
export function RealtimeSync() {
  const { user } = useSession()
  useClientsRealtime(user?.id)
  useDealsRealtime(user?.id)
  useActivitiesRealtime(user?.id)
  return null
}
