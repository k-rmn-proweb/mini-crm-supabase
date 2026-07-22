import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { clientKeys, updateClient, type UpdateClientDto } from '@/entities/client'

export function useUpdateClient() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateClientDto }) => updateClient(id, dto),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) })
    },
  })
}
