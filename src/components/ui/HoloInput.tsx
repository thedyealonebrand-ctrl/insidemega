import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HoloInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const HoloInput = forwardRef<HTMLInputElement, HoloInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative">
        {label && (
          <label className="block font-display text-sm text-muted-foreground uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        
        <div
          className={cn(
            "relative group",
            isFocused && "z-10"
          )}
        >
          {/* Glow effect on focus */}
          <div
            className={cn(
              "absolute -inset-1 rounded-lg bg-gradient-to-r from-primary via-glow-blue to-secondary opacity-0 blur transition-opacity duration-300",
              isFocused && "opacity-50"
            )}
          />
          
          <div className="relative flex items-center">
            {icon && (
              <span className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                {icon}
              </span>
            )}
            
            <input
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "w-full bg-muted/30 backdrop-blur-sm",
                "border border-primary/30 rounded-lg",
                "px-4 py-3 text-foreground font-body",
                "placeholder:text-muted-foreground/50",
                "focus:outline-none focus:border-primary",
                "focus:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
                "transition-all duration-300",
                icon && "pl-12",
                className
              )}
              {...props}
            />
            
            {/* Animated border effect */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg pointer-events-none overflow-hidden",
                "opacity-0 transition-opacity duration-300",
                isFocused && "opacity-100"
              )}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HoloInput.displayName = "HoloInput";
