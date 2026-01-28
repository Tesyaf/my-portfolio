"use client";
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialize variables to avoid flash of undefined variables
    el.style.setProperty("--x", "50%");
    el.style.setProperty("--y", "50%");

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(600px circle at var(--x) var(--y), rgba(80,200,255,0.08), transparent 45%)",
      }}
    />
  );
}
