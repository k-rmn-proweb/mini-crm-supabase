import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui'
import { NAV_ITEMS } from '../model/nav'

type Props = {
  /** Свёрнутый режим: только иконки + тултипы. */
  collapsed?: boolean
  /** Вызывается при клике по пункту (например, закрыть мобильный drawer). */
  onNavigate?: () => void
}

export function SidebarNav({ collapsed = false, onNavigate }: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
          const link = (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              activeOptions={{ exact }}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent',
                collapsed && 'justify-center px-0',
              )}
              activeProps={{
                className: 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
              }}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          )

          if (!collapsed) {
            return link
          }

          return (
            <Tooltip key={to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}
