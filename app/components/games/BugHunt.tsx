"use client";

import { useEffect, useState } from "react";

type Bug = { id: string; x: number; y: number; vx: number; vy: number };

function rand(min: number, max: number) { return min + Math.random() * (max - min); }

export default function BugHunt() {
    const W = 540, H = 280;
    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25);
    const [score, setScore] = useState(0);
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [best, setBest] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem("best_bughunt");
        if (saved) setBest(Number(saved));
    }, []);

    useEffect(() => {
        if (!running) return;

        setTimeLeft(25);
        setScore(0);
        setBugs(Array.from({ length: 8 }, (_, i) => ({
            id: String(i) + ":" + Math.random().toString(16).slice(2),
            x: rand(30, W - 30),
            y: rand(30, H - 30),
            vx: rand(-80, 80),
            vy: rand(-60, 60),
        })));

        const timer = setInterval(() => setTimeLeft((v) => v - 1), 1000);
        const tick = setInterval(() => {
            setBugs((prev) =>
                prev.map((b) => {
                    let x = b.x + b.vx * 0.05;
                    let y = b.y + b.vy * 0.05;
                    let vx = b.vx, vy = b.vy;
                    if (x < 18 || x > W - 18) vx *= -1;
                    if (y < 18 || y > H - 18) vy *= -1;
                    x = Math.max(18, Math.min(W - 18, x));
                    y = Math.max(18, Math.min(H - 18, y));
                    return { ...b, x, y, vx, vy };
                })
            );
        }, 50);

        return () => { clearInterval(timer); clearInterval(tick); };
    }, [running]);

    useEffect(() => {
        if (!running) return;
        if (timeLeft <= 0) {
            setRunning(false);
            if (score > best) {
                setBest(score);
                localStorage.setItem("best_bughunt", String(score));
            }
        }
    }, [timeLeft, running, score, best]);

    function hit(id: string) {
        setScore((v) => v + 10);
        setBugs((prev) => {
            const next = prev.filter((b) => b.id !== id);
            // respawn with increased speed
            const speedMult = 1 + score / 100;
            next.push({
                id: "r:" + Math.random().toString(16).slice(2),
                x: rand(30, W - 30),
                y: rand(30, H - 30),
                vx: rand(-90, 90) * speedMult,
                vy: rand(-70, 70) * speedMult,
            });
            return next;
        });
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60">
                <div>Click the bugs!</div>
                <div className="flex gap-4">
                    <span>Time <b className={timeLeft <= 5 ? "text-red-400" : "text-white/80"}>{Math.max(0, timeLeft)}s</b></span>
                    <span>Score <b className="text-cyan-400">{score}</b></span>
                    <span>Best <b className="text-amber-400">{best}</b></span>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                {!running ? (
                    <div className="text-center space-y-3 py-8">
                        {score > 0 && (
                            <div className="text-lg font-bold text-white/90">
                                Time&apos;s Up!
                                <div className="text-sm font-normal text-white/50">Bugs Squashed: {score / 10}</div>
                            </div>
                        )}
                        <button
                            onClick={() => setRunning(true)}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        >
                            Start Hunt (25s)
                        </button>
                    </div>
                ) : (
                    <div
                        className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-black/50 to-black/30"
                        style={{ width: W, height: H }}
                    >
                        {/* Grid lines for "debug" feel */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: "linear-gradient(rgba(80,200,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(80,200,255,0.3) 1px, transparent 1px)",
                            backgroundSize: "40px 40px"
                        }} />

                        {bugs.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => hit(b.id)}
                                className="absolute grid h-9 w-9 place-items-center rounded-full border border-red-500/20 bg-red-500/10 text-lg transition-transform hover:scale-110 hover:bg-red-500/20 active:scale-90"
                                style={{ left: b.x - 18, top: b.y - 18 }}
                                title="Squash the bug!"
                            >
                                🐞
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
