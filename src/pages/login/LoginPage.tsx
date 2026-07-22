import { Link, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'
import { LoginForm } from '@/features/auth-login'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription>Войдите в свой Mini-CRM</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm
          onSuccess={() => {
            void navigate({ to: '/' })
          }}
        />
        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-foreground underline underline-offset-4">
            Зарегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
