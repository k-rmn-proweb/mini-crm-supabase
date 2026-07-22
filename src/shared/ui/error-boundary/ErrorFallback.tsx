import { TriangleAlert } from 'lucide-react'
import { getErrorMessage } from '@/shared/utils'
import { Button } from '../button'

type ErrorFallbackProps = {
  error?: unknown
  onReset?: () => void
}

/** Полноэкранный фолбэк для непойманных ошибок (ErrorBoundary + роутер). */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <TriangleAlert className="size-10 text-destructive" />
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-semibold">Что-то пошло не так</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {error ? getErrorMessage(error) : 'Произошла непредвиденная ошибка.'}
        </p>
      </div>
      <div className="flex gap-2">
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            Попробовать снова
          </Button>
        )}
        <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
      </div>
    </div>
  )
}
