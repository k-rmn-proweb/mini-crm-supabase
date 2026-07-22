import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/ui'
import { ACTIVITY_TYPE_OPTIONS, type CreateActivityDto } from '@/entities/activity'
import { useCreateActivity } from '../model/useCreateActivity'
import { activityFormSchema, type ActivityFormValues } from '../lib/schema'

export function AddActivityForm({ clientId }: { clientId: string }) {
  const create = useCreateActivity(clientId)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: { type: 'note', content: '' },
  })

  const submit = handleSubmit((values) => {
    const dto: CreateActivityDto = {
      client_id: clientId,
      type: values.type,
      content: values.content,
    }
    create.mutate(dto, {
      onSuccess: () => reset({ type: values.type, content: '' }),
    })
  })

  return (
    <form onSubmit={(e) => submit(e)} className="space-y-2" noValidate>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Textarea
        {...register('content')}
        placeholder="Что произошло? (звонок, письмо, встреча…)"
        rows={2}
        aria-invalid={Boolean(errors.content)}
      />
      {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={create.isPending}>
          {create.isPending ? 'Добавление…' : 'Добавить'}
        </Button>
      </div>
    </form>
  )
}
