import type { CreateDealDto, Deal, DealStage } from '@/entities/deal'
import type { DealFormValues } from './schema'

export function toDealFormValues(deal?: Deal, defaultStage?: DealStage): DealFormValues {
  return {
    title: deal?.title ?? '',
    clientId: deal?.client_id ?? '',
    amount: deal ? String(deal.amount) : '',
    stage: deal?.stage ?? defaultStage ?? 'new',
    expectedCloseDate: deal?.expected_close_date ?? '',
  }
}

export function toDealDto(values: DealFormValues): CreateDealDto {
  return {
    title: values.title,
    client_id: values.clientId,
    amount: Number(values.amount),
    stage: values.stage,
    expected_close_date: values.expectedCloseDate || null,
  }
}
