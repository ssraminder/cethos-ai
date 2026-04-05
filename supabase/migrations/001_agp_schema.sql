-- ============================================================
-- AgencyPro (agp_) schema — Supabase project: scnmdbkpjlkitxdoeiaa
-- This file is a RECORD of the already-applied schema.
-- DO NOT RUN — tables already exist in production.
-- ============================================================

-- 1. Company Info
CREATE TABLE IF NOT EXISTS agp_company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL DEFAULT 'Cethos Media',
  logo_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,
  og_image_url TEXT,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  hero_cta_primary TEXT,
  hero_cta_secondary TEXT,
  footer_cta_heading TEXT,
  footer_cta_subtext TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services
CREATE TABLE IF NOT EXISTS agp_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_desc TEXT,
  long_desc TEXT,
  icon_name TEXT,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Service Deliverables
CREATE TABLE IF NOT EXISTS agp_service_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES agp_services(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 4. Case Studies
CREATE TABLE IF NOT EXISTS agp_case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  service_id UUID REFERENCES agp_services(id) ON DELETE SET NULL,
  challenge TEXT,
  solution TEXT,
  featured_image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Case Study Metrics
CREATE TABLE IF NOT EXISTS agp_case_study_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID REFERENCES agp_case_studies(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  prefix TEXT DEFAULT '',
  suffix TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- 6. Testimonials
CREATE TABLE IF NOT EXISTS agp_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  photo_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Team Members
CREATE TABLE IF NOT EXISTS agp_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 8. Clients (Logo Wall)
CREATE TABLE IF NOT EXISTS agp_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 9. Stats
CREATE TABLE IF NOT EXISTS agp_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  numeric_value NUMERIC NOT NULL,
  prefix TEXT DEFAULT '',
  suffix TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- 10. Process Steps
CREATE TABLE IF NOT EXISTS agp_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 11. FAQs
CREATE TABLE IF NOT EXISTS agp_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  service_id UUID REFERENCES agp_services(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0
);

-- 12. Blog Categories
CREATE TABLE IF NOT EXISTS agp_blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

-- 13. Blog Posts
CREATE TABLE IF NOT EXISTS agp_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category_id UUID REFERENCES agp_blog_categories(id) ON DELETE SET NULL,
  tags TEXT[],
  featured_image_url TEXT,
  author_name TEXT,
  author_photo_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Contact Submissions
CREATE TABLE IF NOT EXISTS agp_contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service_interest TEXT,
  budget_range TEXT,
  message TEXT,
  preferred_language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS Policies (apply as needed in Supabase dashboard)
-- ============================================================

-- Public read access for content tables
-- ALTER TABLE agp_services ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read" ON agp_services FOR SELECT USING (true);
-- (Repeat for agp_case_studies, agp_testimonials, agp_blog_posts, etc.)

-- Insert-only for contact submissions
-- ALTER TABLE agp_contact_submissions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Insert only" ON agp_contact_submissions FOR INSERT WITH CHECK (true);
