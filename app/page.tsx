"use client";

import ZoraCalls from "@/components/zonacalls";
import Header from "@/components/header";

import AIassistant from "@/components/aiassistant";
import TaskCard from "@/components/taskcard";
import CalendarCard from "@/components/calendarcard";
import NotesCard from "@/components/notescard";
import FinanceCard from "@/components/financecard";
import GoalsCard from "@/components/goalscard";
import ActivityCard from "@/components/activitycard";
import ScrollReveal from "@/components/scrollreveal";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#07111F] text-white">
      

      <main className="flex-1 overflow-y-auto">
        <Header />

        <div className="mx-auto max-w-7xl space-y-6 px-6 pb-10">

          {/* ============================= */}
          {/* AI */}
          {/* ============================= */}

          <ScrollReveal delay={0}>
            <AIassistant />
          </ScrollReveal>

          {/* ============================= */}
          {/* ZORA CALLS */}
          {/* ============================= */}

          <ScrollReveal delay={0.12}>
            <ZoraCalls />
          </ScrollReveal>

          {/* ============================= */}
          {/* MAIN GRID */}
          {/* ============================= */}

          <div className="grid gap-6 lg:grid-cols-12">

            {/* LEFT COLUMN */}

            <div className="space-y-6 lg:col-span-8">

              <ScrollReveal delay={0.08}>
                <TaskCard />
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <CalendarCard />
              </ScrollReveal>

              <ScrollReveal delay={0.32}>
                <NotesCard />
              </ScrollReveal>

            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-6 lg:col-span-4">

              <ScrollReveal delay={0.12}>
                <FinanceCard />
              </ScrollReveal>

              <ScrollReveal delay={0.24}>
                <GoalsCard />
              </ScrollReveal>

              <ScrollReveal delay={0.36}>
                <ActivityCard />
              </ScrollReveal>

            </div>
          </div>

          {/* ============================= */}
          {/* FOUNDERS */}
          {/* ============================= */}

          <ScrollReveal delay={0.1}>
            <section className="pt-8">

              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  The Team
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Meet the Founders
                </h2>

                <p className="mt-2 text-gray-400">
                  The people building Zora.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* MONICCA */}

                <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">

                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-bold shadow-lg shadow-blue-500/20">
                    M
                  </div>

                  <h3 className="text-xl font-bold">
                    Monicca
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    CEO
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Leading Zora&apos;s vision, strategy and overall direction.
                  </p>

                </div>

                {/* NITHISH */}

                <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">

                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-bold shadow-lg shadow-blue-500/20">
                    N
                  </div>

                  <h3 className="text-xl font-bold">
                    Nithish
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    CTO
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Leading Zora&apos;s technology and product development.
                  </p>

                </div>

                {/* THANYA */}

                <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">

                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-bold shadow-lg shadow-blue-500/20">
                    T
                  </div>

                  <h3 className="text-xl font-bold">
                    Thanya
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    CRO
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Leading Zora&apos;s growth, relationships and revenue strategy.
                  </p>

                </div>

                {/* DUSHYANTH */}

                <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">

                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-bold shadow-lg shadow-blue-500/20">
                    D
                  </div>

                  <h3 className="text-xl font-bold">
                    Dushyanth
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    CMO
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Leading Zora&apos;s marketing, branding and communications.
                  </p>

                </div>

              </div>
            </section>
          </ScrollReveal>

        </div>
      </main>
    </div>
  );
}