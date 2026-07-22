import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/ui'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Mini-CRM</h1>
        <p className="text-muted-foreground">
          Каркас проекта готов: React 19, TanStack Router, Tailwind, shadcn/ui, FSD.
        </p>
      </div>
      <Button>Всё работает</Button>
    </main>
  )
}
