# Cethos Media — Automated Agent System

## Agents

### 1. CMO Agent (`agp-cmo-agent`)
- **Trigger:** Every Monday 6am UTC (pg_cron)
- **What it does:** Uses GPT-4o to generate 1 unique blog post idea per language (5 total: EN, AR, FR, HI, PA)
- **Output:** Rows in `agp_blog_ideas` with status=pending
- **Then:** Automatically triggers Research Agent for each idea

### 2. Research Agent (`agp-research-agent`)
- **Trigger:** Called by CMO Agent OR daily 8am UTC cron (picks up any missed pending ideas)
- **What it does:**
  1. Fetches pending idea from `agp_blog_ideas`
  2. Writes full 1200-1800 word post in the correct language using GPT-4o
  3. Generates featured image using DALL-E 3
  4. Publishes to `agp_blog_posts` with locale tag
  5. Emails CEO with post preview and link
- **Output:** Published blog post + CEO notification email

### 3. SEO Agent (`agp-seo-agent`)
- **Trigger:** 1st of every month 7am UTC (pg_cron)
- **What it does:**
  1. Fetches HTML of 9 key pages (home, services, case studies, about, contact, + 4 locale homepages)
  2. GPT-4o audits each page for SEO issues
  3. Stores results in `agp_seo_audits`
  4. Emails CEO with score, critical issues, and quick wins

## Required Supabase Secrets (Dashboard → Settings → Edge Function Secrets)
| Secret | Description |
|--------|-------------|
| `OPENAI_API_KEY` | OpenAI API key — GPT-4o for writing + DALL-E 3 for images |
| `CEO_EMAIL` | Email to receive blog notifications and SEO reports |
| `RESEND_API_KEY` | Resend.com API key for sending emails (free: 100/day) |
| `SITE_URL` | Your live domain e.g. https://cethosmedia.com |

## Deployment
```bash
# Deploy all functions
supabase functions deploy agp-cmo-agent --project-ref scnmdbkpjlkitxdoeiaa
supabase functions deploy agp-research-agent --project-ref scnmdbkpjlkitxdoeiaa
supabase functions deploy agp-seo-agent --project-ref scnmdbkpjlkitxdoeiaa

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-... --project-ref scnmdbkpjlkitxdoeiaa
supabase secrets set CEO_EMAIL=your@email.com --project-ref scnmdbkpjlkitxdoeiaa
supabase secrets set RESEND_API_KEY=re_... --project-ref scnmdbkpjlkitxdoeiaa
supabase secrets set SITE_URL=https://cethosmedia.com --project-ref scnmdbkpjlkitxdoeiaa
```

## Cron Setup
Run `supabase/functions/agp-cron-config.sql` in the Supabase SQL Editor.
