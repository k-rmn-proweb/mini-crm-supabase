import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useLogout } from '../model/useLogout'

export function LogoutButton() {
  const navigate = useNavigate()
  const logout = useLogout()

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={logout.isPending}
      onClick={() => {
        logout.mutate(undefined, {
          onSuccess: () => {
            void navigate({ to: '/login' })
          },
        })
      }}
    >
      <LogOut />
      Выйти
    </Button>
  )
}
