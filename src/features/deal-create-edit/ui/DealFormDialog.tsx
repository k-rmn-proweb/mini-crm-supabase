import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils'
import { useClientOptions } from '@/entities/client'
import { DEAL_STAGE_OPTIONS, type CreateDealDto, type Deal, type DealStage } from '@/entities/deal'
import { useCreateDeal } from '../model/useCreateDeal'
import { useUpdateDeal } from '../model/useUpdateDeal'
import { useDeleteDeal } from '../model/useDeleteDeal'
import { dealFormSchema, type DealFormValues } from '../lib/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: Deal
  defaultStage?: DealStage
}

function toFormValues(deal?: Deal, defaultStage?: DealStage): DealFormValues {
  return {
    title: deal?.title ?? '',
    clientId: deal?.client_id ?? '',
    amount: deal ? String(deal.amount) : '',
    stage: deal?.stage ?? defaultStage ?? 'new',
    expectedCloseDate: deal?.expected_close_date ?? '',
  }
}

function toDto(values: DealFormValues): CreateDealDto {
  return {
    title: values.title,
    client_id: values.clientId,
    amount: Number(values.amount),
    stage: values.stage,
    expected_close_date: values.expectedCloseDate || null,
  }
}

export function DealFormDialog({ open, onOpenChange, deal, defaultStage }: Props) {
  const isEdit = Boolean(deal)
  const { data: clients } = useClientOptions()
  const createMutation = useCreateDeal()
  const updateMutation = useUpdateDeal()
  const deleteMutation = useDeleteDeal()
  const active = isEdit ? updateMutation : createMutation

  const values = useMemo(() => toFormValues(deal, defaultStage), [deal, defaultStage])
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    values,
  })

  const submit = handleSubmit((formValues) => {
    const dto = toDto(formValues)
    const close = () => onOpenChange(false)
    if (deal) {
      updateMutation.mutate({ id: deal.id, dto }, { onSuccess: close })
    } else {
      createMutation.mutate(dto, { onSuccess: close })
    }
  })

  const remove = () => {
    if (!deal) {
      return
    }
    deleteMutation.mutate(deal.id, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактировать сделку' : 'Новая сделка'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Измените данные сделки.' : 'Заполните данные новой сделки.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => submit(e)} className="space-y-4" noValidate>
          {active.isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {getErrorMessage(active.error)}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title">Название</Label>
            <Input id="title" aria-invalid={Boolean(errors.title)} {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clientId">Клиент</Label>
            <Controller
              control={control}
              name="clientId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="clientId" className="w-full">
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.clientId && (
              <p className="text-sm text-destructive">{errors.clientId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Сумма</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="1"
                aria-invalid={Boolean(errors.amount)}
                {...register('amount')}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stage">Этап</Label>
              <Controller
                control={control}
                name="stage"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="stage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEAL_STAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expectedCloseDate">Ожидаемая дата закрытия</Label>
            <Input id="expectedCloseDate" type="date" {...register('expectedCloseDate')} />
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {isEdit ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={remove}
                disabled={deleteMutation.isPending}
              >
                Удалить
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={active.isPending}>
                {active.isPending ? 'Сохранение…' : 'Сохранить'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
