import { useState, useEffect, useCallback, useRef } from "react";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { EnergyBar } from "@/components/ui/EnergyBar";
import { GlowButton } from "@/components/ui/GlowButton";
import { Gamepad2, Target, Trophy, Zap, Star, Sparkles } from "lucide-react";

interface InitiationGameProps {
  onComplete: () => void;
  targetScore?: number;
}

interface FloatingPoint {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface TargetOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  value: number;
  speed: number;
}

export function InitiationGame({ onComplete, targetScore = 7000 }: InitiationGameProps) {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [combo, setCombo] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([]);
  const [targets, setTargets] = useState<TargetOrb[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const pointIdRef = useRef(0);
  const targetIdRef = useRef(0);

  // Generate random position within game area
  const getRandomPosition = useCallback(() => {
    const padding = 60;
    return {
      x: padding + Math.random() * (100 - padding * 2 / 3),
      y: padding + Math.random() * (100 - padding * 2 / 3),
    };
  }, []);

  // Spawn new targets
  const spawnTarget = useCallback(() => {
    const pos = getRandomPosition();
    const newTarget: TargetOrb = {
      id: targetIdRef.current++,
      x: pos.x,
      y: pos.y,
      size: 40 + Math.random() * 30,
      value: Math.floor(50 + Math.random() * 100),
      speed: 2 + Math.random() * 3,
    };
    setTargets((prev) => [...prev.slice(-8), newTarget]); // Keep max 9 targets
  }, [getRandomPosition]);

  // Handle target click
  const handleTargetClick = (target: TargetOrb, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newCombo = combo + 1;
    const comboMultiplier = Math.min(1 + newCombo * 0.1, 3);
    const points = Math.floor(target.value * comboMultiplier);
    
    setScore((prev) => {
      const newScore = prev + points;
      if (newScore >= targetScore && !isComplete) {
        setIsComplete(true);
        setIsPlaying(false);
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        onComplete();
      }
      return newScore;
    });
    
    setCombo(newCombo);
    
    // Add floating point animation
    setFloatingPoints((prev) => [
      ...prev,
      {
        id: pointIdRef.current++,
        x: target.x,
        y: target.y,
        value: points,
      },
    ]);
    
    // Remove target
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    
    // Clear floating points after animation
    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== pointIdRef.current - 1));
    }, 1000);
  };

  // Handle background click (miss - reset combo)
  const handleMiss = () => {
    if (isPlaying) {
      setCombo(0);
    }
  };

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setTargets([]);
    setFloatingPoints([]);
    setIsComplete(false);
  };

  // Game loop - spawn targets
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      spawnTarget();
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, spawnTarget]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isComplete, score, highScore]);

  // Move targets
  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setTargets((prev) =>
        prev.map((target) => ({
          ...target,
          x: target.x + (Math.random() - 0.5) * target.speed,
          y: target.y + (Math.random() - 0.5) * target.speed,
        })).map((target) => ({
          ...target,
          x: Math.max(10, Math.min(90, target.x)),
          y: Math.max(10, Math.min(90, target.y)),
        }))
      );
    }, 100);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  // Auto-remove old targets
  useEffect(() => {
    if (!isPlaying) return;

    const cleanupInterval = setInterval(() => {
      setTargets((prev) => prev.slice(-6));
    }, 3000);

    return () => clearInterval(cleanupInterval);
  }, [isPlaying]);

  const progressPercentage = Math.min((score / targetScore) * 100, 100);

  return (
    <HolographicPanel className="max-w-4xl w-full" variant="purple">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-secondary/20 rounded-full mb-4">
          <Gamepad2 className="w-4 h-4 text-secondary" />
          <span className="font-body text-sm uppercase tracking-wider text-secondary">
            Initiation Terminal
          </span>
        </div>
        
        <h2 className="font-display text-4xl sm:text-5xl text-foreground text-glow-purple mb-2">
          THE TRIAL
        </h2>
        
        <p className="font-body text-lg text-muted-foreground">
          Reach <span className="text-primary font-semibold">{targetScore.toLocaleString()} points</span> to unlock the realm.
        </p>
      </div>

      {/* Stats Bar */}
      {isPlaying && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/30 rounded-lg border border-primary/20">
            <div className="font-display text-2xl text-primary">{timeLeft}s</div>
            <div className="font-body text-xs text-muted-foreground uppercase">Time Left</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg border border-secondary/20">
            <div className="font-display text-2xl text-secondary">{combo}x</div>
            <div className="font-body text-xs text-muted-foreground uppercase">Combo</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg border border-glow-blue/20">
            <div className="font-display text-2xl text-glow-blue">{highScore.toLocaleString()}</div>
            <div className="font-body text-xs text-muted-foreground uppercase">High Score</div>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="relative mb-6">
        {/* Holographic frame border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-lg opacity-30 blur-sm" />
        
        <div 
          ref={gameAreaRef}
          className="relative bg-space-black/90 rounded-lg border border-primary/30 h-[350px] overflow-hidden cursor-crosshair"
          onClick={handleMiss}
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px"
            }} />
          </div>
          
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines opacity-20" />
          
          {/* Game content */}
          <div className="relative z-10 w-full h-full">
            {!isPlaying && !isComplete && timeLeft === 60 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <Target className="w-24 h-24 text-primary mx-auto pulse-glow" />
                  <div>
                    <h3 className="font-display text-2xl text-foreground mb-2">Target Practice</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Click the glowing orbs to score points. Build combos for multipliers!
                    </p>
                  </div>
                  <GlowButton variant="primary" onClick={startGame}>
                    <Zap className="w-5 h-5 mr-2" />
                    Initialize Trial
                  </GlowButton>
                </div>
              </div>
            )}
            
            {!isPlaying && !isComplete && timeLeft === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="font-display text-6xl text-muted-foreground">TIME'S UP</div>
                  <div className="font-display text-3xl text-primary">
                    {score.toLocaleString()} POINTS
                  </div>
                  <p className="text-muted-foreground">
                    {score >= targetScore 
                      ? "Congratulations! You passed the trial!"
                      : `You needed ${(targetScore - score).toLocaleString()} more points`
                    }
                  </p>
                  <GlowButton variant="primary" onClick={startGame}>
                    <Zap className="w-5 h-5 mr-2" />
                    Try Again
                  </GlowButton>
                </div>
              </div>
            )}
            
            {isComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Trophy className="w-24 h-24 text-yellow-400 mx-auto animate-bounce" />
                  <h3 className="font-display text-4xl text-primary text-glow-cyan">
                    TRIAL COMPLETE
                  </h3>
                  <p className="font-display text-2xl text-foreground">
                    {score.toLocaleString()} POINTS
                  </p>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    You have proven worthy. The realm awaits. Proceed to claim your access.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Target orbs */}
            {isPlaying && targets.map((target) => (
              <button
                key={target.id}
                onClick={(e) => handleTargetClick(target, e)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 active:scale-95"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: target.size,
                  height: target.size,
                }}
              >
                <div 
                  className="w-full h-full rounded-full bg-gradient-to-br from-primary via-glow-cyan to-secondary animate-pulse"
                  style={{
                    boxShadow: `
                      0 0 20px hsl(var(--primary) / 0.6),
                      0 0 40px hsl(var(--primary) / 0.4),
                      inset 0 0 15px hsl(var(--star-white) / 0.3)
                    `,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-1/2 h-1/2 text-primary-foreground" />
                  </div>
                </div>
              </button>
            ))}
            
            {/* Floating points */}
            {floatingPoints.map((point) => (
              <div
                key={point.id}
                className="absolute pointer-events-none font-display text-xl text-primary animate-[floatUp_1s_ease-out_forwards]"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
              >
                +{point.value}
              </div>
            ))}
            
            {/* Score display during game */}
            {isPlaying && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="font-display text-5xl sm:text-6xl text-primary text-glow-cyan">
                  {score.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <EnergyBar
          value={score}
          max={targetScore}
          label="Trial Progress"
        />
      </div>
      
      {/* Milestone indicators */}
      <div className="flex justify-between mb-6">
        {[0, 1750, 3500, 5250, 7000].map((milestone, i) => (
          <div key={milestone} className="flex flex-col items-center">
            <div className={`
              w-4 h-4 rounded-full border-2 transition-colors
              ${score >= milestone 
                ? "bg-primary border-primary pulse-glow" 
                : "bg-muted/30 border-muted-foreground/30"
              }
            `} />
            <span className="font-body text-xs text-muted-foreground mt-1">
              {milestone > 0 ? `${(milestone/1000).toFixed(1)}k` : "0"}
            </span>
          </div>
        ))}
      </div>
      
      {/* Status indicators */}
      <div className="flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 pulse-glow" : "bg-muted"}`} />
          <span className="text-muted-foreground font-body">
            {isPlaying ? "Active" : "Standby"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isComplete ? "bg-primary pulse-glow" : "bg-muted"}`} />
          <span className="text-muted-foreground font-body">
            {isComplete ? "Access Granted" : "Locked"}
          </span>
        </div>
      </div>
    </HolographicPanel>
  );
}
