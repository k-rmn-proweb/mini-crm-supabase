import { useMemo } from 'react'
import { MessageSquare } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@/shared/ui'
import { useClientOptions } from '@/entities/client'
import { ActivityItem, useRecentActivitiesQuery } from '@/entities/activity'

export function RecentActivity() {
  const { data: activities, isLoading, isError, refetch } = useRecentActivitiesQuery()
  const { data: clients } = useClientOptions()

  const nameById = useMemo(
    () => new Map((clients ?? []).map((client) => [client.id, client.name])),
    [clients],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние активности</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !activities || activities.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Нет активностей"
            description="Активности появятся, когда вы их добавите клиентам."
          />
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                clientName={nameById.get(activity.client_id)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
