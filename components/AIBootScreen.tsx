"use client"

import { useEffect, useState } from "react"

export default function AIBootScreen({
  duration = 2600,
}: {
  duration?: number
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => window.clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#070708] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

        <div className="absolute inset-0 opacity-[0.025]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      </div>

      {/* Top branding */}
      <div className="absolute left-8 top-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
          <div className="h-3 w-3 rounded-[3px] bg-white" />
        </div>

        <span className="text-sm font-medium tracking-[0.22em] text-white/70">
          MONOBLOC
        </span>
      </div>

      {/* Status */}
      <div className="absolute right-8 top-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
        Initializing workspace
      </div>

      {/* Ground */}
      <div className="absolute bottom-[29%] left-0 right-0">
        <div className="mx-auto h-px w-[min(700px,80vw)] bg-white/[0.07]" />
      </div>

      {/* ROBOT */}
      <div className="robot absolute bottom-[calc(29%+1px)] left-[-180px]">
        {/* Shadow */}
        <div className="absolute -bottom-3 left-1/2 h-2 w-20 -translate-x-1/2 rounded-full bg-black/70 blur-md" />

        {/* Body */}
        <div className="relative flex flex-col items-center">
          {/* Antenna */}
          <div className="absolute -top-8 left-1/2 h-7 w-px -translate-x-1/2 bg-white/30" />
          <div className="absolute -top-9 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white" />

          {/* Head */}
          <div className="relative h-[62px] w-[72px] rounded-[18px] border border-white/20 bg-[#151517] shadow-[0_10px_40px_rgba(0,0,0,.45)]">
            {/* Face */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-4">
              <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.7)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.7)]" />
            </div>

            {/* Mouth */}
            <div className="absolute bottom-3 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-white/20" />
          </div>

          {/* Neck */}
          <div className="h-3 w-5 bg-white/10" />

          {/* Body */}
          <div className="relative h-[76px] w-[78px] rounded-[20px] border border-white/15 bg-[#111113]">
            {/* Chest logo */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="h-4 w-4 rounded-[4px] bg-white/80" />
            </div>

            {/* Left arm */}
            <div className="robot-arm-left absolute -left-7 top-5 h-4 w-8 origin-right rounded-full bg-[#151517] ring-1 ring-white/10" />

            {/* Right throwing arm */}
            <div className="robot-arm-right absolute -right-7 top-5 h-4 w-9 origin-left rounded-full bg-[#151517] ring-1 ring-white/10">
              <div className="absolute -right-2 -top-1 h-6 w-6 rounded-full bg-[#18181a] ring-1 ring-white/10" />
            </div>
          </div>

          {/* Legs */}
          <div className="mt-1 flex gap-5">
            <div className="robot-leg-left h-12 w-4 origin-top rounded-full bg-[#151517] ring-1 ring-white/10" />
            <div className="robot-leg-right h-12 w-4 origin-top rounded-full bg-[#151517] ring-1 ring-white/10" />
          </div>
        </div>
      </div>

      {/* MONOBLOC LOGO BEING THROWN */}
      <div className="logo-projectile absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/20 bg-white shadow-[0_0_50px_rgba(255,255,255,.15)]">
            <div className="h-5 w-5 rounded-[5px] bg-black" />
          </div>

          <div className="text-2xl font-semibold tracking-[-0.04em]">
            monobloc
          </div>
        </div>
      </div>

      {/* Center impact */}
      <div className="logo-impact absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

      {/* Bottom status */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/25">
          Your AI Operating System
        </div>
      </div>

      <style jsx>{`
        .robot {
          animation: robotWalk 1.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .robot-leg-left {
          animation: legLeft 0.22s ease-in-out 5 alternate;
        }

        .robot-leg-right {
          animation: legRight 0.22s ease-in-out 5 alternate;
        }

        .robot-arm-left {
          animation: armLeft 0.45s ease-in-out 3 alternate;
        }

        .robot-arm-right {
          animation:
            armReady 0.6s ease-out 1.05s forwards,
            throwArm 0.35s ease-in-out 1.65s forwards;
        }

        .logo-projectile {
          opacity: 0;
          animation: throwLogo 0.95s cubic-bezier(0.18, 0.9, 0.25, 1) 1.55s forwards;
        }

        .logo-impact {
          opacity: 0;
          animation: impact 0.35s ease-out 2.3s forwards;
        }

        @keyframes robotWalk {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(calc(50vw - 220px));
          }
        }

        @keyframes legLeft {
          from {
            transform: rotate(14deg);
          }

          to {
            transform: rotate(-14deg);
          }
        }

        @keyframes legRight {
          from {
            transform: rotate(-14deg);
          }

          to {
            transform: rotate(14deg);
          }
        }

        @keyframes armLeft {
          from {
            transform: rotate(-10deg);
          }

          to {
            transform: rotate(10deg);
          }
        }

        @keyframes armReady {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(-55deg);
          }
        }

        @keyframes throwArm {
          0% {
            transform: rotate(-55deg);
          }

          45% {
            transform: rotate(35deg);
          }

          100% {
            transform: rotate(10deg);
          }
        }

        @keyframes throwLogo {
          0% {
            opacity: 0;
            transform: translate(-220px, 100px) rotate(-35deg) scale(0.55);
          }

          15% {
            opacity: 1;
          }

          65% {
            opacity: 1;
            transform: translate(0, -45px) rotate(12deg) scale(1.05);
          }

          100% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes impact {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }

          40% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(6);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(14);
          }
        }
      `}</style>
    </div>
  )
}