import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { dealKeys, updateDeal, type UpdateDealDto } from '@/entities/deal'

/**
 * Обновление сделки (авто-сохранение в drawer'е). Success-тоста нет — было бы
 * шумно на каждое изменение (статус показывает сам drawer). Ошибки — глобальным toast.
 */
export function useUpdateDeal() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDealDto }) => updateDeal(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
    },
  })
}
