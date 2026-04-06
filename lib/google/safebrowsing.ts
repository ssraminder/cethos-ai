export interface SafeBrowsingResult {
  clean: boolean
  threats: { type: string; platform: string; url: string }[]
}

export async function checkSafeBrowsing(url: string): Promise<SafeBrowsingResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set')

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'ascelo-ai-audit', clientVersion: '1.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) throw new Error(`Safe Browsing API failed: ${res.status}`)
    const data = await res.json()

    if (!data.matches || data.matches.length === 0) {
      return { clean: true, threats: [] }
    }

    return {
      clean: false,
      threats: data.matches.map((m: Record<string, Record<string, string>>) => ({
        type: m.threatType ?? 'UNKNOWN',
        platform: m.platformType ?? 'ANY_PLATFORM',
        url: m.threat?.url ?? url,
      })),
    }
  } catch {
    // Fail open — don't block audit if API is down
    return { clean: true, threats: [] }
  }
}
