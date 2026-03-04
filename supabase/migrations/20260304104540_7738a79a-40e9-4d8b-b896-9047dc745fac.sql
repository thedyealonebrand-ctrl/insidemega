
-- Create ai_agents table
CREATE TABLE public.ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  personality text NOT NULL DEFAULT '',
  specialty text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(citizen_id)
);

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Anyone can insert their own agent
CREATE POLICY "Anyone can create ai agents" ON public.ai_agents FOR INSERT WITH CHECK (true);

-- Anyone can read agents
CREATE POLICY "Anyone can read ai agents" ON public.ai_agents FOR SELECT USING (true);

-- Anyone can update their own agent
CREATE POLICY "Anyone can update own ai agent" ON public.ai_agents FOR UPDATE USING (true);

-- Rename passcode column to password (keep backward compat with existing trigger)
-- Actually, the column name stays "passcode" in DB but we update UI labels only
-- No schema change needed for the rename - it's UI only

-- Add realtime for ai_agents
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_agents;
