import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { clientKeys, deleteClient } from '@/entities/client'
import { dealKeys } from '@/entities/deal'
import { activityKeys } from '@/entities/activity'

export function useDeleteClient() {
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      // The DB cascade removed the client's deals/activities — invalidate their keys too.
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.all })
      toast.success('Client deleted')
    },
  })
}
