import type { Testimonial } from '@/lib/types'

export const testimonials: Omit<Testimonial, 'id'>[] = [
  {
    author_name: 'Rajiv Malhotra',
    author_role: 'Director',
    company: 'Global Pathways',
    quote: 'Ascelo transformed our immigration consultancy lead flow. Targeting the Punjabi-speaking market in Canada and India simultaneously was a game changer.',
    photo_url: null,
    rating: 5,
    featured: true,
    sort_order: 0,
  },
  {
    author_name: 'Ahmed Al-Sayed',
    author_role: 'Founder',
    company: 'Dubai Prime Realty',
    quote: 'The AI Voice agents handled our initial qualification in Arabic flawlessly. It\'s like having a 24/7 multilingual sales team.',
    photo_url: null,
    rating: 5,
    featured: true,
    sort_order: 1,
  },
  {
    author_name: 'Sarah Chen',
    author_role: 'CMO',
    company: 'Zenith Tech Solutions',
    quote: 'Finally an agency that understands ROI as much as they understand AI. No BS, just results and transparent reporting every week.',
    photo_url: null,
    rating: 5,
    featured: true,
    sort_order: 2,
  },
]
