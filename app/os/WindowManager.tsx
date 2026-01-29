"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import OSWindow from "./Window";

export type WindowSpec = {
    id: string;
    title: string;
    icon?: string;
    content: React.ReactNode;
    x: number;
    y: number;
    w: number;
    h: number;
    minimized?: boolean;
    z: number;
};

type WM = {
    windows: WindowSpec[];
    openWindow: (w: Omit<WindowSpec, "x" | "y" | "z"> & Partial<Pick<WindowSpec, "x" | "y" | "w" | "h">>) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
};

const Ctx = createContext<WM | null>(null);

export function useWindowManager() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useWindowManager must be used within <WindowManagerProvider/>");
    return v;
}

export default function WindowManagerProvider({ children }: { children: React.ReactNode }) {
    const [wins, setWins] = useState<WindowSpec[]>([]);
    const [zTop, setZTop] = useState(20);

    const api = useMemo<WM>(() => {
        return {
            windows: wins,
            openWindow: (w) => {
                setWins((prev) => {
                    const exist = prev.find((p) => p.id === w.id);
                    const nextZ = zTop + 1;

                    if (exist) {
                        // bring to front & restore if minimized
                        setZTop((z) => z + 1);
                        return prev.map((p) =>
                            p.id === w.id ? { ...p, minimized: false, z: nextZ } : p
                        );
                    }

                    const x = w.x ?? 80 + (prev.length % 4) * 26;
                    const y = w.y ?? 90 + (prev.length % 4) * 26;

                    const nw: WindowSpec = {
                        id: w.id,
                        title: w.title,
                        icon: w.icon,
                        content: w.content,
                        x,
                        y,
                        w: w.w ?? 620,
                        h: w.h ?? 420,
                        minimized: false,
                        z: nextZ,
                    };
                    setZTop((z) => z + 1);
                    return [...prev, nw];
                });
            },
            closeWindow: (id) => setWins((prev) => prev.filter((p) => p.id !== id)),
            focusWindow: (id) => {
                setZTop((z) => z + 1);
                setWins((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, z: zTop + 1 } : p))
                );
            },
            minimizeWindow: (id) => setWins((prev) => prev.map((p) => (p.id === id ? { ...p, minimized: true } : p))),
            restoreWindow: (id) => {
                setZTop((z) => z + 1);
                setWins((prev) => prev.map((p) => (p.id === id ? { ...p, minimized: false, z: zTop + 1 } : p)));
            },
        };
    }, [zTop, wins]);

    return (
        <Ctx.Provider value={api}>
            {children}

            {/* render windows */}
            <div className="pointer-events-none fixed inset-0 z-[50]">
                {wins
                    .slice()
                    .sort((a, b) => a.z - b.z)
                    .map((w) =>
                        w.minimized ? null : (
                            <OSWindow
                                key={w.id}
                                win={w}
                                onMove={(x, y) =>
                                    setWins((prev) => prev.map((p) => (p.id === w.id ? { ...p, x, y } : p)))
                                }
                                onClose={() => api.closeWindow(w.id)}
                                onMinimize={() => api.minimizeWindow(w.id)}
                                onFocus={() => api.focusWindow(w.id)}
                            />
                        )
                    )}
            </div>
        </Ctx.Provider>
    );
}
