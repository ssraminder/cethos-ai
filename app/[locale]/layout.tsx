import type { Metadata } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CompanyInfoProvider } from '@/lib/context/CompanyInfoContext'
import type { CompanyInfo } from '@/lib/types'
import { locales, rtlLocales, type Locale } from '@/i18n'
import { notFound } from 'next/navigation'

const FALLBACK_COMPANY: CompanyInfo = {
  id: 'fallback',
  agency_name: 'Ascelo AI',
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  og_image_url: null,
  tagline: 'AI-Powered Marketing & Automation for Growing Businesses',
  phone: '+1 (587) 329-2590',
  email: 'info@ascelo.ai',
  address_line1: '421, 7th Ave SW, Floor 30',
  address_line2: null,
  city: 'Calgary',
  state: 'AB',
  postal_code: 'T2P 4K9',
  country: 'Canada',
  linkedin_url: null,
  twitter_url: null,
  instagram_url: null,
  facebook_url: null,
  hero_cta_primary: 'Get a Free Strategy Audit',
  hero_cta_secondary: 'See Our Work',
  footer_cta_heading: 'Ready to Grow Your Business?',
  footer_cta_subtext: 'Get a data-backed roadmap for global domination. No fluff, no commitments, just growth strategy.',
}

async function getCompanyInfo(): Promise<CompanyInfo> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FALLBACK_COMPANY
  }
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data } = await supabase.from('agp_company_info').select('*').single()
    return data ?? FALLBACK_COMPANY
  } catch {
    return FALLBACK_COMPANY
  }
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const company = await getCompanyInfo()
  return {
    title: { default: company.agency_name, template: `%s | ${company.agency_name}` },
    description: company.tagline ?? 'AI-Powered Marketing & Automation for Growing Businesses',
    icons: company.favicon_url ? [{ rel: 'icon', url: company.favicon_url }] : undefined,
    openGraph: {
      siteName: company.agency_name,
      images: company.og_image_url ? [company.og_image_url] : [],
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as Locale)) notFound()
  const isRtl = rtlLocales.includes(locale as Locale)
  const messages = await getMessages()
  const company = await getCompanyInfo()

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className="dark">
      <body className="font-body antialiased bg-background text-on-surface selection:bg-primary/30">
        <NextIntlClientProvider messages={messages}>
          <CompanyInfoProvider value={company}>
            <Navbar locale={locale} />
            <main className="pt-[72px]">{children}</main>
            <Footer />
          </CompanyInfoProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
