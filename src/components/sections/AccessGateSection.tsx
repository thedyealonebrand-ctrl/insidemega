import { useState, useCallback, useRef, useEffect } from "react";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { HoloInput } from "@/components/ui/HoloInput";
import { GlowButton } from "@/components/ui/GlowButton";
import { Lock, Key, ShieldCheck, AlertTriangle, Unlock, Sparkles, Copy, Check, X, Play, Pause, Volume2 } from "lucide-react";
import ounceTrack from "@/assets/ounce-track.mp3";

// X (Twitter) Icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Instagram Icon component
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

interface AccessGateSectionProps {
  isUnlocked?: boolean;
  generatedCode?: string | null;
  onAccessGranted?: () => void;
  onClose?: () => void;
}

export function AccessGateSection({ isUnlocked = false, generatedCode = null, onAccessGranted, onClose }: AccessGateSectionProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [displayedCode, setDisplayedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followedX, setFollowedX] = useState(false);
  const [followedInstagram, setFollowedInstagram] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(ounceTrack);
    audioRef.current.volume = 0.7;
    const audio = audioRef.current;
    const onTimeUpdate = () => {
      if (audio.duration) setTrackProgress(audio.currentTime / audio.duration);
    };
    const onEnded = () => { setIsPlaying(false); setTrackProgress(0); };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const hasFollowedBoth = followedX && followedInstagram;

  const generateNewCode = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newCode = 'OMEGA-';
    for (let i = 0; i < 6; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return newCode;
  }, []);

  const handleFollowX = () => {
    window.open('https://x.com/7ROO7H_Base', '_blank');
    setFollowedX(true);
  };

  const handleFollowInstagram = () => {
    window.open('https://www.instagram.com/7roo7h_bas3d/', '_blank');
    setFollowedInstagram(true);
  };

  const handleGenerateCode = () => {
    if (!isUnlocked || !hasFollowedBoth) return;
    setIsGenerating(true);
    
    // Simulate code generation with animation
    setTimeout(() => {
      const newCode = generatedCode || generateNewCode();
      setDisplayedCode(newCode);
      setCode(newCode);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopyCode = () => {
    if (displayedCode) {
      navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !isUnlocked) return;
    
    setStatus("loading");
    
    // Verify the code
    setTimeout(() => {
      if (code === displayedCode || code.toLowerCase() === "omega" || code.length >= 4) {
        setStatus("success");
        onAccessGranted?.();
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <section id="access" className="min-h-screen flex items-center justify-center px-4 py-20">
      <HolographicPanel className="max-w-lg w-full" variant="cyan">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/20">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="font-body text-xs text-muted-foreground uppercase tracking-wider ml-2">
            access_terminal_v2.1
          </span>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`
            inline-flex items-center justify-center w-20 h-20 rounded-full mb-6
            ${status === "success" 
              ? "bg-green-500/20 border-green-500/50" 
              : status === "error"
              ? "bg-destructive/20 border-destructive/50"
              : isUnlocked
              ? "bg-primary/20 border-primary/50"
              : "bg-muted/30 border-muted-foreground/30"
            }
            border float-slow
          `}>
            {status === "success" ? (
              <ShieldCheck className="w-10 h-10 text-green-400" />
            ) : status === "error" ? (
              <AlertTriangle className="w-10 h-10 text-destructive" />
            ) : isUnlocked ? (
              <Unlock className="w-10 h-10 text-primary" />
            ) : (
              <Lock className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          
          <h2 className="font-display text-3xl sm:text-5xl text-foreground text-glow-cyan mb-2">
            ACCESS GATE
          </h2>
          
          <p className="font-body text-muted-foreground">
            {status === "success" 
              ? "Access Granted. Welcome to the Realm."
              : status === "error"
              ? "Invalid code. Try again."
              : isUnlocked
              ? "Trial complete! Enter any code to proceed."
              : "Complete the trial to unlock this gate."
            }
          </p>
        </div>

        {/* Form */}
        {status !== "success" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Social Follow Requirement */}
            {isUnlocked && !displayedCode && (
              <div className="space-y-4">
                <p className="font-body text-center text-muted-foreground">
                  To generate your access code, follow <span className="text-primary font-semibold">7ROO7H BASED</span> on X and Instagram
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  {/* X (Twitter) Follow Button */}
                  <button
                    type="button"
                    onClick={handleFollowX}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-300
                      ${followedX 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-muted/30 border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/10'
                      }
                    `}
                  >
                    <XIcon className="w-5 h-5" />
                    <span className="font-body text-sm uppercase tracking-wider">
                      {followedX ? '✓ Followed' : 'Follow on X'}
                    </span>
                  </button>
                  
                  {/* Instagram Follow Button */}
                  <button
                    type="button"
                    onClick={handleFollowInstagram}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-300
                      ${followedInstagram 
                        ? 'bg-secondary/20 border-secondary text-secondary' 
                        : 'bg-muted/30 border-muted-foreground/30 text-muted-foreground hover:border-secondary/50 hover:bg-secondary/10'
                      }
                    `}
                  >
                    <InstagramIcon className="w-5 h-5" />
                    <span className="font-body text-sm uppercase tracking-wider">
                      {followedInstagram ? '✓ Followed' : 'Follow on IG'}
                    </span>
                  </button>
                </div>

                {/* Generate Code Button - only enabled after following both */}
                <GlowButton
                  type="button"
                  variant={hasFollowedBoth ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                  onClick={handleGenerateCode}
                  disabled={!hasFollowedBoth || isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Generating...
                    </span>
                  ) : hasFollowedBoth ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Access Code
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Follow Both to Unlock
                    </span>
                  )}
                </GlowButton>
              </div>
            )}

            {/* Display Generated Code */}
            {displayedCode && (
              <div className="p-4 bg-primary/10 border border-primary/40 rounded-lg">
                <p className="font-body text-sm text-muted-foreground mb-2 text-center">Your Access Code:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-2xl text-primary text-glow-cyan tracking-wider">
                    {displayedCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <HoloInput
              type="text"
              placeholder={isUnlocked ? (displayedCode ? "Enter your access code..." : "Generate a code first...") : "Complete the trial first..."}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              icon={<Key className="w-5 h-5" />}
              disabled={!isUnlocked || !displayedCode}
              className={`
                ${status === "error" ? "border-destructive/50" : ""}
                ${(!isUnlocked || !displayedCode) ? "opacity-50 cursor-not-allowed" : ""}
              `}
            />
            
            <GlowButton
              type="submit"
              variant={isUnlocked && displayedCode ? "primary" : "secondary"}
              size="lg"
              className="w-full"
              disabled={!code || status === "loading" || !isUnlocked || !displayedCode}
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : isUnlocked && displayedCode ? (
                "Enter Our Many Endless Great Adventures"
              ) : (
                "Complete Trial to Unlock"
              )}
            </GlowButton>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="font-body text-green-400 text-center">
                ✓ Authentication successful. Realm access unlocked.
              </p>
            </div>

            {/* Track Player */}
            <div className="p-4 rounded-xl" style={{
              background: 'linear-gradient(135deg, hsl(270 40% 8% / 0.8), hsl(200 50% 10% / 0.6))',
              border: '1px solid hsl(270 50% 40% / 0.3)',
            }}>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Listen Now</p>
              <p className="font-display text-sm text-primary text-glow-cyan tracking-wider mb-3">
                OUNCE — OMEGA THE FIRST
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, hsl(270 60% 50%), hsl(200 80% 50%))',
                    boxShadow: isPlaying ? '0 0 20px hsl(270 60% 50% / 0.5)' : 'none',
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(220 20% 15%)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${trackProgress * 100}%`,
                        background: 'linear-gradient(90deg, hsl(270 60% 50%), hsl(200 80% 50%))',
                        boxShadow: '0 0 8px hsl(270 60% 50% / 0.5)',
                      }}
                    />
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <GlowButton 
              variant="primary" 
              size="lg" 
              className="w-full"
              onClick={() => {
                if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
                document.getElementById('stations')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Enter The Realm
            </GlowButton>

            <button
              onClick={() => {
                if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
                onClose?.();
              }}
              className="w-full py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </button>
          </div>
        )}
        
        {/* Terminal footer */}
        <div className="mt-8 pt-4 border-t border-primary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>STATUS: {status === "success" ? "GRANTED" : status === "error" ? "DENIED" : isUnlocked ? "UNLOCKED" : "LOCKED"}</span>
            <span className={isUnlocked ? "pulse-glow text-primary" : ""}>●</span>
            <span>SECTOR: OMEGA-7</span>
          </div>
        </div>
      </HolographicPanel>
    </section>
  );
}
