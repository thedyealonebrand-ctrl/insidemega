import { useEffect, useState } from "react";
import { Twitter, Instagram, ArrowRight, Check } from "lucide-react";

interface GaiaAnnouncementProps {
  onContinue: () => void;
}

const SHARE_TEXT = `I just crossed into the Realm.

Artists aren't just dropping songs anymore…
we're building worlds.

October is going to make sense soon.

#OMEGAwithFRIENDS #1BUsers`;

const TWITTER_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
const INSTAGRAM_COPY_TEXT = SHARE_TEXT;

export default function GaiaAnnouncement({ onContinue }: GaiaAnnouncementProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharedX, setSharedX] = useState(false);
  const [sharedIG, setSharedIG] = useState(false);

  const hasSharedBoth = sharedX && sharedIG;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleXShare = () => {
    window.open(TWITTER_URL, "_blank");
    setSharedX(true);
  };

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(INSTAGRAM_COPY_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      window.open("https://www.instagram.com/", "_blank");
      setSharedIG(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div
        className={`max-w-2xl w-full text-center transition-all duration-[1.2s] ease-out ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Label */}
        <p className="font-body text-xs tracking-[0.5em] uppercase text-emerald-400/60 mb-8">
          You've been chosen — now let them know
        </p>

        {/* Message card */}
        <div
          className="relative rounded-2xl p-8 sm:p-10 mb-10 text-left"
          style={{
            background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(96,165,250,0.06))",
            border: "1px solid rgba(52,211,153,0.2)",
            boxShadow: "0 0 60px rgba(52,211,153,0.08), inset 0 0 40px rgba(52,211,153,0.03)",
          }}
        >
          <div className="absolute top-3 left-4 w-2 h-2 bg-emerald-400/40 rounded-full" />
          <div className="absolute top-3 right-4 w-2 h-2 bg-sky-400/40 rounded-full" />

          {SHARE_TEXT.split("\n").map((line, i) => (
            <p
              key={i}
              className={`font-body text-base sm:text-lg leading-relaxed ${
                line.trim() === "" ? "h-4" : "text-sky-100/90"
              }`}
              style={{
                transitionDelay: `${0.4 + i * 0.08}s`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(6px)",
                transition: "all 0.6s ease-out",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Requirement label */}
        <p
          className="font-body text-xs tracking-[0.3em] uppercase text-sky-300/50 mb-6"
          style={{
            transitionDelay: "0.9s",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        >
          Share on both platforms to unlock entry
        </p>

        {/* Share buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          style={{
            transitionDelay: "1s",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <button
            onClick={handleXShare}
            disabled={sharedX}
            className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105 disabled:hover:scale-100"
            style={{
              background: sharedX
                ? "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.08))"
                : "linear-gradient(135deg, rgba(29,161,242,0.12), rgba(29,161,242,0.06))",
              border: sharedX
                ? "1px solid rgba(52,211,153,0.5)"
                : "1px solid rgba(29,161,242,0.35)",
              color: sharedX ? "#34d399" : "#1DA1F2",
              boxShadow: sharedX
                ? "0 0 25px rgba(52,211,153,0.15)"
                : "0 0 25px rgba(29,161,242,0.1)",
            }}
          >
            {sharedX ? <Check className="w-4 h-4" /> : <Twitter className="w-4 h-4" />}
            {sharedX ? "Posted on X" : "Post on X"}
          </button>

          <button
            onClick={handleInstagramShare}
            disabled={sharedIG}
            className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105 disabled:hover:scale-100"
            style={{
              background: sharedIG
                ? "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.08))"
                : "linear-gradient(135deg, rgba(228,64,95,0.12), rgba(131,58,180,0.12))",
              border: sharedIG
                ? "1px solid rgba(52,211,153,0.5)"
                : "1px solid rgba(228,64,95,0.35)",
              color: sharedIG ? "#34d399" : "#E4405F",
              boxShadow: sharedIG
                ? "0 0 25px rgba(52,211,153,0.15)"
                : "0 0 25px rgba(228,64,95,0.1)",
            }}
          >
            {sharedIG ? <Check className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
            {sharedIG ? "Shared on IG" : copied ? "Copied! Opening IG…" : "Share on Instagram"}
          </button>
        </div>

        {/* Continue - only enabled after both shares */}
        <div
          style={{
            transitionDelay: "1.4s",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <button
            onClick={onContinue}
            disabled={!hasSharedBoth}
            className={`group inline-flex items-center gap-3 px-10 py-4 rounded-lg font-display text-sm tracking-[0.2em] uppercase transition-all duration-500 ${
              hasSharedBoth ? "hover:scale-105" : "cursor-not-allowed"
            }`}
            style={{
              background: hasSharedBoth
                ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(96,165,250,0.2))"
                : "rgba(52,211,153,0.05)",
              border: hasSharedBoth
                ? "1px solid rgba(52,211,153,0.5)"
                : "1px solid rgba(52,211,153,0.15)",
              color: hasSharedBoth ? "#34d399" : "rgba(52,211,153,0.3)",
              boxShadow: hasSharedBoth
                ? "0 0 30px rgba(52,211,153,0.2), inset 0 0 30px rgba(52,211,153,0.08)"
                : "none",
            }}
          >
            Continue to GAIA-1
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {!hasSharedBoth && (
            <p className="mt-4 font-body text-xs text-sky-200/40 tracking-wider">
              {!sharedX && !sharedIG
                ? "Share on X and Instagram to continue"
                : !sharedX
                ? "Now post on X to unlock entry"
                : "Now share on Instagram to unlock entry"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
