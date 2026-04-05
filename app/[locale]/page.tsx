export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { ClientLogos } from '@/components/sections/home/ClientLogos'
import { StatsSection } from '@/components/sections/home/StatsSection'
import { ServicesPreview } from '@/components/sections/home/ServicesPreview'
import { ProcessSection } from '@/components/sections/home/ProcessSection'
import { WorkPreview } from '@/components/sections/home/WorkPreview'
import { TestimonialsSection } from '@/components/sections/home/TestimonialsSection'
import { CtaBanner } from '@/components/sections/home/CtaBanner'
import { services as fallbackServices } from '@/lib/data/services'
import type { Service } from '@/lib/types'

export const metadata = {
  title: 'Ascelo AI — AI-Native Operations for Growing Businesses',
  description:
    'AI-Native Operations for Growing Businesses. We run your entire digital operation — lead gen, voice AI, websites, SEO, content, and automation. Canada, US, UAE, India.',
}

export default async function HomePage() {
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

  return (
    <>
      <HeroSection />
      <ClientLogos />
      <StatsSection />
      <ServicesPreview services={displayServices} />
      <ProcessSection />
      <WorkPreview />
      <TestimonialsSection />
      <CtaBanner />
    </>
  )
}
