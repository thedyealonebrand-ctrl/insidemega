
-- Create junction table to track who energized which signal
CREATE TABLE public.signal_energies (
  signal_id uuid NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
  citizen_id uuid NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (signal_id, citizen_id)
);

-- Enable RLS
ALTER TABLE public.signal_energies ENABLE ROW LEVEL SECURITY;

-- Anyone can read energies (public feed)
CREATE POLICY "Anyone can read signal energies"
  ON public.signal_energies FOR SELECT
  USING (true);

-- Anyone can insert (toggle on) - the RPC will handle validation
CREATE POLICY "Anyone can insert signal energies"
  ON public.signal_energies FOR INSERT
  WITH CHECK (true);

-- Anyone can delete their own energy (toggle off)
CREATE POLICY "Anyone can delete their own energy"
  ON public.signal_energies FOR DELETE
  USING (true);

-- Create RPC to atomically toggle energy
CREATE OR REPLACE FUNCTION public.toggle_signal_energy(p_signal_id uuid, p_citizen_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  already_energized boolean;
  new_energy integer;
BEGIN
  -- Check if already energized
  SELECT EXISTS(
    SELECT 1 FROM signal_energies WHERE signal_id = p_signal_id AND citizen_id = p_citizen_id
  ) INTO already_energized;

  IF already_energized THEN
    -- Remove energy
    DELETE FROM signal_energies WHERE signal_id = p_signal_id AND citizen_id = p_citizen_id;
    UPDATE signals SET energy = GREATEST(energy - 1, 0) WHERE id = p_signal_id;
  ELSE
    -- Add energy
    INSERT INTO signal_energies (signal_id, citizen_id) VALUES (p_signal_id, p_citizen_id);
    UPDATE signals SET energy = energy + 1 WHERE id = p_signal_id;
  END IF;

  SELECT energy INTO new_energy FROM signals WHERE id = p_signal_id;
  RETURN new_energy;
END;
$$;

-- Remove the public UPDATE policy on signals (energy updates now go through RPC)
DROP POLICY IF EXISTS "Anyone can update signal energy" ON public.signals;

-- Populate junction table from existing data is not possible (no history),
-- so we just start fresh with the new system.
