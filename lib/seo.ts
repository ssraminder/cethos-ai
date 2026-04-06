import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

interface SeoConfig {
  page_path: string
  locale: string
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  robots: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  og_type: string | null
  schema_json: Record<string, unknown>[] | null
  hreflang: Record<string, string> | null
  custom_head_tags: string[] | null
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * Fetch SEO config for a given page path and locale.
 * Priority order:
 *   1. pagePath + locale (exact match)
 *   2. pagePath + 'en'  (locale fallback)
 *   3. fallbackPath + locale (path fallback — used for non-en home pages)
 *   4. fallbackPath + 'en'
 *
 * Uses a single DB query and picks the best match by priority score.
 */
export async function getSeoConfig(
  pagePath: string,
  locale: string,
  fallbackPath?: string
): Promise<SeoConfig | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  try {
    const paths =
      fallbackPath && fallbackPath !== pagePath
        ? [pagePath, fallbackPath]
        : [pagePath]
    const localeFilter = locale !== 'en' ? [locale, 'en'] : ['en']

    const { data } = await supabase
      .from('agp_seo_config')
      .select('*')
      .in('page_path', paths)
      .in('locale', localeFilter)

    if (!data || data.length === 0) return null

    // Score: pagePath match = +2, locale match = +1
    const score = (row: SeoConfig) =>
      (row.page_path === pagePath ? 2 : 0) + (row.locale === locale ? 1 : 0)

    const sorted = (data as SeoConfig[]).sort((a, b) => score(b) - score(a))
    return sorted[0] ?? null
  } catch {
    return null
  }
}

/**
 * Returns a Next.js Metadata object built from agp_seo_config.
 * Falls back to `overrides` when no DB record is found (graceful degradation).
 */
export async function generateSeoMetadata(
  pagePath: string,
  locale: string,
  overrides?: Partial<Metadata>,
  fallbackPath?: string
): Promise<Metadata> {
  let config: SeoConfig | null = null
  try {
    config = await getSeoConfig(pagePath, locale, fallbackPath)
  } catch {
    // agp_seo_config may not exist yet — degrade gracefully
  }

  if (!config) {
    return overrides ?? { title: 'Ascelo AI' }
  }

  return {
    title: config.meta_title ?? (overrides?.title as string | undefined) ?? 'Ascelo AI',
    description: config.meta_description ?? undefined,
    robots: (config.robots ?? 'index, follow') as string,
    alternates: {
      canonical: config.canonical_url ?? undefined,
      languages: config.hreflang
        ? (Object.fromEntries(Object.entries(config.hreflang)) as Record<string, string>)
        : undefined,
    },
    openGraph: {
      title: config.og_title ?? config.meta_title ?? undefined,
      description: config.og_description ?? config.meta_description ?? undefined,
      images: config.og_image ? [config.og_image] : [],
      type: (config.og_type as 'website' | 'article') ?? 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.og_title ?? config.meta_title ?? undefined,
      description: config.og_description ?? config.meta_description ?? undefined,
      images: config.og_image ? [config.og_image] : undefined,
    },
  }
}

/**
 * Returns the schema_json array for a page (for JSON-LD rendering).
 */
export async function getSeoSchemas(
  pagePath: string,
  locale: string,
  fallbackPath?: string
): Promise<Record<string, unknown>[]> {
  try {
    const config = await getSeoConfig(pagePath, locale, fallbackPath)
    return config?.schema_json ?? []
  } catch {
    return []
  }
}

/**
 * Returns the hreflang map for a page.
 */
export async function getHreflangLinks(
  pagePath: string,
  locale: string,
  fallbackPath?: string
): Promise<Record<string, string>> {
  try {
    const config = await getSeoConfig(pagePath, locale, fallbackPath)
    return config?.hreflang ?? {}
  } catch {
    return {}
  }
}
