import { useDroppable } from '@dnd-kit/core'
import { cn, formatCurrency } from '@/shared/utils'
import { DEAL_STAGE_LABELS, type Deal, type DealStage } from '@/entities/deal'
import { DraggableDealCard } from './DraggableDealCard'

type Props = {
  stage: DealStage
  deals: Deal[]
  clientNameById: (id: string) => string | undefined
  highlightedId: string | null
  onCardClick: (deal: Deal) => void
}

export function DealColumn({ stage, deals, clientNameById, highlightedId, onCardClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const sum = deals.reduce((acc, deal) => acc + deal.amount, 0)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg bg-muted/40 p-2 transition-colors',
        isOver && 'bg-muted ring-2 ring-ring/40 ring-inset',
      )}
    >
      <div className="flex items-center justify-between px-1 py-1.5">
        <span className="text-sm font-medium">{DEAL_STAGE_LABELS[stage]}</span>
        <span className="text-xs text-muted-foreground">
          {deals.length} · {formatCurrency(sum)}
        </span>
      </div>
      <div className="flex min-h-24 flex-1 flex-col gap-2">
        {deals.map((deal) => (
          <DraggableDealCard
            key={deal.id}
            deal={deal}
            clientName={clientNameById(deal.client_id)}
            highlighted={deal.id === highlightedId}
            onClick={() => onCardClick(deal)}
          />
        ))}
      </div>
    </div>
  )
}
