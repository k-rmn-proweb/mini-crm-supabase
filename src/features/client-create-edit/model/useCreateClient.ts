import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { clientKeys, createClient, type CreateClientDto } from '@/entities/client'

export function useCreateClient() {
  return useMutation({
    // The error is shown inline in the form — no global toast needed.
    meta: { skipErrorToast: true },
    mutationFn: (dto: CreateClientDto) => createClient(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      toast.success('Client created')
    },
  })
}
