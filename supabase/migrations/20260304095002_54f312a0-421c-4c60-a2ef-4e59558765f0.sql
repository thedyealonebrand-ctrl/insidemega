-- Block all direct SELECT on citizens table (passcode column must never be exposed)
-- Safe reads go through the citizen_profiles SECURITY DEFINER view which excludes passcode
CREATE POLICY "No direct select on citizens"
  ON public.citizens
  FOR SELECT
  TO anon, authenticated
  USING (false);