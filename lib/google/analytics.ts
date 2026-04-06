// Phase 10: Google Analytics 4 Data API (requires OAuth access token)
export interface AnalyticsResult {
  sessions: number
  users: number
  engagement_rate: number
  top_pages: { page: string; sessions: number }[]
  traffic_sources: { source: string; sessions: number }[]
  organic_sessions: number
}

export async function getAnalyticsData(
  accessToken: string,
  propertyId: string
): Promise<AnalyticsResult> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
        limit: 10,
      }),
      signal: AbortSignal.timeout(15000),
    }
  )

  if (!res.ok) throw new Error(`GA4 API failed: ${res.status}`)
  const data = await res.json()

  let sessions = 0, users = 0, engagement_rate = 0, organic_sessions = 0
  const traffic_sources: { source: string; sessions: number }[] = []

  for (const row of data.rows ?? []) {
    const source = row.dimensionValues?.[0]?.value ?? 'Unknown'
    const s = parseInt(row.metricValues?.[0]?.value ?? '0', 10)
    sessions += s
    users += parseInt(row.metricValues?.[1]?.value ?? '0', 10)
    engagement_rate = parseFloat(row.metricValues?.[2]?.value ?? '0')
    traffic_sources.push({ source, sessions: s })
    if (source.toLowerCase().includes('organic')) organic_sessions += s
  }

  return { sessions, users, engagement_rate, top_pages: [], traffic_sources, organic_sessions }
}
