import { createClient } from '@supabase/supabase-js'

// Uses a free screenshot service — replace with Browserless/Puppeteer for production
export async function captureScreenshot(url: string, requestId: string): Promise<string | null> {
  try {
    const screenshotApiUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`

    const res = await fetch(screenshotApiUrl, {
      headers: { 'User-Agent': 'AsceloAIAuditBot/1.0' },
      signal: AbortSignal.timeout(20000),
    })

    if (!res.ok) return null

    const buffer = await res.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const storagePath = `audit-screenshots/${requestId}.jpg`
    const { error } = await supabase.storage
      .from('agp-public')
      .upload(storagePath, bytes, { contentType: 'image/jpeg', upsert: true })

    if (error) {
      console.error('Screenshot upload error:', error)
      return null
    }

    const { data } = supabase.storage.from('agp-public').getPublicUrl(storagePath)
    return data?.publicUrl ?? null
  } catch (err) {
    console.error('Screenshot capture failed:', err)
    return null
  }
}
