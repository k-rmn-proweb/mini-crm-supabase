import { cn, formatCurrency } from '@/shared/utils'
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
        'space-y-1 rounded-lg border bg-card p-3 shadow-sm transition-shadow duration-500',
        highlighted && 'ring-2 ring-primary duration-150',
      )}
    >
      <p className="text-sm font-medium">{deal.title}</p>
      {clientName && <p className="text-xs text-muted-foreground">{clientName}</p>}
      <p className="text-sm font-semibold">{formatCurrency(deal.amount)}</p>
    </div>
  )
}
