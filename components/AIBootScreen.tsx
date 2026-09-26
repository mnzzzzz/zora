"use client";

import { useEffect, useState } from "react";

export default function AIBootScreen({
  duration = 1400,
}: {
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#070708] text-white">
      <div className="flex h-full">
        {/* Sidebar skeleton */}
        <aside className="hidden w-[72px] shrink-0 border-r border-white/[0.06] p-4 md:block">
          <div className="mb-10 h-9 w-9 animate-pulse rounded-xl bg-white/[0.08]" />

          <div className="space-y-5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="mx-auto h-9 w-9 animate-pulse rounded-lg bg-white/[0.055]"
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex h-[72px] items-center justify-between border-b border-white/[0.06] px-6 md:px-10">
            <div>
              <div className="h-4 w-28 animate-pulse rounded bg-white/[0.09]" />
              <div className="mt-2 h-2.5 w-40 animate-pulse rounded bg-white/[0.045]" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.07]" />
              <div className="hidden h-3 w-20 animate-pulse rounded bg-white/[0.06] sm:block" />
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-7xl p-6 md:p-10">
            {/* Greeting */}
            <div className="mb-10">
              <div className="h-7 w-64 animate-pulse rounded-md bg-white/[0.1]" />
              <div className="mt-3 h-3 w-80 animate-pulse rounded bg-white/[0.05]" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5"
                >
                  <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />

                  <div className="mt-5 h-7 w-24 animate-pulse rounded bg-white/[0.09]" />

                  <div className="mt-3 h-2.5 w-16 animate-pulse rounded bg-white/[0.04]" />
                </div>
              ))}
            </div>

            {/* Main cards */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Large card */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-28 animate-pulse rounded bg-white/[0.08]" />
                    <div className="mt-2 h-2.5 w-40 animate-pulse rounded bg-white/[0.04]" />
                  </div>

                  <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.05]" />
                </div>

                {/* Fake chart */}
                <div className="mt-10 flex h-48 items-end gap-3">
                  {[45, 65, 38, 72, 55, 84, 62, 92, 70, 78, 52, 88].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="flex-1 animate-pulse rounded-t-md bg-white/[0.06]"
                        style={{
                          height: `${height}%`,
                          animationDelay: `${i * 60}ms`,
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Side card */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
                <div className="h-4 w-24 animate-pulse rounded bg-white/[0.08]" />

                <div className="mt-7 flex items-center justify-center">
                  <div className="h-36 w-36 animate-pulse rounded-full border-[14px] border-white/[0.06]" />
                </div>

                <div className="mx-auto mt-6 h-3 w-28 animate-pulse rounded bg-white/[0.05]" />
              </div>
            </div>

            {/* Bottom cards */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, card) => (
                <div
                  key={card}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
                >
                  <div className="h-4 w-32 animate-pulse rounded bg-white/[0.08]" />

                  <div className="mt-6 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.06]" />

                        <div className="flex-1">
                          <div className="h-2.5 w-32 animate-pulse rounded bg-white/[0.06]" />
                          <div className="mt-2 h-2 w-20 animate-pulse rounded bg-white/[0.035]" />
                        </div>

                        <div className="h-2.5 w-12 animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Soft loading vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}