export {}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Не показывать глобальный error-toast (форма показывает ошибку инлайн). */
      skipErrorToast?: boolean
    }
  }
}
