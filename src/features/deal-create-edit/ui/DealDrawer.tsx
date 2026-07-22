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
import { getErrorMessage } from '@/shared/utils'
import type { Deal } from '@/entities/deal'
import { useCreateDeal } from '../model/useCreateDeal'
import { useUpdateDeal } from '../model/useUpdateDeal'
import { useDeleteDeal } from '../model/useDeleteDeal'
import { dealFormSchema, type DealFormValues } from '../lib/schema'
import { toDealDto, toDealFormValues } from '../lib/mappers'
import { DealFields } from './DealFields'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** With a deal — edit mode; without — create mode. */
  deal?: Deal
  /** Called with the created deal (to highlight it on the board). */
  onSaved?: (deal: Deal) => void
}

/** Create and edit a deal in the right-hand drawer. */
export function DealDrawer({ open, onOpenChange, deal, onSaved }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="gap-0 p-0 sm:max-w-md">
        {deal ? (
          <DealEditForm key={deal.id} deal={deal} onClose={() => onOpenChange(false)} />
        ) : (
          <DealCreateForm onClose={() => onOpenChange(false)} onSaved={onSaved} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function DealCreateForm({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved?: (deal: Deal) => void
}) {
  const createMutation = useCreateDeal()
  const values = useMemo(() => toDealFormValues(undefined), [])
  const form = useForm<DealFormValues>({ resolver: zodResolver(dealFormSchema), values })

  const submit = form.handleSubmit((formValues) => {
    createMutation.mutate(toDealDto(formValues), {
      onSuccess: (created) => {
        onClose()
        onSaved?.(created)
      },
    })
  })

  return (
    <>
      <SheetHeader className="flex-row items-center justify-between gap-2 space-y-0 border-b">
        <SheetTitle>New deal</SheetTitle>
        <SheetDescription className="sr-only">Deal creation form.</SheetDescription>
        <SheetClose asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Close">
            <X />
          </Button>
        </SheetClose>
      </SheetHeader>

      <form
        id="deal-create-form"
        onSubmit={(e) => submit(e)}
        className="flex-1 space-y-4 overflow-y-auto p-4"
        noValidate
      >
        {createMutation.isError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {getErrorMessage(createMutation.error)}
          </p>
        )}
        <DealFields form={form} />
      </form>

      <SheetFooter className="flex-row justify-end gap-2 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="deal-create-form" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating…' : 'Create'}
        </Button>
      </SheetFooter>
    </>
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

  // Keep the latest save function in a ref so the subscription isn't recreated.
  const saveRef = useRef((formValues: DealFormValues) => {
    updateMutation.mutate({ id: deal.id, dto: toDealDto(formValues) })
  })
  saveRef.current = (formValues) => {
    updateMutation.mutate({ id: deal.id, dto: toDealDto(formValues) })
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    // Standard RHF subscription for auto-save; watch is stable inside the effect.
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
        <SheetTitle>Edit deal</SheetTitle>
        <SheetDescription className="sr-only">Changes are saved automatically.</SheetDescription>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            onClick={remove}
            disabled={deleteMutation.isPending}
            aria-label="Delete deal"
          >
            <Trash2 />
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close">
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
          {updateMutation.isPending ? 'Saving…' : 'Changes are saved automatically'}
        </p>
      </SheetFooter>
    </>
  )
}
