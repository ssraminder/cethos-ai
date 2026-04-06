import type { TeamMember } from '@/lib/types'

export const team: Omit<TeamMember, 'id'>[] = [
  {
    name: 'Rajan Mehta',
    role: 'Founder & Strategy Director',
    bio: '15 years in political and brand marketing across India and the Gulf. Built campaigns for 3 winning MLA candidates.',
    photo_url: null,
    linkedin_url: null,
    twitter_url: null,
    sort_order: 0,
  },
  {
    name: 'Priya Sidhu',
    role: 'Head of Performance Marketing',
    bio: 'Google and Meta certified. Managed $50M+ in ad spend across global markets.',
    photo_url: null,
    linkedin_url: null,
    twitter_url: null,
    sort_order: 1,
  },
  {
    name: 'Arjun Bhatia',
    role: 'AI & Content Lead',
    bio: 'Ex-agency creative director turned AI-first content strategist. Produces at scale without sacrificing quality.',
    photo_url: null,
    linkedin_url: null,
    twitter_url: null,
    sort_order: 2,
  },
  {
    name: 'Sarah Mitchell',
    role: 'International Market Lead',
    bio: 'Specialist in diaspora community marketing and cross-border campaign execution across multiple continents.',
    photo_url: null,
    linkedin_url: null,
    twitter_url: null,
    sort_order: 3,
  },
]
