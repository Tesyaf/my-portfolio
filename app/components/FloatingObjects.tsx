"use client";

import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Heart, Puzzle, Satellite } from "lucide-react";

// --- Love Meter Logic & Data ---

const ALIF_SYNONYMS = [
  "alif",
  "alif abrar",
  "muhammad alif abrar",
  "muhammad alif",
  "lip",
  "abror",
];

const ADILA_SYNONYMS = [
  "adila",
  "ilaa",
  "labi",
  "adila nurul hidayah",
  "adila nurul",
  "adilanh",
];

function normalizeName(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[_.,/\\|'\`~!@#$%^&*()+=<>?:;[\]{}-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isInList(name: string, list: string[]) {
  const n = normalizeName(name);
  return list.some((s) => normalizeName(s) === n);
}

function hashToPercent(a: string, b: string) {
  const s = normalizeName(a) + "|" + normalizeName(b);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const pct = Math.abs(h) % 90; 
  return 10 + pct;
}

function computeLoveScore(yourName: string, partnerName: string) {
  const youIsAlif = isInList(yourName, ALIF_SYNONYMS);
  const partnerIsAdila = isInList(partnerName, ADILA_SYNONYMS);
  const youIsAdila = isInList(yourName, ADILA_SYNONYMS);
  const partnerIsAlif = isInList(partnerName, ALIF_SYNONYMS);

  if ((youIsAlif && partnerIsAdila) || (youIsAdila && partnerIsAlif)) return 100;

  const involvingAlif = youIsAlif || partnerIsAlif;
  const involvingAdila = youIsAdila || partnerIsAdila;
  if (involvingAlif || involvingAdila) return 0;

  return hashToPercent(yourName, partnerName);
}

function LoveMeter({ onClose }: { onClose: () => void }) {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const score = useMemo(() => {
    if (!yourName.trim() || !partnerName.trim()) return null;
    return computeLoveScore(yourName, partnerName);
  }, [yourName, partnerName]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white/80">❤️ Love Meter OS_</div>
          <button
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <div className="mb-1.5 text-xs text-emerald-400 uppercase tracking-wider">Player 1</div>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Enter name..."
              autoFocus
            />
          </label>

          <label className="block">
            <div className="mb-1.5 text-xs text-pink-400 uppercase tracking-wider">Player 2</div>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-pink-500/50 transition-colors placeholder:text-slate-600"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Enter name..."
            />
          </label>

          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            {score === null ? (
              <div className="text-sm text-slate-500 text-center py-2">Enter both names to calculate affinity.</div>
            ) : (
              <>
                <div className="flex items-end justify-between mb-2">
                  <div className="text-sm text-white/60">Compatibility Score</div>
                  <div className={`text-3xl font-bold ${score === 100 ? 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]' : score === 0 ? 'text-red-400' : 'text-white'}`}>
                    {score}%
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  />
                </div>
                <div className="mt-3 text-center">
                    {score === 100 && <span className="text-xs text-pink-300">✨ Perfect Match Detected ✨</span>}
                    {score === 0 && <span className="text-xs text-red-300">⚠️ Anomaly Detected: Restricted Pair ⚠️</span>}
                    {score > 0 && score < 100 && <span className="text-xs text-slate-500">Calculation complete.</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Floating Item Component ---

type FloatingItemData = {
  id: string;
  initialX: number;
  initialY: number;
  icon: React.ElementType; // Use Lucide Icon type
  color: string;
  secret?: "LOVE_METER" | "NONE";
};

const items: FloatingItemData[] = [
  { id: "widget-1", initialX: 80, initialY: 120, icon: Box, color: "text-blue-400" },
  { id: "widget-2", initialX: 800, initialY: 180, icon: Satellite, color: "text-purple-400" },
  { id: "widget-3", initialX: 260, initialY: 360, icon: Puzzle, color: "text-amber-400" },
  { id: "heart", initialX: 420, initialY: 320, icon: Heart, color: "text-red-500", secret: "LOVE_METER" },
];

function FloatingItem({ item, containerRef, onActivate }: { item: FloatingItemData; containerRef: React.RefObject<HTMLDivElement>; onActivate: (secret: string) => void }) {
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const Icon = item.icon;

  const wander = async () => {
    if (reduceMotion || isDragging || !containerRef.current) return;
    const container = containerRef.current;
    const itemSize = 60;
    const maxX = container.clientWidth - itemSize;
    const maxY = container.clientHeight - itemSize;
    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;
    const duration = 12 + Math.random() * 8;
    try {
      await controls.start({
        x: nextX,
        y: nextY,
        transition: { duration: duration, ease: "easeInOut" },
      });
      wander();
    } catch (e) {}
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
        controls.set({ x: item.initialX, y: item.initialY });
        wander();
    }, 100);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className={`group pointer-events-auto absolute grid h-12 w-12 cursor-grab place-items-center transition-transform active:cursor-grabbing ${item.color}`}
      style={{
        filter: "drop-shadow(0 0 8px currentColor)",
      }}
      animate={controls}
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0.1}
      onDragStart={() => {
        setIsDragging(true);
        controls.stop();
      }}
      onDragEnd={() => {
        setIsDragging(false);
        wander();
      }}
      onDoubleClick={() => {
        if (item.secret) onActivate(item.secret);
      }}
      whileHover={{ scale: 1.2, rotate: 10, zIndex: 100, filter: "drop-shadow(0 0 15px currentColor) brightness(1.2)" }}
      whileTap={{ scale: 0.9, zIndex: 100 }}
      title={item.secret ? "Double click..." : undefined}
    >
        <motion.div
          animate={item.id === "heart" && !reduceMotion ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon size={28} strokeWidth={2} />
        </motion.div>
    </motion.div>
  );
}

export default function FloatingObjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSecret, setActiveSecret] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full">
        <div 
            ref={containerRef} 
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
        {items.map((it) => (
            <FloatingItem 
                key={it.id} 
                item={it} 
                containerRef={containerRef} 
                onActivate={(secret) => setActiveSecret(secret)}
            />
        ))}
        </div>

        {activeSecret === "LOVE_METER" && (
            <LoveMeter onClose={() => setActiveSecret(null)} />
        )}
    </div>
  );
}
