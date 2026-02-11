import { useState } from "react";
import { Radio, Tv, Brain, Users, Zap, Send, Heart, MessageSquare, Play } from "lucide-react";

interface CitizenData {
  name: string;
  starSign: string;
  talents: string[];
  avatar: number;
  passcode: string;
}

interface GaiaHubProps {
  citizen: CitizenData;
}

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

type HubTab = "feed" | "broadcast" | "ideas" | "citizens";

const MOCK_SIGNALS = [
  { id: 1, author: "NOVA_7", avatar: 1, text: "Just discovered a new frequency in sector 9. The harmonics are unlike anything we've mapped before. 🔊", energy: 42, time: "2m ago" },
  { id: 2, author: "CRYO.ART", avatar: 5, text: "New visual drop incoming. Rendered a full aurora sequence using on-chain generative code.", energy: 128, time: "8m ago", image: true },
  { id: 3, author: "BASEDBUILDER", avatar: 2, text: "Shipped a new protocol for cross-planet identity verification. Citizens can now port their status across realms.", energy: 89, time: "15m ago" },
  { id: 4, author: "STELLAR_X", avatar: 7, text: "Music session tonight in the Broadcast Zone. Ambient space beats. All citizens welcome. ✨", energy: 215, time: "22m ago" },
  { id: 5, author: "DRIFTCODE", avatar: 3, text: "The idea exchange is evolving. We need more builders thinking about decentralized governance for GAIA-1.", energy: 67, time: "31m ago" },
];

const MOCK_BROADCASTS = [
  { id: 1, title: "Cosmic Frequencies Vol. 3", author: "NOVA_7", type: "Music", energy: 340, live: true },
  { id: 2, title: "Aurora Genesis — Generative Art", author: "CRYO.ART", type: "Visual", energy: 198, live: false },
  { id: 3, title: "Building the Metachain", author: "BASEDBUILDER", type: "Talk", energy: 87, live: false },
];

const MOCK_IDEAS = [
  { id: 1, title: "Cross-Planet Passport System", author: "DRIFTCODE", replies: 23, energy: 156, status: "active" },
  { id: 2, title: "GAIA-1 Governance Framework", author: "STELLAR_X", replies: 45, energy: 289, status: "active" },
  { id: 3, title: "Citizen Reputation Score", author: "NOVA_7", replies: 12, energy: 78, status: "draft" },
];

const MOCK_CITIZENS = [
  { name: "NOVA_7", avatar: 1, sign: "Aquarius", talents: ["Music", "Production"], energy: 1240 },
  { name: "CRYO.ART", avatar: 5, sign: "Pisces", talents: ["Art", "Design"], energy: 980 },
  { name: "BASEDBUILDER", avatar: 2, sign: "Capricorn", talents: ["Coding", "Writing"], energy: 2100 },
  { name: "STELLAR_X", avatar: 7, sign: "Leo", talents: ["Music", "Dance"], energy: 1560 },
  { name: "DRIFTCODE", avatar: 3, sign: "Scorpio", talents: ["Coding", "Gaming"], energy: 870 },
];

const tabs: { key: HubTab; label: string; icon: typeof Radio }[] = [
  { key: "feed", label: "Signals", icon: Radio },
  { key: "broadcast", label: "Broadcast", icon: Tv },
  { key: "ideas", label: "Ideas", icon: Brain },
  { key: "citizens", label: "Citizens", icon: Users },
];

