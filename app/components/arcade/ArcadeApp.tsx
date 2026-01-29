"use client";

import { GAMES } from "./games";
import { useWindowManager } from "@/app/os/WindowManager";
import { Gamepad2 } from "lucide-react";

export default function ArcadeApp() {
    const wm = useWindowManager();

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                    <Gamepad2 size={18} className="text-cyan-400" style={{ filter: "drop-shadow(0 0 4px currentColor)" }} />
                    <span>Arcade Hub</span>
                </div>
                <div className="text-xs text-white/50 mt-1">Double-click a game to launch in a new window.</div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {GAMES.map((g) => {
                    const Icon = g.icon;
                    return (
                        <button
                            key={g.id}
                            onDoubleClick={() =>
                                wm.openWindow({
                                    id: `game:${g.id}`,
                                    title: g.title,
                                    icon: "🎮",
                                    w: g.size.w,
                                    h: g.size.h,
                                    content: <g.Component />,
                                })
                            }
                            className="group rounded-xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                {/* Icon with glow effect like floating icons */}
                                <div
                                    className={`grid h-10 w-10 place-items-center rounded-lg bg-white/5 ${g.iconColor}`}
                                    style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
                                >
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white/85">{g.title}</div>
                                    <div className="text-[11px] text-white/50">{g.description}</div>
                                </div>
                            </div>

                            {/* Shimmer effect on hover */}
                            <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-0 group-hover:animate-shimmer group-hover:opacity-100" />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="pt-2 border-t border-white/5">
                <div className="text-[10px] text-white/30 text-center">
                    Tip: You can drag windows by their title bar, minimize them, or close them.
                </div>
            </div>
        </div>
    );
}
