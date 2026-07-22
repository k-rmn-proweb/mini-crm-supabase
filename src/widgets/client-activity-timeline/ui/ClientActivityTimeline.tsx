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
import { ActivityItem, useClientActivitiesQuery } from '@/entities/activity'
import { AddActivityForm } from '@/features/activity-add'

export function ClientActivityTimeline({ clientId }: { clientId: string }) {
  const { data: activities, isLoading, isError, refetch } = useClientActivitiesQuery(clientId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Активности</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddActivityForm clientId={clientId} />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !activities || activities.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Нет активностей"
            description="Добавьте первую активность выше."
          />
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
