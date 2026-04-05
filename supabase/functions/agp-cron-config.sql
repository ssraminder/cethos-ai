-- Run these in Supabase SQL Editor to set up pg_cron jobs
-- Requires pg_cron extension (enabled by default on Supabase)

-- 1. CMO Agent — Every Monday at 6:00am UTC
SELECT cron.schedule(
  'agp-cmo-agent-weekly',
  '0 6 * * 1',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/agp-cmo-agent',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 2. Research Agent — Daily at 8:00am UTC (picks up any pending ideas)
SELECT cron.schedule(
  'agp-research-agent-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/agp-research-agent',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{"pick_pending": true}'::jsonb
  );
  $$
);

-- 3. SEO Agent — 1st of every month at 7:00am UTC
SELECT cron.schedule(
  'agp-seo-agent-monthly',
  '0 7 1 * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/agp-seo-agent',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
