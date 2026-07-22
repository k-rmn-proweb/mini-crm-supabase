import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/shared/api'
import { AppSidebar } from '@/widgets/app-sidebar'
import { AppHeader } from '@/widgets/app-header'

/** Защищённая зона. Нет сессии — на /login. Сессию читаем напрямую (race-free). */
export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
