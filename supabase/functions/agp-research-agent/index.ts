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

serve(async (req) => {
  try {
    const body = await req.json()
    const { idea_id, pick_pending } = body

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!
    const brevoKey = Deno.env.get('BREVO_API_KEY')!
    const ceoEmail = Deno.env.get('CEO_EMAIL')!
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://cethosmedia.com'

    // If called from cron with pick_pending=true, grab the next pending idea
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

    // Mark idea as in_progress
    await supabase.from('agp_blog_ideas').update({ status: 'in_progress' }).eq('id', resolvedIdeaId)

    // Fetch the idea
    const { data: idea, error: ideaError } = await supabase
      .from('agp_blog_ideas')
      .select('*')
      .eq('id', resolvedIdeaId)
      .single()
    if (ideaError || !idea) throw new Error('Idea not found')

    const config = LOCALE_CONFIG[idea.locale] ?? LOCALE_CONFIG.en

    // STEP 1: Write the full blog post
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

Requirements:
- Length: 1200-1800 words
- Structure: H1 title, introduction, 4-6 H2 sections with H3 subsections where needed, conclusion with CTA
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
        max_tokens: 3000,
      }),
    })
    const writeData = await writeResponse.json()
    const fullContent = writeData.choices[0].message.content as string

    // Extract meta description
    const metaMatch = fullContent.match(/^META:\s*(.+)$/m)
    const excerpt = metaMatch ? metaMatch[1].trim() : idea.angle
    const content = fullContent.replace(/^META:.+$/m, '').trim()

    // STEP 2: Generate featured image with DALL-E 3
    const imagePrompt = `Professional marketing blog featured image for an article titled "${idea.title}".
Style: Modern, clean, professional digital marketing agency aesthetic.
Colors: Deep navy (#0A0F1E) background with pink (#EC4899) and cyan (#06B6D4) accents.
No text in the image. Abstract data visualization, global connectivity, or business growth theme.
High quality, suitable for a professional B2B marketing blog.`

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      }),
    })
    const imageData = await imageResponse.json()
    const imageUrl = imageData.data?.[0]?.url ?? null

    // STEP 3: Generate URL-safe slug
    const slugBase = idea.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60)
    const slug = `${slugBase}-${idea.locale}-${Date.now()}`

    // STEP 4: Store in agp_blog_posts
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

    // STEP 5: Mark idea as published
    await supabase.from('agp_blog_ideas').update({ status: 'published' }).eq('id', resolvedIdeaId)

    // STEP 6: Email CEO via Brevo
    const postUrl = `${siteUrl}/${idea.locale}/blog/${slug}`
    const emailHtml = `
<h2>New Blog Post Published</h2>
<p><strong>Language:</strong> ${config.language}</p>
<p><strong>Title:</strong> ${idea.title}</p>
<p><strong>Target Audience:</strong> ${idea.target_audience}</p>
<p><strong>Keywords:</strong> ${idea.keywords?.join(', ')}</p>
<p><strong>Excerpt:</strong> ${excerpt}</p>
<p><strong>Featured Image:</strong> ${imageUrl ? `<img src="${imageUrl}" style="max-width:400px" />` : 'No image generated'}</p>
<p><a href="${postUrl}" style="background:#06B6D4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Post</a></p>
<hr/>
<p style="color:#999;font-size:12px;">Generated by Cethos Media Research Agent • ${new Date().toISOString()}</p>
    `
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Cethos Media AI', email: 'noreply@cethos.com' },
        to: [{ email: ceoEmail }],
        subject: `📝 New Blog Post Published — ${idea.locale.toUpperCase()}: ${idea.title}`,
        htmlContent: emailHtml,
      }),
    })

    return new Response(
      JSON.stringify({ success: true, post_id: post.id, slug, locale: idea.locale }),
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
