import { createFileRoute } from '@tanstack/react-router'
import { DealsPage } from '@/pages/deals'

export const Route = createFileRoute('/_app/deals')({
  component: DealsPage,
})
