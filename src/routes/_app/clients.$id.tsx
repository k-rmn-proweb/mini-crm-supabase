import { createFileRoute } from '@tanstack/react-router'
import { ClientDetailPage } from '@/pages/client-detail'

export const Route = createFileRoute('/_app/clients/$id')({
  component: ClientDetailRoute,
})

function ClientDetailRoute() {
  const { id } = Route.useParams()
  return <ClientDetailPage id={id} />
}
