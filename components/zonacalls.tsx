"use client";

import { useState } from "react";
import {
  Phone,
  CalendarCheck,
  Bot,
  ArrowUpRight,
  Plus,
  Sparkles,
  Clock3,
  Users,
  PhoneCall,
} from "lucide-react";

export default function Monoblocs() {
  const [showSetup, setShowSetup] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-[#0d1b35] via-[#0b1630] to-[#07111f] p-6 shadow-[0_20px_80px_rgba(37,99,235,0.18)] md:p-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <PhoneCall size={25} className="text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  Monoblocls
                </h2>

                <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI READY
                </span>
              </div>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-400">
                Let Monobloc handle calls, appointments, customer questions,
                and follow-ups for you.
              </p>
            </div>

          </div>

          <button
            onClick={() => setShowSetup(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:scale-[1.02] hover:bg-blue-50"
          >
            <Plus size={17} />
            Create AI Receptionist
          </button>

        </div>

        {/* Feature cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <FeatureCard
            icon={<Phone size={19} />}
            title="Answer Calls"
            description="AI answers incoming business calls."
          />

          <FeatureCard
            icon={<CalendarCheck size={19} />}
            title="Book Appointments"
            description="Schedule and manage customer bookings."
          />

          <FeatureCard
            icon={<Users size={19} />}
            title="Customer Follow-ups"
            description="Automatically follow up with customers."
          />

          <FeatureCard
            icon={<Sparkles size={19} />}
            title="Call Intelligence"
            description="Summaries and action items after calls."
          />

        </div>

        {/* Bottom area */}
        <div className="mt-5 grid gap-4 lg:grid-cols-3">

          {/* AI receptionist */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-300">
                  Your AI Receptionist
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Create an AI employee for your business
                </p>
              </div>

              <Bot size={21} className="text-cyan-400" />

            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/15">
                  <Bot size={20} className="text-blue-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    No receptionist configured
                  </p>

                  <p className="text-xs text-gray-500">
                    Set one up to start receiving calls
                  </p>
                </div>

              </div>

              <button
                onClick={() => setShowSetup(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
              >
                Get Started
                <ArrowUpRight size={16} />
              </button>

            </div>

          </div>

          {/* Call stats */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-cyan-400" />

              <p className="text-sm font-medium text-gray-300">
                Call Activity
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <MiniStat
                icon={<Phone size={15} />}
                label="Calls"
                value="—"
              />

              <MiniStat
                icon={<CalendarCheck size={15} />}
                label="Booked"
                value="—"
              />

            </div>

            <p className="mt-4 text-xs text-gray-500">
              Your call analytics will appear here once Monobloc Calls is active.
            </p>

          </div>

        </div>

      </div>

      {/* Setup modal */}
      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0c1729] p-7 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                  <Bot className="text-blue-400" size={23} />
                </div>

                <h3 className="mt-5 text-2xl font-bold text-white">
                  Create your AI Receptionist
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Configure Monobloc to answer calls and handle appointments
                  for your business.
                </p>
              </div>

              <button
                onClick={() => setShowSetup(false)}
                className="rounded-xl px-3 py-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <InputField
                label="Business name"
                placeholder="Enter your business name"
              />

              <InputField
                label="Business phone number"
                placeholder="Enter your phone number"
              />

              <InputField
                label="What should Monobloc help with?"
                placeholder="Appointments, customer questions..."
              />

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setShowSetup(false)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowSetup(false)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Create Receptionist
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

/* Feature Card */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:border-blue-400/20 hover:bg-white/[0.07]">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        {description}
      </p>

    </div>
  );
}

/* Mini Stat */

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">

      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}

/* Input */

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-gray-400">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-blue-400/40 focus:bg-white/[0.07]"
      />
    </div>
  );
}