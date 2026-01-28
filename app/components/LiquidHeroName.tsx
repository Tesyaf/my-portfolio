"use client";

import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export default function LiquidHeroName() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  // Parallax Logic
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.3 });
  const y = useSpring(my, { stiffness: 80, damping: 20, mass: 0.3 });

  useEffect(() => {
    if (reduce) return;

    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 14; 
      const dy = (e.clientY / window.innerHeight - 0.5) * 10; 
      mx.set(dx);
      my.set(dy);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <motion.div
      ref={ref}
      style={{ x: reduce ? 0 : x, y: reduce ? 0 : y }}
      className="relative z-10 select-none mb-10 will-change-transform"
    >
      <motion.div
        animate={reduce ? {} : { y: [0, -6, 0] }}
        transition={reduce ? {} : { duration: 5.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        className="will-change-transform"
      >
        <svg
          viewBox="0 0 800 120"
          className="h-auto w-full max-w-[800px] overflow-visible"
          aria-label="Muhammad Alif Abrar"
        >
          <defs>
            <linearGradient
              id="liquid-gradient"
              gradientUnits="userSpaceOnUse"
              x1="-100%"
              y1="0"
              x2="0%"
              y2="0"
            >
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#78d8ff" />
              <stop offset="55%" stopColor="#d8b4fe" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#e2e8f0" />
              
              {!reduce && (
                <animate
                  attributeName="x1"
                  from="-100%"
                  to="200%"
                  dur="6s"
                  repeatCount="indefinite"
                />
              )}
              {!reduce && (
                <animate
                  attributeName="x2"
                  from="0%"
                  to="300%"
                  dur="6s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
          </defs>

          {/* Optimized Text: No SVG Filter, using CSS drop-shadow via style/class if needed, 
              but for max performance we rely on the bright colors. 
              Adding a slight CSS drop-shadow is cheaper than SVG filter. */}
          <text
            x="0"
            y="60"
            fontSize="60"
            fontWeight="600"
            letterSpacing="-0.02em"
            fill="url(#liquid-gradient)"
            className="font-medium tracking-tight sm:text-6xl drop-shadow-[0_0_10px_rgba(120,216,255,0.5)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Muhammad Alif Abrar
          </text>
        </svg>
      </motion.div>
      
      {/* Subtitle with Aurora Effect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
          <span className="block text-5xl sm:text-6xl mt-[-40px] font-medium tracking-tight hero-aurora opacity-90">
            Portfolio OS_
          </span>
      </motion.div>
    </motion.div>
  );
}
