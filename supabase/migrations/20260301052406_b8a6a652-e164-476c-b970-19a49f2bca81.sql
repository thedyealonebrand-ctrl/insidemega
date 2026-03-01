
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Recreate the hash trigger function to use extensions.gen_salt and extensions.crypt
CREATE OR REPLACE FUNCTION public.hash_passcode_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.passcode := extensions.crypt(NEW.passcode, extensions.gen_salt('bf'));
  RETURN NEW;
END;
$$;

-- Recreate the verify function to use extensions.crypt
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
  SELECT count(*) INTO recent_failures
  FROM public.passcode_attempts
  WHERE citizen_name = p_name
    AND success = false
    AND attempt_time > now() - interval '15 minutes';

  IF recent_failures >= 5 THEN
    INSERT INTO public.passcode_attempts (citizen_name, success)
    VALUES (p_name, false);
    RAISE EXCEPTION 'Too many failed attempts. Try again later.';
  END IF;

  SELECT c.id, c.name, c.star_sign, c.talents, c.avatar
  INTO found_citizen
  FROM public.citizens c
  WHERE c.name = p_name AND c.passcode = extensions.crypt(p_passcode, c.passcode)
  LIMIT 1;

  IF found_citizen IS NULL THEN
    INSERT INTO public.passcode_attempts (citizen_name, success)
    VALUES (p_name, false);
    RETURN;
  END IF;

  INSERT INTO public.passcode_attempts (citizen_name, success)
  VALUES (p_name, true);

  RETURN QUERY SELECT found_citizen.id, found_citizen.name, found_citizen.star_sign, found_citizen.talents, found_citizen.avatar;
END;
$$;

-- Recreate the trigger on citizens table
DROP TRIGGER IF EXISTS hash_passcode_trigger ON public.citizens;
CREATE TRIGGER hash_passcode_trigger
  BEFORE INSERT ON public.citizens
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_passcode_on_insert();

-- Also recreate the cleanup trigger
DROP TRIGGER IF EXISTS cleanup_attempts_trigger ON public.passcode_attempts;
CREATE TRIGGER cleanup_attempts_trigger
  AFTER INSERT ON public.passcode_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_attempts();
