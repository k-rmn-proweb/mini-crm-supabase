import { Briefcase } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@/shared/ui'
import { formatCurrency } from '@/shared/utils'
import { DealStageBadge, useClientDealsQuery } from '@/entities/deal'

export function ClientDeals({ clientId }: { clientId: string }) {
  const { data: deals, isLoading, isError, refetch } = useClientDealsQuery(clientId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !deals || deals.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No deals"
            description="This client has no deals yet."
          />
        ) : (
          <ul className="divide-y">
            {deals.map((deal) => (
              <li key={deal.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{deal.title}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(deal.amount)}</p>
                </div>
                <DealStageBadge stage={deal.stage} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
