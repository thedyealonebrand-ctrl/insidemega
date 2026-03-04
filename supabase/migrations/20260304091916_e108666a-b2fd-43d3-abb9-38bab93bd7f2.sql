
-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create citizens" ON public.citizens;

-- Recreate as PERMISSIVE
CREATE POLICY "Anyone can create citizens"
  ON public.citizens
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
