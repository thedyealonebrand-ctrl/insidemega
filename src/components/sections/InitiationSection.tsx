import { useState } from "react";
import { HolographicPanel, HolographicCard } from "@/components/ui/HolographicPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Headphones, Share2, CheckCircle, Lock, Unlock } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Headphones,
    title: "Listen",
    description: "Listen to OMEGA tracks in order",
    completed: false,
  },
  {
    id: 2,
    icon: Share2,
    title: "Share",
    description: "Share one to X or Instagram",
    completed: false,
  },
  {
    id: 3,
    icon: CheckCircle,
    title: "Confirm",
    description: "Confirm transmission",
    completed: false,
  },
];

export function InitiationSection() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  const allComplete = completedSteps.length === steps.length;

  return (
    <section id="initiation" className="min-h-screen flex items-center justify-center px-4 py-20">
      <HolographicPanel className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full mb-4">
            {allComplete ? (
              <Unlock className="w-4 h-4 text-primary" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-body text-sm uppercase tracking-wider text-muted-foreground">
              Protocol {allComplete ? "Complete" : "In Progress"}
            </span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-glow-cyan mb-4">
            INITIATION PROTOCOL
          </h2>
          
          <p className="font-body text-muted-foreground">
            Complete all steps to receive your access code
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-4 mb-10">
          {steps.map((step) => {
            const isComplete = completedSteps.includes(step.id);
            const Icon = step.icon;
            
            return (
              <HolographicCard
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={isComplete ? "border-primary/50" : ""}
              >
                <div className="flex items-center gap-4">
                  {/* 3D Hologram Icon */}
                  <div className={`
                    relative w-16 h-16 rounded-lg flex items-center justify-center
                    ${isComplete ? "bg-primary/20" : "bg-muted/30"}
                    border ${isComplete ? "border-primary/50" : "border-primary/20"}
                    transition-all duration-300
                    float-fast
                  `}>
                    {/* Glow effect */}
                    {isComplete && (
                      <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md" />
                    )}
                    
                    <Icon className={`
                      relative z-10 w-8 h-8
                      ${isComplete ? "text-primary" : "text-muted-foreground"}
                      transition-colors duration-300
                    `} />
                    
                    {/* Step number */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-muted border border-primary/30 rounded-full flex items-center justify-center">
                      <span className="font-display text-xs text-primary">{step.id}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`
                      font-display text-xl uppercase tracking-wider mb-1
                      ${isComplete ? "text-primary" : "text-foreground"}
                    `}>
                      {step.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Status */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    border transition-all duration-300
                    ${isComplete 
                      ? "border-primary bg-primary/20" 
                      : "border-muted-foreground/30 bg-muted/20"
                    }
                  `}>
                    {isComplete && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              </HolographicCard>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <GlowButton
            variant={allComplete ? "primary" : "secondary"}
            size="lg"
            disabled={!allComplete}
          >
            {allComplete ? "Verify & Receive Access Code" : "Complete All Steps"}
          </GlowButton>
          
          {!allComplete && (
            <p className="mt-4 text-sm text-muted-foreground">
              {completedSteps.length}/{steps.length} steps completed
            </p>
          )}
        </div>
      </HolographicPanel>
    </section>
  );
}
