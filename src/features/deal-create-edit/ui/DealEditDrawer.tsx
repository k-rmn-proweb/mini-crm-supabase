import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, X } from 'lucide-react'
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui'
import type { Deal } from '@/entities/deal'
import { useUpdateDeal } from '../model/useUpdateDeal'
import { useDeleteDeal } from '../model/useDeleteDeal'
import { dealFormSchema, type DealFormValues } from '../lib/schema'
import { toDealDto, toDealFormValues } from '../lib/mappers'
import { DealFields } from './DealFields'

type Props = {
  deal: Deal | null
  onOpenChange: (open: boolean) => void
}

/** Редактирование сделки в правом drawer'е с авто-сохранением. */
export function DealEditDrawer({ deal, onOpenChange }: Props) {
  return (
    <Sheet open={deal !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="gap-0 p-0 sm:max-w-md">
        {deal && <DealEditForm key={deal.id} deal={deal} onClose={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function DealEditForm({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const updateMutation = useUpdateDeal()
  const deleteMutation = useDeleteDeal()

  const values = useMemo(() => toDealFormValues(deal), [deal])
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    values,
    mode: 'onChange',
  })

  // Актуальная функция сохранения — через ref, чтобы подписка не пересоздавалась.
  const saveRef = useRef((formValues: DealFormValues) => {
    updateMutation.mutate({ id: deal.id, dto: toDealDto(formValues) })
  })
  saveRef.current = (formValues) => {
    updateMutation.mutate({ id: deal.id, dto: toDealDto(formValues) })
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    // Стандартная RHF-подписка для авто-сохранения; watch стабилен внутри эффекта.
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = form.watch((formValues, { type }) => {
      if (type !== 'change') {
        return
      }
      const parsed = dealFormSchema.safeParse(formValues)
      if (!parsed.success) {
        return
      }
      clearTimeout(timer)
      timer = setTimeout(() => saveRef.current(parsed.data), 600)
    })
    return () => {
      sub.unsubscribe()
      clearTimeout(timer)
    }
  }, [form])

  const remove = () => {
    deleteMutation.mutate(deal.id, { onSuccess: onClose })
  }

  return (
    <>
      <SheetHeader className="flex-row items-center justify-between gap-2 space-y-0 border-b">
        <SheetTitle>Редактировать сделку</SheetTitle>
        <SheetDescription className="sr-only">
          Изменения сохраняются автоматически.
        </SheetDescription>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            onClick={remove}
            disabled={deleteMutation.isPending}
            aria-label="Удалить сделку"
          >
            <Trash2 />
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Закрыть">
              <X />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <DealFields form={form} />
      </div>

      <SheetFooter className="border-t">
        <p className="text-xs text-muted-foreground">
          {updateMutation.isPending ? 'Сохранение…' : 'Изменения сохраняются автоматически'}
        </p>
      </SheetFooter>
    </>
  )
}
