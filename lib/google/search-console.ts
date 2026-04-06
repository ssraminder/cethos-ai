// Phase 10: Google Search Console API (requires OAuth access token)
export interface SearchConsoleResult {
  top_queries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]
  top_pages: { page: string; clicks: number; impressions: number }[]
  index_coverage: { indexed: number; excluded: number; errors: number } | null
}

export async function getSearchConsoleData(
  accessToken: string,
  siteUrl: string
): Promise<SearchConsoleResult> {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  async function query(dimensions: string[], rowLimit = 50) {
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
        signal: AbortSignal.timeout(15000),
      }
    )
    if (!res.ok) throw new Error(`GSC query failed: ${res.status}`)
    return res.json()
  }

  const [queryData, pageData] = await Promise.all([
    query(['query'], 50).catch(() => ({ rows: [] })),
    query(['page'], 20).catch(() => ({ rows: [] })),
  ])

  return {
    top_queries: (queryData.rows ?? []).map((r: Record<string, unknown>) => ({
      query: (r.keys as string[])[0],
      clicks: Number(r.clicks),
      impressions: Number(r.impressions),
      ctr: Number(r.ctr),
      position: Number(r.position),
    })),
    top_pages: (pageData.rows ?? []).map((r: Record<string, unknown>) => ({
      page: (r.keys as string[])[0],
      clicks: Number(r.clicks),
      impressions: Number(r.impressions),
    })),
    index_coverage: null, // Requires Indexing API — available via GSC UI only
  }
}
