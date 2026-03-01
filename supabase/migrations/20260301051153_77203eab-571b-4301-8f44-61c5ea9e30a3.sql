
-- Fix 1 & 2: Remove public SELECT on citizens table (exposes passcodes and PII directly)
DROP POLICY IF EXISTS "Anyone can read citizen profiles" ON public.citizens;

-- Fix 3: Recreate citizen_profiles view as SECURITY DEFINER (default) so it can
-- read from citizens internally while blocking direct citizen table reads.
-- This view intentionally excludes the passcode column.
CREATE OR REPLACE VIEW public.citizen_profiles AS
  SELECT id, name, star_sign, talents, avatar, created_at
  FROM public.citizens;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.citizen_profiles TO anon, authenticated;
