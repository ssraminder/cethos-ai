export interface NaturalLanguageResult {
  entities: { name: string; type: string; salience: number }[]
  categories: { name: string; confidence: number }[]
  sentiment: { score: number; magnitude: number }
  language: string
}

export async function analyzeContent(text: string): Promise<NaturalLanguageResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  // Truncate to 10k chars (API limit is ~1MB but we keep it cheap)
  const truncated = text.slice(0, 10000)

  try {
    const [entitiesRes, categoriesRes, sentimentRes] = await Promise.all([
      fetch(`https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: truncated }, encodingType: 'UTF8' }),
        signal: AbortSignal.timeout(15000),
      }),
      fetch(`https://language.googleapis.com/v1/documents:classifyText?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: truncated } }),
        signal: AbortSignal.timeout(15000),
      }),
      fetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: truncated }, encodingType: 'UTF8' }),
        signal: AbortSignal.timeout(15000),
      }),
    ])

    const [entData, catData, sentData] = await Promise.all([
      entitiesRes.ok ? entitiesRes.json() as Promise<Record<string, unknown>> : Promise.resolve({} as Record<string, unknown>),
      categoriesRes.ok ? categoriesRes.json() as Promise<Record<string, unknown>> : Promise.resolve({} as Record<string, unknown>),
      sentimentRes.ok ? sentimentRes.json() as Promise<Record<string, unknown>> : Promise.resolve({} as Record<string, unknown>),
    ])

    const entities = (entData.entities as Record<string, unknown>[] | undefined) ?? []
    const categories = (catData.categories as Record<string, unknown>[] | undefined) ?? []
    const docSentiment = sentData.documentSentiment as Record<string, unknown> | undefined

    return {
      entities: entities
        .filter((e) => (e.salience as number) > 0.02)
        .slice(0, 15)
        .map((e) => ({ name: String(e.name), type: String(e.type), salience: Number(e.salience) })),
      categories: categories
        .slice(0, 5)
        .map((c) => ({ name: String(c.name), confidence: Number(c.confidence) })),
      sentiment: {
        score: (docSentiment?.score as number) ?? 0,
        magnitude: (docSentiment?.magnitude as number) ?? 0,
      },
      language: String(entData.language ?? 'en'),
    }
  } catch {
    return { entities: [], categories: [], sentiment: { score: 0, magnitude: 0 }, language: 'en' }
  }
}
