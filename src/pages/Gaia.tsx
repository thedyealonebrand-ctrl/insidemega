import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import GaiaPlanetBackground from "@/components/gaia/GaiaPlanetBackground";
import GaiaLanding from "@/components/gaia/GaiaLanding";
import GaiaOnboarding from "@/components/gaia/GaiaOnboarding";

type GaiaPhase = "landing" | "onboarding" | "hub";

const Gaia = () => {
  const [phase, setPhase] = useState<GaiaPhase>("landing");

  const handleLand = useCallback(() => setPhase("onboarding"), []);
  const handleLearn = useCallback(() => {
    // For now, scroll or show info — later can be a modal
    setPhase("onboarding");
  }, []);
  const handleOnboardingComplete = useCallback(() => setPhase("hub"), []);

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

        {/* Content */}
        <main className="relative z-20">
          {phase === "landing" && <GaiaLanding onLand={handleLand} onLearn={handleLearn} />}
          {phase === "onboarding" && <GaiaOnboarding onComplete={handleOnboardingComplete} />}
          {phase === "hub" && (
            <div className="min-h-screen flex items-center justify-center">
              <p className="font-display text-2xl text-emerald-400 text-center">
                GAIA-1 Hub — Coming in Phase 2
              </p>
            </div>
          )}
        </main>

        {/* Corner accents — emerald themed */}
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
    </>
  );
};

export default Gaia;
