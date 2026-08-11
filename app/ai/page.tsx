"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  Sparkles,
  Plus,
  Mic,
  Paperclip,
  Brain,
  CalendarDays,
  CheckCircle2,
  FileText,
  Zap,
  Command,
} from "lucide-react";

const suggestions = [
  {
    icon: <CalendarDays size={18} />,
    title: "Plan my day",
    text: "Create a productive schedule for me",
  },
  {
    icon: <CheckCircle2 size={18} />,
    title: "Manage my tasks",
    text: "Help me organize what I need to do",
  },
  {
    icon: <FileText size={18} />,
    title: "Summarize something",
    text: "Turn my notes into something useful",
  },
  {
    icon: <Brain size={18} />,
    title: "Think with me",
    text: "Help me solve a problem",
  },
];

export default function AIPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B14] text-white">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-[15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute right-[-5%] top-[20%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute bottom-[-15%] left-[35%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>

      {/* ================================================= */}
      {/* TOP NAV */}
      {/* ================================================= */}

      <header className="relative z-20 flex h-20 items-center justify-between border-b border-white/[0.06] px-6 lg:px-10">

        <div className="flex items-center gap-4">

          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="h-7 w-px bg-white/10" />

          <div className="flex items-center gap-3">

            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">

              <Sparkles size={19} />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#050B14]" />

            </div>

            <div>
              <p className="font-semibold">Zora AI</p>
              <p className="text-xs text-gray-500">
                Intelligent workspace
              </p>
            </div>

          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-gray-400 md:flex">

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          Zora is ready

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col px-5">

        {/* HERO */}

        <section className="flex flex-1 flex-col items-center justify-center pb-12 pt-16">

          {/* AI Orb */}

          <div className="relative mb-8">

            <div className="absolute inset-[-25px] animate-pulse rounded-full bg-cyan-400/10 blur-2xl" />

            <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/15 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-indigo-600/30 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-xl">

              <Sparkles
                size={38}
                className="text-cyan-200"
              />

            </div>

          </div>

          {/* Heading */}

          <div className="text-center">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              ZORA INTELLIGENCE
            </p>

            <h1 className="text-5xl font-bold tracking-[-0.04em] sm:text-6xl">
              What can I help you
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                accomplish?
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-400">
              Ask Zora to think, plan, organize, summarize,
              or help you get things done.
            </p>

          </div>

          {/* ================================================= */}
          {/* SUGGESTIONS */}
          {/* ================================================= */}

          <div className="mt-12 grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {suggestions.map((item) => (
              <button
                key={item.title}
                onClick={() => setMessage(item.text)}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/20">
                  {item.icon}
                </div>

                <p className="text-sm font-semibold">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.text}
                </p>

              </button>
            ))}

          </div>

          {/* ================================================= */}
          {/* CHAT INPUT */}
          {/* ================================================= */}

          <div className="mt-8 w-full max-w-4xl">

            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0C1523]/90 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition focus-within:border-cyan-400/30 focus-within:shadow-[0_0_60px_rgba(34,211,238,0.08)]">

              {/* Input glow */}

              <div className="pointer-events-none absolute -top-20 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative flex items-end gap-2">

                <button
                  type="button"
                  className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-white/5 hover:text-white"
                >
                  <Plus size={20} />
                </button>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask Zora anything..."
                  rows={1}
                  className="max-h-40 min-h-[52px] flex-1 resize-none bg-transparent px-2 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                />

                <button
                  type="button"
                  className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-white/5 hover:text-white"
                >
                  <Paperclip size={18} />
                </button>

                <button
                  type="button"
                  className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-white/5 hover:text-white"
                >
                  <Mic size={18} />
                </button>

                <button
                  type="button"
                  className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/40"
                >
                  <ArrowUp size={19} />
                </button>

              </div>
            </div>

            {/* Bottom hint */}

            <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-gray-600">

              <span>
                Zora can make mistakes. Check important information.
              </span>

              <div className="hidden items-center gap-2 sm:flex">

                <Command size={12} />

                <span>Enter to send</span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}