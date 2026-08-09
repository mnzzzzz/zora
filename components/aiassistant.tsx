"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AIAssistant() {
  return (
    <section className="grid gap-6 lg:grid-cols-5">

      {/* AI Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-7 shadow-[0_20px_80px_rgba(59,130,246,0.45)] lg:col-span-3">

        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">

          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl">
            <Sparkles size={30} />
          </div>

          <h2 className="text-3xl font-bold">
            Zora AI
          </h2>

          <p className="mt-3 max-w-md leading-relaxed text-white/80">
            Ask anything, summarize notes, manage tasks,
            create plans and stay productive.
          </p>

          <Link href="/ai">
            <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:scale-105">
              Open Assistant
            </button>
          </Link>

        </div>

      </div>

      {/* Stats */}
      <div className="grid gap-4 lg:col-span-2">

        <StatCard title="Tasks" />
        <StatCard title="Events" />
        <StatCard title="Notes" />
        <StatCard title="Goals" />

      </div>

    </section>
  );
}

function StatCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        0
      </h2>

    </div>
  );
}