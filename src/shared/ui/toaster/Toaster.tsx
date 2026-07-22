import { Toaster as SonnerToaster } from 'sonner'
import { useUiStore } from '@/shared/store'

/** Контейнер тостов. Тему берёт из ui-store (light/dark). Монтируется один раз в app. */
export function Toaster() {
  const theme = useUiStore((s) => s.theme)
  return <SonnerToaster theme={theme} position="top-right" richColors closeButton />
}

export { toast } from 'sonner'
