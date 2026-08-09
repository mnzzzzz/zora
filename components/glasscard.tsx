import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden

        rounded-[32px]

        border border-white/10

        bg-gradient-to-br
        from-white/[0.08]
        via-white/[0.05]
        to-white/[0.02]

        backdrop-blur-[35px]

        shadow-[0_10px_60px_rgba(0,0,0,0.45)]

        transition-all
        duration-500
        ease-out

        hover:-translate-y-1
        hover:border-blue-400/30
        hover:shadow-[0_20px_80px_rgba(59,130,246,0.25)]

        ${className}
      `}
    >
      {/* Glass highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-transparent" />

      {/* Blue glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/15 blur-[120px]" />

      {/* Cyan glow */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[120px]" />

      {/* Top reflection */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      {/* Left reflection */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}