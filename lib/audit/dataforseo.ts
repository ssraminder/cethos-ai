export interface DataForSEOResult {
  domain_authority: number | null
  organic_traffic_estimate: number | null
  paid_traffic_estimate: number | null
  backlinks_total: number | null
  referring_domains: number | null
  top_backlinks: { url: string; anchor: string; domain_rank: number }[]
  top_keywords: { keyword: string; position: number; monthly_searches: number | null }[]
}

type DfsResponse = { tasks?: unknown[] }

async function dfsRequest(endpoint: string, body: unknown): Promise<DfsResponse> {
  const login = process.env.DATAFORSEO_LOGIN
  const password = process.env.DATAFORSEO_PASSWORD
  if (!login || !password) throw new Error('DataForSEO credentials not set')

  const credentials = Buffer.from(`${login}:${password}`).toString('base64')
  const res = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`DataForSEO API failed: ${res.status}`)
  return res.json()
}

function getFirstResult(data: DfsResponse): Record<string, unknown> | null {
  const task = (data?.tasks ?? [])[0] as Record<string, unknown> | undefined
  if (!task) return null
  const result = (task.result as unknown[] | undefined)?.[0] as Record<string, unknown> | undefined
  return result ?? null
}

export async function getDataForSEO(domain: string): Promise<DataForSEOResult> {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')

  const result: DataForSEOResult = {
    domain_authority: null,
    organic_traffic_estimate: null,
    paid_traffic_estimate: null,
    backlinks_total: null,
    referring_domains: null,
    top_backlinks: [],
    top_keywords: [],
  }

  await Promise.allSettled([
    // Domain Overview
    dfsRequest('/dataforseo_labs/google/domain_rank_overview/live', [{ target: cleanDomain, location_code: 2840 }])
      .then((data) => {
        const item = getFirstResult(data)
        if (item) {
          result.domain_authority = (item.domain_rank as number) ?? null
          result.organic_traffic_estimate = (item.etv as number) ?? null
          result.paid_traffic_estimate = (item.paid_etv as number) ?? null
        }
      }),

    // Backlinks Summary
    dfsRequest('/backlinks/summary/live', [{ target: cleanDomain, include_subdomains: true }])
      .then((data) => {
        const item = getFirstResult(data)
        if (item) {
          result.backlinks_total = (item.backlinks as number) ?? null
          result.referring_domains = (item.referring_domains as number) ?? null
        }
      }),

    // Top backlinks
    dfsRequest('/backlinks/backlinks/live', [{ target: cleanDomain, limit: 10, order_by: ['domain_from_rank,desc'] }])
      .then((data) => {
        const items = (getFirstResult(data)?.items as Record<string, unknown>[]) ?? []
        result.top_backlinks = items.map((l) => ({
          url: String(l.url_from ?? ''),
          anchor: String(l.anchor ?? ''),
          domain_rank: Number(l.domain_from_rank ?? 0),
        }))
      }),

    // Organic Keywords
    dfsRequest('/dataforseo_labs/google/ranked_keywords/live', [{ target: cleanDomain, location_code: 2840, limit: 10, order_by: ['keyword_data.keyword_info.search_volume,desc'] }])
      .then((data) => {
        const items = (getFirstResult(data)?.items as Record<string, unknown>[]) ?? []
        result.top_keywords = items.map((k) => ({
          keyword: String((k.keyword_data as Record<string, unknown>)?.keyword ?? ''),
          position: Number(((k.ranked_serp_element as Record<string, unknown>)?.serp_item as Record<string, unknown>)?.rank_absolute ?? 0),
          monthly_searches: Number(((k.keyword_data as Record<string, unknown>)?.keyword_info as Record<string, unknown>)?.search_volume ?? null) || null,
        }))
      }),
  ])

  return result
}
