-- Audit request lifecycle table
CREATE TABLE IF NOT EXISTS agp_audit_requests (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_url              text NOT NULL,
  full_name                text NOT NULL,
  email                    text NOT NULL,
  company_name             text,
  phone                    text,
  country                  text,
  consent                  boolean NOT NULL DEFAULT false,
  email_verified           boolean NOT NULL DEFAULT false,
  status                   text NOT NULL DEFAULT 'pending_verify',
  -- 'pending_verify' | 'verified' | 'free_running' | 'free_complete'
  -- | 'paid_pending' | 'paid_running' | 'paid_complete' | 'failed'
  teaser_results           jsonb,
  free_audit_results       jsonb,
  paid_audit_results       jsonb,
  screenshot_url           text,
  stripe_session_id        text,
  stripe_payment_intent_id text,
  ip_address               text,
  report_token             text UNIQUE DEFAULT gen_random_uuid()::text,
  -- Phase 10: Google OAuth tokens (stored encrypted in application layer)
  gsc_access_token         text,
  gsc_refresh_token        text,
  ga4_property_id          text,
  gsc_connected            boolean NOT NULL DEFAULT false,
  ga4_connected            boolean NOT NULL DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- OTP table — DB-backed, not Supabase Auth
CREATE TABLE IF NOT EXISTS agp_audit_otps (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_request_id uuid NOT NULL REFERENCES agp_audit_requests(id) ON DELETE CASCADE,
  otp_code         text NOT NULL,
  expires_at       timestamptz NOT NULL,
  attempts         int NOT NULL DEFAULT 0,
  verified         boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Indexes for rate limiting and lookup performance
CREATE INDEX IF NOT EXISTS idx_audit_requests_email_created ON agp_audit_requests (email, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_requests_ip_created ON agp_audit_requests (ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_requests_url_created ON agp_audit_requests (website_url, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_requests_report_token ON agp_audit_requests (report_token);
CREATE INDEX IF NOT EXISTS idx_audit_requests_status ON agp_audit_requests (status);
CREATE INDEX IF NOT EXISTS idx_audit_otps_request_verified ON agp_audit_otps (audit_request_id, verified, expires_at);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION agp_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER agp_audit_requests_updated_at
  BEFORE UPDATE ON agp_audit_requests
  FOR EACH ROW EXECUTE FUNCTION agp_update_updated_at();

-- Disable RLS (using service role key server-side)
ALTER TABLE agp_audit_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE agp_audit_otps DISABLE ROW LEVEL SECURITY;
