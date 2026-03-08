import { useState, useEffect } from "react";
import { Wallet, ArrowRight, ExternalLink } from "lucide-react";

interface GaiaWalletChoiceProps {
  citizenName: string;
  onContinue: () => void;
}

export default function GaiaWalletChoice({ citizenName, onContinue }: GaiaWalletChoiceProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleCreateWallet = () => {
    window.open("https://support.metamask.io/start/creating-a-new-wallet", "_blank");
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div
        className={`max-w-xl w-full text-center transition-all duration-[1s] ease-out ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Success badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
          style={{
            background: "linear-gradient(135deg, hsl(160 60% 20% / 0.3), hsl(200 60% 20% / 0.2))",
            border: "1px solid hsl(160 60% 40% / 0.4)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-display text-[11px] tracking-[0.3em] uppercase" style={{ color: "hsl(160 84% 70%)" }}>
            Citizen Created
          </span>
        </div>

        <h2
          className="font-display text-3xl sm:text-4xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, hsl(160 84% 50%), hsl(200 100% 60%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome, {citizenName}
        </h2>

        <p className="font-body text-sm text-sky-100/60 mb-10 max-w-md mx-auto leading-relaxed">
          Your identity is secured. Before you enter GAIA-1, make sure you have a Base wallet ready — you'll need it inside the Realm.
        </p>

        {/* Two options */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto mb-10">
          {/* Create wallet */}
          <button
            onClick={handleCreateWallet}
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(260 60% 20% / 0.3), hsl(280 60% 20% / 0.2))",
              border: "1px solid hsl(260 60% 50% / 0.4)",
              color: "hsl(260 80% 80%)",
              boxShadow: "0 0 25px hsl(260 60% 50% / 0.1)",
            }}
          >
            <Wallet className="w-4 h-4" />
            Create MetaMask Wallet
            <ExternalLink className="w-3 h-3 opacity-50" />
          </button>

          {/* Continue */}
          <button
            onClick={onContinue}
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(160 60% 20% / 0.3), hsl(200 60% 20% / 0.2))",
              border: "1px solid hsl(160 60% 40% / 0.5)",
              color: "hsl(160 84% 70%)",
              boxShadow: "0 0 25px hsl(160 84% 50% / 0.15)",
            }}
          >
            I Have a Wallet — Enter GAIA-1
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Reminder */}
        <div
          className="rounded-xl p-5 max-w-sm mx-auto"
          style={{
            background: "linear-gradient(135deg, hsl(40 80% 20% / 0.15), hsl(30 80% 20% / 0.1))",
            border: "1px solid hsl(40 80% 50% / 0.25)",
          }}
        >
          <p className="font-body text-xs tracking-wider leading-relaxed" style={{ color: "hsl(40 80% 70%)" }}>
            💡 Post your <span className="font-bold">MetaMask wallet address</span> as your first Signal inside GAIA-1 — let the civilization know you've arrived.
          </p>
        </div>
      </div>
    </section>
  );
}
