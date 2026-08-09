"use client";

import { CheckSquare, Plus } from "lucide-react";

export default function TaskCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827]/70 p-6 shadow-2xl backdrop-blur-2xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <CheckSquare className="text-white" size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Tasks
            </h2>

            <p className="text-sm text-gray-400">
              Stay organized and get things done.
            </p>
          </div>

        </div>

        <button className="rounded-xl bg-white/5 p-2 text-gray-300 transition hover:bg-blue-500/20 hover:text-blue-400">
          <Plus size={18} />
        </button>

      </div>

      {/* Empty State */}
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">

        <CheckSquare
          size={42}
          className="mb-4 text-gray-500"
        />

        <h3 className="text-lg font-semibold text-white">
          No tasks yet
        </h3>

        <p className="mt-2 max-w-xs text-sm text-gray-400">
          Create your first task and let Zora help you stay on top of your day.
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 font-medium text-white transition hover:scale-105">
          <Plus size={18} />
          New Task
        </button>

      </div>

    </section>
  );
}