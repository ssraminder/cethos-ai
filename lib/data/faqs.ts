import type { FAQ } from '@/lib/types'

export const faqs: Omit<FAQ, 'id'>[] = [
  {
    question: 'Do you work with political candidates and parties?',
    answer: 'Yes — political campaign marketing is our primary specialty. We have hands-on experience with Punjab MLA and MP campaigns, combining digital outreach, WhatsApp networks, and offline coordination. We work with candidates across party lines.',
    service_id: null,
    sort_order: 0,
  },
  {
    question: 'Which markets do you serve?',
    answer: 'We operate across three markets: India (with deep focus on Punjab and the North), UAE (particularly Dubai and Abu Dhabi), and Canada (Toronto, Vancouver, and major diaspora hubs). Each market has a dedicated team lead.',
    service_id: null,
    sort_order: 1,
  },
  {
    question: 'How does AI fit into your work?',
    answer: 'We use AI to produce content at scale — ads, graphics, videos, copy — that would take a traditional agency 5× longer. Every AI output is reviewed and refined by a senior human strategist before it goes live. You get volume without compromising quality.',
    service_id: null,
    sort_order: 2,
  },
  {
    question: 'What is your minimum campaign budget?',
    answer: 'Our minimum engagement starts at ₹2L/month for India campaigns and $3,000 CAD/month for Canada and UAE. Political campaign packages are quoted based on constituency size and campaign duration.',
    service_id: null,
    sort_order: 3,
  },
  {
    question: 'Do you handle offline marketing as well?',
    answer: 'Yes. We design and coordinate hoardings, banners, pamphlets, rally materials, and print media — and integrate them with your digital campaign so messaging is consistent across every touchpoint.',
    service_id: null,
    sort_order: 4,
  },
  {
    question: 'Can you manage large-scale WhatsApp broadcast campaigns?',
    answer: 'Absolutely. We have experience managing WhatsApp networks of 40,000+ contacts for political campaigns, including contact segmentation by constituency, language (Punjabi/Hindi/English), and voter profile.',
    service_id: null,
    sort_order: 5,
  },
]
