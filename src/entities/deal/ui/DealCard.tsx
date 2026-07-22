import { formatCurrency } from '@/shared/utils'
import type { Deal } from '../model/types'

/** Презентационная карточка сделки (draggable-обёртку добавляет доска). */
export function DealCard({ deal, clientName }: { deal: Deal; clientName?: string }) {
  return (
    <div className="space-y-1 rounded-lg border bg-card p-3 shadow-sm">
      <p className="text-sm font-medium">{deal.title}</p>
      {clientName && <p className="text-xs text-muted-foreground">{clientName}</p>}
      <p className="text-sm font-semibold">{formatCurrency(deal.amount)}</p>
    </div>
  )
}
