import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib'
import { toast } from '@/shared/ui'
import { activityKeys, createActivity, type CreateActivityDto } from '@/entities/activity'

export function useCreateActivity(clientId: string) {
  return useMutation({
    mutationFn: (dto: CreateActivityDto) => createActivity(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.byClient(clientId) })
      queryClient.invalidateQueries({ queryKey: activityKeys.recent() })
      toast.success('Активность добавлена')
    },
  })
}
