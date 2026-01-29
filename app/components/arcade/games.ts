import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Satellite, Keyboard, LayoutGrid, Bug, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Dynamic imports for better code splitting
const AstroDodge = dynamic(() => import("../games/AstroDodge"), { ssr: false });
const TypingRush = dynamic(() => import("../games/TypingRush"), { ssr: false });
const Breakout = dynamic(() => import("../games/Breakout"), { ssr: false });
const BugHunt = dynamic(() => import("../games/BugHunt"), { ssr: false });
const LoveMeter = dynamic(() => import("../games/LoveMeter"), { ssr: false });

export type GameDef = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
    size: { w: number; h: number };
    Component: ComponentType;
};

export const GAMES: GameDef[] = [
    {
        id: "astro-dodge",
        title: "Astro Dodge",
        description: "Dodge falling meteors!",
        icon: Satellite,
        iconColor: "text-purple-400",
        size: { w: 660, h: 480 },
        Component: AstroDodge
    },
    {
        id: "typing-rush",
        title: "Typing Rush",
        description: "Type commands fast!",
        icon: Keyboard,
        iconColor: "text-cyan-400",
        size: { w: 620, h: 420 },
        Component: TypingRush
    },
    {
        id: "breakout",
        title: "Space Breakout",
        description: "Classic brick breaker",
        icon: LayoutGrid,
        iconColor: "text-amber-400",
        size: { w: 660, h: 500 },
        Component: Breakout
    },
    {
        id: "bug-hunt",
        title: "Bug Hunt",
        description: "Squash those bugs!",
        icon: Bug,
        iconColor: "text-red-400",
        size: { w: 620, h: 420 },
        Component: BugHunt
    },
    {
        id: "love-meter",
        title: "Love Meter",
        description: "Calculate compatibility",
        icon: Heart,
        iconColor: "text-pink-400",
        size: { w: 480, h: 420 },
        Component: LoveMeter
    },
];
