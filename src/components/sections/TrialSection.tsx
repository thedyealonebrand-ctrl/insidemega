import { useState, useEffect } from "react";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { EnergyBar } from "@/components/ui/EnergyBar";
import { GlowButton } from "@/components/ui/GlowButton";
import { Gamepad2, Target, Trophy, Zap } from "lucide-react";

export function TrialSection() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const targetScore = 7000;

  // Simple game simulation - click to score
  const handleClick = () => {
    if (isPlaying) {
      setScore((prev) => Math.min(prev + Math.floor(Math.random() * 100 + 50), targetScore));
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
  };

  const isComplete = score >= targetScore;

  return (
    <section id="trial" className="min-h-screen flex items-center justify-center px-4 py-20">
      <HolographicPanel className="max-w-4xl w-full" variant="purple">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-secondary/20 rounded-full mb-4">
            <Gamepad2 className="w-4 h-4 text-secondary" />
            <span className="font-body text-sm uppercase tracking-wider text-secondary">
              Mission Terminal
            </span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-glow-purple mb-4">
            THE TRIAL
          </h2>
          
          <p className="font-body text-lg text-muted-foreground max-w-md mx-auto">
            Reach <span className="text-primary font-semibold">7,000 points</span> to unlock initiation.
          </p>
        </div>

        {/* Game Frame */}
        <div className="relative mb-8">
          {/* Holographic frame border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-lg opacity-20 blur-sm" />
          
          <div 
            className="relative bg-space-black/80 rounded-lg border border-primary/30 min-h-[300px] flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleClick}
          >
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px"
              }} />
            </div>
            
            {/* Scanlines */}
            <div className="absolute inset-0 scanlines opacity-30" />
            
            {/* Game content */}
            <div className="relative z-10 text-center p-8">
              {!isPlaying ? (
                <div className="space-y-6">
                  <Target className="w-20 h-20 text-primary mx-auto pulse-glow" />
                  <GlowButton variant="primary" onClick={startGame}>
                    <Zap className="w-5 h-5 mr-2" />
                    Initialize Trial
                  </GlowButton>
                </div>
              ) : isComplete ? (
                <div className="space-y-4">
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
                  <h3 className="font-display text-3xl text-primary text-glow-cyan">
                    TRIAL COMPLETE
                  </h3>
                  <p className="text-muted-foreground">
                    You have proven worthy. Proceed to initiation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="font-display text-6xl sm:text-8xl text-primary text-glow-cyan">
                    {score.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground font-body">
                    Click rapidly to accumulate points
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          score > (i + 1) * 1400 ? "bg-primary pulse-glow" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <EnergyBar
          value={score}
          max={targetScore}
          label="Trial Progress"
          className="mb-4"
        />
        
        {/* Status indicators */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400" : "bg-muted"}`} />
            <span className="text-muted-foreground">
              {isPlaying ? "Active" : "Standby"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isComplete ? "bg-primary pulse-glow" : "bg-muted"}`} />
            <span className="text-muted-foreground">
              {isComplete ? "Unlocked" : "Locked"}
            </span>
          </div>
        </div>
      </HolographicPanel>
    </section>
  );
}
