import { Moon, Sun } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useUiStore } from '@/shared/store'

export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
