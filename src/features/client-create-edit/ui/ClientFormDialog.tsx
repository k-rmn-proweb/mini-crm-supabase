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
import { CLIENT_STATUS_OPTIONS, type Client, type CreateClientDto } from '@/entities/client'
import { useCreateClient } from '../model/useCreateClient'
import { useUpdateClient } from '../model/useUpdateClient'
import { clientFormSchema, type ClientFormValues } from '../lib/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
}

function toFormValues(client?: Client): ClientFormValues {
  return {
    name: client?.name ?? '',
    company: client?.company ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    status: client?.status ?? 'lead',
  }
}

function toDto(values: ClientFormValues): CreateClientDto {
  return {
    name: values.name,
    company: values.company || null,
    email: values.email || null,
    phone: values.phone || null,
    status: values.status,
  }
}

export function ClientFormDialog({ open, onOpenChange, client }: Props) {
  const isEdit = Boolean(client)
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const active = isEdit ? updateMutation : createMutation

  const values = useMemo(() => toFormValues(client), [client])
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    values,
  })

  const submit = handleSubmit((formValues) => {
    const dto = toDto(formValues)
    const close = () => {
      onOpenChange(false)
    }
    if (client) {
      updateMutation.mutate({ id: client.id, dto }, { onSuccess: close })
    } else {
      createMutation.mutate(dto, { onSuccess: close })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit client' : 'New client'}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the client's details." : "Fill in the new client's details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => submit(e)} className="space-y-4" noValidate>
          {active.isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {getErrorMessage(active.error)}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register('company')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={active.isPending}>
              {active.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
