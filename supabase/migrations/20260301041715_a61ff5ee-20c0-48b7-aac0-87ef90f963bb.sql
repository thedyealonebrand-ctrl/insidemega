
-- =====================================================
-- FIX 1: Secure passcode column from public reads
-- Create a secure view that excludes passcode and
-- direct the app to use it for public citizen lookups
-- =====================================================

-- Create a view that excludes passcode for public use
CREATE OR REPLACE VIEW public.citizen_profiles AS
SELECT id, name, star_sign, talents, avatar, created_at
FROM public.citizens;

-- Enable RLS-like access on the view by granting to anon/authenticated
GRANT SELECT ON public.citizen_profiles TO anon, authenticated;

-- Revoke direct SELECT on citizens table from public roles
-- (the verify_citizen_passcode SECURITY DEFINER function still has access)
REVOKE SELECT ON public.citizens FROM anon, authenticated;

-- Re-grant INSERT so citizen creation still works
GRANT INSERT ON public.citizens TO anon, authenticated;

-- =====================================================
-- FIX 2: Restrict signals UPDATE to energy column only
-- =====================================================

-- Create a trigger that prevents updating anything except energy
CREATE OR REPLACE FUNCTION public.restrict_signal_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow energy column to change
  IF NEW.citizen_id != OLD.citizen_id
     OR NEW.content != OLD.content
     OR NEW.signal_type != OLD.signal_type
     OR NEW.id != OLD.id
     OR NEW.created_at != OLD.created_at
  THEN
    RAISE EXCEPTION 'Only the energy field can be updated';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_signal_energy_only
  BEFORE UPDATE ON public.signals
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_signal_update();
