export interface PageSpeedResult {
  mobile: PageSpeedCategory
  desktop: PageSpeedCategory
  core_web_vitals: CoreWebVitals
  opportunities: Opportunity[]
}

interface PageSpeedCategory {
  performance: number
  seo: number
  accessibility: number
  best_practices: number
}

interface CoreWebVitals {
  lcp_ms: number | null
  cls: number | null
  fid_ms: number | null
  inp_ms: number | null
  fcp_ms: number | null
  ttfb_ms: number | null
}

interface Opportunity {
  id: string
  title: string
  description: string
  savings_ms: number | null
}

async function fetchPageSpeed(url: string, strategy: 'mobile' | 'desktop', apiKey: string) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}&category=performance&category=seo&category=accessibility&category=best-practices`
  const res = await fetch(endpoint, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`PageSpeed API ${strategy} failed: ${res.status}`)
  return res.json()
}

export async function getPageSpeed(url: string): Promise<PageSpeedResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  const [mobileData, desktopData] = await Promise.all([
    fetchPageSpeed(url, 'mobile', apiKey),
    fetchPageSpeed(url, 'desktop', apiKey),
  ])

  function extractCategories(data: Record<string, unknown>): PageSpeedCategory {
    const cats = (data as Record<string, Record<string, Record<string, Record<string, number>>>>).lighthouseResult?.categories ?? {}
    return {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      best_practices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    }
  }

  function extractCWV(data: Record<string, unknown>): CoreWebVitals {
    const audits = (data as Record<string, Record<string, Record<string, Record<string, number>>>>).lighthouseResult?.audits ?? {}
    return {
      lcp_ms: audits['largest-contentful-paint']?.numericValue ?? null,
      cls: audits['cumulative-layout-shift']?.numericValue ?? null,
      fid_ms: audits['max-potential-fid']?.numericValue ?? null,
      inp_ms: audits['interaction-to-next-paint']?.numericValue ?? null,
      fcp_ms: audits['first-contentful-paint']?.numericValue ?? null,
      ttfb_ms: audits['server-response-time']?.numericValue ?? null,
    }
  }

  function extractOpportunities(data: Record<string, unknown>): Opportunity[] {
    const audits = (data as Record<string, Record<string, Record<string, unknown>>>).lighthouseResult?.audits ?? {}
    return (Object.values(audits) as Record<string, unknown>[])
      .filter((a) => (a.details as Record<string, unknown>)?.type === 'opportunity' && ((a.details as Record<string, number>).overallSavingsMs ?? 0) > 500)
      .slice(0, 10)
      .map((a) => ({
        id: String(a.id ?? ''),
        title: String(a.title ?? ''),
        description: String(a.description ?? ''),
        savings_ms: (a.details as Record<string, number>)?.overallSavingsMs ?? null,
      }))
  }

  return {
    mobile: extractCategories(mobileData),
    desktop: extractCategories(desktopData),
    core_web_vitals: extractCWV(mobileData),
    opportunities: extractOpportunities(mobileData),
  }
}
