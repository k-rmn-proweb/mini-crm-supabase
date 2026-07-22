import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils'
import type { Deal, DealStage } from '@/entities/deal'
import { useCreateDeal } from '../model/useCreateDeal'
import { dealFormSchema, type DealFormValues } from '../lib/schema'
import { toDealDto, toDealFormValues } from '../lib/mappers'
import { DealFields } from './DealFields'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStage?: DealStage
  /** Вызывается с созданной сделкой (для подсветки на доске). */
  onSaved?: (deal: Deal) => void
}

export function DealFormDialog({ open, onOpenChange, defaultStage, onSaved }: Props) {
  const createMutation = useCreateDeal()

  const values = useMemo(() => toDealFormValues(undefined, defaultStage), [defaultStage])
  const form = useForm<DealFormValues>({ resolver: zodResolver(dealFormSchema), values })

  const submit = form.handleSubmit((formValues) => {
    createMutation.mutate(toDealDto(formValues), {
      onSuccess: (created) => {
        onOpenChange(false)
        onSaved?.(created)
      },
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая сделка</DialogTitle>
          <DialogDescription>Заполните данные новой сделки.</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => submit(e)} className="space-y-4" noValidate>
          {createMutation.isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {getErrorMessage(createMutation.error)}
            </p>
          )}

          <DealFields form={form} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Сохранение…' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
