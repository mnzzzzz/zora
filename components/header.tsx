"use client";

import { Search, Bell } from "lucide-react";

export default function Header() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good Evening";
  } else {
    greeting = "Working late?";
  }

  return (
    <header className="flex items-center justify-between rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] p-8 backdrop-blur-[35px] shadow-[0_10px_60px_rgba(0,0,0,.4)]">

      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          {greeting}, Early Bird 👋
        </h1>

        <p className="mt-2 text-gray-400">
          Ready to make today productive?
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-64 bg-transparent text-white placeholder:text-gray-500 outline-none"
          />

        </div>

        {/* Notifications */}
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-400">
          <Bell size={20} />
        </button>

      </div>

    </header>
  );
}