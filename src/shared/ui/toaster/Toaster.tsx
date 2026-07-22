import { Toaster as SonnerToaster } from 'sonner'
import { useUiStore } from '@/shared/store'

/** Toast container. Takes its theme from ui-store (light/dark). Mounted once in the app. */
export function Toaster() {
  const theme = useUiStore((s) => s.theme)
  return <SonnerToaster theme={theme} position="top-right" richColors closeButton />
}

export { toast } from 'sonner'
