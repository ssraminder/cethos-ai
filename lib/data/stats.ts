import type { Stat } from '@/lib/types'

export const stats: Omit<Stat, 'id'>[] = [
  {
    label: 'Campaigns Delivered',
    numeric_value: 50,
    prefix: '',
    suffix: '+',
    sort_order: 0,
  },
  {
    label: 'Average ROAS',
    numeric_value: 10,
    prefix: '',
    suffix: 'x',
    sort_order: 1,
  },
  {
    label: 'Client Retention',
    numeric_value: 95,
    prefix: '',
    suffix: '%',
    sort_order: 2,
  },
  {
    label: 'Languages',
    numeric_value: 5,
    prefix: '',
    suffix: '',
    sort_order: 3,
  },
  {
    label: 'Countries',
    numeric_value: 3,
    prefix: '',
    suffix: '',
    sort_order: 4,
  },
]
