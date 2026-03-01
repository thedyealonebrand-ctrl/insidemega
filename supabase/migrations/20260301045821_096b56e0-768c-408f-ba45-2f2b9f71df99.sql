
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop the passcode format constraint that blocks hashed values
ALTER TABLE public.citizens DROP CONSTRAINT IF EXISTS citizen_passcode_format;

-- Create trigger to hash passcodes on insert
CREATE OR REPLACE FUNCTION public.hash_passcode_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.passcode := crypt(NEW.passcode, gen_salt('bf'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

CREATE TRIGGER hash_passcode_before_insert
  BEFORE INSERT ON public.citizens
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_passcode_on_insert();

-- Migrate existing plaintext passcodes to bcrypt hashes
UPDATE public.citizens SET passcode = crypt(passcode, gen_salt('bf'));

-- Update verify function to use bcrypt comparison
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
  WHERE c.name = p_name AND c.passcode = crypt(p_passcode, c.passcode)
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
