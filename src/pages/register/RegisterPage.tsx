import { Link, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'
import { RegisterForm } from '@/features/auth-register'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Создайте аккаунт Mini-CRM</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm
          onSuccess={() => {
            void navigate({ to: '/' })
          }}
        />
        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
