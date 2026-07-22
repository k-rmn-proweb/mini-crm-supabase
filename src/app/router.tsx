import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { queryClient } from '@/shared/lib'
import { ErrorFallback } from '@/shared/ui'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    // Реальную сессию проставит AuthProvider через context у RouterProvider.
    auth: { session: null, user: null, isLoading: true },
    queryClient,
  },
  // Ошибка в роуте (loader/beforeLoad/render) — полноэкранный фолбэк с reset.
  defaultErrorComponent: ({ error, reset }) => <ErrorFallback error={error} onReset={reset} />,
  defaultNotFoundComponent: () => (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-heading text-3xl font-semibold">404</p>
      <p className="text-muted-foreground">Страница не найдена.</p>
      <a href="/" className="text-sm underline underline-offset-4">
        На главную
      </a>
    </div>
  ),
})
