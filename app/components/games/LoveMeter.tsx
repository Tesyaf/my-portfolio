"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// --- Love Meter Logic & Data ---

const ALIF_SYNONYMS = [
    "alif", "alif abrar", "muhammad alif abrar", "muhammad alif", "lip", "abror",
];

const ADILA_SYNONYMS = [
    "adila", "ilaa", "labi", "adila nurul hidayah", "adila nurul", "adilanh",
];

function normalizeName(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[_.,/\\|'`~!@#$%^&*()+=<>?:;[\]{}-]/g, " ")
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

export default function LoveMeter() {
    const [yourName, setYourName] = useState("");
    const [partnerName, setPartnerName] = useState("");

    const score = useMemo(() => {
        if (!yourName.trim() || !partnerName.trim()) return null;
        return computeLoveScore(yourName, partnerName);
    }, [yourName, partnerName]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Enter two names to calculate love compatibility</span>
            </div>

            <div className="space-y-3">
                <label className="block">
                    <div className="mb-1.5 text-xs text-emerald-400 uppercase tracking-wider">Player 1</div>
                    <input
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        placeholder="Enter name..."
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
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                {score === null ? (
                    <div className="text-sm text-slate-500 text-center py-2">Enter both names to calculate affinity.</div>
                ) : (
                    <>
                        <div className="flex items-end justify-between mb-2">
                            <div className="text-sm text-white/60">Compatibility Score</div>
                            <div className={`text-3xl font-bold ${score === 100 ? 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]' :
                                    score === 0 ? 'text-red-400' : 'text-white'
                                }`}>
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
    );
}
