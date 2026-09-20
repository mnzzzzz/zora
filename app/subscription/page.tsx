"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Check,
  Circle,
  CircleDollarSign,
  Cpu,
  CreditCard,
  Crown,
  Gauge,
  IndianRupee,
  Landmark,
  Lock,
  Network,
  Orbit,
  Radio,
  ScanLine,
  Shield,
  Sparkles,
  Terminal,
  Users,
  X,
  Zap,
} from "lucide-react";

type BillingCycle = "monthly" | "yearly";

type Plan = {
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  level: string;
  icon: React.ReactNode;
  features: string[];
  excluded?: string[];
  accent: string;
  popular?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Enter the Monobloc operating system.",
    level: "LEVEL 01",
    icon: <Sparkles size={20} />,
    accent: "cyan",
    features: [
      "Tasks",
      "Calendar",
      "Notes",
      "Goals",
      "Finance",
      "Monobloc Tutor",
      "Core productivity tools",
      "Monobloc workspace",
    ],
    excluded: [
      "AI",
      "Collaboration",
      "Communication",
      "Business",
    ],
  },
  {
    name: "Hobby",
    monthly: 4,
    yearly: 40,
    description: "Your personal command center.",
    level: "LEVEL 02",
    icon: <Zap size={20} />,
    accent: "blue",
    features: [
      "Everything in Free",
      "AI productivity",
      "Advanced tasks",
      "Advanced calendar",
      "Advanced notes",
      "Goals & planning",
      "Finance tools",
      "Monobloc Tutor",
      "Personal AI assistance",
    ],
    excluded: [
      "Collaboration",
      "Communication",
      "Business",
    ],
  },
  {
    name: "Premium",
    monthly: 10,
    yearly: 100,
    description: "Turn Monobloc into your command center.",
    level: "LEVEL 03",
    icon: <Crown size={20} />,
    accent: "violet",
    popular: true,
    badge: "RECOMMENDED",
    features: [
      "Everything in Hobby",
      "Advanced AI workspace",
      "Collaboration",
      "Monobloc Connect",
      "Realtime messaging",
      "Connection management",
      "Shared workspace",
      "Team communication",
      "Advanced AI assistance",
    ],
    excluded: ["Business tools"],
  },
  {
    name: "Business",
    monthly: 22,
    yearly: 220,
    description: "The complete Monobloc operating system.",
    level: "LEVEL 04",
    icon: <BriefcaseBusiness size={20} />,
    accent: "emerald",
    badge: "FULL SYSTEM",
    features: [
      "Everything in Premium",
      "Business workspace",
      "AI business assistant",
      "Business communication",
      "Customer management",
      "Business calls",
      "Appointment management",
      "Business automation",
      "Advanced business tools",
      "Complete Monobloc ecosystem",
    ],
  },
];

const accent: Record<
  string,
  {
    text: string;
    border: string;
    bg: string;
    gradient: string;
  }
> = {
  cyan: {
    text: "text-cyan-300",
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/10",
    gradient: "from-cyan-400 to-blue-500",
  },
  blue: {
    text: "text-blue-300",
    border: "border-blue-400/20",
    bg: "bg-blue-400/10",
    gradient: "from-blue-500 to-cyan-400",
  },
  violet: {
    text: "text-violet-300",
    border: "border-violet-400/25",
    bg: "bg-violet-400/10",
    gradient: "from-violet-500 via-blue-500 to-cyan-400",
  },
  emerald: {
    text: "text-emerald-300",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/10",
    gradient: "from-emerald-400 to-cyan-400",
  },
};

