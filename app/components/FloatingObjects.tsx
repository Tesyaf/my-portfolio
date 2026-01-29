"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Box, Heart, Puzzle, Satellite, Gamepad2 } from "lucide-react";
import { useWindowManager } from "@/app/os/WindowManager";
import { GAMES } from "./arcade/games";
import ArcadeApp from "./arcade/ArcadeApp";

// --- Floating Item Component ---

type FloatingItemData = {
  id: string;
  initialX: number; // percentage (0-100)
  initialY: number; // percentage (0-100)
  icon: React.ElementType;
  color: string;
  action?: "ARCADE" | "GAME";
  gameId?: string;
};

const items: FloatingItemData[] = [
  { id: "arcade", initialX: 2, initialY: 8, icon: Gamepad2, color: "text-cyan-400", action: "ARCADE" },
  { id: "satellite", initialX: 92, initialY: 12, icon: Satellite, color: "text-purple-400", action: "GAME", gameId: "astro-dodge" },
  { id: "puzzle", initialX: 3, initialY: 55, icon: Puzzle, color: "text-amber-400", action: "GAME", gameId: "breakout" },
  { id: "heart", initialX: 90, initialY: 60, icon: Heart, color: "text-red-500", action: "GAME", gameId: "love-meter" },
  { id: "box", initialX: 5, initialY: 32, icon: Box, color: "text-blue-400", action: "GAME", gameId: "typing-rush" },
];

function FloatingItem({
  item,
  containerRef,
  onActivate
}: {
  item: FloatingItemData;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onActivate: (item: FloatingItemData) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [dragKey, setDragKey] = useState(0);
  const Icon = item.icon;

  // Simple floating animation
  const floatAnimation = (reduceMotion || isDragging) ? {} : {
    y: [0, -15, 0, 10, 0],
    x: [0, 8, 0, -8, 0],
  };

  return (
    <motion.div
      key={dragKey}
      className={`group pointer-events-auto absolute grid h-12 w-12 cursor-grab place-items-center active:cursor-grabbing ${item.color}`}
      style={{
        left: `${item.initialX}%`,
        top: `${item.initialY}%`,
        filter: "drop-shadow(0 0 8px currentColor)",
      }}
      animate={floatAnimation}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        setDragKey(prev => prev + 1);
      }}
      onDoubleClick={() => {
        if (item.action) onActivate(item);
      }}
      whileHover={{ scale: 1.2, rotate: 10, zIndex: 100, filter: "drop-shadow(0 0 15px currentColor) brightness(1.2)" }}
      whileTap={{ scale: 0.9, zIndex: 100 }}
      title={item.action ? "Double click to open" : undefined}
    >
      <motion.div
        animate={item.id === "heart" && !reduceMotion ? {
          scale: [1, 1.15, 1],
        } : {}}
        transition={{
          duration: 1,
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
  const wm = useWindowManager();

  const handleActivate = (item: FloatingItemData) => {
    if (item.action === "ARCADE") {
      // Open Arcade Hub
      wm.openWindow({
        id: "app:arcade",
        title: "Arcade Hub",
        icon: "🎮",
        w: 680,
        h: 480,
        content: <ArcadeApp />,
      });
    } else if (item.action === "GAME" && item.gameId) {
      // Open specific game directly
      const game = GAMES.find(g => g.id === item.gameId);
      if (game) {
        // Map game id to emoji for window icon
        const iconMap: Record<string, string> = {
          "astro-dodge": "🛰️",
          "typing-rush": "⌨️",
          "breakout": "🧱",
          "bug-hunt": "🐞",
          "love-meter": "💚",
        };
        wm.openWindow({
          id: `game:${game.id}`,
          title: game.title,
          icon: iconMap[game.id] ?? "🎮",
          w: game.size.w,
          h: game.size.h,
          content: <game.Component />,
        });
      }
    }
  };

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
            onActivate={handleActivate}
          />
        ))}
      </div>
    </div>
  );
}
