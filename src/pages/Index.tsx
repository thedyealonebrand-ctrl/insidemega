import CountdownTimer from "@/components/CountdownTimer";
import GlitchText from "@/components/GlitchText";
import ParticleField from "@/components/ParticleField";
import BaseLogo from "@/components/BaseLogo";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Particle Background */}
      <ParticleField />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-10" />
      <div className="fixed inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none z-10" />

      {/* Main Content */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Top badge */}
        <div className="animate-reveal mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/30 backdrop-blur-sm border border-primary/20 rounded-full">
            <span className="w-2 h-2 bg-primary rounded-full pulse-glow" />
            <span className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground">
              Incoming Transmission
            </span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="animate-reveal-delay-1 font-display text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] text-center leading-none mb-4">
          <GlitchText text="OMEGA" className="text-foreground" />
          <br />
          <span className="text-primary text-glow">REALM</span>
        </h1>

        {/* Tagline */}
        <div className="animate-reveal-delay-2 max-w-xl text-center mb-12">
          <p className="font-body text-lg sm:text-xl text-muted-foreground mb-2">
            They thought this was music.
          </p>
          <p className="font-display text-2xl sm:text-3xl text-foreground">
            It's <span className="text-primary text-glow">infrastructure</span>.
          </p>
        </div>

        {/* Countdown */}
        <div className="animate-reveal-delay-3 mb-12">
          <p className="text-center font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Opens Saturday
          </p>
          <CountdownTimer />
        </div>

        {/* CTA */}
        <div className="animate-reveal-delay-4 flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button className="group relative px-8 py-4 bg-primary text-primary-foreground font-display text-xl uppercase tracking-wider overflow-hidden transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]">
            <span className="relative z-10">Enter The Realm</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1s_linear_infinite] transition-opacity" />
          </button>
          <button className="px-8 py-4 border border-primary/30 text-foreground font-display text-xl uppercase tracking-wider hover:border-primary hover:bg-primary/10 transition-all">
            Learn More
          </button>
        </div>

        {/* Built on Base */}
        <div className="animate-reveal-delay-4 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Built on
          </span>
          <BaseLogo className="w-6 h-6 text-[#0052FF]" />
          <span className="font-body text-sm font-semibold text-foreground">
            Base
          </span>
        </div>

        {/* Bottom tagline */}
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-body text-xs uppercase tracking-[0.4em] text-muted-foreground/50">
          Remember where you were
        </p>
      </main>

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 pointer-events-none z-20" />
      <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/20 pointer-events-none z-20" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary/20 pointer-events-none z-20" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 pointer-events-none z-20" />
    </div>
  );
};

export default Index;
