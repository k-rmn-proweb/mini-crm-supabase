import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { dealKeys, updateDeal, type UpdateDealDto } from '@/entities/deal'

export function useUpdateDeal() {
  return useMutation({
    meta: { skipErrorToast: true },
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDealDto }) => updateDeal(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
      toast.success('Сделка обновлена')
    },
  })
}
