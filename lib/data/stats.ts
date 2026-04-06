import type { Stat } from '@/lib/types'

export interface LiveStat extends Omit<Stat, 'id'> {
  /** Base value as of baseDate */
  base_value: number
  /** ISO date string — the epoch for base_value */
  base_date?: string
  /** Milliseconds per +1 increment (undefined = static forever) */
  ms_per_unit?: number
}

// AI Assets Delivered: 1200 on Apr 6 2026, +20/month → +1 every ~1.5 days
const MS_PER_DAY = 86_400_000
const AI_ASSETS_BASE_DATE = '2026-04-06'
const AI_ASSETS_MS_PER_UNIT = 1.5 * MS_PER_DAY   // +1 every 36 hours ≈ +20/month

// Markets Served: 40 on Apr 6 2026, +1 every 30 days
const MARKETS_MS_PER_UNIT = 30 * MS_PER_DAY

export const stats: LiveStat[] = [
  {
    label: 'AI Assets Delivered',
    numeric_value: 1200,
    base_value: 1200,
    base_date: AI_ASSETS_BASE_DATE,
    ms_per_unit: AI_ASSETS_MS_PER_UNIT,
    prefix: '',
    suffix: '+',
    sort_order: 0,
  },
  {
    label: 'Average Client ROAS',
    numeric_value: 12,
    base_value: 12,
    prefix: '',
    suffix: '×',
    sort_order: 1,
  },
  {
    label: 'Client Retention Rate',
    numeric_value: 98,
    base_value: 98,
    prefix: '',
    suffix: '%',
    sort_order: 2,
  },
  {
    label: 'Markets Served',
    numeric_value: 40,
    base_value: 40,
    base_date: AI_ASSETS_BASE_DATE,
    ms_per_unit: MARKETS_MS_PER_UNIT,
    prefix: '',
    suffix: '+',
    sort_order: 3,
  },
]

/** Returns the current live value based on elapsed time since base_date */
export function getLiveValue(stat: LiveStat): number {
  if (!stat.base_date || !stat.ms_per_unit) return stat.base_value
  const elapsed = Date.now() - new Date(stat.base_date).getTime()
  return stat.base_value + Math.floor(elapsed / stat.ms_per_unit)
}
