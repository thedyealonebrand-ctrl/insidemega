import { useState, useEffect } from "react";
import { User, Star, Sparkles, Lock, ChevronRight } from "lucide-react";

interface CitizenData {
  name: string;
  starSign: string;
  talents: string[];
  avatar: number;
  passcode: string;
}

interface GaiaCitizenCreationProps {
  onComplete: (citizen: CitizenData) => void;
  error?: string | null;
}

const STAR_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const TALENTS = [
  "Music", "Art", "Coding", "Fashion", "Storytelling", "Photography",
  "Design", "Film", "Writing", "Gaming", "Dance", "Production",
];

const AVATAR_STYLES = [
  { bg: "linear-gradient(135deg, #34d399, #06b6d4)", emoji: "🛸" },
  { bg: "linear-gradient(135deg, #a78bfa, #ec4899)", emoji: "🌌" },
  { bg: "linear-gradient(135deg, #60a5fa, #3b82f6)", emoji: "⚡" },
  { bg: "linear-gradient(135deg, #f59e0b, #ef4444)", emoji: "🔥" },
  { bg: "linear-gradient(135deg, #14b8a6, #34d399)", emoji: "🌿" },
  { bg: "linear-gradient(135deg, #8b5cf6, #6366f1)", emoji: "💎" },
  { bg: "linear-gradient(135deg, #f472b6, #a78bfa)", emoji: "✨" },
  { bg: "linear-gradient(135deg, #38bdf8, #818cf8)", emoji: "🧬" },
];

