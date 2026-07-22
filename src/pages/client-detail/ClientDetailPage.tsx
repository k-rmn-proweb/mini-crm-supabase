import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Building2, Mail, Pencil, Phone } from 'lucide-react'
import { Button, Card, CardContent, ErrorState, Skeleton } from '@/shared/ui'
import { ClientStatusBadge, useClientQuery } from '@/entities/client'
import { ClientFormDialog } from '@/features/client-create-edit'
import { ClientDeals } from '@/widgets/client-deals'
import { ClientActivityTimeline } from '@/widgets/client-activity-timeline'

function BackLink() {
  return (
    <Link
      to="/clients"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Клиенты
    </Link>
  )
}

export function ClientDetailPage({ id }: { id: string }) {
  const { data: client, isLoading, isError, refetch } = useClientQuery(id)
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !client) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          title="Клиент не найден"
          description="Возможно, он был удалён."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BackLink />

      <Card>
        <CardContent className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-semibold">{client.name}</h1>
              <ClientStatusBadge status={client.status} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {client.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-4" />
                  {client.company}
                </span>
              )}
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-4" />
                  {client.email}
                </span>
              )}
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-4" />
                  {client.phone}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil />
            Редактировать
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClientDeals clientId={client.id} />
        <ClientActivityTimeline clientId={client.id} />
      </div>

      <ClientFormDialog open={editOpen} client={client} onOpenChange={setEditOpen} />
    </div>
  )
}
