import { useEffect } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { ErrorBoundary } from '@/shared/ui'
import { useApplyTheme } from '@/shared/hooks'
import { AuthProvider, useAuth } from '@/entities/user'
import { AppProviders } from './providers'
import { router } from './router'

function InnerApp() {
  const auth = useAuth()
  const userId = auth.session?.user.id

  useEffect(() => {
    // При смене пользователя (login/logout) пересчитать гварды роутов.
    router.invalidate()
  }, [userId])

  if (auth.isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Загрузка…
      </div>
    )
  }

  return <RouterProvider router={router} context={{ auth }} />
}

export function App() {
  useApplyTheme()

  return (
    <ErrorBoundary>
      <AppProviders>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </AppProviders>
    </ErrorBoundary>
  )
}
