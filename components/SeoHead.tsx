import { getSeoConfig } from '@/lib/seo'

interface Props {
  pagePath: string
  locale: string
  fallbackPath?: string
}

/**
 * Server component that renders JSON-LD schema scripts and hreflang link tags.
 * Place at the top of each page's JSX return — Next.js hoists script tags correctly.
 * Metadata (title, description, OG, robots, alternates) is handled separately
 * via generateSeoMetadata() in each page's generateMetadata export.
 */
export async function SeoHead({ pagePath, locale, fallbackPath }: Props) {
  let schemas: Record<string, unknown>[] = []
  let hreflang: Record<string, string> = {}

  try {
    const config = await getSeoConfig(pagePath, locale, fallbackPath)
    schemas = config?.schema_json ?? []
    hreflang = config?.hreflang ?? {}
  } catch {
    // agp_seo_config may not exist yet — render nothing
  }

  if (schemas.length === 0 && Object.keys(hreflang).length === 0) {
    return null
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {Object.entries(hreflang).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
    </>
  )
}
