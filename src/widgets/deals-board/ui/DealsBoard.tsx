import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button, ErrorState, Skeleton } from '@/shared/ui'
import { useClientOptions } from '@/entities/client'
import { DealCard, DEAL_STAGES, useDealsQuery, type Deal, type DealStage } from '@/entities/deal'
import { DealFormDialog } from '@/features/deal-create-edit'
import { useUpdateDealStage } from '@/features/deal-change-stage'
import { DealColumn } from './DealColumn'

type DialogState = { open: boolean; deal?: Deal }

export function DealsBoard() {
  const { data: deals, isLoading, isError, refetch } = useDealsQuery()
  const { data: clients } = useClientOptions()
  const updateStage = useUpdateDealStage()

  const [dialog, setDialog] = useState<DialogState>({ open: false })
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const highlight = (id: string) => {
    setHighlightedId(id)
    clearTimeout(highlightTimer.current)
    highlightTimer.current = setTimeout(() => setHighlightedId(null), 1200)
  }
  useEffect(() => () => clearTimeout(highlightTimer.current), [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const clientNameById = useMemo(() => {
    const map = new Map((clients ?? []).map((client) => [client.id, client.name]))
    return (id: string) => map.get(id)
  }, [clients])

  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = { new: [], negotiation: [], won: [], lost: [] }
    for (const deal of deals ?? []) {
      grouped[deal.stage].push(deal)
    }
    return grouped
  }, [deals])

  if (isLoading) {
    return <BoardSkeleton />
  }
  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  const onDragStart = (event: DragStartEvent) => {
    setActiveDeal((deals ?? []).find((deal) => deal.id === event.active.id) ?? null)
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null)
    const overId = event.over?.id
    if (overId === undefined) {
      return
    }
    const deal = (deals ?? []).find((item) => item.id === event.active.id)
    if (!deal || deal.stage === overId) {
      return
    }
    updateStage.mutate({ id: deal.id, stage: overId as DealStage })
    highlight(deal.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Сделки</h1>
        <Button onClick={() => setDialog({ open: true })}>
          <Plus />
          Добавить сделку
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-2">
          {DEAL_STAGES.map((stage) => (
            <DealColumn
              key={stage}
              stage={stage}
              deals={dealsByStage[stage]}
              clientNameById={clientNameById}
              highlightedId={highlightedId}
              onCardClick={(deal) => setDialog({ open: true, deal })}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDeal ? (
            <DealCard deal={activeDeal} clientName={clientNameById(activeDeal.client_id)} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealFormDialog
        open={dialog.open}
        deal={dialog.deal}
        onSaved={(deal) => highlight(deal.id)}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
      />
    </div>
  )
}

function BoardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-72 shrink-0" />
        ))}
      </div>
    </div>
  )
}
