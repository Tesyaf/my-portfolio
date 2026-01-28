export default function GlowSweepOverlay() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-0"
    >
      {/* Soft border glow */}
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />

      {/* Moving light sweep (scanner) */}
      <span className="os-sweep absolute -inset-x-24 -inset-y-10 opacity-30 w-[150%]" />

      {/* Subtle inner bloom/glow */}
      <span
        className="absolute inset-0 rounded-2xl opacity-20 blur-2xl
                   bg-[radial-gradient(circle,rgba(80,200,255,0.14),transparent_60%)]"
      />
    </span>
  );
}
