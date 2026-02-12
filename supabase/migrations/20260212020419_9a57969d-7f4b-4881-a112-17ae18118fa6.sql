
-- Citizens table for persistent citizen profiles
CREATE TABLE public.citizens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  star_sign TEXT NOT NULL,
  talents TEXT[] NOT NULL DEFAULT '{}',
  avatar INTEGER NOT NULL DEFAULT 0,
  passcode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Signals table (posts/feed)
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  signal_type TEXT NOT NULL DEFAULT 'thought',
  energy INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Citizens: anyone can create, read all, but only update own (matched by id stored in app)
CREATE POLICY "Anyone can create citizens" ON public.citizens FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read citizens" ON public.citizens FOR SELECT USING (true);

-- Signals: anyone can create, read, and update energy
CREATE POLICY "Anyone can read signals" ON public.signals FOR SELECT USING (true);
CREATE POLICY "Anyone can create signals" ON public.signals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update signal energy" ON public.signals FOR UPDATE USING (true);

-- Enable realtime for signals
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;
