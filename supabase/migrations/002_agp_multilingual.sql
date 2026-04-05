-- Migration 002: Add multilingual columns to agp_ tables

ALTER TABLE agp_services
  ADD COLUMN title_ar text,
  ADD COLUMN short_desc_ar text,
  ADD COLUMN long_desc_ar text,
  ADD COLUMN title_fr text,
  ADD COLUMN short_desc_fr text,
  ADD COLUMN long_desc_fr text,
  ADD COLUMN title_hi text,
  ADD COLUMN short_desc_hi text,
  ADD COLUMN long_desc_hi text,
  ADD COLUMN title_pa text,
  ADD COLUMN short_desc_pa text,
  ADD COLUMN long_desc_pa text;

ALTER TABLE agp_case_studies
  ADD COLUMN title_ar text,
  ADD COLUMN challenge_ar text,
  ADD COLUMN solution_ar text,
  ADD COLUMN title_fr text,
  ADD COLUMN challenge_fr text,
  ADD COLUMN solution_fr text,
  ADD COLUMN title_hi text,
  ADD COLUMN challenge_hi text,
  ADD COLUMN solution_hi text,
  ADD COLUMN title_pa text,
  ADD COLUMN challenge_pa text,
  ADD COLUMN solution_pa text;

ALTER TABLE agp_testimonials
  ADD COLUMN quote_ar text,
  ADD COLUMN quote_fr text,
  ADD COLUMN quote_hi text,
  ADD COLUMN quote_pa text;

ALTER TABLE agp_faqs
  ADD COLUMN question_ar text,
  ADD COLUMN answer_ar text,
  ADD COLUMN question_fr text,
  ADD COLUMN answer_fr text,
  ADD COLUMN question_hi text,
  ADD COLUMN answer_hi text,
  ADD COLUMN question_pa text,
  ADD COLUMN answer_pa text;

ALTER TABLE agp_blog_posts
  ADD COLUMN title_ar text,
  ADD COLUMN excerpt_ar text,
  ADD COLUMN content_ar text,
  ADD COLUMN title_fr text,
  ADD COLUMN excerpt_fr text,
  ADD COLUMN content_fr text,
  ADD COLUMN title_hi text,
  ADD COLUMN excerpt_hi text,
  ADD COLUMN content_hi text,
  ADD COLUMN title_pa text,
  ADD COLUMN excerpt_pa text,
  ADD COLUMN content_pa text;

ALTER TABLE agp_company_info
  ADD COLUMN tagline_ar text,
  ADD COLUMN tagline_fr text,
  ADD COLUMN tagline_hi text,
  ADD COLUMN tagline_pa text,
  ADD COLUMN hero_cta_primary_ar text,
  ADD COLUMN hero_cta_primary_fr text,
  ADD COLUMN hero_cta_primary_hi text,
  ADD COLUMN hero_cta_primary_pa text;
