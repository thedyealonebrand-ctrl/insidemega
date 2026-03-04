import { useState } from "react";
import { Lock, ChevronRight, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GaiaReentryProps {
  citizenName: string;
  onSuccess: (citizen: { id: string; name: string; starSign: string; talents: string[]; avatar: number }) => void;
  onBack: () => void;
}

export default function GaiaReentry({ citizenName, onSuccess, onBack }: GaiaReentryProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (passcode.length < 6) return;
    setLoading(true);
    setError("");

    const { data, error: dbError } = await supabase
      .rpc("verify_citizen_passcode", { p_name: citizenName, p_passcode: passcode });

    if (dbError) {
      const msg = dbError.message?.includes("Too many failed attempts")
        ? "Too many failed attempts. Try again in 15 minutes."
        : "Invalid password. Try again.";
      setError(msg);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setError("Invalid password. Try again.");
      setLoading(false);
      return;
    }

    const row = data[0];
    onSuccess({
      id: row.id,
      name: row.name,
      starSign: row.star_sign,
      talents: row.talents,
      avatar: row.avatar,
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full text-center space-y-8">
        <div>
          <p className="font-body text-[10px] tracking-[0.6em] uppercase text-emerald-400/50 mb-2">
            Welcome Back, Citizen
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, hsl(280 80% 65%), hsl(200 100% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {citizenName}
          </h2>
        </div>

        <div className="space-y-4">
          <p className="font-body text-sm text-sky-100/60">Enter your password to re-enter GAIA-1</p>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
            <input
              type="password"
              maxLength={32}
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError("");
              }}
              placeholder="Enter password..."
              className="w-full pl-10 pr-5 py-4 rounded-lg font-display text-sm tracking-wider text-center outline-none transition-all duration-300 focus:scale-[1.02]"
              style={{
                background: "hsl(220 30% 8% / 0.8)",
                border: `1px solid ${error ? "hsl(0 60% 50% / 0.5)" : "hsl(280 60% 30% / 0.3)"}`,
                color: "hsl(280 80% 75%)",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400/80">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="font-body text-xs">{error}</span>
            </div>
          )}

          <p className="font-body text-[10px] text-sky-200/30 mt-2 text-center">
            {passcode.length > 0 ? `${passcode.length} characters` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            disabled={passcode.length < 6 || loading}
            className="group relative px-10 py-4 rounded-lg font-display text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg, hsl(280 40% 20% / 0.4), hsl(200 60% 20% / 0.3))",
              border: "1px solid hsl(280 50% 40% / 0.4)",
              color: "hsl(280 80% 75%)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "VERIFYING..." : "RE-ENTER GAIA-1"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={onBack}
            className="font-body text-xs text-sky-200/30 hover:text-sky-200/60 transition-colors"
          >
            ← Back to Landing
          </button>
        </div>
      </div>
    </section>
  );
}
