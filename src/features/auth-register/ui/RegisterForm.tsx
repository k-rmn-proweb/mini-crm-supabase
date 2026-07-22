import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils'
import { useRegister } from '../model/useRegister'
import { registerSchema, type RegisterValues } from '../lib/schema'

function toFriendly(error: unknown): string {
  const message = getErrorMessage(error)
  if (message.includes('already registered')) {
    return 'A user with this email already exists'
  }
  return message
}

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  const submit = handleSubmit((values) => {
    registerMutation.mutate(values, { onSuccess })
  })

  return (
    <form onSubmit={(e) => submit(e)} className="space-y-4" noValidate>
      {registerMutation.isError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {toFriendly(registerMutation.error)}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Name</Label>
        <Input
          id="fullName"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          {...register('fullName')}
        />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating account…' : 'Sign up'}
      </Button>
    </form>
  )
}
