import { Link, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'
import { LoginForm } from '@/features/auth-login'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your Mini-CRM</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm
          onSuccess={() => {
            navigate({ to: '/' })
          }}
        />
        <p className="text-center text-sm text-muted-foreground">
          No account?{' '}
          <Link to="/register" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
