import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/shared/utils'
import { DealCard, type Deal } from '@/entities/deal'

type Props = {
  deal: Deal
  clientName?: string
  onClick?: () => void
}

export function DraggableDealCard({ deal, clientName, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id })
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn('cursor-grab touch-none active:cursor-grabbing', isDragging && 'opacity-40')}
    >
      <DealCard deal={deal} clientName={clientName} />
    </div>
  )
}
