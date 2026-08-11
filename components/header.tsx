"use client";

import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="mx-0 mb-4 rounded-[28px] border border-white/10 bg-[#101B2B]/90 px-6 py-4 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">

        {/* LEFT — Greeting */}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Good Afternoon, Early Bird 👋
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Ready to make today productive?
          </p>
        </div>

        {/* RIGHT — Search + Notification */}
        <div className="flex shrink-0 items-center gap-3">

          {/* Search */}
          <div className="flex h-12 w-[300px] items-center rounded-2xl border border-white/10 bg-[#182435] px-4">
            <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Notification */}
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#182435] transition hover:bg-white/10"
          >
            <Bell className="h-5 w-5 text-slate-300" />
          </button>

        </div>
      </div>
    </header>
  );
}