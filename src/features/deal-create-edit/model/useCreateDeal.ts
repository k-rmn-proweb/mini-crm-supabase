import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { createDeal, dealKeys, type CreateDealDto } from '@/entities/deal'

export function useCreateDeal() {
  return useMutation({
    meta: { skipErrorToast: true },
    mutationFn: (dto: CreateDealDto) => createDeal(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
      toast.success('Deal created')
    },
  })
}
