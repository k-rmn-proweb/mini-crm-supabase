import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Введите имя'),
  email: z.email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export type RegisterValues = z.infer<typeof registerSchema>
