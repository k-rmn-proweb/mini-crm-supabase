import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { dealKeys, updateDeal, type UpdateDealDto } from '@/entities/deal'

/**
 * Update a deal (auto-save in the drawer). No success toast — it would be
 * noisy on every change (the drawer itself shows status). Errors go to the global toast.
 */
export function useUpdateDeal() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDealDto }) => updateDeal(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
    },
  })
}
