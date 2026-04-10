import type { ProcessStep } from '@/lib/types'

export const processSteps: Omit<ProcessStep, 'id'>[] = [
  {
    title: 'Discovery',
    description: 'Deep dive into your market, competitors, and language requirements.',
    icon_name: 'Search',
    sort_order: 0,
  },
  {
    title: 'Production',
    description: 'AI-accelerated multilingual creative and technical setup.',
    icon_name: 'Sparkles',
    sort_order: 1,
  },
  {
    title: 'Launch',
    description: 'Synchronized deployment across targeted channels and regions.',
    icon_name: 'Rocket',
    sort_order: 2,
  },
  {
    title: 'Optimize',
    description: 'Real-time adjustments based on live performance data.',
    icon_name: 'BarChart2',
    sort_order: 3,
  },
]
