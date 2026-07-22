import { TriangleAlert } from 'lucide-react'
import { getErrorMessage } from '@/shared/utils'
import { Button } from '../button'

type ErrorFallbackProps = {
  error?: unknown
  onReset?: () => void
}

/** Full-screen fallback for uncaught errors (ErrorBoundary + router). */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <TriangleAlert className="size-10 text-destructive" />
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-semibold">Something went wrong</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {error ? getErrorMessage(error) : 'An unexpected error occurred.'}
        </p>
      </div>
      <div className="flex gap-2">
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            Try again
          </Button>
        )}
        <Button onClick={() => window.location.reload()}>Reload page</Button>
      </div>
    </div>
  )
}
