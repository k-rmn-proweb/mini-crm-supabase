import type { DealStage } from './types'

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  new: 'Новая',
  negotiation: 'Переговоры',
  won: 'Выиграна',
  lost: 'Проиграна',
}

/** Порядок этапов (колонки Kanban в Фазе 5). */
export const DEAL_STAGES: DealStage[] = ['new', 'negotiation', 'won', 'lost']

export const DEAL_STAGE_OPTIONS = DEAL_STAGES.map((value) => ({
  value,
  label: DEAL_STAGE_LABELS[value],
}))

/** Сплошные цвета этапов (акценты карточек/колонок, графики). */
export const DEAL_STAGE_COLORS: Record<DealStage, string> = {
  new: '#3b82f6',
  negotiation: '#f59e0b',
  won: '#10b981',
  lost: '#ef4444',
}
