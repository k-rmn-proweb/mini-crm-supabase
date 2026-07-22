import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Users, Briefcase } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { to: '/clients', label: 'Клиенты', icon: Users, exact: false },
  { to: '/deals', label: 'Сделки', icon: Briefcase, exact: false },
] as const

export function AppSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-sidebar md:block">
      <div className="flex h-14 items-center px-4 font-heading text-lg font-semibold">Mini-CRM</div>
      <nav className="space-y-1 px-2">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            activeProps={{
              className: 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
            }}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
