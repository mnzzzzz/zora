"use client";

import { Wallet } from "lucide-react";

export default function FinanceCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827]/70 p-6 shadow-2xl backdrop-blur-2xl">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400">
          <Wallet className="text-white" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Finances
          </h2>

          <p className="text-sm text-gray-400">
            Track your money in one place.
          </p>
        </div>

      </div>

      {/* Empty State */}
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">

        <Wallet size={40} className="mb-4 text-gray-500" />

        <h3 className="text-lg font-semibold text-white">
          No financial data yet
        </h3>

        <p className="mt-2 max-w-xs text-sm text-gray-400">
          Connect your accounts or manually add transactions to begin tracking your finances.
        </p>

      </div>

    </section>
  );
}