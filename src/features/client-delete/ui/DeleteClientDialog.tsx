import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@/shared/ui'
import type { Client } from '@/entities/client'
import { useDeleteClient } from '../model/useDeleteClient'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
}

export function DeleteClientDialog({ open, onOpenChange, client }: Props) {
  const deleteMutation = useDeleteClient()

  const confirm = () => {
    if (!client) {
      return
    }
    deleteMutation.mutate(client.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить клиента?</AlertDialogTitle>
          <AlertDialogDescription>
            Клиент {client?.name ? `«${client.name}»` : ''} и все его сделки и активности будут
            удалены безвозвратно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Отмена</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Удаление…' : 'Удалить'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
