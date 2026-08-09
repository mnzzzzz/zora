"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

export default function CalendarCard() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827]/70 p-6 shadow-2xl backdrop-blur-2xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <CalendarDays className="text-white" size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Calendar
            </h2>

            <p className="text-sm text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>

        <Link href="/calendar">
          <button className="rounded-xl bg-white/5 p-2 text-gray-400 transition hover:bg-blue-500/20 hover:text-blue-400">
            <ChevronRight size={18} />
          </button>
        </Link>

      </div>

      {/* Date */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">
          Today
        </p>

        <h1 className="mt-1 text-5xl font-bold text-white">
          {today.getDate()}
        </h1>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
        <p className="text-gray-400">
          No upcoming events.
        </p>
      </div>

      {/* Footer */}
      <Link href="/calendar">
        <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 font-semibold text-white transition hover:scale-[1.02]">
          Open Calendar
        </button>
      </Link>

    </section>
  );
}