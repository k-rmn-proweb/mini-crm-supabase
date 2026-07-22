import { Briefcase, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

export type NavItem = {
  to: '/' | '/clients' | '/deals'
  label: string
  icon: LucideIcon
  exact: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/clients', label: 'Clients', icon: Users, exact: false },
  { to: '/deals', label: 'Deals', icon: Briefcase, exact: false },
]
