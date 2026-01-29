"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WORDS = [
    "sudo", "chmod", "deploy", "git push", "npm run build", "systemctl", "ssh", "docker", "neon", "tailwind",
    "framer-motion", "postgres", "azure", "pipeline", "latency", "vector", "cache", "compile", "debug", "merge",
    "commit", "branch", "rebase", "stash", "fetch", "pull", "clone", "init", "status", "diff"
];

function pickPrompt() {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    const tail = Math.random() < 0.35 ? ` ${WORDS[Math.floor(Math.random() * WORDS.length)]}` : "";
    return (w + tail).trim();
}

export default function TypingRush() {
    const [running, setRunning] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [typed, setTyped] = useState("");
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [best, setBest] = useState(0);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("best_typing");
        if (saved) setBest(Number(saved));
    }, []);

    const correctPrefix = useMemo(() => {
        let i = 0;
        while (i < typed.length && i < prompt.length && typed[i] === prompt[i]) i++;
        return i;
    }, [typed, prompt]);

    const hasError = typed.length > 0 && correctPrefix < typed.length;

    useEffect(() => {
        if (!running) return;
        inputRef.current?.focus();
        setPrompt(pickPrompt());
        setTyped("");
        setScore(0);
        setStreak(0);
        setTimeLeft(30);

        const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
        return () => clearInterval(t);
    }, [running]);

    useEffect(() => {
        if (!running) return;
        if (timeLeft <= 0) {
            setRunning(false);
            if (score > best) {
                setBest(score);
                localStorage.setItem("best_typing", String(score));
            }
        }
    }, [timeLeft, running, score, best]);

    function submitIfDone(next: string) {
        if (next === prompt) {
            const bonus = Math.min(8, 2 + Math.floor(streak / 3));
            setScore((s) => s + 10 + bonus);
            setStreak((s) => s + 1);
            setPrompt(pickPrompt());
            setTyped("");
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60">
                <div>Type the command exactly</div>
                <div className="flex gap-4">
                    <span>Time <b className={timeLeft <= 5 ? "text-red-400" : "text-white/80"}>{Math.max(0, timeLeft)}s</b></span>
                    <span>Score <b className="text-cyan-400">{score}</b></span>
                    <span>Best <b className="text-amber-400">{best}</b></span>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                {!running ? (
                    <div className="text-center space-y-3">
                        {score > 0 && (
                            <div className="text-lg font-bold text-white/90">
                                Time&apos;s Up!
                                <div className="text-sm font-normal text-white/50">Final Score: {score}</div>
                            </div>
                        )}
                        <button
                            onClick={() => setRunning(true)}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        >
                            Start (30s)
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Prompt</div>
                            <div className="rounded-lg border border-white/10 bg-black/50 p-3 font-mono text-sm">
                                <span className="text-emerald-400/80">guest@portfolio</span>
                                <span className="text-white/30">:</span>
                                <span className="text-sky-300/70">~</span>
                                <span className="text-white/30">$ </span>
                                <span className="text-emerald-300/60">{prompt.slice(0, correctPrefix)}</span>
                                <span className="text-white/90">{prompt.slice(correctPrefix)}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-[10px] uppercase tracking-wider text-white/40">Your input</div>
                                {streak > 2 && <div className="text-[10px] text-amber-400">🔥 Streak: {streak}</div>}
                            </div>
                            <input
                                ref={inputRef}
                                value={typed}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setTyped(next);
                                    submitIfDone(next);
                                }}
                                className={`w-full rounded-lg border bg-black/50 px-3 py-2.5 font-mono text-sm text-white/90 outline-none transition-colors ${hasError ? "border-red-500/50 bg-red-500/5" : "border-white/10 focus:border-cyan-500/30"
                                    }`}
                                placeholder="type here..."
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
