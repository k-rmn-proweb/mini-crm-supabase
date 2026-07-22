import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils'
import { useLogin } from '../model/useLogin'
import { loginSchema, type LoginValues } from '../lib/schema'
import { DEMO_CREDENTIALS } from '../lib/consts'

function toFriendly(error: unknown): string {
  const message = getErrorMessage(error)
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password'
  }
  return message
}

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit((values) => {
    login.mutate(values, { onSuccess })
  })

  const loginAsDemo = () => {
    login.mutate(DEMO_CREDENTIALS, { onSuccess })
  }

  return (
    <form onSubmit={(e) => submit(e)} className="space-y-4" noValidate>
      {login.isError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {toFriendly(login.error)}
        </p>
      )}

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
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={loginAsDemo}
        disabled={login.isPending}
      >
        Log in as demo
      </Button>
    </form>
  )
}
