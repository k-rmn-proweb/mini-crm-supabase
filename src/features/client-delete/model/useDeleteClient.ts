import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { clientKeys, deleteClient } from '@/entities/client'

export function useDeleteClient() {
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      toast.success('Клиент удалён')
      // Каскад в БД сносит сделки/активности клиента — их ключи инвалидируем,
      // когда появятся entities deal/activity (Фаза 4/5).
    },
  })
}
