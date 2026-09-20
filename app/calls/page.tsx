"use client";

import MonoblocCalls from "@/components/zonacalls";
import DashboardButton from "@/components/dashboardbutton";

export default function CallsPage() {
  return (
    <main className="min-h-screen bg-[#07111F] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <DashboardButton />

        <MonoblocCalls />
      </div>
    </main>
  );
}
