import { useEffect } from 'react'
import { useUiStore } from '@/shared/store'

/** Syncs the theme from ui-store with the `.dark` class on <html>. */
export function useApplyTheme() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
}
