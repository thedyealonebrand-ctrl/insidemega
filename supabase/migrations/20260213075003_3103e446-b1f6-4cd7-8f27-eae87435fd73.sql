
-- 1. Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can read citizens" ON public.citizens;

-- 2. Revoke full SELECT, grant only non-sensitive columns
REVOKE SELECT ON public.citizens FROM anon, authenticated;
GRANT SELECT (id, name, star_sign, talents, avatar, created_at) ON public.citizens TO anon, authenticated;

-- 3. Re-add SELECT policy for RLS (only granted columns are readable)
CREATE POLICY "Anyone can read citizen profiles"
ON public.citizens FOR SELECT USING (true);

-- 4. Create server-side passcode verification function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.verify_citizen_passcode(p_name text, p_passcode text)
RETURNS TABLE(id uuid, name text, star_sign text, talents text[], avatar integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.star_sign, c.talents, c.avatar
  FROM public.citizens c
  WHERE c.name = p_name AND c.passcode = p_passcode
  LIMIT 1;
$$;
