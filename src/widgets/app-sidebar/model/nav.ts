import { Briefcase, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

export type NavItem = {
  to: '/' | '/clients' | '/deals'
  label: string
  icon: LucideIcon
  exact: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { to: '/clients', label: 'Клиенты', icon: Users, exact: false },
  { to: '/deals', label: 'Сделки', icon: Briefcase, exact: false },
]
