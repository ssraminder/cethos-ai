import type { Stat } from '@/lib/types'

export const stats: Omit<Stat, 'id'>[] = [
  { label: 'Campaigns Delivered', numeric_value: 50, prefix: '', suffix: '+', sort_order: 0 },
  { label: 'Average Client ROI', numeric_value: 10, prefix: '', suffix: '×', sort_order: 1 },
  { label: 'Satisfaction Rate', numeric_value: 98, prefix: '', suffix: '%', sort_order: 2 },
  { label: 'Languages Supported', numeric_value: 5, prefix: '', suffix: '', sort_order: 3 },
]
