import { useState } from "react";
import { Bot, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GaiaAgentCreationProps {
  citizen: {
    id: string;
    name: string;
    starSign: string;
    talents: string[];
  };
  onComplete: () => void;
  onSkip: () => void;
}

const SPECIALTIES = [
  "Navigator", "Strategist", "Curator", "Analyst",
  "Creator", "Protector", "Explorer", "Diplomat",
];

export default function GaiaAgentCreation({ citizen, onComplete, onSkip }: GaiaAgentCreationProps) {
  const [agentName, setAgentName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ personality: string; greeting: string } | null>(null);
  const [error, setError] = useState("");

  const canGenerate = agentName.trim().length >= 2 && specialty !== "";

  const handleGenerate = async () => {
    if (!canGenerate || generating) return;
    setGenerating(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-agent", {
        body: {
          citizenName: citizen.name,
          starSign: citizen.starSign,
          talents: citizen.talents,
          agentName: agentName.trim(),
          specialty,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data);

      // Save to database
      await supabase.from("ai_agents").insert({
        citizen_id: citizen.id,
        agent_name: agentName.trim(),
        personality: data.personality || "",
        specialty,
      });
    } catch (e: any) {
      setError(e.message || "Failed to generate agent. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(280 40% 20% / 0.3), hsl(200 40% 20% / 0.2))",
              border: "1px solid hsl(280 50% 50% / 0.3)",
            }}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-display text-[10px] tracking-[0.3em] uppercase text-purple-300/80">AI Agent Lab</span>
          </div>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, hsl(280 80% 65%), hsl(200 100% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Your Agent
          </h2>
          <p className="font-body text-sm text-sky-100/50">
            Generate a personalized AI companion for your journey on GAIA-1
          </p>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* Agent Name */}
            <div className="text-center">
              <label className="font-display text-[10px] tracking-[0.3em] uppercase text-emerald-400/50 block mb-2">
                Agent Name
              </label>
              <input
                type="text"
                maxLength={20}
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Name your agent..."
                className="w-full max-w-sm mx-auto block px-5 py-3.5 rounded-lg font-display text-sm tracking-wider text-center outline-none transition-all duration-300 focus:scale-[1.02]"
                style={{
                  background: "hsl(220 30% 8% / 0.8)",
                  border: "1px solid hsl(280 50% 30% / 0.3)",
                  color: "hsl(280 80% 75%)",
                  boxShadow: "0 0 20px hsl(280 50% 50% / 0.05)",
                }}
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="font-display text-[10px] tracking-[0.3em] uppercase text-emerald-400/50 block mb-3 text-center">
                Specialty
              </label>
              <div className="flex flex-wrap gap-2.5 justify-center max-w-md mx-auto">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpecialty(s)}
                    className="px-4 py-2.5 rounded-full font-display text-[11px] tracking-wider uppercase transition-all duration-300 hover:scale-105"
                    style={{
                      background: specialty === s
                        ? "linear-gradient(135deg, hsl(280 60% 25% / 0.5), hsl(200 60% 25% / 0.4))"
                        : "hsl(220 25% 8% / 0.6)",
                      border: `1px solid ${specialty === s ? "hsl(280 60% 50% / 0.5)" : "hsl(220 20% 20% / 0.3)"}`,
                      color: specialty === s ? "hsl(280 80% 80%)" : "hsl(220 15% 55%)",
                      boxShadow: specialty === s ? "0 0 15px hsl(280 60% 50% / 0.15)" : "none",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="font-body text-sm text-red-400/80 text-center">{error}</p>
            )}

            {/* Generate button */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || generating}
                className="group relative px-10 py-4 rounded-lg font-display text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, hsl(280 40% 20% / 0.4), hsl(200 40% 20% / 0.3))",
                  border: "1px solid hsl(280 50% 50% / 0.4)",
                  color: "hsl(280 80% 75%)",
                  boxShadow: "0 0 25px hsl(280 50% 50% / 0.1)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      GENERATING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      GENERATE AGENT
                    </>
                  )}
                </span>
              </button>
              <button
                onClick={onSkip}
                className="font-body text-xs text-sky-200/30 hover:text-sky-200/60 transition-colors"
              >
                Skip for now →
              </button>
            </div>
          </div>
        ) : (
          /* Result display */
          <div className="space-y-6 text-center">
            <div
              className="rounded-xl p-6 max-w-md mx-auto"
              style={{
                background: "linear-gradient(135deg, hsl(280 30% 10% / 0.5), hsl(220 30% 8% / 0.5))",
                border: "1px solid hsl(280 50% 40% / 0.3)",
                boxShadow: "0 0 40px hsl(280 50% 50% / 0.1)",
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: "linear-gradient(135deg, hsl(280 60% 40%), hsl(200 60% 50%))",
                  boxShadow: "0 0 30px hsl(280 60% 50% / 0.3)",
                }}
              >
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-lg tracking-wider text-purple-300 mb-1">{agentName}</h3>
              <p className="font-display text-[10px] tracking-[0.3em] uppercase text-sky-200/40 mb-4">{specialty}</p>
              <p className="font-body text-sm text-sky-100/60 leading-relaxed mb-4">{result.personality}</p>
              <div
                className="rounded-lg p-3 mt-4"
                style={{
                  background: "hsl(220 30% 8% / 0.6)",
                  border: "1px solid hsl(280 40% 30% / 0.2)",
                }}
              >
                <p className="font-body text-xs text-purple-300/70 italic">"{result.greeting}"</p>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="group relative px-10 py-4 rounded-lg font-display text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(160 60% 20% / 0.4), hsl(200 60% 20% / 0.3))",
                border: "1px solid hsl(160 60% 40% / 0.5)",
                color: "hsl(160 84% 70%)",
                boxShadow: "0 0 25px hsl(160 84% 50% / 0.15)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                ENTER GAIA-1
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
