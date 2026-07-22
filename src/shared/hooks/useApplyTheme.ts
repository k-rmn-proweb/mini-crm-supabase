import { useEffect } from 'react'
import { useUiStore } from '@/shared/store'

/** Синхронизирует тему из ui-store с классом `.dark` на <html>. */
export function useApplyTheme() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
}