export default function GaiaHub({ citizen }: GaiaHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("feed");
  const [signalText, setSignalText] = useState("");
  const [energized, setEnergized] = useState<Set<number>>(new Set());

  const toggleEnergy = (id: number) => {
    setEnergized((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const myAvatar = AVATAR_STYLES[citizen.avatar];

  return (
    <section className="min-h-screen pt-4 pb-24 px-3 sm:px-6">
      {/* Top bar — citizen info */}
      <div className="flex items-center justify-between max-w-3xl mx-auto mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: myAvatar.bg, boxShadow: "0 0 12px hsl(160 84% 50% / 0.2)" }}
          >
            {myAvatar.emoji}
          </div>
          <div>
            <p className="font-display text-xs tracking-wider text-emerald-400">{citizen.name}</p>
            <p className="font-body text-[10px] text-sky-200/40 tracking-wider">{citizen.starSign} · Citizen</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
          background: "hsl(220 25% 8% / 0.6)",
          border: "1px solid hsl(50 80% 50% / 0.2)",
        }}>
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="font-display text-[11px] text-yellow-400/80 tracking-wider">0</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex justify-center gap-1 mb-6 max-w-3xl mx-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-display text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
            style={{
              background: activeTab === key ? "hsl(160 40% 15% / 0.4)" : "transparent",
              border: `1px solid ${activeTab === key ? "hsl(160 50% 40% / 0.3)" : "transparent"}`,
              color: activeTab === key ? "hsl(160 84% 70%)" : "hsl(220 15% 45%)",
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        {/* ═══ SIGNAL FEED ═══ */}
        {activeTab === "feed" && (
          <div className="space-y-4">
            {/* Compose */}
            <div className="rounded-xl p-4" style={{
              background: "hsl(220 25% 6% / 0.7)",
              border: "1px solid hsl(160 40% 25% / 0.2)",
              backdropFilter: "blur(12px)",
            }}>
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ background: myAvatar.bg }}
                >
                  {myAvatar.emoji}
                </div>
                <textarea
                  value={signalText}
                  onChange={(e) => setSignalText(e.target.value)}
                  placeholder="Broadcast a signal..."
                  maxLength={280}
                  rows={2}
                  className="flex-1 bg-transparent resize-none outline-none font-body text-sm text-sky-100/70 placeholder:text-sky-200/20"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-display text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 disabled:opacity-30"
                  disabled={!signalText.trim()}
                  style={{
                    background: "linear-gradient(135deg, hsl(160 60% 20% / 0.3), hsl(200 60% 20% / 0.2))",
                    border: "1px solid hsl(160 50% 40% / 0.3)",
                    color: "hsl(160 84% 70%)",
                  }}
                >
                  <Send className="w-3 h-3" />
                  Signal
                </button>
              </div>
            </div>

            {/* Signals */}
            {MOCK_SIGNALS.map((signal) => {
              const av = AVATAR_STYLES[signal.avatar];
              const isEnergized = energized.has(signal.id);
              return (
                <div
                  key={signal.id}
                  className="rounded-xl p-4 transition-all duration-500 hover:translate-y-[-2px]"
                  style={{
                    background: "hsl(220 25% 6% / 0.5)",
                    border: "1px solid hsl(200 30% 20% / 0.15)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 20px hsl(220 50% 5% / 0.3)",
                  }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{ background: av.bg }}
                    >
                      {av.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-display text-xs tracking-wider text-sky-100/90">{signal.author}</span>
                        <span className="font-body text-[10px] text-sky-200/30">{signal.time}</span>
                      </div>
                      <p className="font-body text-sm text-sky-100/65 leading-relaxed">{signal.text}</p>
                      {signal.image && (
                        <div className="mt-3 h-32 rounded-lg" style={{
                          background: "linear-gradient(135deg, hsl(160 40% 12%), hsl(220 40% 15%), hsl(280 30% 15%))",
                          border: "1px solid hsl(160 30% 25% / 0.2)",
                        }}>
                          <div className="w-full h-full flex items-center justify-center font-body text-xs text-sky-200/30">
                            [ Visual Signal ]
                          </div>
                        </div>
                      )}
                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => toggleEnergy(signal.id)}
                          className="flex items-center gap-1.5 transition-all duration-300 hover:scale-110"
                          style={{ color: isEnergized ? "hsl(50 90% 60%)" : "hsl(220 15% 40%)" }}
                        >
                          <Zap className="w-3.5 h-3.5" fill={isEnergized ? "currentColor" : "none"} />
                          <span className="font-display text-[11px] tracking-wider">
                            {signal.energy + (isEnergized ? 1 : 0)}
                          </span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sky-200/30 hover:text-sky-200/60 transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-display text-[11px] tracking-wider">Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ BROADCAST ZONE ═══ */}
        {activeTab === "broadcast" && (
          <div className="space-y-4">
            <p className="font-body text-xs text-sky-200/40 text-center tracking-wider mb-2">
              Holographic Stage — Broadcasts from Citizens
            </p>
            {MOCK_BROADCASTS.map((bc) => (
              <div
                key={bc.id}
                className="rounded-xl p-5 transition-all duration-500 hover:translate-y-[-2px] relative overflow-hidden"
                style={{
                  background: bc.live
                    ? "linear-gradient(135deg, hsl(160 30% 8% / 0.7), hsl(200 30% 10% / 0.5))"
                    : "hsl(220 25% 6% / 0.5)",
                  border: `1px solid ${bc.live ? "hsl(160 50% 40% / 0.3)" : "hsl(200 30% 20% / 0.15)"}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {bc.live && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-display text-[10px] tracking-wider text-red-400">LIVE</span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, hsl(280 40% 15%), hsl(200 40% 15%))",
                    border: "1px solid hsl(280 30% 30% / 0.3)",
                  }}>
                    <Play className="w-6 h-6 text-sky-200/50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-sm tracking-wider text-sky-100/90">{bc.title}</h3>
                    <p className="font-body text-xs text-sky-200/40 mt-1">{bc.author} · {bc.type}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Zap className="w-3 h-3 text-yellow-400/70" />
                      <span className="font-display text-[11px] text-yellow-400/60 tracking-wider">{bc.energy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ IDEA EXCHANGE ═══ */}
        {activeTab === "ideas" && (
          <div className="space-y-4">
            <p className="font-body text-xs text-sky-200/40 text-center tracking-wider mb-2">
              Neural Network — Collaborative Innovation
            </p>
            {MOCK_IDEAS.map((idea) => (
              <div
                key={idea.id}
                className="rounded-xl p-5 transition-all duration-500 hover:translate-y-[-2px] relative"
                style={{
                  background: "hsl(220 25% 6% / 0.5)",
                  border: "1px solid hsl(280 30% 25% / 0.2)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Connection lines decoration */}
                <div className="absolute top-0 left-6 w-px h-full" style={{
                  background: "linear-gradient(180deg, transparent, hsl(280 50% 40% / 0.15), transparent)",
                }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{
                      background: idea.status === "active" ? "hsl(160 84% 50%)" : "hsl(220 20% 35%)",
                      boxShadow: idea.status === "active" ? "0 0 8px hsl(160 84% 50% / 0.5)" : "none",
                    }} />
                    <span className="font-display text-[10px] tracking-wider uppercase" style={{
                      color: idea.status === "active" ? "hsl(160 84% 60%)" : "hsl(220 15% 45%)",
                    }}>{idea.status}</span>
                  </div>
                  <h3 className="font-display text-sm tracking-wider text-sky-100/90 mb-1">{idea.title}</h3>
                  <p className="font-body text-xs text-sky-200/40">{idea.author}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-sky-200/40">
                      <MessageSquare className="w-3 h-3" />
                      <span className="font-display text-[11px] tracking-wider">{idea.replies}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-400/50">
                      <Zap className="w-3 h-3" />
                      <span className="font-display text-[11px] tracking-wider">{idea.energy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ CITIZEN PROFILES ═══ */}
        {activeTab === "citizens" && (
          <div className="space-y-3">
            <p className="font-body text-xs text-sky-200/40 text-center tracking-wider mb-2">
              Citizens of GAIA-1
            </p>
            {MOCK_CITIZENS.map((c, i) => {
              const av = AVATAR_STYLES[c.avatar];
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:translate-y-[-1px]"
                  style={{
                    background: "hsl(220 25% 6% / 0.5)",
                    border: "1px solid hsl(200 30% 20% / 0.15)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ background: av.bg }}
                  >
                    {av.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xs tracking-wider text-sky-100/90">{c.name}</p>
                    <p className="font-body text-[10px] text-sky-200/35 mt-0.5">{c.sign} · {c.talents.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400/50 shrink-0">
                    <Zap className="w-3 h-3" />
                    <span className="font-display text-[11px] tracking-wider">{c.energy}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
