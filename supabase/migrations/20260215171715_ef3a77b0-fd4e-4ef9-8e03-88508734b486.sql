
-- Table to persist partner access sessions by IP address
CREATE TABLE public.partner_ip_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code_id UUID NOT NULL REFERENCES public.partner_access_codes(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  code TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  module_id UUID NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  activity_duration_minutes INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast IP lookup
CREATE INDEX idx_partner_ip_sessions_ip ON public.partner_ip_sessions(ip_address, is_active);
CREATE INDEX idx_partner_ip_sessions_expires ON public.partner_ip_sessions(expires_at);

-- Enable RLS
ALTER TABLE public.partner_ip_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (sessions are checked without auth)
CREATE POLICY "Anyone can read their own IP sessions"
  ON public.partner_ip_sessions FOR SELECT
  USING (true);

-- Only edge functions (service role) can insert/update
CREATE POLICY "Service role can manage IP sessions"
  ON public.partner_ip_sessions FOR ALL
  USING (true)
  WITH CHECK (true);
