import { cn } from "@/lib/utils";

interface EnergyBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function EnergyBar({
  value,
  max = 100,
  className,
  showLabel = true,
  label,
}: EnergyBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-display text-sm text-muted-foreground uppercase tracking-wider">
            {label || "Progress"}
          </span>
          <span className="font-display text-sm text-primary">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      
      <div className="relative h-4 rounded-full bg-muted/50 border border-primary/20 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-primary/30"
              style={{ left: `${(i + 1) * 5}%` }}
            />
          ))}
        </div>
        
        {/* Energy fill */}
        <div
          className="absolute inset-y-0 left-0 energy-bar transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%]" />
        </div>
        
        {/* Glow effect at the edge */}
        <div
          className="absolute top-0 bottom-0 w-4 blur-sm transition-all duration-500"
          style={{
            left: `calc(${percentage}% - 8px)`,
            background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
          }}
        />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 scanlines opacity-20" />
      </div>
    </div>
  );
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.5))",
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--electric-blue))" />
            <stop offset="100%" stopColor="hsl(var(--aurora-purple))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl text-primary text-glow-cyan">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
