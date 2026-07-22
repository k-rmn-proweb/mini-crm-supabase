import { type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, ErrorState, Skeleton } from '@/shared/ui'
import { CLIENT_STATUS_LABELS, useClientStats, type ClientStatus } from '@/entities/client'
import { DEAL_STAGES, DEAL_STAGE_COLORS, DEAL_STAGE_LABELS, useDealsQuery } from '@/entities/deal'

const STATUS_COLORS: Record<ClientStatus, string> = {
  lead: '#3b82f6',
  active: '#10b981',
  inactive: '#94a3b8',
}

const tooltipStyle = {
  background: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--popover-foreground)',
}

const axisTick = { fontSize: 12, fill: 'var(--muted-foreground)' }

function newClientsByMonth(clients: { created_at: string }[], monthsBack = 6) {
  const base = new Date()
  const months = Array.from({ length: monthsBack }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth() - (monthsBack - 1 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      count: 0,
    }
  })
  for (const client of clients) {
    const d = new Date(client.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const month = months.find((m) => m.key === key)
    if (month) {
      month.count += 1
    }
  }
  return months
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">{children}</div>
      </CardContent>
    </Card>
  )
}

export function DashboardCharts() {
  const clients = useClientStats()
  const deals = useDealsQuery()

  if (clients.isLoading || deals.isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    )
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

  const statusData = (['lead', 'active', 'inactive'] as ClientStatus[])
    .map((status) => ({
      name: CLIENT_STATUS_LABELS[status],
      value: clientList.filter((client) => client.status === status).length,
      fill: STATUS_COLORS[status],
    }))
    .filter((entry) => entry.value > 0)

  const stageData = DEAL_STAGES.map((stage) => ({
    name: DEAL_STAGE_LABELS[stage],
    count: dealList.filter((deal) => deal.stage === stage).length,
    fill: DEAL_STAGE_COLORS[stage],
  }))

  const monthData = newClientsByMonth(clientList)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Deals by stage">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
            <Bar dataKey="count" name="Deals" radius={[6, 6, 0, 0]}>
              {stageData.map((entry) => (
                // Cell is the standard way to color per-entry; only deprecated in Recharts 4
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Clients by status">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="New clients by month">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="count"
              name="New clients"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
