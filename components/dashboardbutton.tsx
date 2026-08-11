"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function DashboardButton() {
  return (
    <Link
      href="/"
      className="group mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
    >
      <ArrowLeft
        size={17}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />

      <LayoutDashboard size={17} />

      Dashboard
    </Link>
  );
}