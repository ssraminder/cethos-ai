import { createClient } from '@supabase/supabase-js'

export interface SiteGraphic {
  id: string
  page_path: string
  section: string
  slot_name: string
  image_url: string | null
  alt_text: string | null
  width: number | null
  height: number | null
}

export async function getPageGraphics(pagePath: string, locale: string = 'en'): Promise<SiteGraphic[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  try {
    const supabase = createClient(url, key)
    const { data } = await supabase
      .from('agp_graphics')
      .select('*')
      .eq('page_path', pagePath)
      .eq('locale', locale)
      .eq('active', true)
      .order('sort_order')
    return (data as SiteGraphic[]) ?? []
  } catch {
    return []
  }
}

export function getGraphic(graphics: SiteGraphic[], section: string, slot: string): SiteGraphic | null {
  return graphics.find(g => g.section === section && g.slot_name === slot) ?? null
}
