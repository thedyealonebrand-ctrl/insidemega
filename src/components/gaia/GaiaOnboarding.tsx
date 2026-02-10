import { useState, useCallback, useEffect } from "react";

interface GaiaOnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "ARRIVAL",
    subtitle: "Entering Orbit",
    text: "Welcome Day1r. You have entered orbit. GAIA-1 is the first inhabited world discovered inside the OMEGA REALM.",
    accent: "#34d399",
  },
  {
    title: "PURPOSE",
    subtitle: "The Social Layer",
    text: "GAIA-1 is where the universe becomes social. Share ideas, post visuals, meet other explorers, connect through music and culture.",
    accent: "#60a5fa",
  },
  {
    title: "SYSTEM LAYER",
    subtitle: "OnChain Identity",
    text: "GAIA-1 is powered by onchain identity. Activate your explorer ID.",
    accent: "#38bdf8",
  },
  {
    title: "WALLET CONNECT",
    subtitle: "Establish Presence",
    text: "Connect your wallet to establish your presence on GAIA-1. You are not just joining a platform. You are entering a civilization.",
    accent: "#a78bfa",
    walletStep: true,
  },
  {
    title: "CONFIRMED",
    subtitle: "Welcome, Citizen",
    text: "Citizenship confirmed. Welcome to GAIA-1.",
    accent: "#34d399",
    final: true,
  },
];

export default function GaiaOnboarding({ onComplete }: GaiaOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  const step = steps[currentStep];

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (animating) return;
    if (currentStep >= steps.length - 1) {
      onComplete();
      return;
    }
    setAnimating(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setAnimating(false);
    }, 600);
  }, [currentStep, animating, onComplete]);

  const handleWalletCreate = () => {
    window.open("https://www.coinbase.com/wallet", "_blank");
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="flex gap-2 mb-12 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-700"
              style={{
                width: i === currentStep ? "48px" : "24px",
                background:
                  i <= currentStep
                    ? `linear-gradient(90deg, ${steps[i].accent}, ${steps[Math.min(i + 1, steps.length - 1)].accent})`
                    : "rgba(255,255,255,0.1)",
                boxShadow: i === currentStep ? `0 0 12px ${step.accent}40` : "none",
              }}
            />
          ))}
        </div>

        {/* Step content */}
        <div
          className={`text-center transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Step label */}
          <p
            className="font-body text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: `${step.accent}99` }}
          >
            {step.subtitle}
          </p>

          {/* Step title */}
          <h2
            className="font-display text-3xl sm:text-5xl font-bold mb-8"
            style={{
              color: step.accent,
              textShadow: `0 0 40px ${step.accent}40, 0 0 80px ${step.accent}20`,
            }}
          >
            {step.title}
          </h2>

          {/* Step text */}
          <p className="font-body text-base sm:text-lg text-sky-100/75 leading-relaxed max-w-lg mx-auto mb-10">
            {step.text}
          </p>

          {/* Wallet step special content */}
          {step.walletStep && (
            <div className="mb-8 space-y-4">
              <button
                onClick={handleWalletCreate}
                className="group relative px-8 py-4 font-display text-sm tracking-[0.15em] uppercase rounded-lg transition-all duration-500 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(96,90,250,0.2), rgba(167,139,250,0.15))",
                  border: "1px solid rgba(167,139,250,0.4)",
                  color: "#a78bfa",
                  boxShadow: "0 0 30px rgba(167,139,250,0.15)",
                }}
              >
                <span className="relative z-10">Create Base Wallet</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              </button>
              <p className="font-body text-xs text-sky-200/40 tracking-wider">
                Return once your Base wallet is created
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => {
                  setVisible(false);
                  setTimeout(() => setCurrentStep((s) => s - 1), 500);
                }}
                className="px-6 py-3 font-display text-xs tracking-[0.2em] uppercase rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Back
              </button>
            )}

            <button
              onClick={goNext}
              className="group relative px-8 py-3 font-display text-xs tracking-[0.2em] uppercase rounded-lg transition-all duration-500 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${step.accent}20, ${step.accent}10)`,
                border: `1px solid ${step.accent}60`,
                color: step.accent,
                boxShadow: `0 0 25px ${step.accent}15`,
              }}
            >
              <span className="relative z-10">
                {step.final ? "Enter GAIA-1" : "Continue"}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
                style={{ background: `${step.accent}10` }}
              />
            </button>
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center mt-12 font-body text-xs tracking-[0.3em] text-sky-200/20 uppercase">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </section>
  );
}
