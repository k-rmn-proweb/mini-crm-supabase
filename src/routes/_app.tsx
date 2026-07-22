import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/shared/api'
import { AppSidebar, MobileSidebar } from '@/widgets/app-sidebar'
import { AppHeader } from '@/widgets/app-header'
import { RealtimeSync } from '@/widgets/realtime-sync'

/** Protected area. No session — go to /login. We read the session directly (race-free). */
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
      <RealtimeSync />
      <AppSidebar />
      <MobileSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
