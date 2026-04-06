import type { Stat } from '@/lib/types'

export interface LiveStat extends Omit<Stat, 'id'> {
  /** How much to increment per tick (undefined = static) */
  increment?: number
  /** Milliseconds between ticks */
  interval_ms?: number
}

export const stats: LiveStat[] = [
  { label: 'AI Assets Delivered', numeric_value: 1200, prefix: '', suffix: '+', sort_order: 0, increment: 1, interval_ms: 4000 },
  { label: 'Average Client ROAS', numeric_value: 12, prefix: '', suffix: '×', sort_order: 1 },
  { label: 'Client Retention Rate', numeric_value: 98, prefix: '', suffix: '%', sort_order: 2 },
  { label: 'Markets Served', numeric_value: 40, prefix: '', suffix: '+', sort_order: 3, increment: 1, interval_ms: 60000 },
]
