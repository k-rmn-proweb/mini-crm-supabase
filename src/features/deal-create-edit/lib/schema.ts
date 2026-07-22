import { z } from 'zod'

export const dealFormSchema = z.object({
  title: z.string().min(1, 'Введите название'),
  clientId: z.string().min(1, 'Выберите клиента'),
  amount: z
    .string()
    .refine((v) => v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0, 'Некорректная сумма'),
  stage: z.enum(['new', 'negotiation', 'won', 'lost']),
  expectedCloseDate: z.string(),
})

export type DealFormValues = z.infer<typeof dealFormSchema>
