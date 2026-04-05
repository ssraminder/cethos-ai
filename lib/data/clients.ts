import type { Client } from '@/lib/types'

export const clients: Omit<Client, 'id'>[] = [
  {
    name: 'Punjab Agri Corp',
    logo_url: '/images/clients/punjab-agri.svg',
    website_url: null,
    sort_order: 0,
  },
  {
    name: 'Chandigarh Motors',
    logo_url: '/images/clients/chandigarh-motors.svg',
    website_url: null,
    sort_order: 1,
  },
  {
    name: 'Al Rashidi Properties',
    logo_url: '/images/clients/al-rashidi.svg',
    website_url: null,
    sort_order: 2,
  },
  {
    name: 'Dubai Trade Hub',
    logo_url: '/images/clients/dubai-trade.svg',
    website_url: null,
    sort_order: 3,
  },
  {
    name: 'Brar Immigration',
    logo_url: '/images/clients/brar-immigration.svg',
    website_url: null,
    sort_order: 4,
  },
  {
    name: 'TechBridge India',
    logo_url: '/images/clients/techbridge.svg',
    website_url: null,
    sort_order: 5,
  },
]
