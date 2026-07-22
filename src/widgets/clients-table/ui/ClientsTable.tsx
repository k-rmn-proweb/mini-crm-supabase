import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui'
import { formatDate } from '@/shared/utils'
import {
  CLIENT_STATUS_OPTIONS,
  ClientStatusBadge,
  useClientsQuery,
  type Client,
} from '@/entities/client'
import { ClientFormDialog } from '@/features/client-create-edit'
import { DeleteClientDialog } from '@/features/client-delete'
import { useClientsFilters } from '../model/clients-filters'

type DialogState = { open: boolean; client?: Client }

export function ClientsTable() {
  const { data: clients, isLoading, isError, refetch } = useClientsQuery()
  const { search, status, setSearch, setStatus } = useClientsFilters()

  const [form, setForm] = useState<DialogState>({ open: false })
  const [toDelete, setToDelete] = useState<DialogState>({ open: false })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (clients ?? []).filter((client) => {
      const matchesStatus = status === 'all' || client.status === status
      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        (client.company ?? '').toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [clients, search, status])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">Клиенты</h1>
        <Button onClick={() => setForm({ open: true })}>
          <Plus />
          Добавить клиента
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или компании"
            className="pl-8"
          />
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {CLIENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <ClientsTableSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : clients && clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Пока нет клиентов"
          description="Добавьте первого клиента, чтобы начать вести базу."
          action={
            <Button onClick={() => setForm({ open: true })}>
              <Plus />
              Добавить клиента
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Ничего не найдено"
          description="Измените поиск или фильтр."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Компания</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead className="w-24 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.company ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{client.email ?? '—'}</TableCell>
                  <TableCell>
                    <ClientStatusBadge status={client.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Редактировать"
                        onClick={() => setForm({ open: true, client })}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Удалить"
                        onClick={() => setToDelete({ open: true, client })}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ClientFormDialog
        open={form.open}
        client={form.client}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
      />
      <DeleteClientDialog
        open={toDelete.open}
        client={toDelete.client}
        onOpenChange={(open) => setToDelete((prev) => ({ ...prev, open }))}
      />
    </div>
  )
}

function ClientsTableSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
}
