import { cn } from '@/shared/utils'
import { DEAL_STAGE_LABELS } from '../model/consts'
import type { DealStage } from '../model/types'

const COLORS: Record<DealStage, string> = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  negotiation: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  lost: 'bg-destructive/10 text-destructive',
}

export function DealStageBadge({ stage }: { stage: DealStage }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        COLORS[stage],
      )}
    >
      {DEAL_STAGE_LABELS[stage]}
    </span>
  )
}
