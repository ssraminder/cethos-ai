import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LOCALES = [
  { code: 'en', name: 'English', market: 'India, UAE, Canada', language: 'English' },
  { code: 'ar', name: 'Arabic', market: 'UAE and Arab diaspora', language: 'Arabic' },
  { code: 'fr', name: 'French Canada', market: 'Quebec and French-speaking Canada', language: 'French (Canadian)' },
  { code: 'hi', name: 'Hindi', market: 'India (Hindi-speaking belt: UP, MP, Rajasthan, Delhi)', language: 'Hindi' },
  { code: 'pa', name: 'Punjabi', market: 'Punjab (India), Punjabi diaspora in Canada and UK', language: 'Punjabi (Gurmukhi script)' },
]

const AGENCY_CONTEXT = `
You are the CMO of Cethos Media, a global digital marketing agency serving India, UAE and Canada.
Services: Performance Marketing (PPC), Social Media Management, SEO & Online Reputation, AI-Powered Content Production, WhatsApp & SMS Campaigns, Political Campaign Marketing, Offline Marketing, Brand Strategy, Multilingual Marketing.
USP: AI-powered tools combined with human strategists. Cost-effective. Multilingual expertise.
Competitors: Traditional agencies, freelancers, local digital shops.
Target clients: SMEs, political candidates, real estate developers, immigration consultants, diaspora-focused businesses.
`

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const openaiKey = Deno.env.get('OPENAI_API_KEY')!
    const ideas = []

    for (const locale of LOCALES) {
      const systemPrompt = `${AGENCY_CONTEXT}
You are generating a blog post idea for the ${locale.name} audience.
Target market: ${locale.market}
The blog must be written in ${locale.language}.
Generate ONE unique, highly relevant blog post idea that:
1. Addresses a real pain point of the target market
2. Incorporates local nuances, cultural context, and region-specific keywords
3. Positions Cethos Media's services as the solution
4. Has strong SEO potential in the target market
5. Is NOT a generic digital marketing post — it must feel local and specific

Return ONLY valid JSON in this exact format:
{
  "title": "the blog post title in ${locale.language}",
  "angle": "1-2 sentence description of the unique angle and why it resonates with this audience",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "target_audience": "specific description of who this post is for"
}`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: systemPrompt }],
          temperature: 0.8,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
      })

      const data = await response.json()
      const idea = JSON.parse(data.choices[0].message.content)

      ideas.push({
        locale: locale.code,
        title: idea.title,
        angle: idea.angle,
        keywords: idea.keywords,
        target_audience: idea.target_audience,
        status: 'pending',
        created_by: 'cmo-agent',
      })
    }

    const { error } = await supabase.from('agp_blog_ideas').insert(ideas)
    if (error) throw error

    // Trigger research agent for each idea
    const { data: pendingIdeas } = await supabase
      .from('agp_blog_ideas')
      .select('id')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5)

    // Invoke research agent asynchronously for each
    for (const idea of (pendingIdeas ?? [])) {
      supabase.functions.invoke('agp-research-agent', {
        body: { idea_id: idea.id },
      }).catch(console.error)
    }

    return new Response(
      JSON.stringify({ success: true, ideas_generated: ideas.length }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('CMO Agent error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
