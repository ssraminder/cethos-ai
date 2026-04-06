-- ============================================================
-- agp_graphics — database-driven image slots for any page/section
-- Applied to Supabase project scnmdbkpjlkitxdoeiaa via MCP migration tool
-- ============================================================

CREATE TABLE IF NOT EXISTS agp_graphics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path    text NOT NULL,          -- e.g. '/', '/about', '/services'
  section      text NOT NULL,          -- e.g. 'hero', 'team', 'services'
  slot_name    text NOT NULL,          -- e.g. 'background', 'card_1', 'feature'
  image_url    text,                   -- full URL (Supabase Storage or CDN)
  alt_text     text,
  width        integer,
  height       integer,
  locale       text NOT NULL DEFAULT 'en',
  active       boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- One active graphic per slot per locale per page
CREATE UNIQUE INDEX IF NOT EXISTS agp_graphics_slot_locale_idx
  ON agp_graphics (page_path, section, slot_name, locale);

CREATE INDEX IF NOT EXISTS agp_graphics_page_idx
  ON agp_graphics (page_path, locale, active);
