import { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import GaiaPlanetBackground from "@/components/gaia/GaiaPlanetBackground";
import GaiaLanding from "@/components/gaia/GaiaLanding";
import GaiaCitizenCreation from "@/components/gaia/GaiaCitizenCreation";
import GaiaReentry from "@/components/gaia/GaiaReentry";
import GaiaHub from "@/components/gaia/GaiaHub";

type GaiaPhase = "landing" | "citizen" | "reentry" | "beaming" | "hub";

interface CitizenData {
  id: string;
  name: string;
  starSign: string;
  talents: string[];
  avatar: number;
}

const Gaia = () => {
  const [phase, setPhase] = useState<GaiaPhase>("landing");
  const [citizen, setCitizen] = useState<CitizenData | null>(null);
  const [existingCitizenName, setExistingCitizenName] = useState<string | null>(null);

  // Check if returning citizen
  useEffect(() => {
    const stored = localStorage.getItem("gaia-citizen-name");
    if (stored) setExistingCitizenName(stored);
  }, []);

  const handleLand = useCallback(() => setPhase("citizen"), []);
  const handleLearn = useCallback(() => setPhase("citizen"), []);
  const handleReenter = useCallback(() => setPhase("reentry"), []);
  const handleBack = useCallback(() => setPhase("landing"), []);

  const handleCitizenComplete = useCallback(async (data: Omit<CitizenData, "id"> & { passcode: string }) => {
    // Save to database
    const { data: row, error } = await supabase
      .from("citizens")
      .insert({
        name: data.name,
        star_sign: data.starSign,
        talents: data.talents,
        avatar: data.avatar,
        passcode: data.passcode,
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("Failed to save citizen:", error);
      return;
    }

    const fullCitizen: CitizenData = { id: (row as any).id, name: data.name, starSign: data.starSign, talents: data.talents, avatar: data.avatar };
    setCitizen(fullCitizen);
    localStorage.setItem("gaia-citizen-name", data.name);
    setExistingCitizenName(data.name);
    setPhase("beaming");
    setTimeout(() => setPhase("hub"), 2800);
  }, []);

  const handleReentrySuccess = useCallback((data: CitizenData) => {
    setCitizen(data);
    localStorage.setItem("gaia-citizen-name", data.name);
    setPhase("beaming");
    setTimeout(() => setPhase("hub"), 2800);
  }, []);

  return (
    <>
      <Helmet>
        <title>GAIA-1 — The First Living Planet | OMEGA REALM</title>
        <meta
          name="description"
          content="Enter GAIA-1, a living digital planet inside the OMEGA REALM. Connect, create, and shape the future of OnChain Culture."
        />
      </Helmet>

      <div className="relative min-h-screen overflow-x-hidden">
        <GaiaPlanetBackground />

        {/* Atmospheric overlays */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020a14]/60 via-transparent to-[#041a2e]/80" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#020a14]/70" />
        </div>

        {/* Scanlines */}
        <div className="fixed inset-0 pointer-events-none z-10 opacity-15 scanlines" />

        {/* Beam-down transition */}
        {phase === "beaming" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-center animate-beam-sequence">
              <div
                className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1"
                style={{
                  background: "linear-gradient(180deg, hsl(160 84% 50%), transparent)",
                  boxShadow: "0 0 40px 15px hsl(160 84% 50% / 0.3), 0 0 80px 30px hsl(160 84% 50% / 0.15)",
                  animation: "beamDown 1.2s ease-out forwards",
                }}
              />
              <div
                className="fixed inset-0"
                style={{
                  background: "hsl(160 84% 80%)",
                  animation: "beamFlash 2.8s ease-out forwards",
                }}
              />
              <p
                className="relative font-display text-lg sm:text-2xl tracking-[0.3em] uppercase"
                style={{
                  color: "hsl(160 84% 70%)",
                  textShadow: "0 0 30px hsl(160 84% 50% / 0.6)",
                  animation: "beamText 2.8s ease-out forwards",
                }}
              >
                Beaming Down to GAIA-1
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="relative z-20">
          {phase === "landing" && (
            <GaiaLanding
              onLand={handleLand}
              onLearn={handleLearn}
              onReenter={handleReenter}
              hasExistingCitizen={!!existingCitizenName}
            />
          )}
          {phase === "citizen" && <GaiaCitizenCreation onComplete={handleCitizenComplete} />}
          {phase === "reentry" && existingCitizenName && (
            <GaiaReentry
              citizenName={existingCitizenName}
              onSuccess={handleReentrySuccess}
              onBack={handleBack}
            />
          )}
          {phase === "hub" && citizen && <GaiaHub citizen={citizen} />}
        </main>

        {/* Corner accents */}
        <div className="fixed top-0 left-0 w-24 h-24 pointer-events-none z-30">
          <div className="absolute top-4 left-4 w-full h-full border-l-2 border-t-2 border-emerald-500/30" />
          <div className="absolute top-2 left-2 w-3 h-3 bg-emerald-400/50 rounded-full blur-sm" />
        </div>
        <div className="fixed top-0 right-0 w-24 h-24 pointer-events-none z-30">
          <div className="absolute top-4 right-4 w-full h-full border-r-2 border-t-2 border-emerald-500/30" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400/50 rounded-full blur-sm" />
        </div>
        <div className="fixed bottom-0 left-0 w-24 h-24 pointer-events-none z-30">
          <div className="absolute bottom-4 left-4 w-full h-full border-l-2 border-b-2 border-sky-500/30" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-sky-400/50 rounded-full blur-sm" />
        </div>
        <div className="fixed bottom-0 right-0 w-24 h-24 pointer-events-none z-30">
          <div className="absolute bottom-4 right-4 w-full h-full border-r-2 border-b-2 border-sky-500/30" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-sky-400/50 rounded-full blur-sm" />
        </div>
      </div>

      <style>{`
        @keyframes beamDown {
          0% { opacity: 0; transform: translateX(-50%) scaleY(0); transform-origin: top; }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) scaleY(1); transform-origin: top; }
        }
        @keyframes beamFlash {
          0%, 35% { opacity: 0; }
          45% { opacity: 0.8; }
          70% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes beamText {
          0% { opacity: 0; transform: translateY(20px); }
          20% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default Gaia;
