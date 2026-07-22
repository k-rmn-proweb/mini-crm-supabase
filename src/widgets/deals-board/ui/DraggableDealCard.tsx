import { useDraggable } from '@dnd-kit/core'
import { motion } from 'motion/react'
import { cn } from '@/shared/utils'
import { DealCard, type Deal } from '@/entities/deal'

type Props = {
  deal: Deal
  clientName?: string
  highlighted?: boolean
  onClick?: () => void
}

export function DraggableDealCard({ deal, clientName, highlighted, onClick }: Props) {
  // Визуал перетаскивания даёт DragOverlay, поэтому transform к источнику не применяем —
  // карточка остаётся на месте (приглушённая), а соседи плавно сдвигаются через layout.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id })

  return (
    <motion.div
      layout
      ref={setNodeRef}
      onClick={onClick}
      {...attributes}
      {...listeners}
      className={cn('cursor-grab touch-none active:cursor-grabbing', isDragging && 'opacity-40')}
    >
      <DealCard deal={deal} clientName={clientName} highlighted={highlighted} />
    </motion.div>
  )
}
