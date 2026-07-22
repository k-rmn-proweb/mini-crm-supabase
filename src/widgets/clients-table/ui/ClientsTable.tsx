import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
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
import { useDebouncedValue } from '@/shared/hooks'
import { cn, formatDate } from '@/shared/utils'
import {
  CLIENT_STATUS_OPTIONS,
  ClientStatusBadge,
  useClientsQuery,
  type Client,
} from '@/entities/client'
import { ClientFormDialog } from '@/features/client-create-edit'
import { DeleteClientDialog } from '@/features/client-delete'
import { useClientsFilters } from '../model/clients-filters'

const PAGE_SIZE = 10

type DialogState = { open: boolean; client?: Client }

export function ClientsTable() {
  const { search, status, page, setSearch, setStatus, setPage } = useClientsFilters()
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data, isLoading, isError, isFetching, refetch } = useClientsQuery({
    search: debouncedSearch,
    status: status === 'all' ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  })

  const [form, setForm] = useState<DialogState>({ open: false })
  const [toDelete, setToDelete] = useState<DialogState>({ open: false })

  const rows = data?.rows ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasFilters = debouncedSearch !== '' || status !== 'all'
  // Спиннер, пока поиск «оседает»: набор ждёт дебаунса или идёт запрос по поиску.
  const searchPending = search !== debouncedSearch || (isFetching && debouncedSearch !== '')

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
            className="px-8"
          />
          <div className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center">
            {searchPending ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Очистить поиск"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
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
        <ErrorState onRetry={() => refetch()} />
      ) : total === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={Search}
            title="Ничего не найдено"
            description="Измените поиск или фильтр."
          />
        ) : (
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
        )
      ) : (
        <>
          <div
            className={cn(
              'overflow-x-auto rounded-lg border transition-opacity',
              isFetching && 'opacity-60',
            )}
          >
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
                {rows.map((client) => (
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

          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              {total} {plural(total, ['клиент', 'клиента', 'клиентов'])}
            </span>
            <div className="flex items-center gap-2">
              <span>
                Стр. {page + 1} из {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Предыдущая страница"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Следующая страница"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </>
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

function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) {
    return forms[0]
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return forms[1]
  }
  return forms[2]
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
