import { DashboardKpi } from '@/widgets/dashboard-kpi'
import { DashboardCharts } from '@/widgets/dashboard-charts'
import { RecentActivity } from '@/widgets/dashboard-recent-activity'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
      <DashboardKpi />
      <DashboardCharts />
      <RecentActivity />
    </div>
  )
}
