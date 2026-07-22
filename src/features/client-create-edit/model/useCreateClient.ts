import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { clientKeys, createClient, type CreateClientDto } from '@/entities/client'

export function useCreateClient() {
  return useMutation({
    mutationFn: (dto: CreateClientDto) => createClient(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}