export default function SubscriptionPage() {
  const [billing, setBilling] =
    useState<BillingCycle>("monthly");

  const [boot, setBoot] = useState(true);

  const [activePlan, setActivePlan] =
    useState<string | null>(null);

  const [paymentOpen, setPaymentOpen] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState("card");

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setBoot(false);
    }, 1100);

    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
        })
      );
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPrice = (plan: Plan) => {
    return billing === "monthly"
      ? plan.monthly
      : plan.yearly;
  };

  const handlePlanSelect = (plan: Plan) => {
    if (plan.name === "Free") {
      setActivePlan("Free");
      return;
    }

    setSelectedPlan(plan);
    setPaymentMethod("card");
    setPaymentSuccess(false);
    setPaymentOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02060c] text-white selection:bg-cyan-400/30">
      {/* BOOT SCREEN */}

      <div
        className={`pointer-events-none fixed inset-0 z-[999] flex items-center justify-center bg-[#02060c] transition-all duration-1000 ${
          boot
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <div className="text-center">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full border border-cyan-400/20" />

            <div className="absolute inset-2 rounded-full border border-cyan-400/30" />

            <div className="absolute inset-5 rounded-full bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,.35)]" />

            <Sparkles
              size={25}
              className="relative animate-pulse text-cyan-300"
            />
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-400">
            Initializing Monobloc
          </p>

          <div className="mx-auto mt-4 h-px w-48 overflow-hidden bg-white/10">
            <div className="h-full w-1/2 animate-[scan_1s_linear_infinite] bg-cyan-400" />
          </div>
        </div>
      </div>

      {/* GLOBAL HUD */}

      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute left-0 top-0 h-20 w-20 border-l border-t border-cyan-400/10" />

        <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-cyan-400/10" />

        <div className="absolute bottom-0 left-0 h-20 w-20 border-b border-l border-cyan-400/10" />

        <div className="absolute bottom-0 right-0 h-20 w-20 border-b border-r border-cyan-400/10" />
      </div>

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[8%] h-[500px] w-[500px] animate-[float_9s_ease-in-out_infinite] rounded-full bg-cyan-500/[0.045] blur-[160px]" />

        <div className="absolute right-[5%] top-[20%] h-[550px] w-[550px] animate-[float_11s_ease-in-out_infinite_reverse] rounded-full bg-blue-600/[0.045] blur-[180px]" />

        <div className="absolute bottom-[-15%] left-[35%] h-[600px] w-[600px] animate-[float_13s_ease-in-out_infinite] rounded-full bg-violet-600/[0.035] blur-[190px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#02060c_85%)]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,.3)_4px)]" />
      </div>

      {/* TOP BAR */}

      <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
        >
          <ArrowLeft
            size={15}
            className="text-slate-600 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-cyan-400"
          />

          <span className="text-xs font-semibold text-slate-500 group-hover:text-white">
            Return to Monobloc
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-slate-700">
            Monobloc // SUBSYSTEM ACCESS
          </span>

          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 sm:flex">
            <Radio
              size={11}
              className="animate-pulse text-cyan-400"
            />

            <span className="font-mono text-[9px] text-slate-700">
              LIVE
            </span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05]">
            <Sparkles
              size={16}
              className="text-cyan-400"
            />
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-12 pt-8 text-center md:px-8 md:pt-12">
        <div className="relative mx-auto mb-9 h-44 w-44">
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-cyan-400/10 border-dashed" />

          <div className="absolute inset-4 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-blue-400/10" />

          <div className="absolute inset-8 animate-[spin_7s_linear_infinite] rounded-full border border-violet-400/10 border-dashed" />

          <div className="absolute left-2 top-1/2 h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,.9)]" />

          <div className="absolute right-4 top-7 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,.8)]" />

          <div className="absolute bottom-5 left-10 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,.8)]" />

          <div className="absolute inset-[34px] animate-[pulse_3s_ease-in-out_infinite] rounded-full border border-cyan-400/20 bg-[#07131f]/90 shadow-[0_0_80px_rgba(34,211,238,.15)] backdrop-blur-xl" />

          <div className="absolute inset-[47px] flex animate-[pulse_2.5s_ease-in-out_infinite] items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-violet-500/20">
            <Brain
              size={28}
              className="text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,.7)]"
            />
          </div>
        </div>

        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2">
          <ScanLine
            size={12}
            className="animate-pulse text-cyan-400"
          />

          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-400">
            INTELLIGENCE CORE ONLINE
          </span>
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-[-0.055em] sm:text-5xl md:text-7xl">
          Your life.
          <br />

          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              One operating system.
            </span>

            <span className="absolute -bottom-2 left-0 h-px w-full animate-[shimmer_3s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
          Choose how deeply you want Monobloc integrated into
          the way you think, work, communicate and operate.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] backdrop-blur-xl md:grid-cols-4">
          <Readout
            icon={<Cpu size={12} />}
            label="CORE"
            value="ONLINE"
          />

          <Readout
            icon={<Network size={12} />}
            label="NETWORK"
            value="STABLE"
          />

          <Readout
            icon={<Shield size={12} />}
            label="SECURITY"
            value="ACTIVE"
          />

          <Readout
            icon={<Gauge size={12} />}
            label="SYSTEM"
            value={time}
          />
        </div>
      </section>

      {/* BILLING CONTROL */}

      <section className="relative z-20 mx-auto mb-10 flex justify-center px-5">
        <div className="relative rounded-2xl border border-white/10 bg-[#07101b]/80 p-1.5 shadow-[0_20px_80px_rgba(0,0,0,.4)] backdrop-blur-2xl">
          <div
            className={`absolute top-1.5 h-[calc(100%-12px)] w-[132px] rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 transition-all duration-500 ${
              billing === "monthly"
                ? "left-1.5"
                : "left-[138px]"
            }`}
          />

          <div className="relative flex">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`w-[132px] rounded-xl px-4 py-3 text-xs font-bold transition-all duration-300 ${
                billing === "monthly"
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-300"
              }`}
            >
              MONTHLY
            </button>

            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`flex w-[145px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-300 ${
                billing === "yearly"
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-300"
              }`}
            >
              YEARLY

              <span className="animate-pulse rounded-full border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 text-[7px] text-cyan-400">
                2 MONTHS FREE
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* PLAN GRID */}

      <section className="relative z-10 mx-auto max-w-[1500px] px-5 pb-20 md:px-8">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => {
            const colors = accent[plan.accent];
            const price = getPrice(plan);
            const active = activePlan === plan.name;

            return (
              <div
                key={plan.name}
                className="group relative animate-[cardEnter_.7s_cubic-bezier(.16,1,.3,1)_both]"
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                <div className="absolute -inset-px rounded-[30px] opacity-0 blur-sm transition duration-700 group-hover:opacity-100 bg-gradient-to-b from-cyan-400/20 via-blue-500/10 to-transparent" />

                <div
                  className={`relative flex h-full min-h-[640px] flex-col overflow-hidden rounded-[30px] border bg-[#07101b]/80 backdrop-blur-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-[#091421]/90 ${
                    plan.popular
                      ? "border-violet-400/25 shadow-[0_25px_100px_rgba(139,92,246,.08)]"
                      : "border-white/[0.08]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute h-px w-full animate-[scanDown_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  </div>

                  <div className="absolute left-3 top-3 h-4 w-4 border-l border-t border-cyan-400/20" />
                  <div className="absolute right-3 top-3 h-4 w-4 border-r border-t border-cyan-400/20" />
                  <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-cyan-400/10" />
                  <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-cyan-400/10" />

                  <div
                    className={`absolute -right-20 -top-20 h-52 w-52 rounded-full ${colors.bg} opacity-30 blur-[90px] transition duration-700 group-hover:opacity-70`}
                  />

                  <div className="relative p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors.border} ${colors.bg} ${colors.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {plan.icon}
                      </div>

                      {plan.badge && (
                        <span
                          className={`rounded-full border px-2.5 py-1 font-mono text-[7px] font-bold tracking-[0.2em] ${
                            plan.popular
                              ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
                              : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 animate-pulse rounded-full ${colors.bg}`}
                      />

                      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-700">
                        {plan.level}
                      </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-black tracking-tight">
                      {plan.name}
                    </h2>

                    <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-600">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-end">
                      <span className="text-5xl font-black tracking-[-0.06em]">
                        ${price}
                      </span>

                      <span className="mb-2 ml-1 font-mono text-[9px] text-slate-700">
                        {plan.monthly === 0
                          ? "FOREVER"
                          : billing === "monthly"
                          ? "/ MONTH"
                          : "/ YEAR"}
                      </span>
                    </div>

                    {billing === "yearly" &&
                      plan.monthly > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[9px] text-cyan-400">
                            ${(plan.yearly / 12).toFixed(2)}
                            /month equivalent
                          </span>

                          <span className="h-1 w-1 rounded-full bg-cyan-400" />

                          <span className="text-[9px] text-slate-700">
                            2 months free
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                  <div className="relative flex-1 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-700">
                        ACCESS PROTOCOL
                      </span>

                      <span className="font-mono text-[8px] text-slate-800">
                        {String(plan.features.length).padStart(
                          2,
                          "0"
                        )}
                        /∞
                      </span>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="group/feature flex items-start gap-3"
                        >
                          <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${colors.border} ${colors.bg}`}
                          >
                            <Check
                              size={9}
                              className={colors.text}
                            />
                          </div>

                          <span className="text-xs leading-5 text-slate-400 transition-colors group-hover/feature:text-white">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {plan.excluded &&
                      plan.excluded.length > 0 && (
                        <>
                          <div className="my-5 h-px bg-white/[0.04]" />

                          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-800">
                            LOCKED MODULES
                          </span>

                          <div className="mt-3 space-y-2">
                            {plan.excluded.map((feature) => (
                              <div
                                key={feature}
                                className="flex items-center gap-2"
                              >
                                <Lock
                                  size={9}
                                  className="text-slate-800"
                                />

                                <span className="text-[10px] text-slate-700">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                  </div>

                  <div className="relative p-6 pt-0">
                    <button
                      type="button"
                      onClick={() =>
                        handlePlanSelect(plan)
                      }
                      className={`group/button relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r ${colors.gradient} text-xs font-black text-white shadow-lg transition-all duration-500 hover:scale-[1.025]`}
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                      <span className="relative">
                        {active
                          ? "SYSTEM ACCESS GRANTED"
                          : plan.name === "Free"
                          ? "ENTER SYSTEM"
                          : `ACTIVATE ${plan.name.toUpperCase()}`}
                      </span>

                      <ArrowRight
                        size={14}
                        className="relative transition-transform duration-300 group-hover/button:translate-x-1"
                      />
                    </button>

                    <div className="mt-3 flex items-center justify-center gap-2">
                      <Circle
                        size={6}
                        className={`fill-current ${colors.text}`}
                      />

                      <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-slate-800">
                        Access available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMAND CENTER */}

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/10 bg-[#06101a]/80 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-px w-full animate-[scanHorizontal_4s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          </div>

          <div className="relative grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="border-b border-white/[0.06] p-7 lg:border-b-0 lg:border-r md:p-10">
              <div className="flex items-center gap-2">
                <Terminal
                  size={14}
                  className="text-cyan-400"
                />

                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-cyan-400">
                  Monobloc INTELLIGENCE CORE
                </span>
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-black tracking-[-0.04em] md:text-4xl">
                Don't buy another app.
                <br />

                <span className="text-slate-600">
                  Upgrade your system.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
                Monobloc brings your tasks, knowledge,
                goals, planning, AI, communication and
                business workflows into one operating
                layer.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Module
                  icon={<Brain size={15} />}
                  label="AI"
                />

                <Module
                  icon={<Users size={15} />}
                  label="CONNECT"
                />

                <Module
                  icon={<Zap size={15} />}
                  label="PRODUCTIVITY"
                />

                <Module
                  icon={<BriefcaseBusiness size={15} />}
                  label="BUSINESS"
                />
              </div>
            </div>

            <div className="relative p-7 md:p-10">
              <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-700">
                SYSTEM DIAGNOSTICS
              </div>

              <div className="mt-6 space-y-5">
                <Diagnostic
                  label="PERSONAL OS"
                  value="ONLINE"
                  progress="100%"
                />

                <Diagnostic
                  label="INTELLIGENCE"
                  value="READY"
                  progress="88%"
                />

                <Diagnostic
                  label="NETWORK"
                  value="STABLE"
                  progress="94%"
                />

                <Diagnostic
                  label="BUSINESS CORE"
                  value="AVAILABLE"
                  progress="76%"
                />
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">
                  <Orbit
                    size={16}
                    className="animate-[spin_6s_linear_infinite] text-cyan-400"
                  />
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold text-cyan-400">
                    ALL SYSTEMS NOMINAL
                  </p>

                  <p className="mt-1 text-[10px] text-slate-700">
                    Monobloc is ready when you are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="relative z-10 border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.05]">
              <Sparkles
                size={12}
                className="text-cyan-400"
              />
            </div>

            <span className="text-xs font-bold text-slate-500">
              Monobloc
            </span>

            <span className="text-[9px] text-slate-800">
              //
            </span>

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-800">
              AI OPERATING SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-700">
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </footer>

      {/* PAYMENT MODAL */}

      {paymentOpen && selectedPlan && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#02060c]/80 backdrop-blur-md"
            onClick={() => setPaymentOpen(false)}
          />

          <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-cyan-400/[0.08] blur-[160px]" />

          <div className="relative w-full max-w-xl animate-[paymentEnter_.5s_cubic-bezier(.16,1,.3,1)] overflow-hidden rounded-[30px] border border-cyan-400/20 bg-[#07101b]/95 shadow-[0_30px_150px_rgba(0,0,0,.7)] backdrop-blur-3xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-0 top-0 h-px w-full animate-[scanHorizontal_3s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

              <div className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-400/[0.04] blur-[100px]" />
            </div>

            <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-cyan-400/30" />
            <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-cyan-400/30" />
            <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-cyan-400/20" />
            <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-cyan-400/20" />

            <div className="relative flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07]">
                  <CreditCard
                    size={17}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-400">
                    SECURE PAYMENT PROTOCOL
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Activate Monobloc {selectedPlan.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPaymentOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition-all duration-300 hover:rotate-90 hover:border-red-400/30 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative p-6">
              {!paymentSuccess ? (
                <>
                  <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-600">
                          SELECTED MODULE
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                              accent[selectedPlan.accent].border
                            } ${
                              accent[selectedPlan.accent].bg
                            } ${
                              accent[selectedPlan.accent].text
                            }`}
                          >
                            {selectedPlan.icon}
                          </div>

                          <div>
                            <p className="font-bold">
                              Monobloc {selectedPlan.name}
                            </p>

                            <p className="text-[10px] text-slate-600">
                              {billing === "monthly"
                                ? "Monthly access cycle"
                                : "Annual access cycle"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
                          TOTAL
                        </p>

                        <p className="mt-1 text-3xl font-black">
                          ${getPrice(selectedPlan)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600">
                        SELECT PAYMENT CHANNEL
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Shield
                          size={10}
                          className="text-cyan-400"
                        />

                        <span className="font-mono text-[7px] text-cyan-400">
                          SECURE
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <PaymentMethod
                        active={paymentMethod === "card"}
                        onClick={() =>
                          setPaymentMethod("card")
                        }
                        icon={
                          <CreditCard
                            size={18}
                            className="text-cyan-400"
                          />
                        }
                        title="CARD"
                        subtitle="Debit / Credit"
                      />

                      <PaymentMethod
                        active={paymentMethod === "upi"}
                        onClick={() =>
                          setPaymentMethod("upi")
                        }
                        icon={
                          <IndianRupee
                            size={18}
                            className="text-blue-400"
                          />
                        }
                        title="UPI"
                        subtitle="Instant payment"
                      />

                      <PaymentMethod
                        active={
                          paymentMethod === "paypal"
                        }
                        onClick={() =>
                          setPaymentMethod("paypal")
                        }
                        icon={
                          <CircleDollarSign
                            size={18}
                            className="text-violet-400"
                          />
                        }
                        title="PAYPAL"
                        subtitle="Global payments"
                      />

                      <PaymentMethod
                        active={paymentMethod === "emi"}
                        onClick={() =>
                          setPaymentMethod("emi")
                        }
                        icon={
                          <Landmark
                            size={18}
                            className="text-emerald-400"
                          />
                        }
                        title="EMI"
                        subtitle="Flexible access"
                      />
                    </div>
                  </div>

                  <div className="mt-5 min-h-[145px] rounded-2xl border border-white/[0.06] bg-black/20 p-5">
                    {paymentMethod === "card" && (
                      <div className="animate-[fadeUp_.35s_ease-out]">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-500">
                            CARD INTERFACE
                          </p>

                          <CreditCard
                            size={14}
                            className="text-cyan-400"
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                            <span className="text-[9px] text-slate-700">
                              Card number
                            </span>

                            <p className="mt-1 font-mono text-xs text-slate-500">
                              •••• •••• •••• ••••
                            </p>
                          </div>

                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                            <span className="text-[9px] text-slate-700">
                              Expiry
                            </span>

                            <p className="mt-1 font-mono text-xs text-slate-500">
                              MM / YY
                            </p>
                          </div>

                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                            <span className="text-[9px] text-slate-700">
                              CVV
                            </span>

                            <p className="mt-1 font-mono text-xs text-slate-500">
                              •••
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="animate-[fadeUp_.35s_ease-out]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-blue-400">
                              UPI PAYMENT CHANNEL
                            </p>

                            <p className="mt-2 text-xs text-slate-600">
                              Connect using your preferred
                              UPI application.
                            </p>
                          </div>

                          <IndianRupee
                            size={24}
                            className="text-blue-400"
                          />
                        </div>

                        <div className="mt-5 flex gap-2">
                          {[
                            "GPay",
                            "PhonePe",
                            "Paytm",
                          ].map((app) => (
                            <div
                              key={app}
                              className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.025] py-3 text-center font-mono text-[8px] text-slate-500"
                            >
                              {app}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="animate-[fadeUp_.35s_ease-out]">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.08]">
                            <CircleDollarSign
                              size={22}
                              className="text-violet-400"
                            />
                          </div>

                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-violet-300">
                              PAYPAL GATEWAY
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-600">
                              Continue securely through
                              your PayPal account.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

                        <p className="mt-4 font-mono text-[8px] text-slate-700">
                          GLOBAL PAYMENT CHANNEL READY
                        </p>
                      </div>
                    )}

                    {paymentMethod === "emi" && (
                      <div className="animate-[fadeUp_.35s_ease-out]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-emerald-400">
                              EMI ACCESS PROTOCOL
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-600">
                              Spread your Monobloc subscription
                              across flexible payment
                              cycles.
                            </p>
                          </div>

                          <Landmark
                            size={24}
                            className="text-emerald-400"
                          />
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                          {[
                            "3 MONTHS",
                            "6 MONTHS",
                            "12 MONTHS",
                          ].map((period) => (
                            <div
                              key={period}
                              className="rounded-lg border border-emerald-400/10 bg-emerald-400/[0.025] py-3 text-center font-mono text-[7px] text-slate-600"
                            >
                              {period}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentSuccess(true)
                    }
                    className="group/pay relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-4 text-xs font-black text-white shadow-[0_15px_60px_rgba(34,211,238,.18)] transition-all duration-500 hover:scale-[1.015]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/pay:translate-x-full" />

                    <Shield
                      size={15}
                      className="relative"
                    />

                    <span className="relative">
                      SIMULATE SECURE PAYMENT
                    </span>

                    <ArrowRight
                      size={15}
                      className="relative"
                    />
                  </button>

                  <p className="mt-4 text-center font-mono text-[7px] uppercase tracking-[0.2em] text-slate-800">
                    DEMO PAYMENT INTERFACE • NO REAL
                    TRANSACTION
                  </p>
                </>
              ) : (
                <div className="flex min-h-[500px] animate-[fadeUp_.5s_ease-out] flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="absolute inset-[-30px] animate-ping rounded-full border border-cyan-400/10" />

                    <div className="absolute inset-[-15px] rounded-full border border-cyan-400/15" />

                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] shadow-[0_0_80px_rgba(34,211,238,.2)]">
                      <Check
                        size={38}
                        className="text-cyan-300"
                      />
                    </div>
                  </div>

                  <p className="mt-9 font-mono text-[9px] uppercase tracking-[0.4em] text-cyan-400">
                    PAYMENT PROTOCOL COMPLETE
                  </p>

                  <h3 className="mt-4 text-3xl font-black tracking-tight">
                    System access ready.
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                    Your Monobloc {selectedPlan.name} access
                    request has been simulated
                    successfully.
                  </p>

                  <div className="mt-7 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />

                    <span className="font-mono text-[8px] tracking-[0.2em] text-slate-500">
                      Monobloc{" "}
                      {selectedPlan.name.toUpperCase()} //
                      READY
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentOpen(false);
                      setActivePlan(selectedPlan.name);
                    }}
                    className="mt-8 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.09] px-6 py-3 text-xs font-bold text-cyan-300 transition-all duration-300 hover:scale-105 hover:bg-cyan-400/[0.1]"
                  >
                    ENTER Monobloc

                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform: translate3d(
                20px,
                -25px,
                0
              )
              scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(300%);
          }
        }

        @keyframes scanDown {
          0% {
            transform: translateY(-20px);
          }

          100% {
            transform: translateY(100px);
          }
        }

        @keyframes scanHorizontal {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes paymentEnter {
          from {
            opacity: 0;
            transform: translateY(30px)
              scale(1.76);
          }

          to {
            opacity: 1;
            transform: translateY(0)
              scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(25px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0)
              scale(1);
          }
        }
      `}</style>
    </main>
  );
}

function Readout({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-white/[0.06] p-3 text-left md:border-r last:border-r-0">
      <div className="flex items-center gap-2">
        <span className="text-cyan-500">
          {icon}
        </span>

        <span className="font-mono text-[7px] tracking-[0.2em] text-slate-700">
          {label}
        </span>
      </div>

      <p className="mt-1 font-mono text-[9px] font-bold text-slate-500">
        {value}
      </p>
    </div>
  );
}

function Module({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.03]">
      <span className="text-cyan-400 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>

      <span className="font-mono text-[7px] tracking-[0.15em] text-slate-700 group-hover:text-slate-400">
        {label}
      </span>
    </div>
  );
}

function Diagnostic({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[8px] tracking-[0.2em] text-slate-700">
          {label}
        </span>

        <span className="font-mono text-[8px] text-cyan-400">
          {value}
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-400/60 to-blue-500"
          style={{
            width: progress,
          }}
        />
      </div>
    </div>
  );
}

function PaymentMethod({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-cyan-400/30 bg-cyan-400/[0.06] shadow-[0_0_30px_rgba(34,211,238,.06)]"
          : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.14] hover:bg-white/[0.03]"
      }`}
    >
      {active && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      )}

      <div className="flex items-center justify-between">
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            active
              ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.3)]"
              : "bg-white/10"
          }`}
        />
      </div>

      <p
        className={`mt-4 text-xs font-black ${
          active
            ? "text-white"
            : "text-slate-500 group-hover:text-slate-300"
        }`}
      >
        {title}
      </p>

      <p className="mt-1 text-[9px] text-slate-700">
        {subtitle}
      </p>
    </button>
  );
}