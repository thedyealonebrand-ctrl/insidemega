
-- Fix the SECURITY DEFINER view warning by using SECURITY INVOKER
CREATE OR REPLACE VIEW public.citizen_profiles
WITH (security_invoker = true) AS
SELECT id, name, star_sign, talents, avatar, created_at
FROM public.citizens;
