import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Ten distinct colour palette + style combinations — every post gets a different look
const VISUAL_STYLES = [
  // 0 — Cosmic violet
  'background: deep cosmic violet #1A0A2E, accent colours: electric gold #F5C518 and neon magenta #FF2D9B. Style: isometric 3D floating data cubes and holographic dashboards suspended in a starfield, gold node connections, magenta pulse rings radiating outward',
  // 1 — Emerald forest
  'background: deep forest green #0B2818, accent colours: bright emerald #00E676 and warm amber #FFB300. Style: macro photography of circuit traces forming organic root systems, emerald glowing nodes, amber data streams flowing like sap between leaves of light',
  // 2 — Warm ember
  'background: near-black warm charcoal #1C1108, accent colours: burnt orange #FF6B1A and molten gold #FFD700. Style: topographic contour map where lines morph into growth charts and funnel diagrams, orange peak lines on dark terrain, gold highlights on peaks',
  // 3 — Arctic ice
  'background: cold slate #0D1B2A, accent colours: ice blue #7FDBFF and silver white #E8F4F8. Style: crystalline lattice formations, sharp geometric facets refracting ice-blue light, silver reflections, clean Scandinavian minimalism meets digital precision',
  // 4 — Desert dusk
  'background: warm deep terracotta #1E0F00, accent colours: coral #FF6B6B and sand gold #E8C07D. Style: aerial satellite view of desert trade routes morphing into digital ad networks, coral connection lines, sand-gold hub nodes pulsing with data',
  // 5 — Neon noir
  'background: true black #050505, accent colours: neon green #39FF14 and hot pink #FF007F. Style: particle physics visualisation, thousands of luminous dots forming brand identity explosions, neon green trails, hot pink energy bursts, cyberpunk editorial',
  // 6 — Ocean deep
  'background: deep ocean teal #021B1A, accent colours: turquoise #00CED1 and bioluminescent white #E0FFFF. Style: underwater light-ray aesthetics, kelp-like data streams rising, turquoise bioluminescent nodes glowing, waves of information flowing upward',
  // 7 — Burgundy luxury
  'background: deep burgundy #1A0010, accent colours: rose gold #B76E79 and champagne #F7E7CE. Style: architectural photography perspective, soaring abstract towers with rose-gold data overlays reflected in a champagne mirrored floor, luxury B2B editorial feel',
  // 8 — Electric indigo
  'background: deep indigo #0D0628, accent colours: vivid purple #8A2BE2 and bright cyan #00FFFF. Style: ink-wash calligraphy brushstrokes dissolving into data streams, purple ink clouds, cyan neon veins threading through, East-meets-tech aesthetic',
  // 9 — Sunrise gradient
  'background: deep rose-navy gradient from #1A0520 to #0A1020, accent colours: sunrise coral #FF6B9D and dawn yellow #FFE066. Style: brutalist graphic design, bold geometric shapes colliding mid-canvas, sunrise coral blocks, dawn yellow impact zones, oversized abstract forms',
]

