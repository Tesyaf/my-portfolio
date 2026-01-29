"use client";

import { useEffect, useRef, useState } from "react";

type M = { x: number; y: number; r: number; vy: number };

export default function AstroDodge() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const raf = useRef<number | null>(null);
    const keys = useRef(new Set<string>());

    const [score, setScore] = useState(0);
    const [best, setBest] = useState<number>(0);
    const [running, setRunning] = useState(false);

    const W = 580, H = 340;

    const S = useRef({
        p: { x: W / 2, y: H - 60, r: 9 },
        ms: [] as M[],
        t: 0,
        spawn: 0,
        alive: 0,
    });

    // Load best score on mount
    useEffect(() => {
        const saved = localStorage.getItem("best_astro");
        if (saved) setBest(Number(saved));
    }, []);

    function reset() {
        S.current = { p: { x: W / 2, y: H - 60, r: 9 }, ms: [], t: 0, spawn: 0, alive: 0 };
        setScore(0);
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            keys.current.add(e.key.toLowerCase());
            if (!running && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                reset();
                setRunning(true);
            }
        };
        const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    }, [running]);

    useEffect(() => {
        if (!running) return;
        const c = canvasRef.current!;
        const ctx = c.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;
        c.width = W * dpr; c.height = H * dpr;
        c.style.width = `${W}px`; c.style.height = `${H}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const loop = (t: number) => {
            const s = S.current;
            const dt = Math.min(0.033, (t - (s.t || t)) / 1000);
            s.t = t;

            // move player
            const sp = 260;
            let vx = 0, vy = 0;
            const k = keys.current;
            if (k.has("a") || k.has("arrowleft")) vx -= 1;
            if (k.has("d") || k.has("arrowright")) vx += 1;
            if (k.has("w") || k.has("arrowup")) vy -= 1;
            if (k.has("s") || k.has("arrowdown")) vy += 1;
            s.p.x = Math.max(s.p.r, Math.min(W - s.p.r, s.p.x + vx * sp * dt));
            s.p.y = Math.max(s.p.r, Math.min(H - s.p.r, s.p.y + vy * sp * dt));

            // spawn meteors
            s.spawn += dt;
            const every = Math.max(0.20, 0.65 - s.alive / 30);
            if (s.spawn >= every) {
                s.spawn = 0;
                const r = 6 + Math.random() * 11;
                s.ms.push({ x: r + Math.random() * (W - 2 * r), y: -r, r, vy: 90 + Math.random() * 160 + s.alive * 2 });
            }

            // update meteors & collision
            let dead = false;
            for (const m of s.ms) {
                m.y += m.vy * dt;
                const dx = m.x - s.p.x, dy = m.y - s.p.y;
                const rr = m.r + s.p.r;
                if (dx * dx + dy * dy <= rr * rr) dead = true;
            }
            s.ms = s.ms.filter((m) => m.y < H + m.r + 10);

            // score
            if (!dead) {
                s.alive += dt;
                const sc = Math.floor(s.alive * 10);
                setScore(sc);
            } else {
                setRunning(false);
                const final = Math.floor(s.alive * 10);
                if (final > best) {
                    setBest(final);
                    localStorage.setItem("best_astro", String(final));
                }
                return;
            }

            // render
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgba(5,10,20,0.95)";
            ctx.fillRect(0, 0, W, H);

            // subtle stars
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            for (let i = 0; i < 60; i++) ctx.fillRect((i * 97) % W, (i * 53) % H, 1.2, 1.2);

            // player glow
            const pGrad = ctx.createRadialGradient(s.p.x, s.p.y, 0, s.p.x, s.p.y, s.p.r * 3);
            pGrad.addColorStop(0, "rgba(80,200,255,0.35)");
            pGrad.addColorStop(1, "rgba(80,200,255,0)");
            ctx.beginPath();
            ctx.fillStyle = pGrad;
            ctx.arc(s.p.x, s.p.y, s.p.r * 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "rgba(220,245,255,0.95)";
            ctx.shadowColor = "rgba(80,200,255,0.6)";
            ctx.shadowBlur = 12;
            ctx.arc(s.p.x, s.p.y, s.p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            for (const m of s.ms) {
                const mGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 2);
                mGrad.addColorStop(0, "rgba(255,120,120,0.2)");
                mGrad.addColorStop(1, "rgba(255,120,120,0)");
                ctx.beginPath();
                ctx.fillStyle = mGrad;
                ctx.arc(m.x, m.y, m.r * 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = "rgba(200,180,220,0.6)";
                ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
                ctx.fill();
            }

            raf.current = requestAnimationFrame(loop);
        };

        raf.current = requestAnimationFrame(loop);
        return () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; };
    }, [running, best]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60">
                <div>Move: WASD / Arrows</div>
                <div className="flex gap-4">
                    <span>Score <b className="text-cyan-400">{score}</b></span>
                    <span>Best <b className="text-amber-400">{best}</b></span>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <canvas ref={canvasRef} className="block" />
                {!running && (
                    <div className="absolute inset-0 grid place-items-center bg-black/50 backdrop-blur-sm">
                        <div className="text-center space-y-2">
                            {score > 0 && (
                                <div className="text-xl font-bold text-white/90">
                                    Game Over!
                                    <div className="text-sm font-normal text-white/50 mt-1">Score: {score}</div>
                                </div>
                            )}
                            <button
                                onClick={() => { reset(); setRunning(true); }}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                            >
                                {score > 0 ? "Play Again" : "Start Game"}
                            </button>
                            <div className="text-[11px] text-white/40">or press Enter / Space</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
