import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { dealKeys, deleteDeal } from '@/entities/deal'

export function useDeleteDeal() {
  return useMutation({
    mutationFn: (id: string) => deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
      toast.success('Сделка удалена')
    },
  })
}
