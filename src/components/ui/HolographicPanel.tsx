import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HolographicPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "cyan" | "purple" | "blue";
  floating?: boolean;
  glow?: boolean;
}

export function HolographicPanel({
  children,
  className,
  variant = "cyan",
  floating = true,
  glow = true,
}: HolographicPanelProps) {
  const variantClasses = {
    cyan: "glass-panel border-primary/30",
    purple: "glass-panel-purple border-secondary/30",
    blue: "glass-panel border-glow-blue/30",
  };

  const glowClasses = {
    cyan: "box-glow-cyan",
    purple: "box-glow-purple",
    blue: "shadow-[0_0_30px_hsl(var(--electric-blue)/0.3)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl p-6 backdrop-blur-xl transition-all duration-500",
        variantClasses[variant],
        floating && "float-slow",
        glow && glowClasses[variant],
        className
      )}
    >
      {/* Holographic edge effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function HolographicCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-lg p-4 cursor-pointer transition-all duration-300",
        "bg-gradient-to-br from-muted/40 to-muted/20",
        "border border-primary/20 hover:border-primary/50",
        "hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
        "transform-gpu hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
