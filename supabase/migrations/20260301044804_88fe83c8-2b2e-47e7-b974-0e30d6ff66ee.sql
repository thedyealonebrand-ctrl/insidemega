
-- 1. UNIQUE constraint on citizen names (prevents impersonation)
ALTER TABLE public.citizens ADD CONSTRAINT unique_citizen_name UNIQUE(name);

-- 2. Input validation constraints
ALTER TABLE public.signals ADD CONSTRAINT signal_content_length 
  CHECK (char_length(content) >= 1 AND char_length(content) <= 500);

ALTER TABLE public.citizens ADD CONSTRAINT citizen_name_length 
  CHECK (char_length(name) >= 2 AND char_length(name) <= 50);

ALTER TABLE public.citizens ADD CONSTRAINT citizen_passcode_format 
  CHECK (passcode ~ '^[0-9]{4,6}$');

ALTER TABLE public.citizens ADD CONSTRAINT citizen_star_sign_length 
  CHECK (char_length(star_sign) >= 1 AND char_length(star_sign) <= 30);

-- 3. Rate limiting table for passcode attempts
CREATE TABLE public.passcode_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_name text NOT NULL,
  attempt_time timestamptz NOT NULL DEFAULT now(),
  success boolean NOT NULL DEFAULT false
);

ALTER TABLE public.passcode_attempts ENABLE ROW LEVEL SECURITY;

-- Only allow inserts (from the RPC function via SECURITY DEFINER)
-- No public read/write needed
CREATE POLICY "No public access to attempts"
  ON public.passcode_attempts
  FOR SELECT
  USING (false);

-- Index for efficient lookups
CREATE INDEX idx_attempts_name_time ON public.passcode_attempts(citizen_name, attempt_time);

-- Auto-cleanup old attempts (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_attempts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.passcode_attempts WHERE attempt_time < now() - interval '1 hour';
  RETURN NEW;
END;
$$;

CREATE TRIGGER cleanup_attempts_trigger
  AFTER INSERT ON public.passcode_attempts
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_attempts();

-- 4. Replace verify_citizen_passcode with rate-limited version
CREATE OR REPLACE FUNCTION public.verify_citizen_passcode(p_name text, p_passcode text)
RETURNS TABLE(id uuid, name text, star_sign text, talents text[], avatar integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_failures integer;
  found_citizen record;
BEGIN
  -- Check rate limit: max 5 failed attempts in 15 minutes
  SELECT count(*) INTO recent_failures
  FROM public.passcode_attempts
  WHERE citizen_name = p_name
    AND success = false
    AND attempt_time > now() - interval '15 minutes';

  IF recent_failures >= 5 THEN
    -- Log the blocked attempt too
    INSERT INTO public.passcode_attempts (citizen_name, success)
    VALUES (p_name, false);
    RAISE EXCEPTION 'Too many failed attempts. Try again later.';
  END IF;

  -- Attempt verification
  SELECT c.id, c.name, c.star_sign, c.talents, c.avatar
  INTO found_citizen
  FROM public.citizens c
  WHERE c.name = p_name AND c.passcode = p_passcode
  LIMIT 1;

  IF found_citizen IS NULL THEN
    -- Log failed attempt
    INSERT INTO public.passcode_attempts (citizen_name, success)
    VALUES (p_name, false);
    RETURN;
  END IF;

  -- Log successful attempt
  INSERT INTO public.passcode_attempts (citizen_name, success)
  VALUES (p_name, true);

  RETURN QUERY SELECT found_citizen.id, found_citizen.name, found_citizen.star_sign, found_citizen.talents, found_citizen.avatar;
END;
$$;
