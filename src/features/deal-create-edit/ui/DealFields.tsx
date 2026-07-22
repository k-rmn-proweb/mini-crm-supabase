import { Controller, type UseFormReturn } from 'react-hook-form'
import {
  DatePicker,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import { useClientOptions } from '@/entities/client'
import { DEAL_STAGE_OPTIONS } from '@/entities/deal'
import type { DealFormValues } from '../lib/schema'

/** Поля формы сделки — общие для диалога создания и drawer'а редактирования. */
export function DealFields({ form }: { form: UseFormReturn<DealFormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form
  const { data: clients } = useClientOptions()

  return (
    <>
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
        {errors.clientId && <p className="text-sm text-destructive">{errors.clientId.message}</p>}
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
        <Controller
          control={control}
          name="expectedCloseDate"
          render={({ field }) => (
            <DatePicker id="expectedCloseDate" value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </>
  )
}
