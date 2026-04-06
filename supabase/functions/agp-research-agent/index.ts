import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LOCALE_CONFIG: Record<string, { language: string; market: string; fontNote: string }> = {
  en: { language: 'English', market: 'Global', fontNote: '' },
  ar: { language: 'Arabic (Modern Standard with Gulf dialect nuances)', market: 'UAE and Arab diaspora', fontNote: 'Write in right-to-left Arabic script.' },
  fr: { language: 'French (Canadian/Quebec)', market: 'Quebec and French Canada', fontNote: 'Use Canadian French spellings and idioms where appropriate.' },
  hi: { language: 'Hindi (Devanagari script)', market: 'Hindi-speaking India', fontNote: 'Write in Hindi Devanagari. Use common Hindi marketing terms.' },
  pa: { language: 'Punjabi (Gurmukhi script)', market: 'Punjab India and Punjabi diaspora', fontNote: 'Write in Punjabi Gurmukhi script. Use authentic Punjabi expressions.' },
}

const AGENCY_CONTEXT = `
Agency: Ascelo AI — global digital marketing agency and AI solutions consultancy serving clients worldwide.
Services: Performance Marketing, Social Media, SEO, AI Content, WhatsApp/SMS, Political Marketing, Offline Marketing, Brand Strategy, Multilingual Marketing.
USP: AI-powered + human-managed. Cost-effective. Multilingual expertise.
Website: ascelo.ai
`

const MIN_WORDS = 1800
const MAX_WORDS = 2200

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

// Claude writes the initial draft
async function writeWithClaude(
  idea: Record<string, unknown>,
  config: { language: string; market: string; fontNote: string },
  anthropicKey: string
): Promise<string> {
  const writingPrompt = `${AGENCY_CONTEXT}

You are a senior content strategist and copywriter for Ascelo AI.
Write a comprehensive, SEO-optimised blog post for the following brief:

Title: ${idea.title}
Language: ${config.language}
Target Market: ${config.market}
Target Audience: ${idea.target_audience}
Core Angle: ${idea.angle}
Primary Keywords to include naturally: ${(idea.keywords as string[])?.join(', ')}

${config.fontNote}

REQUIREMENTS — STRICT:
- Length: EXACTLY ${MIN_WORDS}–${MAX_WORDS} words (enforced — do not go under or over)
- Structure: H1 title, introduction, 4-6 H2 sections each with 2-3 paragraphs, H3 subsections where needed, conclusion with CTA
- Must feel LOCAL — local market context, local business examples, local pain points
- Incorporate keywords naturally (not stuffed)
- End with a strong CTA mentioning Ascelo AI's free strategy audit
- Include a meta description (max 155 chars) at the very start as: META: [your meta description here]
- Write the FULL post in ${config.language}

Return ONLY the blog post content starting with META: on line 1, then the full post.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: writingPrompt }],
    }),
  })
  const data = await res.json()
  const content = data.content?.[0]?.text
  if (!content) throw new Error(`Claude writer: empty response — ${JSON.stringify(data)}`)
  return content
}

// Claude reviews quality, word count, SEO fit — rewrites if needed
async function reviewWithClaude(
  content: string,
  idea: Record<string, unknown>,
  config: { language: string; market: string },
  anthropicKey: string
): Promise<{ approved: boolean; score: number; issues: string[]; revised_content: string | null }> {
  const wordCount = countWords(content)

  const prompt = `You are a senior editorial director at Ascelo AI, a B2B digital marketing agency and AI solutions consultancy.
Review the following blog post draft and return a JSON assessment.

Blog Brief:
- Title: ${idea.title}
- Target Language: ${config.language}
- Target Market: ${config.market}
- Target Audience: ${idea.target_audience}
- Core Angle: ${idea.angle}
- Keywords: ${(idea.keywords as string[])?.join(', ')}

Word Count: ${wordCount} (Required: ${MIN_WORDS}–${MAX_WORDS} words)

Draft Content:
${content.slice(0, 6000)}

Review criteria:
1. WORD COUNT: Must be ${MIN_WORDS}–${MAX_WORDS} words. If outside range, MUST revise.
2. QUALITY: Genuinely useful, specific, non-generic?
3. SEO: Keywords woven in naturally? Strong H2 structure?
4. CULTURAL FIT: Feels local and relevant to ${config.market}?
5. CTA: Clear, compelling call-to-action mentioning Ascelo AI?
6. READABILITY: B2B professional but engaging tone?

Return ONLY valid JSON:
{
  "approved": true/false,
  "word_count": ${wordCount},
  "score": 0-100,
  "issues": ["issue1", "issue2"],
  "improvements": ["instruction1", "instruction2"],
  "revised_content": null
}

Approve ONLY if: word count ${MIN_WORDS}–${MAX_WORDS} AND score ≥75 AND strong CTA present.
If NOT approved, put the complete revised post in "revised_content" (${MIN_WORDS}–${MAX_WORDS} words, do not truncate).`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  const raw = data.content?.[0]?.text ?? '{}'
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Claude review: invalid JSON response')
  return JSON.parse(match[0])
}

// Claude generates a bespoke, art-directed image prompt for gpt-image-1
async function generateImagePrompt(
  title: string,
  excerpt: string,
  content: string,
  locale: string,
  market: string,
  anthropicKey: string
): Promise<string> {
  const prompt = `You are a world-class art director specialising in B2B digital marketing imagery.
Your job: write a single, highly detailed image generation prompt for a blog post featured image.

Blog Post Details:
- Title: ${title}
- Target Market: ${market}
- Locale: ${locale}
- Excerpt: ${excerpt}
- Content sample: ${content.slice(0, 800)}

Brand Design System:
- Background: deep navy #0A0F1E
- Primary accent: electric pink #EC4899
- Secondary accent: cyan #06B6D4
- Style: premium B2B agency aesthetic, inspired by AKQA, R/GA, Huge
- No text, logos, or watermarks in the image
- No people or faces
- Abstract, conceptual, data-driven visuals

Create a prompt that:
1. Directly reflects the SPECIFIC topic of this blog post (not generic "digital marketing")
2. Uses abstract visual metaphors relevant to the subject matter
3. Incorporates the brand colour palette naturally
4. Feels premium, editorial, award-winning
5. Would look stunning as a 1536×1024 hero image

Think like a top creative director — what single visual metaphor best captures this article's essence?

Return ONLY the image prompt text — no preamble, no explanation, no quotes. Just the prompt.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  const imagePrompt = data.content?.[0]?.text?.trim() ?? ''
  if (!imagePrompt) throw new Error('Claude image prompt: empty response')
  console.log(`Claude image prompt: ${imagePrompt.slice(0, 120)}...`)
  return imagePrompt
}

