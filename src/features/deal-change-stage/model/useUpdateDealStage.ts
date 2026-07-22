import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { dealKeys, updateDealStage, type Deal, type DealStage } from '@/entities/deal'

/** Change a deal's stage (drag & drop). Optimistically updates the board, rolls back on error. */
export function useUpdateDealStage() {
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: DealStage }) => updateDealStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: dealKeys.list() })
      const previous = queryClient.getQueryData<Deal[]>(dealKeys.list())
      queryClient.setQueryData<Deal[]>(dealKeys.list(), (old) =>
        old?.map((deal) => (deal.id === id ? { ...deal, stage } : deal)),
      )
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dealKeys.list(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
    },
  })
}
