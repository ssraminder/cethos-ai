export interface VisionImageResult {
  url: string
  labels: string[]
  safe: boolean
  explicit_content: boolean
  dominant_colors: string[]
}

export interface VisionResult {
  images_analyzed: number
  results: VisionImageResult[]
  any_explicit: boolean
}

export async function analyzeImages(imageUrls: string[]): Promise<VisionResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  // Cap at 20 images
  const urls = imageUrls.slice(0, 20)
  if (urls.length === 0) return { images_analyzed: 0, results: [], any_explicit: false }

  try {
    const requests = urls.map((url) => ({
      image: { source: { imageUri: url } },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 5 },
        { type: 'SAFE_SEARCH_DETECTION' },
        { type: 'IMAGE_PROPERTIES' },
      ],
    }))

    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
      signal: AbortSignal.timeout(20000),
    })

    if (!res.ok) throw new Error(`Vision API failed: ${res.status}`)
    const data = await res.json()

    let any_explicit = false
    const results: VisionImageResult[] = (data.responses ?? []).map(
      (r: Record<string, unknown>, i: number) => {
        const safe = r.safeSearchAnnotation as Record<string, string> ?? {}
        const explicit = ['LIKELY', 'VERY_LIKELY'].includes(safe.adult ?? '') ||
          ['LIKELY', 'VERY_LIKELY'].includes(safe.violence ?? '')
        if (explicit) any_explicit = true

        const labels = ((r.labelAnnotations ?? []) as Record<string, unknown>[])
          .map((l: Record<string, unknown>) => String(l.description))

        const colors = ((r.imagePropertiesAnnotation as Record<string, unknown>)?.dominantColors as Record<string, unknown>)
          ?.colors as Record<string, unknown>[] ?? []
        const dominant_colors = colors
          .slice(0, 3)
          .map((c: Record<string, unknown>) => {
            const px = c.color as Record<string, number> ?? {}
            return `rgb(${px.red ?? 0},${px.green ?? 0},${px.blue ?? 0})`
          })

        return {
          url: urls[i],
          labels,
          safe: !explicit,
          explicit_content: explicit,
          dominant_colors,
        }
      }
    )

    return { images_analyzed: urls.length, results, any_explicit }
  } catch {
    return { images_analyzed: 0, results: [], any_explicit: false }
  }
}
