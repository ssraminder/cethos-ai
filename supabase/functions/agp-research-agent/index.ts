import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LOCALE_CONFIG: Record<string, { language: string; market: string; fontNote: string }> = {
  en: { language: 'English', market: 'India, UAE, Canada', fontNote: '' },
  ar: { language: 'Arabic (Modern Standard with Gulf dialect nuances)', market: 'UAE and Arab diaspora', fontNote: 'Write in right-to-left Arabic script.' },
  fr: { language: 'French (Canadian/Quebec)', market: 'Quebec and French Canada', fontNote: 'Use Canadian French spellings and idioms where appropriate.' },
  hi: { language: 'Hindi (Devanagari script)', market: 'Hindi-speaking India', fontNote: 'Write in Hindi Devanagari. Use common Hindi marketing terms.' },
  pa: { language: 'Punjabi (Gurmukhi script)', market: 'Punjab India and Punjabi diaspora', fontNote: 'Write in Punjabi Gurmukhi script. Use authentic Punjabi expressions.' },
}

const AGENCY_CONTEXT = `
Agency: Cethos Media — global digital marketing agency serving India, UAE and Canada.
Services: Performance Marketing, Social Media, SEO, AI Content, WhatsApp/SMS, Political Marketing, Offline Marketing, Brand Strategy, Multilingual Marketing.
USP: AI-powered + human-managed. Cost-effective. Multilingual expertise.
Website: cethosmedia.com
`

// Enforced word count range — reviewed and rewritten by Claude if violated
const MIN_WORDS = 1800
const MAX_WORDS = 2200

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

async function reviewWithClaude(
  content: string,
  idea: Record<string, unknown>,
  config: { language: string; market: string },
  anthropicKey: string
): Promise<{ approved: boolean; score: number; issues: string[]; revised_content: string | null }> {
  const wordCount = countWords(content)

  const reviewPrompt = `You are a senior editorial director at Cethos Media, a B2B digital marketing agency.
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
1. WORD COUNT: Must be ${MIN_WORDS}–${MAX_WORDS} words. Current: ${wordCount}. If outside range, MUST revise.
2. QUALITY: Is content genuinely useful, specific, and non-generic?
3. SEO: Are keywords woven in naturally? Strong H2 structure?
4. CULTURAL FIT: Does it feel local and relevant to ${config.market}?
5. CTA: Is there a clear, compelling call-to-action mentioning Cethos Media?
6. READABILITY: Appropriate tone for B2B, professional but engaging?

Return ONLY valid JSON:
{
  "approved": true/false,
  "word_count": ${wordCount},
  "score": 0-100,
  "issues": ["issue1", "issue2"],
  "improvements": ["specific instruction1", "specific instruction2"],
  "revised_content": null
}

Approve (approved: true) ONLY if ALL of these are met:
- Word count is between ${MIN_WORDS} and ${MAX_WORDS}
- Score is 75 or above
- CTA is present and strong
- No major quality issues

If NOT approved, provide the fully revised content in "revised_content" (complete post, not truncated). The revised content MUST be ${MIN_WORDS}–${MAX_WORDS} words.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: reviewPrompt }],
    }),
  })

  const data = await response.json()
  const rawText = data.content?.[0]?.text ?? '{}'
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude review returned invalid JSON')
  return JSON.parse(jsonMatch[0])
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
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://cethosmedia.com'

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

    // STEP 1: GPT-4o writes the draft (targeting 1800-2200 words)
    const writingPrompt = `${AGENCY_CONTEXT}

You are a senior content strategist and copywriter for Cethos Media.
Write a comprehensive, SEO-optimised blog post for the following brief:

Title: ${idea.title}
Language: ${config.language}
Target Market: ${config.market}
Target Audience: ${idea.target_audience}
Core Angle: ${idea.angle}
Primary Keywords to include naturally: ${idea.keywords?.join(', ')}

${config.fontNote}

REQUIREMENTS — STRICT:
- Length: EXACTLY ${MIN_WORDS}–${MAX_WORDS} words (enforced — do not go under or over)
- Structure: H1 title, introduction, 4-6 H2 sections each with 2-3 paragraphs, H3 subsections where needed, conclusion with CTA
- The post must feel LOCAL — use local market context, local business examples (generic), local pain points
- Incorporate keywords naturally (not stuffed)
- End with a strong CTA mentioning Cethos Media's free strategy audit
- Include a meta description (max 155 chars) at the very start as: META: [your meta description here]
- Write the FULL post in ${config.language}

Return ONLY the blog post content starting with META: on line 1, then the full post.`

    const writeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: writingPrompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })
    const writeData = await writeResponse.json()
    const fullContent = writeData.choices[0].message.content as string

    const metaMatch = fullContent.match(/^META:\s*(.+)$/m)
    const excerpt = metaMatch ? metaMatch[1].trim() : idea.angle
    let content = fullContent.replace(/^META:.+$/m, '').trim()

    // STEP 2: Claude reviews quality, word count, SEO, cultural fit — rewrites if needed
    console.log(`Draft ready. Words: ${countWords(content)}. Sending to Claude for review...`)
    const review = await reviewWithClaude(content, idea, config, anthropicKey)
    console.log(`Claude: approved=${review.approved}, score=${review.score}, words=${review.word_count}`)

    if (!review.approved && review.revised_content) {
      content = review.revised_content
      console.log(`Claude revised. New word count: ${countWords(content)}`)
    }

    // STEP 3: Generate URL-safe slug (before image upload — needed for storage path)
    const slugBase = idea.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
    const slugPrefix = slugBase.length > 4 ? slugBase : `post-${resolvedIdeaId.slice(0, 8)}`
    const slug = `${slugPrefix}-${idea.locale}-${Date.now()}`

    // STEP 4: Generate featured image with gpt-image-1
    const imagePrompt = `Professional marketing blog featured image for an article titled "${idea.title}".
Style: Modern, clean, professional digital marketing agency aesthetic.
Colors: Deep navy (#0A0F1E) background with pink (#EC4899) and cyan (#06B6D4) accents.
No text in the image. Abstract data visualization, global connectivity, or business growth theme.
High quality, suitable for a professional B2B marketing blog.`

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

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(imageRequestBody),
    })
    const imageData = await imageResponse.json()

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

    // STEP 5: Publish to agp_blog_posts
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
        author_name: 'Cethos Media Research Team',
        published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (postError) throw postError

    await supabase.from('agp_blog_ideas').update({ status: 'published' }).eq('id', resolvedIdeaId)

    // STEP 6: Email CEO via Brevo (includes Claude review summary)
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
${imageUrl ? `<p><strong>Featured Image:</strong><br/><img src="${imageUrl}" style="max-width:400px" /></p>` : ''}
<p><a href="${postUrl}" style="background:#06B6D4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Post</a></p>
<hr/>
<p style="color:#999;font-size:12px;">Generated by Cethos Media Research Agent • Reviewed by Claude • ${new Date().toISOString()}</p>
    `
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Cethos Media AI', email: 'noreply@cethos.com' },
        to: [{ email: ceoEmail }],
        subject: `New Post - ${idea.locale.toUpperCase()}: ${idea.title} [Claude: ${review.approved ? 'Approved' : 'Revised'} • ${finalWordCount} words]`,
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
