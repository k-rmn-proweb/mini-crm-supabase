import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { dealKeys, updateDealStage, type Deal, type DealStage } from '@/entities/deal'

/** Смена этапа сделки (drag&drop). Оптимистично обновляет доску, откатывает при ошибке. */
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
