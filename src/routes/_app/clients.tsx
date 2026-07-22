import { createFileRoute } from '@tanstack/react-router'
import { ClientsPage } from '@/pages/clients-list'

export const Route = createFileRoute('/_app/clients')({
  component: ClientsPage,
})