// Topic-to-visual-concept map for richer prompts
function buildImagePrompt(
  title: string,
  excerpt: string,
  locale: string,
  postIndex: number
): string {
  const style = VISUAL_STYLES[postIndex % VISUAL_STYLES.length]

  const localeContext: Record<string, string> = {
    en: 'global B2B digital marketing, modern corporate aesthetic',
    ar: 'Middle East UAE market, geometric Islamic pattern motifs fused with digital elements',
    fr: 'Quebec Canadian market, clean Francophone editorial sensibility',
    hi: 'Indian subcontinent market, vibrant yet professional Desi digital landscape',
    pa: 'Punjab India and diaspora market, culturally resonant Punjabi visual heritage meeting modern tech',
  }

  const context = localeContext[locale] ?? localeContext.en

  return `You are a world-class art director at a top-tier creative agency (think R/GA, AKQA, Huge).

Blog Post to Visualise:
Title: ${title}
Excerpt: ${excerpt.slice(0, 200)}
Market/Locale Context: ${context}

Colour Palette & Style Direction (USE THESE EXACT COLOURS — do not swap for navy):
${style}

Your task: Write ONE highly specific, detailed image generation prompt that:
1. Directly captures the CORE CONCEPT of this specific post (not generic "digital marketing")
2. Uses EXACTLY the colour palette and style from the direction above — no substitutions
3. Creates a hero image that is VISUALLY DISTINCT from a plain dark navy background
4. Contains zero text, logos, people, faces, or watermarks
5. Uses concrete visual metaphors tied to the post topic — not vague terms like "abstract shapes"
6. Would result in a stunning 1536×1024 hero image

Start the prompt directly with the scene description. Apply the style direction faithfully.

Return ONLY the image generation prompt. No preamble, no explanation, no quotes. Just the prompt.`
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
  const openaiKey = Deno.env.get('OPENAI_API_KEY')!

  try {
    const body = await req.json().catch(() => ({}))
    const { post_id, pick_next, refresh_all } = body

    // ── Determine which post(s) to process ───────────────────────────────
    if (refresh_all) {
      // Return list of all post IDs so caller can invoke one-by-one
      const { data: posts } = await supabase
        .from('agp_blog_posts')
        .select('id, title, locale')
        .eq('published', true)
        .order('published_at', { ascending: true })

      return new Response(
        JSON.stringify({ posts: posts ?? [], message: 'Invoke with each post_id individually' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    let targetPostId = post_id

    if (!targetPostId && pick_next) {
      // Pick next post — cycle through all posts by taking the one updated least recently
      const { data: next } = await supabase
        .from('agp_blog_posts')
        .select('id')
        .eq('published', true)
        .order('updated_at', { ascending: true })
        .limit(1)
        .single()
      targetPostId = next?.id
    }

    if (!targetPostId) {
      return new Response(
        JSON.stringify({ error: 'Provide post_id, pick_next: true, or refresh_all: true' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch the post ────────────────────────────────────────────────────
    const { data: post, error: postError } = await supabase
      .from('agp_blog_posts')
      .select('id, title, excerpt, content, locale, slug, featured_image_url')
      .eq('id', targetPostId)
      .single()

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: 'Post not found', detail: postError }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Determine style index from slug hash for consistent but varied assignment
    const slugHash = post.slug.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
    const styleIndex = slugHash % VISUAL_STYLES.length

    const artDirectionPrompt = buildImagePrompt(
      post.title,
      post.excerpt ?? post.content?.slice(0, 200) ?? '',
      post.locale ?? 'en',
      styleIndex
    )

    // ── Step 1: Claude Haiku art-directs the image prompt ─────────────────
    console.log(`[ImageRefresh] Generating prompt for: ${post.title.slice(0, 60)}`)
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 500,
        messages: [{ role: 'user', content: artDirectionPrompt }],
      }),
    })
    const claudeData = await claudeRes.json()
    const imagePrompt = claudeData.content?.[0]?.text?.trim()
    if (!imagePrompt) throw new Error('Claude returned empty image prompt')
    console.log(`[ImageRefresh] Prompt (${imagePrompt.length} chars): ${imagePrompt.slice(0, 100)}...`)

    // ── Step 2: OpenAI gpt-image-1 renders the image ──────────────────────
    console.log('[ImageRefresh] Generating image with gpt-image-1...')
    const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: imagePrompt,
        n: 1,
        size: '1536x1024',
        quality: 'medium',
        output_format: 'png',
      }),
    })
    const imageData = await imageRes.json()
    const b64 = imageData.data?.[0]?.b64_json
    if (!b64) throw new Error(`gpt-image-1 failed: ${JSON.stringify(imageData).slice(0, 200)}`)

    // ── Step 3: Upload to Supabase Storage ────────────────────────────────
    const storagePath = `blog-images/${post.slug}-refreshed.png`
    const imageBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const { error: uploadError } = await supabase.storage
      .from('agp-public')
      .upload(storagePath, imageBytes, { contentType: 'image/png', upsert: true })

    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`)

    const { data: publicData } = supabase.storage.from('agp-public').getPublicUrl(storagePath)
    const newImageUrl = publicData?.publicUrl

    // ── Step 4: Update the blog post ──────────────────────────────────────
    const { error: updateError } = await supabase
      .from('agp_blog_posts')
      .update({
        featured_image_url: newImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id)

    if (updateError) throw new Error(`DB update failed: ${updateError.message}`)

    console.log(`[ImageRefresh] Done — ${post.slug}`)

    return new Response(
      JSON.stringify({
        success: true,
        post_id: post.id,
        slug: post.slug,
        locale: post.locale,
        title: post.title.slice(0, 80),
        image_url: newImageUrl,
        image_prompt_preview: imagePrompt.slice(0, 150),
        style_used: VISUAL_STYLES[styleIndex].slice(0, 60) + '...',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[ImageRefresh] Error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