serve(async (req) => {
  try {
    const body = await req.json()
    const { idea_id, pick_pending } = body

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    const imageModel = Deno.env.get('OPENAI_IMAGE_MODEL') ?? 'gpt-image-1'
    const brevoKey = Deno.env.get('BREVO_API_KEY')!
    const ceoEmail = Deno.env.get('CEO_EMAIL')!
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://ascelo.ai'

    let resolvedIdeaId = idea_id
    if (!resolvedIdeaId && pick_pending) {
      const { data: pending } = await supabase
        .from('agp_blog_ideas')
        .select('id')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      if (!pending) {
        return new Response(
          JSON.stringify({ success: true, message: 'No pending ideas to process' }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
      resolvedIdeaId = pending.id
    }

    if (!resolvedIdeaId) throw new Error('idea_id is required')

    await supabase.from('agp_blog_ideas').update({ status: 'in_progress' }).eq('id', resolvedIdeaId)

    const { data: idea, error: ideaError } = await supabase
      .from('agp_blog_ideas')
      .select('*')
      .eq('id', resolvedIdeaId)
      .single()
    if (ideaError || !idea) throw new Error('Idea not found')

    const config = LOCALE_CONFIG[idea.locale] ?? LOCALE_CONFIG.en

    // STEP 1: Claude Sonnet writes the draft (1800–2200 words)
    console.log('Claude Sonnet writing draft...')
    const fullContent = await writeWithClaude(idea, config, anthropicKey)
    console.log(`Draft ready. Words: ${countWords(fullContent)}`)

    const metaMatch = fullContent.match(/^META:\s*(.+)$/m)
    const excerpt = metaMatch ? metaMatch[1].trim() : idea.angle
    let content = fullContent.replace(/^META:.+$/m, '').trim()

    // STEP 2: Claude Opus reviews & rewrites if needed
    console.log(`Draft words: ${countWords(content)}. Sending to Claude Opus for review...`)
    const review = await reviewWithClaude(content, idea, config, anthropicKey)
    console.log(`Claude review: approved=${review.approved}, score=${review.score}, words=${review.word_count}`)

    if (!review.approved && review.revised_content) {
      content = review.revised_content
      console.log(`Claude revised. New word count: ${countWords(content)}`)
    }

    // STEP 3: Generate slug (before image upload — needed for storage path)
    const slugBase = idea.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
    const slugPrefix = slugBase.length > 4 ? slugBase : `post-${resolvedIdeaId.slice(0, 8)}`
    const slug = `${slugPrefix}-${idea.locale}-${Date.now()}`

    // STEP 4: Claude Haiku generates a bespoke image prompt
    console.log('Claude Haiku generating image prompt...')
    const imagePrompt = await generateImagePrompt(
      idea.title as string,
      excerpt,
      content,
      idea.locale as string,
      config.market,
      anthropicKey
    )

    // STEP 5: gpt-image-1 generates the featured image using Claude's prompt
    const isGptImage1 = imageModel === 'gpt-image-1'
    const imageRequestBody: Record<string, unknown> = {
      model: imageModel,
      prompt: imagePrompt,
      n: 1,
      size: isGptImage1 ? '1536x1024' : '1792x1024',
    }
    if (isGptImage1) {
      imageRequestBody.quality = 'medium'
      imageRequestBody.output_format = 'png'
    } else {
      imageRequestBody.quality = 'standard'
    }

    const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(imageRequestBody),
    })
    const imageData = await imageRes.json()

    let imageUrl: string | null = null
    if (isGptImage1) {
      const b64 = imageData.data?.[0]?.b64_json
      if (b64) {
        const imageBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
        const storagePath = `blog-images/${slug}.png`
        const { error: uploadError } = await supabase.storage
          .from('agp-public')
          .upload(storagePath, imageBytes, { contentType: 'image/png', upsert: true })
        if (!uploadError) {
          const { data: publicData } = supabase.storage.from('agp-public').getPublicUrl(storagePath)
          imageUrl = publicData?.publicUrl ?? null
        }
      }
    } else {
      imageUrl = imageData.data?.[0]?.url ?? null
    }

    // STEP 6: Publish to agp_blog_posts
    const finalWordCount = countWords(content)
    const { data: post, error: postError } = await supabase
      .from('agp_blog_posts')
      .insert({
        title: idea.title,
        slug,
        excerpt,
        content,
        locale: idea.locale,
        tags: idea.keywords ?? [],
        featured_image_url: imageUrl,
        author_name: 'Ascelo AI Research Team',
        published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (postError) throw postError

    await supabase.from('agp_blog_ideas').update({ status: 'published' }).eq('id', resolvedIdeaId)

    // STEP 7: Email CEO via Brevo
    const postUrl = `${siteUrl}/${idea.locale}/blog/${slug}`
    const reviewSummary = review.issues?.length
      ? `<p><strong>Claude Review:</strong> ${review.approved ? 'Approved' : 'Revised'} | Score: ${review.score}/100 | Words: ${finalWordCount}</p><ul>${review.issues.map((i: string) => `<li>${i}</li>`).join('')}</ul>`
      : `<p><strong>Claude Review:</strong> Approved | Score: ${review.score}/100 | Words: ${finalWordCount}</p>`

    const emailHtml = `
<h2>New Blog Post Published</h2>
<p><strong>Language:</strong> ${config.language}</p>
<p><strong>Title:</strong> ${idea.title}</p>
<p><strong>Target Audience:</strong> ${idea.target_audience}</p>
<p><strong>Keywords:</strong> ${idea.keywords?.join(', ')}</p>
<p><strong>Excerpt:</strong> ${excerpt}</p>
${reviewSummary}
<p><strong>Image Prompt (by Claude Haiku):</strong><br/><em style="color:#666;font-size:12px">${imagePrompt.slice(0, 200)}...</em></p>
${imageUrl ? `<p><strong>Featured Image:</strong><br/><img src="${imageUrl}" style="max-width:400px;border-radius:8px" /></p>` : '<p><em>Image generation failed</em></p>'}
<p><a href="${postUrl}" style="background:#06B6D4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Post</a></p>
<hr/>
<p style="color:#999;font-size:12px;">Claude Sonnet wrote · Claude Opus reviewed · Claude Haiku art-directed · gpt-image-1 rendered · ${new Date().toISOString()}</p>
    `

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Ascelo AI', email: 'noreply@ascelo.ai' },
        to: [{ email: ceoEmail }],
        subject: `New Post — ${idea.locale.toUpperCase()}: ${idea.title} [Claude: ${review.approved ? '✓ Approved' : '↺ Revised'} · ${finalWordCount}w]`,
        htmlContent: emailHtml,
      }),
    })

    return new Response(
      JSON.stringify({
        success: true,
        post_id: post.id,
        slug,
        locale: idea.locale,
        word_count: finalWordCount,
        claude_approved: review.approved,
        claude_score: review.score,
        has_image: !!imageUrl,
        image_prompt_preview: imagePrompt.slice(0, 150),
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Research Agent error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
