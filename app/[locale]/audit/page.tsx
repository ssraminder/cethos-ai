import type { Metadata } from 'next'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { AuditForm } from '@/components/sections/audit/AuditForm'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Free Website SEO Audit | Ascelo AI',
    description: 'Get an instant free SEO audit for your website. Verify your email, receive detailed findings, and optionally upgrade to a $7.99 comprehensive report.',
  }
}

export default function AuditPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Hero */}
      <div className="relative bg-[#0A0F1E] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('https://scnmdbkpjlkitxdoeiaa.supabase.co/storage/v1/object/public/agp-public/graphics/hero-background.png')" }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#EC4899]/15 text-[#EC4899] text-xs font-heading font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            AI-Powered · Instant · No Login
          </span>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-4">
            Free Website SEO Audit
          </h1>
          <p className="font-body text-white/60 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Submit your URL, verify your email, and get a full technical SEO report delivered to your inbox — free, in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40 font-heading">
            {['15-page crawl', 'Google PageSpeed', 'Safe Browsing check', 'Core Web Vitals', 'No credit card'].map(f => (
              <span key={f} className="flex items-center gap-1.5">
                <span className="text-[#EC4899]">✓</span> {f}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E]/0 via-[#0A0F1E]/40 to-[#0A0F1E] pointer-events-none" />
      </div>

      {/* Form */}
      <SectionWrapper className="bg-white">
        <div className="max-w-2xl mx-auto">
          <AuditForm locale={locale} />
        </div>
      </SectionWrapper>

      {/* Trust strip */}
      <div className="bg-[#FDF2F8] border-t border-[#EC4899]/10 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '1,200+', label: 'Audits completed' },
              { value: '15+', label: 'SEO checks' },
              { value: '5 min', label: 'Report delivery' },
              { value: '$0', label: 'Free audit cost' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-heading font-bold text-[#0A0F1E] text-3xl">{stat.value}</p>
                <p className="font-body text-[#0A0F1E]/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
