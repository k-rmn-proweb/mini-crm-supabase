import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { clientKeys, deleteClient } from '@/entities/client'

export function useDeleteClient() {
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      // Каскад в БД сносит сделки/активности клиента — их ключи инвалидируем,
      // когда появятся entities deal/activity (Фаза 4/5).
    },
  })
}
