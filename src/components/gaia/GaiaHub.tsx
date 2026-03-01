import { useState, useEffect, useCallback } from "react";
import { Radio, Tv, Brain, Users, Zap, Send, MessageSquare, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CitizenData {
  id: string;
  name: string;
  starSign: string;
  talents: string[];
  avatar: number;
}

interface GaiaHubProps {
  citizen: CitizenData;
}

interface Signal {
  id: string;
  citizen_id: string;
  content: string;
  signal_type: string;
  energy: number;
  created_at: string;
  citizen_name?: string;
  citizen_avatar?: number;
}

interface CitizenRow {
  id: string;
  name: string;
  star_sign: string;
  talents: string[];
  avatar: number;
  created_at: string;
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

const tabs: { key: HubTab; label: string; icon: typeof Radio }[] = [
  { key: "feed", label: "Signals", icon: Radio },
  { key: "broadcast", label: "Broadcast", icon: Tv },
  { key: "ideas", label: "Ideas", icon: Brain },
  { key: "citizens", label: "Citizens", icon: Users },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function GaiaHub({ citizen }: GaiaHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("feed");
  const [signalText, setSignalText] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [citizens, setCitizens] = useState<CitizenRow[]>([]);
  const [energized, setEnergized] = useState<Set<string>>(new Set());
  const [posting, setPosting] = useState(false);

  // Load signals with citizen info
  const loadSignals = useCallback(async () => {
    const { data: signalRows } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!signalRows || signalRows.length === 0) {
      setSignals([]);
      return;
    }

    const citizenIds = [...new Set(signalRows.map((s: any) => s.citizen_id))];
    const { data: citizenRows } = await supabase
      .from("citizen_profiles")
      .select("id, name, avatar")
      .in("id", citizenIds);

    const citizenMap = new Map((citizenRows || []).map((c: any) => [c.id, c]));

    setSignals(
      signalRows.map((s: any) => {
        const c = citizenMap.get(s.citizen_id);
        return {
          ...s,
          citizen_name: c?.name || "Unknown",
          citizen_avatar: c?.avatar ?? 0,
        };
      })
    );
  }, []);

  // Load citizens
  const loadCitizens = useCallback(async () => {
    const { data } = await supabase
      .from("citizen_profiles")
      .select("id, name, star_sign, talents, avatar, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setCitizens(data as CitizenRow[]);
  }, []);

  useEffect(() => {
    loadSignals();
    loadCitizens();

    // Realtime subscription for new signals
    const channel = supabase
      .channel("signals-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "signals" }, () => {
        loadSignals();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadSignals, loadCitizens]);

  const postSignal = async () => {
    if (!signalText.trim() || posting) return;
    setPosting(true);
    await supabase.from("signals").insert({
      citizen_id: citizen.id,
      content: signalText.trim(),
      signal_type: "thought",
    });
    setSignalText("");
    setPosting(false);
    loadSignals();
  };

  const toggleEnergy = async (signalId: string, currentEnergy: number) => {
    const wasEnergized = energized.has(signalId);
    setEnergized((prev) => {
      const next = new Set(prev);
      wasEnergized ? next.delete(signalId) : next.add(signalId);
      return next;
    });
    await supabase
      .from("signals")
      .update({ energy: currentEnergy + (wasEnergized ? -1 : 1) })
      .eq("id", signalId);
  };

  const myAvatar = AVATAR_STYLES[citizen.avatar];

  return (
    <section className="min-h-screen pt-4 pb-24 px-3 sm:px-6">
      {/* Top bar */}
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
          <span className="font-display text-[11px] text-yellow-400/80 tracking-wider">
            {signals.filter(s => s.citizen_id === citizen.id).reduce((sum, s) => sum + s.energy, 0)}
          </span>
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
              <div className="flex justify-between items-center mt-2">
                <span className="font-body text-[10px] text-sky-200/20">{signalText.length}/280</span>
                <button
                  onClick={postSignal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-display text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 disabled:opacity-30"
                  disabled={!signalText.trim() || posting}
                  style={{
                    background: "linear-gradient(135deg, hsl(160 60% 20% / 0.3), hsl(200 60% 20% / 0.2))",
                    border: "1px solid hsl(160 50% 40% / 0.3)",
                    color: "hsl(160 84% 70%)",
                  }}
                >
                  <Send className="w-3 h-3" />
                  {posting ? "Sending..." : "Signal"}
                </button>
              </div>
            </div>

            {/* Empty state */}
            {signals.length === 0 && (
              <div className="text-center py-16">
                <Radio className="w-10 h-10 mx-auto text-sky-200/15 mb-4" />
                <p className="font-display text-sm text-sky-200/30 tracking-wider">No signals yet</p>
                <p className="font-body text-xs text-sky-200/20 mt-1">Be the first to broadcast a signal to GAIA-1</p>
              </div>
            )}

            {/* Signals */}
            {signals.map((signal) => {
              const av = AVATAR_STYLES[signal.citizen_avatar ?? 0];
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
                        <span className="font-display text-xs tracking-wider text-sky-100/90">{signal.citizen_name}</span>
                        <span className="font-body text-[10px] text-sky-200/30">{timeAgo(signal.created_at)}</span>
                      </div>
                      <p className="font-body text-sm text-sky-100/65 leading-relaxed">{signal.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => toggleEnergy(signal.id, signal.energy)}
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
          <div className="text-center py-16">
            <Tv className="w-10 h-10 mx-auto text-sky-200/15 mb-4" />
            <p className="font-display text-sm text-sky-200/30 tracking-wider">Broadcast Zone</p>
            <p className="font-body text-xs text-sky-200/20 mt-1">Holographic stage coming soon</p>
          </div>
        )}

        {/* ═══ IDEA EXCHANGE ═══ */}
        {activeTab === "ideas" && (
          <div className="text-center py-16">
            <Brain className="w-10 h-10 mx-auto text-sky-200/15 mb-4" />
            <p className="font-display text-sm text-sky-200/30 tracking-wider">Idea Exchange</p>
            <p className="font-body text-xs text-sky-200/20 mt-1">Neural network threads coming soon</p>
          </div>
        )}

        {/* ═══ CITIZEN PROFILES ═══ */}
        {activeTab === "citizens" && (
          <div className="space-y-3">
            <p className="font-body text-xs text-sky-200/40 text-center tracking-wider mb-2">
              Citizens of GAIA-1
            </p>
            {citizens.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-10 h-10 mx-auto text-sky-200/15 mb-4" />
                <p className="font-body text-xs text-sky-200/20">No citizens have landed yet</p>
              </div>
            )}
            {citizens.map((c) => {
              const av = AVATAR_STYLES[c.avatar];
              return (
                <div
                  key={c.id}
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
                    <p className="font-body text-[10px] text-sky-200/35 mt-0.5">
                      {c.star_sign} · {c.talents.join(", ")}
                    </p>
                  </div>
                  <div className="font-body text-[10px] text-sky-200/25 shrink-0">
                    {timeAgo(c.created_at)}
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
