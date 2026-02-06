import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

export function GlowButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  ...props
}: GlowButtonProps) {
  const baseClasses = `
    relative font-display uppercase tracking-wider overflow-hidden
    transition-all duration-300 transform-gpu
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary via-primary to-glow-cyan
      text-primary-foreground font-semibold
      border border-primary/50
      hover:shadow-[0_0_40px_hsl(var(--primary)/0.5),0_0_80px_hsl(var(--primary)/0.3)]
      hover:border-primary
      hover:scale-105
    `,
    secondary: `
      bg-gradient-to-r from-secondary/20 to-accent/20
      text-foreground
      border border-secondary/40
      hover:border-secondary
      hover:shadow-[0_0_30px_hsl(var(--secondary)/0.4)]
      hover:bg-secondary/30
    `,
    ghost: `
      bg-transparent
      text-foreground
      border border-primary/30
      hover:border-primary/60
      hover:bg-primary/10
      hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]
    `,
  };

  return (
    <button
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {/* Animated background gradient */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-glow-blue to-primary bg-[length:200%_100%] opacity-0 hover:opacity-100 animate-[shimmer_2s_linear_infinite] transition-opacity" />
      )}
      
      {/* Pulse ring effect */}
      <div className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100">
        <div className="absolute inset-0 animate-ping bg-primary/20 rounded-md" style={{ animationDuration: "2s" }} />
      </div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
      
      {/* Bottom glow line */}
      {variant === "primary" && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
    </button>
  );
}

export function IconButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        "relative p-3 rounded-full",
        "bg-muted/50 border border-primary/20",
        "hover:border-primary/50 hover:bg-primary/10",
        "hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
        "transition-all duration-300 transform-gpu hover:scale-110",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </button>
  );
}
