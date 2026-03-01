import { useEffect, useState } from "react";
import { Twitter, Instagram, ArrowRight } from "lucide-react";

interface GaiaAnnouncementProps {
  onContinue: () => void;
}

const SHARE_TEXT = `I just crossed into the Realm.

Artists aren't just dropping songs anymore…
we're building worlds.

October is going to make sense soon.`;

const TWITTER_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
const INSTAGRAM_COPY_TEXT = SHARE_TEXT;

export default function GaiaAnnouncement({ onContinue }: GaiaAnnouncementProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(INSTAGRAM_COPY_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      window.open("https://www.instagram.com/", "_blank");
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
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(29,161,242,0.12), rgba(29,161,242,0.06))",
              border: "1px solid rgba(29,161,242,0.35)",
              color: "#1DA1F2",
              boxShadow: "0 0 25px rgba(29,161,242,0.1)",
            }}
          >
            <Twitter className="w-4 h-4" />
            Post on X
          </a>

          <button
            onClick={handleInstagramShare}
            className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(228,64,95,0.12), rgba(131,58,180,0.12))",
              border: "1px solid rgba(228,64,95,0.35)",
              color: "#E4405F",
              boxShadow: "0 0 25px rgba(228,64,95,0.1)",
            }}
          >
            <Instagram className="w-4 h-4" />
            {copied ? "Copied! Opening IG…" : "Share on Instagram"}
          </button>
        </div>

        {/* Continue */}
        <button
          onClick={onContinue}
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-lg font-display text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105"
          style={{
            transitionDelay: "1.4s",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.8s ease-out",
            background: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(96,165,250,0.15))",
            border: "1px solid rgba(52,211,153,0.4)",
            color: "#34d399",
            boxShadow: "0 0 30px rgba(52,211,153,0.15), inset 0 0 30px rgba(52,211,153,0.05)",
          }}
        >
          Continue to GAIA-1
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p
          className="mt-6 font-body text-xs text-sky-200/30 tracking-wider"
          style={{
            transitionDelay: "1.6s",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        >
          Sharing is optional — your journey continues either way
        </p>
      </div>
    </section>
  );
}
