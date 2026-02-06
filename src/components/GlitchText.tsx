import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const glitch = () => {
      const glitchDuration = 150;
      const iterations = 3;
      let currentIteration = 0;

      interval = setInterval(() => {
        if (currentIteration < iterations) {
          const glitched = text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (Math.random() > 0.7) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              return char;
            })
            .join("");
          setDisplayText(glitched);
          currentIteration++;
        } else {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, glitchDuration / iterations);
    };

    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 5000;
      timeout = setTimeout(() => {
        glitch();
        scheduleGlitch();
      }, delay);
    };

    scheduleGlitch();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text]);

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {displayText}
    </span>
  );
};

export default GlitchText;
