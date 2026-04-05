import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CompanyInfoProvider } from '@/lib/context/CompanyInfoContext'
import type { CompanyInfo } from '@/lib/types'

const FALLBACK_COMPANY: CompanyInfo = {
  id: 'fallback',
  agency_name: 'Cethos Media',
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  og_image_url: null,
  tagline: 'AI-Powered. Human-Managed. Results Guaranteed.',
  phone: null,
  email: 'hello@cethosmedia.com',
  address_line1: null,
  address_line2: null,
  city: null,
  state: null,
  postal_code: null,
  country: 'Canada',
  linkedin_url: null,
  twitter_url: null,
  instagram_url: null,
  facebook_url: null,
  hero_cta_primary: 'Get a Free Audit',
  hero_cta_secondary: 'See Our Work',
  footer_cta_heading: 'Ready to dominate your market?',
  footer_cta_subtext: 'Talk to our team today — free strategy audit included.',
}

async function getCompanyInfo(): Promise<CompanyInfo> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FALLBACK_COMPANY
  }
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data } = await supabase
      .from('agp_company_info')
      .select('*')
      .single()
    return data ?? FALLBACK_COMPANY
  } catch {
    return FALLBACK_COMPANY
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo()
  return {
    title: { default: company.agency_name, template: `%s | ${company.agency_name}` },
    description: company.tagline ?? 'AI-Powered. Human-Managed. Results Guaranteed.',
    icons: company.favicon_url ? [{ rel: 'icon', url: company.favicon_url }] : undefined,
    openGraph: {
      siteName: company.agency_name,
      images: company.og_image_url ? [company.og_image_url] : [],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompanyInfo()
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <CompanyInfoProvider value={company}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CompanyInfoProvider>
      </body>
    </html>
  )
}
