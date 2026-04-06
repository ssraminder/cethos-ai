export interface CustomSearchResult {
  indexed_count: number | null
  available: boolean
}

export async function getIndexedPageCount(domain: string): Promise<CustomSearchResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID

  if (!apiKey || !cx) return { indexed_count: null, available: false }

  try {
    // Clean domain for site: query
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const query = `site:${cleanDomain}`

    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=1`,
      { signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) throw new Error(`Custom Search API failed: ${res.status}`)
    const data = await res.json()

    const totalResults = parseInt(data?.searchInformation?.totalResults ?? '0', 10)
    return { indexed_count: totalResults, available: true }
  } catch {
    return { indexed_count: null, available: false }
  }
}
