/** Достаёт человекочитаемое сообщение из неизвестной ошибки. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Что-то пошло не так'
}
