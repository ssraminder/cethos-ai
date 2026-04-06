export interface KnowledgeGraphResult {
  found: boolean
  name: string | null
  description: string | null
  types: string[]
  wikipedia_url: string | null
  image_url: string | null
}

export async function checkKnowledgeGraph(query: string): Promise<KnowledgeGraphResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  try {
    const res = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(query)}&key=${apiKey}&limit=3&indent=true`,
      { signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) throw new Error(`Knowledge Graph API failed: ${res.status}`)
    const data = await res.json()

    const items = data?.itemListElement ?? []
    if (items.length === 0) return { found: false, name: null, description: null, types: [], wikipedia_url: null, image_url: null }

    const top = items[0]?.result ?? {}
    return {
      found: true,
      name: top.name ?? null,
      description: top.description ?? top.detailedDescription?.articleBody?.slice(0, 300) ?? null,
      types: top['@type'] ?? [],
      wikipedia_url: top.detailedDescription?.url ?? null,
      image_url: top.image?.contentUrl ?? null,
    }
  } catch {
    return { found: false, name: null, description: null, types: [], wikipedia_url: null, image_url: null }
  }
}
