import { z } from 'zod'

export const dealFormSchema = z.object({
  title: z.string().min(1, 'Enter a title'),
  clientId: z.string().min(1, 'Select a client'),
  amount: z
    .string()
    .refine((v) => v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0, 'Invalid amount'),
  stage: z.enum(['new', 'negotiation', 'won', 'lost']),
  expectedCloseDate: z.string(),
})

export type DealFormValues = z.infer<typeof dealFormSchema>
