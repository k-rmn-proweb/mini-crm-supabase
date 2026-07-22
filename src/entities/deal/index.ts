// Публичный API сущности deal.
export { useDealsQuery } from './model/useDealsQuery'
export { useClientDealsQuery } from './model/useClientDealsQuery'
export { useDealsRealtime } from './model/useDealsRealtime'
export { DealCard } from './ui/DealCard'
export { DealStageBadge } from './ui/DealStageBadge'
export {
  DEAL_STAGE_LABELS,
  DEAL_STAGE_OPTIONS,
  DEAL_STAGES,
  DEAL_STAGE_COLORS,
} from './model/consts'
export { dealKeys } from './api/keys'
export {
  fetchDeals,
  fetchDealsByClient,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
} from './api/api'
export type { Deal, DealStage } from './model/types'
export type { CreateDealDto, UpdateDealDto } from './api/dto'
