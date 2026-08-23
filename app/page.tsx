"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Cpu,
  Orbit,
  Fingerprint,
  Command,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setBooted(true);
    }, 700);

    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();

    const clock = setInterval(updateTime, 1000);

    return () => {
      clearTimeout(bootTimer);
      clearInterval(clock);
    };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030811] text-white">

      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.045] blur-[140px]" />

        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/[0.08] blur-[130px]" />

        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/[0.06] blur-[150px]" />

      </div>

      {/* =====================================================
          GRID
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.045]
          [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* =====================================================
          TOP SYSTEM BAR
      ===================================================== */}

      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-white/[0.06] px-6 py-4 sm:px-10">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06]">
            <Sparkles
              size={15}
              className="text-cyan-400"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              ZORA
            </p>

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
              Neural Operating System
            </p>
          </div>

        </div>

        <div className="hidden items-center gap-6 sm:flex">

          <SystemStatus
            icon={<Activity size={12} />}
            label="SYSTEM"
            value="ONLINE"
          />

          <SystemStatus
            icon={<Cpu size={12} />}
            label="CORE"
            value="READY"
          />

          <div className="font-mono text-xs text-slate-500">
            {time}
          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 pb-10 pt-24">

        <div className="w-full max-w-[1000px]">

          {/* =================================================
              SYSTEM INTRO
          ================================================= */}

          <div
            className={`
              mb-8 text-center transition-all duration-1000
              ${
                booted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }
            `}
          >

            <div className="mb-5 flex items-center justify-center gap-3">

              <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/40" />

              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400/70">
                Neural interface
              </span>

              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/40" />

            </div>

            <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
              Welcome back.
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your workspace is waiting.
              <br />
              Connect to Zora to continue.
            </p>

          </div>

          {/* =================================================
              INTERFACE
          ================================================= */}

          <div
            className={`
              grid overflow-hidden rounded-[32px]
              border border-cyan-400/10
              bg-[#07111e]/80
              shadow-[0_30px_120px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
              transition-all duration-1000
              lg:grid-cols-[0.9fr_1.1fr]
              ${
                booted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }
            `}
          >

            {/* =================================================
                LEFT SYSTEM PANEL
            ================================================= */}

            <div className="relative hidden overflow-hidden border-r border-white/[0.06] bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-blue-500/[0.04] p-10 lg:block">

              {/* Orbital glow */}

              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.08]" />

              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.1]" />

              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.12]" />

              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.9)]" />

              {/* Orbit */}

              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-cyan-400/10">

                <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

              </div>

              <div className="relative flex h-full flex-col justify-between">

                <div>

                  <div className="mb-8 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07]">
                      <Orbit
                        size={21}
                        className="text-cyan-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                        Zora Core
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        Cognitive interface
                      </p>

                    </div>

                  </div>

                  <p className="max-w-xs text-2xl font-semibold leading-tight">
                    Intelligence,
                    <br />
                    without the friction.
                  </p>

                  <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                    Tasks, schedules, knowledge, goals and
                    decisions — connected through one
                    intelligent workspace.
                  </p>

                </div>

                <div className="space-y-3">

                  <SystemLine
                    label="NEURAL CORE"
                    status="READY"
                  />

                  <SystemLine
                    label="WORKSPACE"
                    status="SYNCED"
                  />

                  <SystemLine
                    label="ASSISTANT"
                    status="ONLINE"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                LOGIN PANEL
            ================================================= */}

            <div className="p-7 sm:p-10">

              <div className="mb-7 flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                    Authentication
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Access Zora
                  </h2>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025]">
                  <Fingerprint
                    size={19}
                    className="text-slate-500"
                  />
                </div>

              </div>

              {/* Google */}

              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium transition hover:border-cyan-400/20 hover:bg-white/[0.05]"
              >

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
                  G
                </span>

                Continue with Google

              </button>

              {/* Divider */}

              <div className="my-6 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/[0.07]" />

                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-700">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/[0.07]" />

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Identity
                  </label>

                  <div className="group flex h-12 items-center rounded-xl border border-white/[0.08] bg-black/20 px-4 transition focus-within:border-cyan-400/30 focus-within:shadow-[0_0_25px_rgba(34,211,238,0.05)]">

                    <Mail
                      size={17}
                      className="mr-3 shrink-0 text-slate-600 transition group-focus-within:text-cyan-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      autoComplete="email"
                      placeholder="Enter your email"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500"
                    >
                      Access key
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[10px] text-cyan-400/70 transition hover:text-cyan-300"
                    >
                      Recover access
                    </Link>

                  </div>

                  <div className="group flex h-12 items-center rounded-xl border border-white/[0.08] bg-black/20 px-4 transition focus-within:border-cyan-400/30 focus-within:shadow-[0_0_25px_rgba(34,211,238,0.05)]">

                    <Lock
                      size={17}
                      className="mr-3 shrink-0 text-slate-600 transition group-focus-within:text-cyan-400"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      autoComplete="current-password"
                      placeholder="Enter your access key"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="ml-2 text-slate-600 transition hover:text-cyan-400"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* REMEMBER */}

                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) =>
                        setRemember(e.target.checked)
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <span className="text-xs text-slate-500">
                      Maintain session
                    </span>

                  </label>

                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-emerald-400/60">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                    Secure

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="group relative flex h-13 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-[length:200%_100%] text-sm font-bold text-white shadow-[0_0_30px_rgba(34,211,238,0.12)] transition-all duration-500 hover:bg-right hover:shadow-[0_0_45px_rgba(34,211,238,0.22)]"
                >

                  <span className="relative z-10">
                    Initialize Zora
                  </span>

                  <ArrowRight
                    size={17}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />

                  <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

                </button>

              </form>

              {/* Security */}

              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-700">

                <ShieldCheck size={13} />

                End-to-end protected workspace

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-slate-700 sm:flex-row">

            <div className="flex items-center gap-2">
              <Command size={11} />
              Zora Operating System
            </div>

            <div>
              Built for what comes next
            </div>

            <div>
              v1.0 · Neural Core
            </div>

          </div>

          {/* SIGNUP */}

          <p className="mt-5 text-center text-xs text-slate-600">

            New to Zora?{" "}

            <Link
              href="/signup"
              className="font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              Create your workspace
            </Link>

          </p>

        </div>

      </div>

      {/* =====================================================
          CORNER HUD
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-6 left-6 hidden text-[8px] uppercase tracking-[0.25em] text-slate-700 sm:block">
        ZORA // SECURE CHANNEL
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-2 text-[8px] uppercase tracking-[0.25em] text-slate-700 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        Connection stable
      </div>

    </main>
  );
}

/* =========================================================
   SYSTEM STATUS
========================================================= */

function SystemStatus({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span className="text-cyan-400/70">
        {icon}
      </span>

      <div>
        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-700">
          {label}
        </p>

        <p className="text-[9px] font-bold tracking-[0.15em] text-emerald-400/70">
          {value}
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   SYSTEM LINE
========================================================= */

function SystemLine({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">

      <span className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
        {label}
      </span>

      <div className="flex items-center gap-2">

        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

        <span className="text-[9px] font-semibold tracking-[0.15em] text-emerald-400/70">
          {status}
        </span>

      </div>

    </div>
  );
}