import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(1, 'Введите имя'),
  company: z.string(),
  email: z.literal('').or(z.email('Некорректный email')),
  phone: z.string(),
  status: z.enum(['lead', 'active', 'inactive']),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
