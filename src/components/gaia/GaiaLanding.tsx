import { useEffect, useState } from "react";

interface GaiaLandingProps {
  onLand: () => void;
  onLearn: () => void;
}

export default function GaiaLanding({ onLand, onLearn }: GaiaLandingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div
        className={`max-w-3xl w-full text-center transition-all duration-[1.5s] ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Subtitle */}
        <p className="font-body text-xs sm:text-sm tracking-[0.4em] uppercase text-emerald-400/70 mb-6">
          The First Living Planet in the OMEGA REALM
        </p>

        {/* Title */}
        <h1
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold mb-10 leading-tight"
          style={{
            background: "linear-gradient(135deg, #34d399 0%, #60a5fa 40%, #e0f2fe 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px rgba(52, 211, 153, 0.3))",
          }}
        >
          WELCOME TO GAIA-1
        </h1>

        {/* Narrative text */}
        <div className="space-y-4 mb-14 max-w-xl mx-auto">
          {[
            "You are a Day1r",
            "You are part of the first1s",
            "You have crossed the stars to get here.",
            "So you are no longer just a visitor.",
            "You are part of the REALM.",
          ].map((line, i) => (
            <p
              key={i}
              className="font-body text-base sm:text-lg text-sky-100/80 leading-relaxed"
              style={{
                transitionDelay: `${0.8 + i * 0.15}s`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.8s ease-out",
              }}
            >
              {line}
            </p>
          ))}

          <div
            className="pt-4 border-t border-emerald-500/20"
            style={{
              transitionDelay: "1.8s",
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease-out",
            }}
          >
            <p className="font-body text-sm sm:text-base text-sky-200/60 leading-relaxed">
              This is where explorers become citizens, artists become builders, and culture becomes onchain.
            </p>
            <p className="font-body text-sm sm:text-base text-sky-200/60 leading-relaxed mt-3">
              GAIA-1 is a social world — a place to connect, share, create, and shape the future of the OnChain Culture together.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{
            transitionDelay: "2.2s",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 1s ease-out",
          }}
        >
          <button
            onClick={onLand}
            className="group relative px-10 py-4 font-display text-sm tracking-[0.2em] uppercase overflow-hidden rounded-lg transition-all duration-500 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(96,165,250,0.15))",
              border: "1px solid rgba(52,211,153,0.4)",
              color: "#34d399",
              boxShadow: "0 0 30px rgba(52,211,153,0.15), inset 0 0 30px rgba(52,211,153,0.05)",
            }}
          >
            <span className="relative z-10">Land on GAIA-1</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

          <button
            onClick={onLearn}
            className="group relative px-10 py-4 font-display text-sm tracking-[0.2em] uppercase overflow-hidden rounded-lg transition-all duration-500 hover:scale-105"
            style={{
              background: "rgba(14,30,50,0.5)",
              border: "1px solid rgba(96,165,250,0.3)",
              color: "#93c5fd",
              boxShadow: "0 0 20px rgba(96,165,250,0.1), inset 0 0 20px rgba(96,165,250,0.03)",
            }}
          >
            <span className="relative z-10">Learn About This World</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}
