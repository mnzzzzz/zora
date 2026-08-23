"use client";

import DocumentsCard from "@/components/DocumentsCard";
import FloatingSidebar from "@/components/floatingsidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
  Send,
  Brain,
  Building2,
  Zap,
  ChevronRight,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Radio,
  Cpu,
  Command,
  ShieldCheck,
  Orbit,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Dashboard() {
  const [command, setCommand] = useState("");
  const [showCommand, setShowCommand] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const [focusSeconds, setFocusSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLoaded, setTimerLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zora-focus-seconds");

    if (saved) {
      const parsed = Number(saved);

      if (Number.isFinite(parsed)) {
        setFocusSeconds(parsed);
      }
    }

    setTimerLoaded(true);
  }, []);

  useEffect(() => {
    if (!timerLoaded) return;

    localStorage.setItem(
      "zora-focus-seconds",
      focusSeconds.toString()
    );
  }, [focusSeconds, timerLoaded]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setFocusSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const formatFocusTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m`;
    }

    return `${seconds}s`;
  };

  const resetFocusTimer = () => {
    setTimerRunning(false);
    setFocusSeconds(0);
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: newTask.trim(),
        completed: false,
      },
    ]);

    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const productivity =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) * 100
        );

  const openAI = () => {
    if (!command.trim()) return;

    setIsThinking(true);

    window.setTimeout(() => {
      window.location.href = `/ai-assistant?prompt=${encodeURIComponent(
        command.trim()
      )}`;
    }, 450);
  };

  const activateCommand = (text: string) => {
    setCommand(text);
    setShowCommand(true);
  };

  return (
    <main className="min-h-screen bg-[#030811] px-5 py-6 pl-24 text-white sm:px-7 sm:pl-24 lg:px-10 lg:pl-28">

      <FloatingSidebar />

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-[5%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.035] blur-[150px]" />
        <div className="absolute right-[5%] top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.04] blur-[170px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.025] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">

        {/* HEADER */}

        <section className="mb-6 rounded-[30px] border border-white/10 bg-[#08111e]/80 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,1)]" />

                <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                  ZORA OS
                </span>

                <span className="ml-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-2 py-0.5 text-[9px] uppercase tracking-wider text-cyan-500">
                  Online
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                The stage is yours.
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Everything you need, connected in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCommand(true)}
              className="group flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.12]"
            >
              <Sparkles
                size={18}
                className="transition group-hover:rotate-12"
              />

              Ask Zora

              <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-slate-500">
                ⌘ K
              </span>
            </button>
          </div>
        </section>

        {/* STATS */}

        <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

          <Stat
            icon={<CheckCircle2 size={19} />}
            label="Tasks completed"
            value={completedTasks.toString()}
            href="/tasks"
          />

          <Stat
            icon={<TrendingUp size={19} />}
            label="Productivity"
            value={`${productivity}%`}
            href="/tasks"
          />

          <Stat
            icon={<Target size={19} />}
            label="Active goals"
            value="—"
            href="/goals"
          />

          <Link
            href="/tutor"
            className="group rounded-[26px] border border-white/10 bg-[#08111e]/75 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
          >
            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <Clock3 size={19} />
              </div>

              <ArrowRight
                size={15}
                className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
              />
            </div>

            <p className="mt-5 text-2xl font-bold">
              {formatFocusTime(focusSeconds)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Focus time
            </p>
          </Link>
        </section>

        {/* FOCUS */}

        <section className="relative mb-6 overflow-hidden rounded-[30px] border border-cyan-400/10 bg-gradient-to-br from-[#0d2035] via-[#091522] to-[#050b13] p-6 shadow-2xl">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Timer
                  size={25}
                  className={
                    timerRunning
                      ? "animate-pulse text-cyan-400"
                      : "text-slate-400"
                  }
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Focus Protocol
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {timerRunning
                    ? "Zora is tracking your focus."
                    : "Ready when you are."}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Study time is saved automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <div className="min-w-[110px] text-center">
                <p className="text-3xl font-bold">
                  {formatFocusTime(focusSeconds)}
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                  total focus
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTimerRunning((running) => !running)
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/10 transition hover:scale-105"
              >
                {timerRunning ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} className="ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={resetFocusTimer}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-500 transition hover:bg-white/[0.08] hover:text-white"
              >
                <RotateCcw size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* ZORA COMMAND CENTER */}

        <section className="relative mb-6 min-h-[620px] overflow-hidden rounded-[36px] border border-cyan-400/20 bg-[#050d18] shadow-[0_0_100px_rgba(34,211,238,0.06)]">

          {/* GRID */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.35) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />

          {/* AMBIENT GLOW */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.06] blur-[120px]" />

          {/* TOP HUD */}

          <div className="absolute left-6 right-6 top-5 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05]">
                <Cpu size={14} className="text-cyan-400" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-500">
                  ZORA INTELLIGENCE
                </p>

                <p className="text-[10px] text-slate-600">
                  Neural command interface
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider text-slate-600">

              <span className="hidden sm:flex items-center gap-2">
                <Activity size={12} className="text-cyan-500" />
                Neural link active
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-cyan-500" />
                Secure
              </span>
            </div>
          </div>

          {/* CORNER HUD */}

          <div className="absolute left-6 top-20 h-10 w-10 border-l border-t border-cyan-400/30" />
          <div className="absolute right-6 top-20 h-10 w-10 border-r border-t border-cyan-400/30" />
          <div className="absolute bottom-6 left-6 h-10 w-10 border-b border-l border-cyan-400/30" />
          <div className="absolute bottom-6 right-6 h-10 w-10 border-b border-r border-cyan-400/30" />

          {/* CENTER */}

          <div className="relative z-10 flex min-h-[620px] flex-col items-center justify-center px-5 py-24">

            {/* CORE */}

            <div className="relative flex h-[280px] w-[280px] items-center justify-center sm:h-[330px] sm:w-[330px]">

              {/* outer ring */}

              <div className="absolute inset-0 rounded-full border border-cyan-400/10" />

              <div className="absolute inset-4 rounded-full border border-cyan-400/10" />

              {/* rotating ring */}

              <div className="absolute inset-7 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-cyan-400/20" />

              <div className="absolute inset-12 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-blue-400/20" />

              {/* orbital dots */}

              <div className="absolute inset-0 animate-[spin_9s_linear_infinite]">
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)]" />
              </div>

              <div className="absolute inset-0 animate-[spin_14s_linear_infinite_reverse]">
                <span className="absolute bottom-[12%] right-[5%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,1)]" />
              </div>

              {/* radar */}

              <div className="absolute inset-[58px] overflow-hidden rounded-full border border-cyan-400/20">
                <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-bottom-left animate-[spin_3s_linear_infinite] bg-gradient-to-tr from-cyan-400/20 to-transparent" />

                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, transparent 49.5%, rgba(34,211,238,.7) 50%, transparent 50.5%), linear-gradient(0deg, transparent 49.5%, rgba(34,211,238,.7) 50%, transparent 50.5%)",
                  }}
                />
              </div>

              {/* core */}

              <div className="relative flex h-[135px] w-[135px] items-center justify-center rounded-full border border-cyan-300/40 bg-[#061522] shadow-[0_0_45px_rgba(34,211,238,0.25),inset_0_0_40px_rgba(34,211,238,0.12)] sm:h-[155px] sm:w-[155px]">

                <div className="absolute inset-3 animate-pulse rounded-full border border-cyan-400/20" />

                <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-xl" />

                <div className="relative flex flex-col items-center">
                  <Sparkles
                    size={34}
                    className="text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,.8)]"
                  />

                  <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-400">
                    ZORA
                  </span>

                  <span className="mt-1 text-[8px] uppercase tracking-widest text-slate-600">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

            {/* TITLE */}

            <div className="mt-4 text-center">

              <div className="mb-3 flex items-center justify-center gap-3">

                <span className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/40" />

                <span className="text-[9px] uppercase tracking-[0.4em] text-cyan-500">
                  Intelligence Core
                </span>

                <span className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/40" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What do you need?
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Tell Zora what you're working on. Your tasks,
                schedule, goals, notes and workspace are all
                connected.
              </p>
            </div>

            {/* COMMAND INPUT */}

            <div className="mt-7 w-full max-w-3xl">

              <div className="group relative">

                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-cyan-400/30 opacity-70 blur-[2px]" />

                <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#07111d]/95 p-2 shadow-2xl">

                  <Command
                    size={18}
                    className="ml-3 shrink-0 text-cyan-500"
                  />

                  <input
                    value={command}
                    onChange={(e) =>
                      setCommand(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        command.trim()
                      ) {
                        openAI();
                      }
                    }}
                    placeholder="Talk to Zora..."
                    className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-slate-700"
                  />

                  <button
                    type="button"
                    onClick={openAI}
                    disabled={!command.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_0_25px_rgba(34,211,238,.15)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>

              {/* QUICK COMMANDS */}

              <div className="mt-4 flex flex-wrap justify-center gap-2">

                <QuickCommand
                  icon={<CalendarDays size={12} />}
                  text="Plan my day"
                  onClick={() =>
                    activateCommand(
                      "Plan my day based on my tasks and schedule"
                    )
                  }
                />

                <QuickCommand
                  icon={<CheckCircle2 size={12} />}
                  text="Organize tasks"
                  onClick={() =>
                    activateCommand(
                      "Help me organize my tasks"
                    )
                  }
                />

                <QuickCommand
                  icon={<Brain size={12} />}
                  text="Study plan"
                  onClick={() =>
                    activateCommand(
                      "Create a study plan for me"
                    )
                  }
                />

                <QuickCommand
                  icon={<Target size={12} />}
                  text="Review goals"
                  onClick={() =>
                    activateCommand(
                      "Review my goals and tell me what I should focus on"
                    )
                  }
                />
              </div>
            </div>

            {/* TELEMETRY */}

            <div className="mt-7 grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">

              <Telemetry
                label="CORE"
                value="99.9%"
              />

              <Telemetry
                label="STATUS"
                value="READY"
              />

              <Telemetry
                label="LATENCY"
                value="12ms"
              />

              <Telemetry
                label="LINK"
                value="ACTIVE"
              />
            </div>

            {/* WAVEFORM */}

            <div className="mt-5 flex h-6 items-center justify-center gap-[3px] opacity-50">

              {Array.from({ length: 42 }).map(
                (_, index) => (
                  <span
                    key={index}
                    className="w-[2px] rounded-full bg-cyan-400"
                    style={{
                      height: `${5 + ((index * 17) % 18)}px`,
                      opacity:
                        0.25 +
                        ((index * 13) % 70) / 100,
                    }}
                  />
                )
              )}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">

          <div className="space-y-6">

            {/* TASKS */}

            <section className="rounded-[30px] border border-white/10 bg-[#08111e]/80 p-6 backdrop-blur-xl">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Today
                    </p>

                    <h2 className="text-xl font-bold">
                      Tasks
                    </h2>
                  </div>
                </div>

                <Link
                  href="/tasks"
                  className="text-slate-500 transition hover:text-cyan-400"
                >
                  <ChevronRight size={20} />
                </Link>
              </div>

              <div className="flex gap-2">

                <input
                  value={newTask}
                  onChange={(e) =>
                    setNewTask(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask();
                  }}
                  placeholder="Add a task..."
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

                <button
                  type="button"
                  onClick={addTask}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 transition hover:scale-105"
                >
                  <Plus size={19} />
                </button>
              </div>

              <div className="mt-4 space-y-2">

                {tasks.length === 0 ? (
                  <Link
                    href="/tasks"
                    className="block rounded-2xl border border-dashed border-white/10 p-7 text-center transition hover:border-cyan-400/20 hover:bg-white/[0.02]"
                  >
                    <CheckCircle2
                      size={27}
                      className="mx-auto mb-3 text-slate-700"
                    />

                    <p className="text-sm text-slate-400">
                      No tasks yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Add one above or open Tasks.
                    </p>
                  </Link>
                ) : (
                  tasks.map((task) => (
                    <button
                      type="button"
                      key={task.id}
                      onClick={() =>
                        toggleTask(task.id)
                      }
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:bg-white/[0.05]"
                    >
                      <CheckCircle2
                        size={19}
                        className={
                          task.completed
                            ? "text-cyan-400"
                            : "text-slate-600"
                        }
                      />

                      <span
                        className={
                          task.completed
                            ? "text-sm text-slate-600 line-through"
                            : "text-sm text-slate-300"
                        }
                      >
                        {task.title}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <Link
                href="/tasks"
                className="mt-5 flex items-center gap-2 text-xs font-semibold text-cyan-400"
              >
                Open full task manager
                <ArrowRight size={14} />
              </Link>
            </section>

            {/* DOCUMENTS */}

            <section>
              <DocumentsCard />
            </section>

            {/* TOOLS */}

            <section>

              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Workspace
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Everything connected
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                <Tool
                  href="/notes"
                  icon={<FileText size={20} />}
                  title="Notes"
                  description="Capture ideas"
                />

                <Tool
                  href="/goals"
                  icon={<Target size={20} />}
                  title="Goals"
                  description="Track progress"
                />

                <Tool
                  href="/tutor"
                  icon={<GraduationCap size={20} />}
                  title="Tutor"
                  description="Learn"
                />

                <Tool
                  href="/business-helper"
                  icon={<Building2 size={20} />}
                  title="Business"
                  description="Operate"
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            <DashboardLink
              href="/calendar"
              icon={<CalendarDays size={20} />}
              label="Schedule"
              title="Calendar"
              description="Schedule and manage your events."
            />

            <Link
              href="/finance"
              className="group block rounded-[30px] border border-white/10 bg-[#08111e]/80 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                    <Wallet size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Finance
                    </p>

                    <h2 className="font-bold">
                      Money overview
                    </h2>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                />
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-600">
                  Current balance
                </p>

                <p className="mt-1 text-3xl font-bold">
                  ₹0
                </p>

                <p className="mt-3 text-xs text-slate-600">
                  Open Finance to manage your transactions.
                </p>
              </div>
            </Link>

            <DashboardLink
              href="/goals"
              icon={<Target size={20} />}
              label="Progress"
              title="Goals"
              description="Create and track your goals."
            />

            <DashboardLink
              href="/ai-assistant"
              icon={<Brain size={20} />}
              label="Intelligence"
              title="Zora AI"
              description="Open the full AI workspace."
            />

          </div>
        </div>
      </div>

      {/* COMMAND OVERLAY */}

      {showCommand && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02060c]/75 px-5 backdrop-blur-xl"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowCommand(false);
            }
          }}
        >

          <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[#06101c] shadow-[0_0_100px_rgba(34,211,238,0.12)]">

            <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.5) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative p-6 sm:p-8">

              <div className="mb-7 flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/[0.06]">

                    <div className="absolute inset-1 animate-pulse rounded-full border border-cyan-400/20" />

                    <Sparkles
                      size={22}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
                      ZORA CORE
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Command Interface
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                      <span className="text-[10px] uppercase tracking-wider text-slate-600">
                        Ready
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCommand(false)}
                  className="rounded-xl border border-white/5 p-2 text-slate-600 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative">

                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-md" />

                <div className="relative flex items-center rounded-2xl border border-cyan-400/20 bg-[#030b14] p-2">

                  <Radio
                    size={18}
                    className="ml-4 text-cyan-400"
                  />

                  <input
                    autoFocus
                    value={command}
                    onChange={(e) =>
                      setCommand(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        command.trim()
                      ) {
                        openAI();
                      }
                    }}
                    placeholder="What can I do for you?"
                    className="min-w-0 flex-1 bg-transparent px-4 py-5 text-sm text-white outline-none placeholder:text-slate-700"
                  />

                  <button
                    type="button"
                    onClick={openAI}
                    disabled={
                      !command.trim() || isThinking
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 transition hover:scale-105 disabled:opacity-40"
                  >
                    {isThinking ? (
                      <Activity
                        size={18}
                        className="animate-pulse"
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-7">

                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">
                  Suggested commands
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                  <CommandSuggestion
                    icon={<CalendarDays size={15} />}
                    title="Plan my day"
                    description="Build a schedule around my priorities"
                    onClick={() =>
                      setCommand(
                        "Plan my day around my priorities"
                      )
                    }
                  />

                  <CommandSuggestion
                    icon={<CheckCircle2 size={15} />}
                    title="Organize my tasks"
                    description="Help me decide what to work on"
                    onClick={() =>
                      setCommand(
                        "Organize my tasks and tell me what to prioritize"
                      )
                    }
                  />

                  <CommandSuggestion
                    icon={<Brain size={15} />}
                    title="Create a study plan"
                    description="Build a focused study schedule"
                    onClick={() =>
                      setCommand(
                        "Create a study plan for me"
                      )
                    }
                  />

                  <CommandSuggestion
                    icon={<Target size={15} />}
                    title="Review my goals"
                    description="Tell me what deserves attention"
                    onClick={() =>
                      setCommand(
                        "Review my goals and tell me what I should focus on"
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">

                <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider text-slate-700">

                  <span className="flex items-center gap-2">
                    <ShieldCheck size={12} />
                    Secure
                  </span>

                  <span className="flex items-center gap-2">
                    <Cpu size={12} />
                    Core active
                  </span>

                  <span className="hidden sm:flex items-center gap-2">
                    <Zap size={12} />
                    Low latency
                  </span>
                </div>

                <span className="font-mono text-[9px] text-slate-700">
                  ZORA//CMD_01
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Telemetry({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-center">
      <p className="text-[8px] uppercase tracking-[0.2em] text-slate-700">
        {label}
      </p>

      <p className="mt-1 font-mono text-[10px] font-semibold text-cyan-500/80">
        {value}
      </p>
    </div>
  );
}

function QuickCommand({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-slate-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
    >
      {icon}
      {text}
    </button>
  );
}

function CommandSuggestion({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/[0.06] text-cyan-500 transition group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-300">
          {title}
        </p>

        <p className="mt-1 truncate text-[10px] text-slate-600">
          {description}
        </p>
      </div>

      <ArrowRight
        size={13}
        className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
      />
    </button>
  );
}

function DashboardLink({
  href,
  icon,
  label,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[30px] border border-white/10 bg-[#08111e]/80 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
            {icon}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {label}
            </p>

            <h2 className="font-bold">
              {title}
            </h2>
          </div>
        </div>

        <ArrowRight
          size={18}
          className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">

        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-slate-700">
          {icon}
        </div>

        <p className="text-sm text-slate-400">
          Open {title}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {description}
        </p>
      </div>
    </Link>
  );
}

function Stat({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[26px] border border-white/10 bg-[#08111e]/75 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>

        <ArrowRight
          size={15}
          className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
        />
      </div>

      <p className="mt-5 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </Link>
  );
}

function Tool({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-[#08111e]/70 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>

        <ArrowRight
          size={14}
          className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
        />
      </div>

      <p className="mt-4 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </Link>
  );
}