import { cn, formatCurrency, formatDate } from '@/shared/utils'
import { DEAL_STAGE_COLORS } from '../model/consts'
import type { Deal } from '../model/types'

type Props = {
  deal: Deal
  clientName?: string
  /** Кратковременная подсветка (после перемещения/создания). */
  highlighted?: boolean
}

/** Презентационная карточка сделки (draggable-обёртку добавляет доска). */
export function DealCard({ deal, clientName, highlighted }: Props) {
  return (
    <div
      className={cn(
        'space-y-2 rounded-lg border border-l-[3px] bg-card p-3 shadow-xs transition-all',
        'hover:-translate-y-0.5 hover:shadow-md',
        highlighted && 'ring-2 ring-primary duration-150',
      )}
      style={{ borderLeftColor: DEAL_STAGE_COLORS[deal.stage] }}
    >
      <p className="text-sm leading-snug font-medium">{deal.title}</p>

      {clientName && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">
            {clientName.charAt(0).toUpperCase()}
          </span>
          <span className="truncate">{clientName}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{formatCurrency(deal.amount)}</span>
        {deal.expected_close_date && (
          <span className="text-xs text-muted-foreground">
            {formatDate(deal.expected_close_date)}
          </span>
        )}
      </div>
    </div>
  )
}
