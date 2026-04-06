export interface CruxResult {
  available: boolean
  lcp: CruxMetric | null
  cls: CruxMetric | null
  inp: CruxMetric | null
  fcp: CruxMetric | null
  ttfb: CruxMetric | null
}

interface CruxMetric {
  rating: 'good' | 'needs-improvement' | 'poor'
  p75: number
  histogram: { start: number; end?: number; density: number }[]
}

export async function getCruxData(url: string): Promise<CruxResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  try {
    const res = await fetch(
      `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, formFactor: 'PHONE' }),
        signal: AbortSignal.timeout(10000),
      }
    )

    if (res.status === 404) return { available: false, lcp: null, cls: null, inp: null, fcp: null, ttfb: null }
    if (!res.ok) throw new Error(`CrUX API failed: ${res.status}`)

    const data = await res.json()
    const metrics = data?.record?.metrics ?? {}

    const extractMetric = (key: string): CruxMetric | null => {
      const m = metrics[key]
      if (!m) return null
      return {
        rating: m.percentiles?.p75 !== undefined
          ? rateMetric(key, m.percentiles.p75)
          : 'needs-improvement',
        p75: m.percentiles?.p75 ?? 0,
        histogram: m.histogram ?? [],
      }
    }

    return {
      available: true,
      lcp: extractMetric('largest_contentful_paint'),
      cls: extractMetric('cumulative_layout_shift'),
      inp: extractMetric('interaction_to_next_paint'),
      fcp: extractMetric('first_contentful_paint'),
      ttfb: extractMetric('experimental_time_to_first_byte'),
    }
  } catch {
    return { available: false, lcp: null, cls: null, inp: null, fcp: null, ttfb: null }
  }
}

function rateMetric(key: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    largest_contentful_paint: [2500, 4000],
    cumulative_layout_shift: [0.1, 0.25],
    interaction_to_next_paint: [200, 500],
    first_contentful_paint: [1800, 3000],
    experimental_time_to_first_byte: [800, 1800],
  }
  const [good, poor] = thresholds[key] ?? [0, Infinity]
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}
