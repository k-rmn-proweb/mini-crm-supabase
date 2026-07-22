import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useUiStore } from '@/shared/store'
import { cn } from '@/shared/utils'
import { Button } from '@/shared/ui'
import { SidebarNav } from './SidebarNav'

/** Десктопный сайдбар: сворачивается до иконок. Скрыт на мобиле (< md). */
export function AppSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebarCollapsed)

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      <div className={cn('flex h-14 items-center px-4', collapsed && 'justify-center px-0')}>
        {!collapsed && <span className="font-heading text-lg font-semibold">Mini-CRM</span>}
      </div>

      <SidebarNav collapsed={collapsed} />

      <div className={cn('mt-auto p-2', collapsed && 'flex justify-center')}>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggle}
          aria-label={collapsed ? 'Развернуть сайдбар' : 'Свернуть сайдбар'}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>
    </aside>
  )
}
