import { HeroSection } from '@/components/sections/home/HeroSection'
import { ClientLogos } from '@/components/sections/home/ClientLogos'
import { StatsSection } from '@/components/sections/home/StatsSection'
import { ServicesPreview } from '@/components/sections/home/ServicesPreview'
import { ProcessSection } from '@/components/sections/home/ProcessSection'
import { WorkPreview } from '@/components/sections/home/WorkPreview'
import { TestimonialsSection } from '@/components/sections/home/TestimonialsSection'
import { CtaBanner } from '@/components/sections/home/CtaBanner'

export const metadata = {
  title: 'Home',
  description:
    'AI-Powered. Human-Managed. Results Guaranteed. Political campaign marketing and digital marketing for India, UAE and Canada.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientLogos />
      <StatsSection />
      <ServicesPreview />
      <ProcessSection />
      <WorkPreview />
      <TestimonialsSection />
      <CtaBanner />
    </>
  )
}