export default function GaiaCitizenCreation({ onComplete, error: externalError }: GaiaCitizenCreationProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [citizen, setCitizen] = useState<CitizenData>({
    name: "",
    starSign: "",
    talents: [],
    avatar: 0,
    passcode: "",
  });

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, [step]);

  const toggleTalent = (t: string) => {
    setCitizen((prev) => ({
      ...prev,
      talents: prev.talents.includes(t)
        ? prev.talents.filter((x) => x !== t)
        : prev.talents.length < 5
        ? [...prev.talents, t]
        : prev.talents,
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return citizen.name.trim().length >= 2;
      case 1: return citizen.starSign !== "";
      case 2: return citizen.talents.length >= 1;
      case 3: return true;
      case 4: return citizen.passcode.length >= 6;
      default: return false;
    }
  };

  const next = () => {
    if (!canProceed()) return;
    if (step === 4) {
      onComplete(citizen);
      return;
    }
    setVisible(false);
    setTimeout(() => setStep((s) => s + 1), 400);
  };

  const stepLabels = ["IDENTITY", "STAR SIGN", "TALENTS", "AVATAR", "PASSWORD"];
  const stepIcons = [User, Star, Sparkles, User, Lock];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mb-10">
          {stepLabels.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-700"
              style={{
                width: i === step ? "40px" : "16px",
                background: i <= step
                  ? "linear-gradient(90deg, hsl(160 84% 50%), hsl(200 100% 60%))"
                  : "hsl(220 20% 15%)",
                boxShadow: i === step ? "0 0 12px hsl(160 84% 50% / 0.4)" : "none",
              }}
            />
          ))}
        </div>

        {/* Title bar */}
        <div className="text-center mb-2">
          <p className="font-body text-[10px] tracking-[0.6em] uppercase text-emerald-400/50 mb-1">
            Citizen Creation — Step {step + 1}/{stepLabels.length}
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, hsl(160 84% 50%), hsl(200 100% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stepLabels[step]}
          </h2>
        </div>

        {/* Step content */}
        <div
          className={`mt-8 transition-all duration-600 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Step 0: Citizen Name */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <p className="font-body text-sm text-sky-100/60">Choose your display name on GAIA-1</p>
              <div className="relative max-w-sm mx-auto">
                <input
                  type="text"
                  maxLength={24}
                  value={citizen.name}
                  onChange={(e) => setCitizen({ ...citizen, name: e.target.value })}
                  placeholder="Enter Citizen Name..."
                  className="w-full px-5 py-4 rounded-lg font-display text-sm tracking-wider text-center outline-none transition-all duration-300 focus:scale-[1.02]"
                  style={{
                    background: "hsl(220 30% 8% / 0.8)",
                    border: "1px solid hsl(160 60% 30% / 0.3)",
                    color: "hsl(160 84% 70%)",
                    boxShadow: "0 0 20px hsl(160 84% 50% / 0.05), inset 0 0 20px hsl(160 84% 50% / 0.03)",
                  }}
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                  boxShadow: citizen.name.length >= 2 ? "0 0 25px hsl(160 84% 50% / 0.15)" : "none",
                  transition: "box-shadow 0.5s",
                }} />
              </div>
            </div>
          )}

          {/* Step 1: Star Sign */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="font-body text-sm text-sky-100/60 text-center">Select your cosmic alignment</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-w-md mx-auto">
                {STAR_SIGNS.map((sign) => (
                  <button
                    key={sign}
                    onClick={() => setCitizen({ ...citizen, starSign: sign })}
                    className="px-3 py-3 rounded-lg font-display text-[11px] tracking-wider uppercase transition-all duration-300 hover:scale-105"
                    style={{
                      background: citizen.starSign === sign
                        ? "linear-gradient(135deg, hsl(160 60% 20% / 0.6), hsl(200 60% 20% / 0.4))"
                        : "hsl(220 25% 8% / 0.6)",
                      border: `1px solid ${citizen.starSign === sign ? "hsl(160 60% 40% / 0.6)" : "hsl(220 20% 20% / 0.4)"}`,
                      color: citizen.starSign === sign ? "hsl(160 84% 70%)" : "hsl(220 15% 55%)",
                      boxShadow: citizen.starSign === sign ? "0 0 15px hsl(160 84% 50% / 0.15)" : "none",
                    }}
                  >
                    {sign}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Talents */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="font-body text-sm text-sky-100/60 text-center">
                Choose up to 5 talents <span className="text-emerald-400/60">({citizen.talents.length}/5)</span>
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center max-w-lg mx-auto">
                {TALENTS.map((talent) => {
                  const active = citizen.talents.includes(talent);
                  return (
                    <button
                      key={talent}
                      onClick={() => toggleTalent(talent)}
                      className="px-4 py-2.5 rounded-full font-display text-[11px] tracking-wider uppercase transition-all duration-300 hover:scale-105"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, hsl(280 60% 25% / 0.5), hsl(200 60% 25% / 0.4))"
                          : "hsl(220 25% 8% / 0.6)",
                        border: `1px solid ${active ? "hsl(280 60% 50% / 0.5)" : "hsl(220 20% 20% / 0.3)"}`,
                        color: active ? "hsl(280 80% 80%)" : "hsl(220 15% 55%)",
                        boxShadow: active ? "0 0 15px hsl(280 60% 50% / 0.15)" : "none",
                      }}
                    >
                      {talent}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Avatar */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="font-body text-sm text-sky-100/60 text-center">Select your citizen avatar</p>
              <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                {AVATAR_STYLES.map((av, i) => (
                  <button
                    key={i}
                    onClick={() => setCitizen({ ...citizen, avatar: i })}
                    className="relative aspect-square rounded-xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110"
                    style={{
                      background: av.bg,
                      border: citizen.avatar === i ? "2px solid hsl(0 0% 100% / 0.6)" : "2px solid transparent",
                      boxShadow: citizen.avatar === i ? "0 0 25px hsl(0 0% 100% / 0.2), inset 0 0 15px hsl(0 0% 100% / 0.1)" : "none",
                      opacity: citizen.avatar === i ? 1 : 0.7,
                    }}
                  >
                    {av.emoji}
                    {citizen.avatar === i && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                        <span className="text-[10px]">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Passcode */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <p className="font-body text-sm text-sky-100/60">Create a password (min 6 characters) to re-enter GAIA-1</p>
              <div className="relative max-w-xs mx-auto">
                <input
                  type="password"
                  maxLength={32}
                  value={citizen.passcode}
                  onChange={(e) => setCitizen({ ...citizen, passcode: e.target.value })}
                  placeholder="Enter password..."
                  className="w-full px-5 py-4 rounded-lg font-display text-sm tracking-wider text-center outline-none transition-all duration-300 focus:scale-[1.02]"
                  style={{
                    background: "hsl(220 30% 8% / 0.8)",
                    border: "1px solid hsl(280 60% 30% / 0.3)",
                    color: "hsl(280 80% 75%)",
                    boxShadow: "0 0 20px hsl(280 60% 50% / 0.05), inset 0 0 20px hsl(280 60% 50% / 0.03)",
                  }}
                />
                <p className="font-body text-[10px] text-sky-200/30 mt-3">
                  {citizen.passcode.length}/6+ characters
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error display */}
        {externalError && (
          <div className="text-center mt-4">
            <p className="font-body text-sm text-red-400/80">{externalError}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <button
            onClick={next}
            disabled={!canProceed()}
            className="group relative px-10 py-4 rounded-lg font-display text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            style={{
              background: step === 4
                ? "linear-gradient(135deg, hsl(160 60% 20% / 0.4), hsl(200 60% 20% / 0.3))"
                : "linear-gradient(135deg, hsl(160 60% 20% / 0.2), hsl(200 60% 20% / 0.15))",
              border: "1px solid hsl(160 60% 40% / 0.4)",
              color: "hsl(160 84% 70%)",
              boxShadow: "0 0 25px hsl(160 84% 50% / 0.1)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {step === 4 ? "ENTER GAIA-1" : "CONTINUE"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
          </button>
        </div>
      </div>
    </section>
  );
}
