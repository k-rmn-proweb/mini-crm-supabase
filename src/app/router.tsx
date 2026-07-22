import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { queryClient } from '@/shared/lib'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    // Реальную сессию проставит AuthProvider через context у RouterProvider.
    auth: { session: null, user: null, isLoading: true },
    queryClient,
  },
})
