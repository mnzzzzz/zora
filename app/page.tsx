"use client";

import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";

export default function Dashboard() {
  const [command, setCommand] = useState("");
  const [showCommand, setShowCommand] = useState(false);

  const [tasks, setTasks] = useState<
    { id: number; title: string; completed: boolean }[]
  >([]);

  const [newTask, setNewTask] = useState("");

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
          ? { ...task, completed: !task.completed }
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
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <main className="min-h-screen px-5 py-6 text-white sm:px-7 lg:px-10">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <section className="mb-6 rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 shadow-2xl backdrop-blur-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                Zora OS
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
            onClick={() => setShowCommand(true)}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-400/10
              px-5
              py-3
              text-sm
              font-semibold
              text-cyan-300
              transition
              hover:border-cyan-400/40
              hover:bg-cyan-400/15
            "
          >
            <Sparkles size={18} />

            Ask Zora

            <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-slate-500">
              ⌘ K
            </span>
          </button>

        </div>

      </section>

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

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
          value="0"
          href="/goals"
        />

        <Stat
          icon={<Clock3 size={19} />}
          label="Focus time"
          value="0h"
          href="/tasks"
        />

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="space-y-6">

          {/* ZORA COMMAND CARD */}

          <button
            onClick={() => setShowCommand(true)}
            className="
              group
              relative
              w-full
              overflow-hidden
              rounded-[32px]
              border
              border-cyan-400/10
              bg-gradient-to-br
              from-[#10253d]
              via-[#0b1727]
              to-[#07101b]
              p-7
              text-left
              shadow-2xl
              transition
              hover:border-cyan-400/25
            "
          >

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">

                    <Sparkles size={22} />

                  </div>

                  <div>
                    <p className="font-bold">
                      Zora Intelligence
                    </p>

                    <p className="text-xs text-slate-500">
                      Your AI operating layer
                    </p>
                  </div>

                </div>

                <Zap
                  size={20}
                  className="text-cyan-400"
                />

              </div>

              <h2 className="mt-7 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                Tell Zora what you need.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Ask for help with your tasks, schedule, goals,
                notes, studying, or work.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-400">

                Open Zora

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />

              </div>

            </div>

          </button>

          {/* =================================================
              TASKS
          ================================================= */}

          <section className="rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

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

            {/* ADD TASK */}

            <div className="flex gap-2">

              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
                placeholder="Add a task..."
                className="
                  min-w-0
                  flex-1
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  focus:border-cyan-400/30
                "
              />

              <button
                onClick={addTask}
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  to-cyan-400
                  transition
                  hover:scale-105
                "
              >
                <Plus size={19} />
              </button>

            </div>

            {/* TASK LIST */}

            <div className="mt-4 space-y-2">

              {tasks.length === 0 ? (

                <Link
                  href="/tasks"
                  className="
                    block
                    rounded-2xl
                    border
                    border-dashed
                    border-white/10
                    p-7
                    text-center
                    transition
                    hover:border-cyan-400/20
                  "
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
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-4
                      text-left
                      transition
                      hover:bg-white/[0.05]
                    "
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

          {/* =================================================
              QUICK TOOLS
          ================================================= */}

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

        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className="space-y-6">

          {/* CALENDAR */}

          <Link
            href="/calendar"
            className="
              group
              block
              rounded-[30px]
              border
              border-white/10
              bg-[#0b1422]/80
              p-6
              backdrop-blur-xl
              transition
              hover:-translate-y-1
              hover:border-cyan-400/20
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Schedule
                  </p>

                  <h2 className="font-bold">
                    Calendar
                  </h2>
                </div>

              </div>

              <ArrowRight
                size={18}
                className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
              />

            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-7 text-center">

              <CalendarDays
                size={27}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-400">
                No upcoming events.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Open Calendar to plan your day.
              </p>

            </div>

          </Link>

          {/* FINANCE */}

          <Link
            href="/finance"
            className="
              group
              block
              rounded-[30px]
              border
              border-white/10
              bg-[#0b1422]/80
              p-6
              backdrop-blur-xl
              transition
              hover:-translate-y-1
              hover:border-cyan-400/20
            "
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

              <div className="mt-4 h-1.5 rounded-full bg-white/[0.06]">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>

              <p className="mt-3 text-xs text-slate-600">
                Open Finance to add your first transaction.
              </p>

            </div>

          </Link>

          {/* GOALS */}

          <Link
            href="/goals"
            className="
              group
              block
              rounded-[30px]
              border
              border-white/10
              bg-[#0b1422]/80
              p-6
              backdrop-blur-xl
              transition
              hover:-translate-y-1
              hover:border-cyan-400/20
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                  <Target size={20} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Progress
                  </p>

                  <h2 className="font-bold">
                    Goals
                  </h2>
                </div>

              </div>

              <ArrowRight
                size={18}
                className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
              />

            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">

              <Target
                size={27}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-400">
                No goals yet.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Create your first goal.
              </p>

            </div>

          </Link>

          {/* AI / BRAIN */}

          <Link
            href="/ai-assistant"
            className="
              group
              block
              rounded-[30px]
              border
              border-white/10
              bg-[#0b1422]/80
              p-6
              backdrop-blur-xl
              transition
              hover:-translate-y-1
              hover:border-cyan-400/20
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                  <Brain size={20} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Intelligence
                  </p>

                  <h2 className="font-bold">
                    Zora AI
                  </h2>
                </div>

              </div>

              <ArrowRight
                size={18}
                className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
              />

            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Ask questions, organize your work, and let Zora
              help connect everything together.
            </p>

          </Link>

        </div>

      </div>

      {/* =====================================================
          COMMAND CENTER MODAL
      ===================================================== */}

      {showCommand && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 backdrop-blur-md">

          <div className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#0b1422] p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Ask Zora
                  </h2>

                  <p className="text-xs text-slate-500">
                    Tell Zora what you need.
                  </p>
                </div>

              </div>

              <button
                onClick={() => setShowCommand(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <div className="flex gap-3">

              <input
                autoFocus
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && command.trim()) {
                    window.location.href = `/ai-assistant?prompt=${encodeURIComponent(
                      command
                    )}`;
                  }
                }}
                placeholder="e.g. Plan my day..."
                className="
                  min-w-0
                  flex-1
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-5
                  py-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  focus:border-cyan-400/30
                "
              />

              <button
                onClick={() => {
                  if (!command.trim()) return;

                  window.location.href =
                    `/ai-assistant?prompt=${encodeURIComponent(command)}`;
                }}
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  to-cyan-400
                  transition
                  hover:scale-105
                "
              >
                <Send size={19} />
              </button>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <Suggestion
                text="Plan my day"
                onClick={() => setCommand("Plan my day")}
              />

              <Suggestion
                text="Organize tasks"
                onClick={() => setCommand("Organize my tasks")}
              />

              <Suggestion
                text="Study plan"
                onClick={() => setCommand("Create a study plan")}
              />

              <Suggestion
                text="Review goals"
                onClick={() => setCommand("Review my goals")}
              />

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

/* =========================================================
   STAT
========================================================= */

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
      className="
        group
        rounded-[26px]
        border
        border-white/10
        bg-[#0b1422]/75
        p-5
        backdrop-blur-xl
        transition
        hover:-translate-y-1
        hover:border-cyan-400/20
      "
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

/* =========================================================
   TOOL
========================================================= */

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
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-[#0b1422]/70
        p-4
        backdrop-blur-xl
        transition
        hover:-translate-y-1
        hover:border-cyan-400/20
      "
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

/* =========================================================
   SUGGESTION
========================================================= */

function Suggestion({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-xl
        border
        border-white/10
        bg-white/[0.03]
        px-3
        py-3
        text-xs
        text-slate-400
        transition
        hover:border-cyan-400/20
        hover:bg-cyan-400/[0.05]
        hover:text-cyan-300
      "
    >
      {text}
    </button>
  );
}