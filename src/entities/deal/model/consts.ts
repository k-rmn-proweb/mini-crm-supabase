import type { DealStage } from './types'

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  new: 'New',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

/** Stage order (Kanban columns in Phase 5). */
export const DEAL_STAGES: DealStage[] = ['new', 'negotiation', 'won', 'lost']

export const DEAL_STAGE_OPTIONS = DEAL_STAGES.map((value) => ({
  value,
  label: DEAL_STAGE_LABELS[value],
}))

/** Solid stage colors (card/column accents, charts). */
export const DEAL_STAGE_COLORS: Record<DealStage, string> = {
  new: '#3b82f6',
  negotiation: '#f59e0b',
  won: '#10b981',
  lost: '#ef4444',
}
