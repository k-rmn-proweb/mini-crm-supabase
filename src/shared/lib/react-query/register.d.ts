export {}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Do not show the global error toast (the form shows the error inline). */
      skipErrorToast?: boolean
    }
  }
}
