export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { ClientLogos } from '@/components/sections/home/ClientLogos'
import { StatsSection } from '@/components/sections/home/StatsSection'
import { ServicesPreview } from '@/components/sections/home/ServicesPreview'
import { ProcessSection } from '@/components/sections/home/ProcessSection'
import { WorkPreview } from '@/components/sections/home/WorkPreview'
import { TestimonialsSection } from '@/components/sections/home/TestimonialsSection'
import { CtaBanner } from '@/components/sections/home/CtaBanner'
import { SeoHead } from '@/components/SeoHead'
import { generateSeoMetadata } from '@/lib/seo'
import { services as fallbackServices } from '@/lib/data/services'
import { clients as fallbackClients } from '@/lib/data/clients'
import { caseStudies as fallbackCaseStudies } from '@/lib/data/case-studies'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'
import type { Service, Client, CaseStudy, Testimonial } from '@/lib/types'
import { getPageGraphics, getGraphic } from '@/lib/graphics'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const pagePath = locale === 'en' ? '/' : `/${locale}`
  const fallbackPath = locale !== 'en' ? '/' : undefined
  return generateSeoMetadata(pagePath, locale, {
    title: 'Ascelo AI — We Market Your Business and Automate Your Operations',
    description: 'AI-powered digital marketing and operations automation for growing businesses worldwide. Performance marketing, SEO, social media, AI content and more.',
  }, fallbackPath)
}

export default async function HomePage({ params: { locale } }: Props) {
  const pagePath = locale === 'en' ? '/' : `/${locale}`
  const fallbackPath = locale !== 'en' ? '/' : undefined
  let serviceList: Service[] = []
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data } = await supabase
        .from('agp_services')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
      serviceList = (data as Service[]) ?? []
    }
  } catch {
    serviceList = []
  }

  const displayServices = serviceList.length > 0
    ? serviceList
    : (fallbackServices as unknown as Service[])

  // Fetch clients, case studies, testimonials in parallel
  let clientList: Client[] = []
  let caseStudyList: CaseStudy[] = []
  let testimonialList: Testimonial[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const [clientsRes, casesRes, testimonialsRes] = await Promise.all([
        supabase.from('agp_clients').select('*').order('sort_order', { ascending: true }),
        supabase.from('agp_case_studies').select('*, metrics:agp_case_study_metrics(*)').eq('published', true).order('sort_order', { ascending: true }),
        supabase.from('agp_testimonials').select('*').order('sort_order', { ascending: true }),
      ])
      clientList = (clientsRes.data as Client[]) ?? []
      caseStudyList = (casesRes.data as CaseStudy[]) ?? []
      testimonialList = (testimonialsRes.data as Testimonial[]) ?? []
    }
  } catch {
    // fall through to fallbacks
  }

  const displayClients = clientList.length > 0 ? clientList : undefined
  const displayCaseStudies = caseStudyList.length > 0 ? caseStudyList : undefined
  const displayTestimonials = testimonialList.length > 0 ? testimonialList : undefined

  const graphics = await getPageGraphics('/', locale)
  const heroBg = getGraphic(graphics, 'hero', 'background')

  return (
    <>
      <SeoHead pagePath={pagePath} locale={locale} fallbackPath={fallbackPath} />
      <HeroSection backgroundUrl={heroBg?.image_url ?? undefined} />
      <ClientLogos clients={displayClients} />
      <StatsSection />
      <ServicesPreview services={displayServices} />
      <ProcessSection />
      <WorkPreview caseStudies={displayCaseStudies} />
      <TestimonialsSection testimonials={displayTestimonials} />
      <CtaBanner />
    </>
  )
}
