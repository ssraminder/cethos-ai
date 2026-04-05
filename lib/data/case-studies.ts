import type { CaseStudy } from '@/lib/types'

type MetricSeed = {
  label: string
  value: string
  prefix: string
  suffix: string
  sort_order: number
}

type CaseStudyWithMetrics = Omit<CaseStudy, 'id' | 'metrics'> & {
  metrics: MetricSeed[]
}

export const caseStudies: CaseStudyWithMetrics[] = [
  {
    title: 'Punjab MLA Campaign: 3× Voter Reach in 6 Weeks',
    slug: 'punjab-mla-campaign-voter-reach',
    client_name: 'AAP-aligned Constituency Campaign, Punjab',
    client_logo_url: null,
    service_id: null,
    challenge: 'Candidate had low digital presence in urban constituency. Opponents dominated social media.',
    solution: 'Deployed targeted Meta Ads, WhatsApp broadcast network of 45,000 contacts, and daily AI-generated content.',
    featured_image_url: null,
    featured: true,
    published: true,
    sort_order: 0,
    created_at: '2026-01-15T00:00:00Z',
    metrics: [
      { label: 'Voter Reach Increase', value: '3', prefix: '', suffix: '×', sort_order: 0 },
      { label: 'WhatsApp Contacts Reached', value: '45', prefix: '', suffix: 'K', sort_order: 1 },
      { label: 'Positive Sentiment', value: '87', prefix: '', suffix: '%', sort_order: 2 },
      { label: 'Cost Per Impression', value: '0.08', prefix: '₹', suffix: '', sort_order: 3 },
    ],
  },
  {
    title: 'Chandigarh SME: 220% Organic Traffic Growth',
    slug: 'chandigarh-sme-organic-growth',
    client_name: 'Leading Retail Brand, Chandigarh',
    client_logo_url: null,
    service_id: null,
    challenge: 'Established retail brand with zero digital presence struggling to compete with e-commerce players.',
    solution: 'Built comprehensive SEO strategy, optimised Google Business Profile, and launched content marketing program targeting local searches.',
    featured_image_url: null,
    featured: true,
    published: true,
    sort_order: 1,
    created_at: '2026-02-01T00:00:00Z',
    metrics: [
      { label: 'Organic Traffic Growth', value: '220', prefix: '', suffix: '%', sort_order: 0 },
      { label: 'Keywords Ranking #1', value: '34', prefix: '', suffix: '', sort_order: 1 },
      { label: 'Lead Volume Increase', value: '145', prefix: '', suffix: '%', sort_order: 2 },
      { label: 'Time to Results', value: '4', prefix: '', suffix: ' months', sort_order: 3 },
    ],
  },
  {
    title: 'Dubai Real Estate: 85 Qualified Leads Per Month',
    slug: 'dubai-real-estate-leads',
    client_name: 'Premium Property Developer, Dubai UAE',
    client_logo_url: null,
    service_id: null,
    challenge: 'Premium developer targeting Indian diaspora in UAE struggling with high lead costs and poor quality traffic from generic agencies.',
    solution: 'Built audience segments targeting Indian expats by income and intent signals. Launched Hindi/English bilingual ads with UAE-specific landing pages.',
    featured_image_url: null,
    featured: true,
    published: true,
    sort_order: 2,
    created_at: '2026-02-15T00:00:00Z',
    metrics: [
      { label: 'Qualified Leads/Month', value: '85', prefix: '', suffix: '', sort_order: 0 },
      { label: 'Cost Per Lead Reduction', value: '60', prefix: '', suffix: '%', sort_order: 1 },
      { label: 'Google Ads ROAS', value: '4.2', prefix: '', suffix: '×', sort_order: 2 },
      { label: 'Sales Pipeline Value', value: '2.4', prefix: '$', suffix: 'M', sort_order: 3 },
    ],
  },
  {
    title: 'Canada Immigration Consultancy: 40% Lower CPL',
    slug: 'canada-immigration-cpl-reduction',
    client_name: 'Immigration Consultancy, Toronto Canada',
    client_logo_url: null,
    service_id: null,
    challenge: 'Toronto-based immigration consultancy facing saturated market and rising ad costs. Previous agency delivered poor quality leads at high CPL.',
    solution: 'Rebuilt Meta and Google campaigns with refined Punjabi community audience targeting, new creative angles, and AI-powered lead qualification.',
    featured_image_url: null,
    featured: false,
    published: true,
    sort_order: 3,
    created_at: '2026-03-01T00:00:00Z',
    metrics: [
      { label: 'Cost Per Lead Reduction', value: '40', prefix: '', suffix: '%', sort_order: 0 },
      { label: 'Conversion Rate Increase', value: '3', prefix: '', suffix: '×', sort_order: 1 },
      { label: 'Monthly Leads Generated', value: '120', prefix: '', suffix: '+', sort_order: 2 },
      { label: 'Ad Spend Efficiency', value: '67', prefix: '', suffix: '%', sort_order: 3 },
    ],
  },
]
