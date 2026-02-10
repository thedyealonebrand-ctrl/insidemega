import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Rocket, Satellite } from "lucide-react";

interface HeroSectionProps {
  onBeginTrial: () => void;
  onHowItWorks: () => void;
}

export function HeroSection({ onBeginTrial, onHowItWorks }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Light flare effects */}
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl light-flare" />
      <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-secondary/10 rounded-full blur-3xl light-flare" style={{ animationDelay: "2s" }} />
      
      {/* Status badge */}
      <div className="animate-reveal mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-muted/30 backdrop-blur-sm border border-primary/30 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full pulse-glow" />
          <span className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground">
            System Online
          </span>
        </div>
      </div>

      {/* Main Title */}
      <div className="animate-reveal-delay-1 text-center perspective-1000 mb-8">
        <h1 className="font-display text-3xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight tracking-wider">
          <span className="block text-muted-foreground mb-2 text-lg sm:text-4xl md:text-5xl lg:text-6xl">ENTER</span>
          <span className="block text-glow-cyan">
            <span className="text-primary">O</span>
            <span className="text-foreground">.</span>
            <span className="text-primary">M</span>
            <span className="text-foreground">.</span>
            <span className="text-primary">E</span>
            <span className="text-foreground">.</span>
            <span className="text-primary">G</span>
            <span className="text-foreground">.</span>
            <span className="text-primary">A</span>
            <span className="text-foreground mx-2 sm:mx-4">REALM</span>
          </span>
        </h1>
      </div>

      {/* Tagline */}
      <HolographicPanel className="animate-reveal-delay-2 max-w-2xl text-center mb-12" floating={false}>
        <p className="font-display text-xl sm:text-2xl text-foreground mb-3">
          Music. Culture. Onchain.
        </p>
        <p className="font-body text-muted-foreground text-lg">
          This is not a website. This is a{" "}
          <span className="text-primary text-glow-cyan">system</span>.
        </p>
      </HolographicPanel>

      {/* CTA Buttons */}
      <div className="animate-reveal-delay-3 flex flex-col sm:flex-row items-center gap-4">
        <GlowButton
          variant="primary"
          size="lg"
          icon={<Rocket className="w-5 h-5" />}
          onClick={onBeginTrial}
        >
          Begin The Trial
        </GlowButton>
        
        <GlowButton
          variant="ghost"
          size="lg"
          icon={<Satellite className="w-5 h-5" />}
          onClick={onHowItWorks}
        >
          How It Works
        </GlowButton>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-reveal-delay-3">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="font-body text-xs uppercase tracking-[0.3em]">Scroll to explore</span>
          <div className="w-6 h-10 border border-primary/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
