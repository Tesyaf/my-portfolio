"use client";

import { useEffect, useRef, useState } from "react";

export default function Breakout() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const raf = useRef<number | null>(null);
    const keys = useRef(new Set<string>());

    const [running, setRunning] = useState(false);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const W = 580, H = 360;

    const S = useRef({
        p: { x: W / 2, w: 90, y: H - 26 },
        b: { x: W / 2, y: H - 60, vx: 180, vy: -180, r: 7 },
        bricks: [] as { x: number; y: number; w: number; h: number; hit: boolean; color: string }[],
    });

    const colors = ["rgba(80,200,255,0.7)", "rgba(160,120,255,0.7)", "rgba(255,180,100,0.7)", "rgba(120,255,180,0.7)", "rgba(255,120,180,0.7)"];

    function reset(full = true) {
        const s = S.current;
        s.p = { x: W / 2, w: 90, y: H - 26 };
        s.b = { x: W / 2, y: H - 60, vx: 180 * (Math.random() > 0.5 ? 1 : -1), vy: -180, r: 7 };
        if (full) {
            s.bricks = [];
            const rows = 5, cols = 10;
            const bw = 50, bh = 14;
            const gap = 6;
            const startX = (W - (cols * bw + (cols - 1) * gap)) / 2;
            const startY = 40;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    s.bricks.push({
                        x: startX + c * (bw + gap),
                        y: startY + r * (bh + gap),
                        w: bw,
                        h: bh,
                        hit: false,
                        color: colors[r % colors.length],
                    });
                }
            }
            setScore(0);
            setLives(3);
            setGameOver(false);
            setWon(false);
        }
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
        const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    }, []);

    useEffect(() => {
        if (!running) return;
        const c = canvasRef.current!;
        const ctx = c.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;
        c.width = W * dpr; c.height = H * dpr;
        c.style.width = `${W}px`; c.style.height = `${H}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        let last = performance.now();
        let currentLives = 3;

        const loop = (t: number) => {
            const dt = Math.min(0.033, (t - last) / 1000);
            last = t;
            const s = S.current;

            // paddle
            const sp = 360;
            let dir = 0;
            const k = keys.current;
            if (k.has("a") || k.has("arrowleft")) dir -= 1;
            if (k.has("d") || k.has("arrowright")) dir += 1;
            s.p.x = Math.max(s.p.w / 2, Math.min(W - s.p.w / 2, s.p.x + dir * sp * dt));

            // ball
            s.b.x += s.b.vx * dt;
            s.b.y += s.b.vy * dt;

            // walls
            if (s.b.x < s.b.r) { s.b.x = s.b.r; s.b.vx *= -1; }
            if (s.b.x > W - s.b.r) { s.b.x = W - s.b.r; s.b.vx *= -1; }
            if (s.b.y < s.b.r) { s.b.y = s.b.r; s.b.vy *= -1; }

            // paddle collision
            const px0 = s.p.x - s.p.w / 2, px1 = s.p.x + s.p.w / 2;
            const py0 = s.p.y - 10;
            if (s.b.y + s.b.r >= py0 && s.b.y + s.b.r <= py0 + 20 && s.b.x >= px0 && s.b.x <= px1 && s.b.vy > 0) {
                s.b.vy *= -1;
                const hit = (s.b.x - s.p.x) / (s.p.w / 2);
                s.b.vx = 240 * hit;
            }

            // bricks collision
            for (const br of s.bricks) {
                if (br.hit) continue;
                if (s.b.x + s.b.r < br.x || s.b.x - s.b.r > br.x + br.w || s.b.y + s.b.r < br.y || s.b.y - s.b.r > br.y + br.h) continue;
                br.hit = true;
                setScore((v) => v + 10);
                s.b.vy *= -1;
                break;
            }

            // lose ball
            if (s.b.y > H + 20) {
                currentLives--;
                setLives(currentLives);
                if (currentLives <= 0) {
                    setRunning(false);
                    setGameOver(true);
                    return;
                }
                reset(false);
            }

            // win
            if (s.bricks.every((b) => b.hit)) {
                setRunning(false);
                setWon(true);
                return;
            }

            // render
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgba(5,10,20,0.95)";
            ctx.fillRect(0, 0, W, H);

            // bricks
            for (const br of s.bricks) {
                if (br.hit) continue;
                ctx.fillStyle = br.color.replace("0.7", "0.15");
                ctx.fillRect(br.x - 3, br.y - 3, br.w + 6, br.h + 6);
                ctx.fillStyle = br.color;
                ctx.fillRect(br.x, br.y, br.w, br.h);
            }

            // paddle glow
            ctx.fillStyle = "rgba(160,120,255,0.12)";
            ctx.fillRect(s.p.x - s.p.w / 2 - 10, s.p.y - 18, s.p.w + 20, 36);

            ctx.fillStyle = "rgba(220,240,255,0.85)";
            ctx.shadowColor = "rgba(160,120,255,0.5)";
            ctx.shadowBlur = 10;
            ctx.fillRect(s.p.x - s.p.w / 2, s.p.y - 8, s.p.w, 16);
            ctx.shadowBlur = 0;

            // ball glow
            const bGrad = ctx.createRadialGradient(s.b.x, s.b.y, 0, s.b.x, s.b.y, s.b.r * 3);
            bGrad.addColorStop(0, "rgba(80,200,255,0.3)");
            bGrad.addColorStop(1, "rgba(80,200,255,0)");
            ctx.beginPath();
            ctx.fillStyle = bGrad;
            ctx.arc(s.b.x, s.b.y, s.b.r * 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.shadowColor = "rgba(80,200,255,0.6)";
            ctx.shadowBlur = 10;
            ctx.arc(s.b.x, s.b.y, s.b.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            raf.current = requestAnimationFrame(loop);
        };

        raf.current = requestAnimationFrame(loop);
        return () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; };
    }, [running]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60">
                <div>Move: A/D or ←/→</div>
                <div className="flex gap-4">
                    <span>Lives <b className={lives <= 1 ? "text-red-400" : "text-white/80"}>{lives}</b></span>
                    <span>Score <b className="text-cyan-400">{score}</b></span>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <canvas ref={canvasRef} className="block" />
                {!running && (
                    <div className="absolute inset-0 grid place-items-center bg-black/50 backdrop-blur-sm">
                        <div className="text-center space-y-2">
                            {gameOver && (
                                <div className="text-xl font-bold text-red-400">Game Over!</div>
                            )}
                            {won && (
                                <div className="text-xl font-bold text-emerald-400">You Win! 🎉</div>
                            )}
                            {(gameOver || won) && (
                                <div className="text-sm text-white/50">Score: {score}</div>
                            )}
                            <button
                                onClick={() => { reset(true); setRunning(true); }}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                            >
                                {gameOver || won ? "Play Again" : "Start Game"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
