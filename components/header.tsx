"use client";

import { Search, Bell, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header
      className="
        mx-0
        mb-6
        w-full
        rounded-[26px]
        border
        border-white/10
        bg-[#101B2B]/80
        px-7
        py-4
        shadow-[0_10px_40px_rgba(0,0,0,0.15)]
        backdrop-blur-xl
      "
    >
      <div className="flex min-h-[72px] items-center justify-between gap-6">

        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-4">

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-blue-500
              to-cyan-400
              shadow-[0_0_25px_rgba(34,211,238,0.18)]
            "
          >
            <Sparkles
              size={20}
              className="text-white"
            />
          </div>

          <div className="min-w-0">
            <h1
              className="
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                text-white
              "
            >
              The stage is yours.
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Make something worth remembering.
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 items-center gap-3">

          <div
            className="
              flex
              h-12
              w-[300px]
              items-center
              rounded-2xl
              border
              border-white/10
              bg-[#182435]/80
              px-4
              transition
              focus-within:border-cyan-400/30
            "
          >
            <Search
              className="mr-3 h-5 w-5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-slate-500
              "
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-[#182435]/80
              transition
              hover:border-cyan-400/20
              hover:bg-cyan-400/10
            "
          >
            <Bell
              size={20}
              className="text-slate-300"
            />
          </button>

        </div>
      </div>
    </header>
  );
}