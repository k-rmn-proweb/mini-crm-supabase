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
          <AlertDialogTitle>Delete client?</AlertDialogTitle>
          <AlertDialogDescription>
            The client {client?.name ? `«${client.name}»` : ''} and all their deals and activities
            will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
