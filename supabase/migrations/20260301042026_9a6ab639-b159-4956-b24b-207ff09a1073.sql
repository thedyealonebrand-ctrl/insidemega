
-- Grant SELECT on non-sensitive columns only to anon/authenticated
-- This allows the security_invoker view to work while hiding passcode
GRANT SELECT (id, name, star_sign, talents, avatar, created_at) ON public.citizens TO anon, authenticated;
