"use client";
import ZoraCalls from "@/components/zonacalls";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

import AIassistant from "@/components/aiassistant";
import TaskCard from "@/components/taskcard";
import CalendarCard from "@/components/calendarcard";
import NotesCard from "@/components/notescard";
import FinanceCard from "@/components/financecard";
import GoalsCard from "@/components/goalscard";
import ActivityCard from "@/components/activitycard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#07111F] text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Header />

        <div className="mx-auto max-w-7xl space-y-6 px-6 pb-10">

          {/* AI */}
          <AIassistant/>
          <ZoraCalls />
          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-12">

            <div className="space-y-6 lg:col-span-8">
              <TaskCard />
              <CalendarCard />
              <NotesCard />
            </div>

            <div className="space-y-6 lg:col-span-4">
              <FinanceCard />
              <GoalsCard />
              <ActivityCard />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}