// Публичный API сущности deal.
export { useClientDealsQuery } from './model/useClientDealsQuery'
export { DealStageBadge } from './ui/DealStageBadge'
export { DEAL_STAGE_LABELS, DEAL_STAGE_OPTIONS, DEAL_STAGES } from './model/consts'
export { dealKeys } from './api/keys'
export { fetchDealsByClient } from './api/api'
export type { Deal, DealStage } from './model/types'
