import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { clientKeys, updateClient, type UpdateClientDto } from '@/entities/client'

export function useUpdateClient() {
  return useMutation({
    // The error is shown inline in the form — no global toast needed.
    meta: { skipErrorToast: true },
    mutationFn: ({ id, dto }: { id: string; dto: UpdateClientDto }) => updateClient(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) })
      toast.success('Client updated')
    },
  })
}
