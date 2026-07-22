import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/utils'

export const queryClient = new QueryClient({
  // Глобальный перехват ошибок мутаций: любая упавшая запись показывает toast.
  // Формы с инлайн-ошибками выключают его через meta.skipErrorToast.
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.skipErrorToast) {
        return
      }
      toast.error(getErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
