import { CircleDollarSign, Trophy, UserCheck, Users, type LucideIcon } from 'lucide-react'
import { Card, CardContent, ErrorState, Skeleton } from '@/shared/ui'
import { cn, formatCurrency } from '@/shared/utils'
import { useClientStats } from '@/entities/client'
import { useDealsQuery } from '@/entities/deal'

type Kpi = { label: string; value: string | number; icon: LucideIcon; color: string }

export function DashboardKpi() {
  const clients = useClientStats()
  const deals = useDealsQuery()

  if (clients.isLoading || deals.isLoading) {
    return <KpiSkeleton />
  }
  if (clients.isError || deals.isError) {
    return (
      <ErrorState
        onRetry={() => {
          clients.refetch()
          deals.refetch()
        }}
      />
    )
  }

  const clientList = clients.data ?? []
  const dealList = deals.data ?? []
  const openSum = dealList
    .filter((deal) => deal.stage === 'new' || deal.stage === 'negotiation')
    .reduce((sum, deal) => sum + deal.amount, 0)
  const wonSum = dealList
    .filter((deal) => deal.stage === 'won')
    .reduce((sum, deal) => sum + deal.amount, 0)

  const items: Kpi[] = [
    {
      label: 'Total clients',
      value: clientList.length,
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active clients',
      value: clientList.filter((client) => client.status === 'active').length,
      icon: UserCheck,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Open deals',
      value: formatCurrency(openSum),
      icon: CircleDollarSign,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Won deals',
      value: formatCurrency(wonSum),
      icon: Trophy,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-heading text-2xl font-semibold">{value}</p>
            </div>
            <div
              className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', color)}
            >
              <Icon className="size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  )
}
