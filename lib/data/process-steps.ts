import type { ProcessStep } from '@/lib/types'

export const processSteps: Omit<ProcessStep, 'id'>[] = [
  {
    title: 'Discovery & Strategy',
    description: 'We audit your current presence, research competitors, and map a market-specific strategy across India, UAE or Canada.',
    icon_name: 'Compass',
    sort_order: 0,
  },
  {
    title: 'AI-Assisted Creative Production',
    description: 'Our AI tools produce high-volume content — ads, videos, graphics, copy — reviewed and refined by senior human strategists.',
    icon_name: 'Sparkles',
    sort_order: 1,
  },
  {
    title: 'Multi-Channel Execution',
    description: 'We launch across Meta, Google, WhatsApp, SMS, and offline channels simultaneously — ensuring total market coverage.',
    icon_name: 'Zap',
    sort_order: 2,
  },
  {
    title: 'Data-Driven Optimisation',
    description: 'Daily performance reviews, A/B testing, and weekly reports. We optimise until your numbers beat projections.',
    icon_name: 'BarChart2',
    sort_order: 3,
  },
]
