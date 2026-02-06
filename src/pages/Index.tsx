import { useRef, useState } from "react";
import SpaceBackground from "@/components/space/SpaceBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { InitiationGame } from "@/components/game/InitiationGame";
import { AccessGateSection } from "@/components/sections/AccessGateSection";
import { StationsSection } from "@/components/sections/StationsSection";

const Index = () => {
  const [trialComplete, setTrialComplete] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const trialRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);
  const stationsRef = useRef<HTMLDivElement>(null);

  const scrollToTrial = () => {
    trialRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAccess = () => {
    accessRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStations = () => {
    stationsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTrialComplete = () => {
    setTrialComplete(true);
    // Auto scroll to access gate after a delay
    setTimeout(() => {
      scrollToAccess();
    }, 2000);
  };

  const handleAccessGranted = () => {
    setAccessGranted(true);
    // Auto scroll to stations after access
    setTimeout(() => {
      scrollToStations();
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* 3D Space Background */}
      <SpaceBackground />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-10 opacity-30" />

      {/* Gradient overlays for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-10 opacity-60" />
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-background pointer-events-none z-10" />

      {/* Light flare effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-10 light-flare" />

      {/* Main Content */}
      <main className="relative z-20">
        {/* Hero Section */}
        <HeroSection 
          onBeginTrial={scrollToTrial} 
          onHowItWorks={scrollToTrial} 
        />

        {/* Trial/Game Section */}
        <section ref={trialRef} id="trial" className="min-h-screen flex items-center justify-center px-4 py-20">
          <InitiationGame 
            onComplete={handleTrialComplete}
            targetScore={7000}
          />
        </section>

        {/* Access Gate */}
        <div ref={accessRef}>
          <AccessGateSection 
            isUnlocked={trialComplete}
            onAccessGranted={handleAccessGranted}
          />
        </div>

        {/* Stations - Only fully visible after access */}
        <div 
          ref={stationsRef}
          className={`transition-opacity duration-1000 ${accessGranted ? "opacity-100" : "opacity-30 pointer-events-none"}`}
        >
          <StationsSection />
        </div>

        {/* Footer */}
        <footer className="relative py-12 text-center border-t border-primary/10">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground/50 mb-4">
            Remember where you were
          </p>
          <p className="font-display text-xl text-primary text-glow-cyan">
            OMEGA REALM
          </p>
        </footer>
      </main>

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-30">
        <div className="absolute top-4 left-4 w-full h-full border-l-2 border-t-2 border-primary/30" />
        <div className="absolute top-2 left-2 w-4 h-4 bg-primary/50 rounded-full blur-sm" />
      </div>
      <div className="fixed top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-30">
        <div className="absolute top-4 right-4 w-full h-full border-r-2 border-t-2 border-primary/30" />
        <div className="absolute top-2 right-2 w-4 h-4 bg-primary/50 rounded-full blur-sm" />
      </div>
      <div className="fixed bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-30">
        <div className="absolute bottom-4 left-4 w-full h-full border-l-2 border-b-2 border-primary/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-secondary/50 rounded-full blur-sm" />
      </div>
      <div className="fixed bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-30">
        <div className="absolute bottom-4 right-4 w-full h-full border-r-2 border-b-2 border-primary/30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-secondary/50 rounded-full blur-sm" />
      </div>
    </div>
  );
};

export default Index;
