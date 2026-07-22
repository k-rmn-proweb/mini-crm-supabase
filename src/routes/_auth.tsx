import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/shared/api'

/** Public area (login/register). If already signed in — go to the dashboard. */
export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Outlet />
    </div>
  )
}
