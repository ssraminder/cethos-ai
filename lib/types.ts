export interface CompanyInfo {
  id: string
  agency_name: string
  logo_url: string | null
  logo_dark_url: string | null
  favicon_url: string | null
  og_image_url: string | null
  tagline: string | null
  phone: string | null
  email: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  linkedin_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  hero_cta_primary: string | null
  hero_cta_secondary: string | null
  footer_cta_heading: string | null
  footer_cta_subtext: string | null
}

export interface Service {
  id: string
  title: string
  slug: string
  short_desc: string | null
  long_desc: string | null
  icon_name: string | null
  featured: boolean
  active: boolean
  sort_order: number
}

export interface ServiceDeliverable {
  id: string
  service_id: string
  label: string
  sort_order: number
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  client_name: string
  client_logo_url: string | null
  service_id: string | null
  challenge: string | null
  solution: string | null
  featured_image_url: string | null
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
  metrics?: CaseStudyMetric[]
}

export interface CaseStudyMetric {
  id: string
  case_study_id: string
  label: string
  value: string
  prefix: string
  suffix: string
  sort_order: number
}

export interface Testimonial {
  id: string
  author_name: string
  author_role: string | null
  company: string | null
  quote: string
  photo_url: string | null
  rating: number
  featured: boolean
  sort_order: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  sort_order: number
}

export interface Client {
  id: string
  name: string
  logo_url: string
  website_url: string | null
  sort_order: number
}

export interface Stat {
  id: string
  label: string
  numeric_value: number
  prefix: string
  suffix: string
  sort_order: number
}

export interface ProcessStep {
  id: string
  title: string
  description: string | null
  icon_name: string | null
  sort_order: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  service_id: string | null
  sort_order: number
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  locale: string | null
  category_id: string | null
  category?: BlogCategory
  tags: string[] | null
  featured_image_url: string | null
  author_name: string | null
  author_photo_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

export interface ContactSubmission {
  name: string
  email: string
  company?: string
  service_interest?: string
  budget_range?: string
  message?: string
  preferred_language?: string
}
