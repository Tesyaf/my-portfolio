"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import type { WindowSpec } from "./WindowManager";

export default function OSWindow({
    win,
    onMove,
    onClose,
    onMinimize,
    onFocus,
}: {
    win: WindowSpec;
    onMove: (x: number, y: number) => void;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
}) {
    const startPos = useRef({ x: win.x, y: win.y });

    return (
        <motion.div
            className="pointer-events-auto absolute overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/90 shadow-2xl backdrop-blur-xl"
            style={{ width: win.w, height: win.h, left: win.x, top: win.y, zIndex: win.z }}
            onMouseDown={onFocus}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
        >
            {/* glow inside window */}
            <div className="pointer-events-none absolute inset-0 opacity-40 overflow-hidden rounded-2xl">
                <div className="absolute -top-32 -left-32 w-64 h-64 blur-3xl bg-[radial-gradient(circle,rgba(80,200,255,0.15),transparent_60%)]" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 blur-3xl bg-[radial-gradient(circle,rgba(160,120,255,0.12),transparent_60%)]" />
            </div>

            {/* Title bar - draggable */}
            <motion.div
                className="flex cursor-grab items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5 active:cursor-grabbing select-none"
                drag
                dragMomentum={false}
                dragElastic={0}
                onDragStart={() => {
                    startPos.current = { x: win.x, y: win.y };
                }}
                onDrag={(_, info) => {
                    onMove(startPos.current.x + info.offset.x, startPos.current.y + info.offset.y);
                }}
            >
                <div className="flex items-center gap-2.5 text-sm text-white/70">
                    <span className="text-base">{win.icon ?? "⬡"}</span>
                    <span className="font-medium text-white/85">{win.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/5 text-[10px] text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
                        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                        title="Minimize"
                    >
                        —
                    </button>
                    <button
                        className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/5 text-[10px] text-white/60 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </motion.div>

            {/* Content area */}
            <div className="relative h-[calc(100%-44px)] overflow-auto p-4">
                {win.content}
            </div>
        </motion.div>
    );
}
