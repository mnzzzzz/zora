"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  CalendarDays,
  FileText,
  Target,
  MessageCircle,
  Wand2,
} from "lucide-react";

export default function AIAssistant() {
  return (
    <section className="grid gap-5 lg:grid-cols-5">

      {/* ================================================= */}
      {/* MAIN ZORA AI CARD */}
      {/* ================================================= */}

      <div className="group relative overflow-hidden rounded-[36px] border border-cyan-300/20 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 p-8 shadow-[0_25px_100px_rgba(59,130,246,0.35)] lg:col-span-3">

        {/* Ambient background */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl transition duration-700 group-hover:scale-125" />

        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Decorative circles */}
        <div className="absolute right-10 top-10 h-32 w-32 rounded-full border border-white/10" />
        <div className="absolute right-16 top-16 h-20 w-20 rounded-full border border-white/10" />

        <div className="relative z-10">

          {/* Top row */}
          <div className="flex items-start justify-between">

            {/* AI Icon */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/20 bg-white/15 shadow-xl backdrop-blur-xl">

              <div className="absolute inset-0 animate-pulse rounded-[22px] bg-cyan-300/10" />

              <Sparkles
                size={30}
                strokeWidth={2}
                className="relative"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-xl">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />

              AI Online
            </div>

          </div>

          {/* Heading */}
          <div className="mt-7">

            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-100/80">
              Your intelligent workspace
            </p>

            <h2 className="text-4xl font-bold tracking-tight">
              Meet Zora AI
            </h2>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/75">
              Your personal AI layer for planning, organizing,
              understanding and getting things done.
            </p>

          </div>

          {/* Quick actions */}
          <div className="mt-7 flex flex-wrap gap-2">

            <QuickAction icon={<MessageCircle size={14} />} text="Ask Zora" />

            <QuickAction icon={<Wand2 size={14} />} text="Plan my day" />

            <QuickAction icon={<FileText size={14} />} text="Summarize" />

          </div>

          {/* CTA */}
          <Link href="/ai">

            <button className="group/button mt-7 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 font-semibold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

              Open Zora AI

              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
              />

            </button>

          </Link>

        </div>
      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:col-span-2">

        <StatCard
          title="Tasks"
          value="0"
          icon={<CheckCircle2 size={20} />}
          description="completed"
        />

        <StatCard
          title="Events"
          value="0"
          icon={<CalendarDays size={20} />}
          description="upcoming"
        />

        <StatCard
          title="Notes"
          value="0"
          icon={<FileText size={20} />}
          description="saved"
        />

        <StatCard
          title="Goals"
          value="0"
          icon={<Target size={20} />}
          description="active"
        />

      </div>

    </section>
  );
}


/* ================================================= */
/* QUICK ACTION */
/* ================================================= */

function QuickAction({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex cursor-default items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur-xl transition duration-300 hover:bg-white/20">

      {icon}

      {text}

    </div>
  );
}


/* ================================================= */
/* STAT CARD */
/* ================================================= */

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">

      {/* Glow */}
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
            {icon}
          </div>

          <ArrowUpRight
            size={16}
            className="text-white/20 transition duration-300 group-hover:text-cyan-300"
          />

        </div>

        <p className="mt-5 text-sm text-gray-400">
          {title}
        </p>

        <div className="mt-1 flex items-baseline gap-2">

          <h2 className="text-3xl font-bold">
            {value}
          </h2>

          <span className="text-xs text-gray-500">
            {description}
          </span>

        </div>

      </div>
    </div>
  );
}