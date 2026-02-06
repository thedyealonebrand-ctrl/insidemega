import { useState } from "react";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { HoloInput } from "@/components/ui/HoloInput";
import { GlowButton } from "@/components/ui/GlowButton";
import { Lock, Key, ShieldCheck, AlertTriangle, Unlock } from "lucide-react";

interface AccessGateSectionProps {
  isUnlocked?: boolean;
  onAccessGranted?: () => void;
}

export function AccessGateSection({ isUnlocked = false, onAccessGranted }: AccessGateSectionProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !isUnlocked) return;
    
    setStatus("loading");
    
    // Simulate verification
    setTimeout(() => {
      if (code.toLowerCase() === "omega" || code.length >= 4) {
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
          
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-glow-cyan mb-2">
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
            <HoloInput
              type="text"
              placeholder={isUnlocked ? "Enter access code..." : "Complete the trial first..."}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              icon={<Key className="w-5 h-5" />}
              disabled={!isUnlocked}
              className={`
                ${status === "error" ? "border-destructive/50" : ""}
                ${!isUnlocked ? "opacity-50 cursor-not-allowed" : ""}
              `}
            />
            
            <GlowButton
              type="submit"
              variant={isUnlocked ? "primary" : "secondary"}
              size="lg"
              className="w-full"
              disabled={!code || status === "loading" || !isUnlocked}
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : isUnlocked ? (
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
            
            <GlowButton 
              variant="primary" 
              size="lg" 
              className="w-full"
              onClick={() => {
                document.getElementById('stations')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Enter The Realm
            </GlowButton>
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
