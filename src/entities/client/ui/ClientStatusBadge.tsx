import { cn } from '@/shared/utils'
import { CLIENT_STATUS_LABELS } from '../model/consts'
import type { ClientStatus } from '../model/types'

const COLORS: Record<ClientStatus, string> = {
  lead: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        COLORS[status],
      )}
    >
      {CLIENT_STATUS_LABELS[status]}
    </span>
  )
}
