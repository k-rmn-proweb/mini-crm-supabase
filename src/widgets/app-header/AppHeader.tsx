import { Menu } from 'lucide-react'
import { useUiStore } from '@/shared/store'
import { Button } from '@/shared/ui'
import { useProfile, useSession } from '@/entities/user'
import { ThemeToggle } from '@/features/theme-toggle'
import { LogoutButton } from '@/features/auth-logout'

export function AppHeader() {
  const { user } = useSession()
  const { data: profile } = useProfile()
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen)
  const name = profile?.full_name || user?.email || 'User'

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </Button>
        <span className="font-heading text-lg font-semibold md:hidden">Mini-CRM</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline">{name}</span>
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  )
}
