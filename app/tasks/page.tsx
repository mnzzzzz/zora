"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  Check,
  Plus,
  Trash2,
  Clock3,
  Zap,
  Target,
  Activity,
  ChevronRight,
  Circle,
  CheckCircle2,
  Cpu,
  Radio,
  Sparkles,
  CalendarDays,
  AlertTriangle,
  X,
  Terminal,
  Signal,
  BrainCircuit,
} from "lucide-react";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  due: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] =
    useState<Priority>("MEDIUM");
  const [newDue, setNewDue] = useState("");

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const highPriorityTasks = useMemo(
    () =>
      activeTasks.filter(
        (task) => task.priority === "HIGH"
      ),
    [activeTasks]
  );

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length / tasks.length) * 100
        );

  function createTask() {
    if (!newTitle.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      completed: false,
      due: newDue,
    };

    setTasks((current) => [task, ...current]);

    setNewTitle("");
    setNewDescription("");
    setNewPriority("MEDIUM");
    setNewDue("");
    setShowCreate(false);
  }

  function toggleTask(id: number) {
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
  }

  function deleteTask(id: number) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  return (
    <>
      <FloatingSidebar />

      <main className="relative min-h-screen overflow-hidden bg-transparent px-5 py-6 text-white sm:px-6 sm:py-8 lg:pl-28">

        {/* =====================================================
            JARVIS BACKGROUND
        ===================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <div className="absolute left-[5%] top-[8%] h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[130px]" />

          <div className="absolute right-[0%] top-[25%] h-96 w-96 rounded-full bg-blue-500/[0.06] blur-[150px]" />

          <div className="absolute bottom-[0%] left-[35%] h-96 w-96 rounded-full bg-violet-500/[0.04] blur-[160px]" />

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Scanlines */}

          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,211,238,0.015)_50%,transparent_100%)]" />

          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        </div>

        <div className="relative z-10 mx-auto max-w-7xl">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="relative mb-7 overflow-hidden rounded-[28px] border border-cyan-400/10 bg-[#030b14]/75 p-6 backdrop-blur-2xl sm:p-7">

            {/* HUD corners */}

            <HudCorners />

            {/* Scan beam */}

            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px animate-pulse bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06]">

                    <Cpu
                      size={19}
                      className="text-cyan-300"
                    />

                    <div className="absolute inset-0 rounded-xl border border-cyan-400/20 animate-ping" />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-cyan-400">
                        ZORA
                      </p>

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      <span className="font-mono text-[8px] tracking-[0.2em] text-emerald-400">
                        ONLINE
                      </span>

                    </div>

                    <p className="mt-1 font-mono text-[8px] tracking-[0.2em] text-slate-600">
                      PERSONAL TASK SYSTEM
                    </p>

                  </div>

                </div>

                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Mission Control
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Stay on top of what matters. Zora keeps
                  your tasks, priorities and progress organized.
                </p>

              </div>

              <div className="flex items-center gap-4">

                <div className="hidden text-right sm:block">

                  <p className="font-mono text-[8px] tracking-[0.25em] text-slate-600">
                    SYSTEM STATUS
                  </p>

                  <div className="mt-1 flex items-center justify-end gap-2">

                    <Signal
                      size={12}
                      className="text-emerald-400"
                    />

                    <span className="font-mono text-[10px] text-emerald-400">
                      ALL SYSTEMS NORMAL
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-cyan-300/30 bg-cyan-400/[0.08] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/[0.14]"
                >

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <Plus
                    size={16}
                    className="relative transition group-hover:rotate-90"
                  />

                  <span className="relative">
                    New Task
                  </span>

                </button>

              </div>

            </div>

          </header>

          {/* =====================================================
              TELEMETRY
          ===================================================== */}

          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <TelemetryCard
              icon={<Activity size={17} />}
              label="ACTIVE TASKS"
              value={String(activeTasks.length)}
              status="LIVE"
              bars={activeTasks.length}
            />

            <TelemetryCard
              icon={<CheckCircle2 size={17} />}
              label="COMPLETED"
              value={String(completedTasks.length)}
              status="DONE"
              bars={completedTasks.length}
            />

            <TelemetryCard
              icon={<AlertTriangle size={17} />}
              label="HIGH PRIORITY"
              value={String(highPriorityTasks.length)}
              status={
                highPriorityTasks.length > 0
                  ? "ATTENTION"
                  : "CLEAR"
              }
              bars={highPriorityTasks.length}
            />

            <TelemetryCard
              icon={<Zap size={17} />}
              label="COMPLETION"
              value={`${completionPercentage}%`}
              status="SYNCED"
              bars={completionPercentage}
            />

          </section>

          {/* =====================================================
              PROGRESS / CORE
          ===================================================== */}

          <section className="relative mb-6 overflow-hidden rounded-[30px] border border-cyan-400/10 bg-[#050e18]/80 p-6 backdrop-blur-2xl sm:p-8">

            <HudCorners />

            <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">

              <div className="lg:col-span-8">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/[0.08]">
                    <BrainCircuit
                      size={14}
                      className="text-cyan-400"
                    />
                  </div>

                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                    YOUR PROGRESS
                  </span>

                </div>

                <h2 className="mt-4 text-2xl font-semibold">

                  {tasks.length === 0
                    ? "Ready when you are."
                    : `You're ${completionPercentage}% through your tasks.`}

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                  {tasks.length === 0
                    ? "Create your first task and Zora will start tracking your progress."
                    : highPriorityTasks.length > 0
                      ? `${highPriorityTasks.length} high-priority task${highPriorityTasks.length === 1 ? "" : "s"} need your attention.`
                      : "Everything looks good. Keep going."}

                </p>

                {/* Progress bar */}

                <div className="mt-7">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="font-mono text-[8px] tracking-[0.2em] text-slate-600">
                      COMPLETION
                    </span>

                    <span className="font-mono text-[9px] text-cyan-400">
                      {completionPercentage}%
                    </span>

                  </div>

                  <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 transition-all duration-700"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  </div>

                </div>

              </div>

              {/* Reactor */}

              <div className="flex justify-center lg:col-span-4">

                <ProgressCore
                  percentage={completionPercentage}
                />

              </div>

            </div>

          </section>

          {/* =====================================================
              MAIN GRID
          ===================================================== */}

          <div className="grid gap-5 lg:grid-cols-12">

            {/* TASKS */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:col-span-8">

              <HudCorners subtle />

              <div className="relative mb-6 flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Radio
                      size={13}
                      className="text-cyan-400"
                    />

                    <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                      TASKS
                    </span>

                  </div>

                  <h2 className="mt-2 text-xl font-semibold">
                    Your Tasks
                  </h2>

                </div>

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                  <span className="font-mono text-[9px] text-slate-600">
                    {activeTasks.length} ACTIVE
                  </span>

                </div>

              </div>

              {activeTasks.length === 0 ? (

                <EmptyState
                  icon={<Target size={23} />}
                  title="No active tasks"
                  description="Create a task and Zora will add it here."
                  onCreate={() => setShowCreate(true)}
                />

              ) : (

                <div className="space-y-2.5">

                  {activeTasks.map((task) => (

                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />

                  ))}

                </div>

              )}

            </section>

            {/* ZORA OVERVIEW */}

            <section className="relative overflow-hidden rounded-[30px] border border-cyan-400/10 bg-[#050e18]/70 p-6 backdrop-blur-xl lg:col-span-4">

              <HudCorners subtle />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">

                    <Sparkles
                      size={19}
                      className="text-cyan-400"
                    />

                    <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                  </div>

                  <div>

                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-400">
                      ZORA
                    </p>

                    <h2 className="mt-1 font-semibold">
                      Overview
                    </h2>

                  </div>

                </div>

                <div className="mt-6 space-y-2">

                  <SystemRow
                    label="Task system"
                    value="ONLINE"
                  />

                  <SystemRow
                    label="Priority"
                    value={
                      highPriorityTasks.length > 0
                        ? "ATTENTION"
                        : "CLEAR"
                    }
                  />

                  <SystemRow
                    label="Active tasks"
                    value={`${activeTasks.length}`}
                  />

                  <SystemRow
                    label="Completed"
                    value={`${completionPercentage}%`}
                  />

                </div>

                {/* Zora message */}

                <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-4">

                  <div className="flex items-center gap-2">

                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-400/[0.08]">

                      <Zap
                        size={12}
                        className="text-cyan-400"
                      />

                    </div>

                    <span className="font-mono text-[8px] tracking-[0.2em] text-cyan-400">
                      ZORA SAYS
                    </span>

                  </div>

                  <p className="mt-3 text-xs leading-6 text-slate-500">

                    {tasks.length === 0
                      ? "Your workspace is ready. What are we working on?"
                      : highPriorityTasks.length > 0
                        ? "You have some important tasks waiting. Let's tackle those first."
                        : "You're doing great. Keep the momentum going."}

                  </p>

                </div>

                {/* Activity terminal */}

                <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20">

                  <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-3">

                    <Terminal
                      size={12}
                      className="text-slate-600"
                    />

                    <span className="font-mono text-[8px] tracking-[0.2em] text-slate-600">
                      ACTIVITY
                    </span>

                    <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                  </div>

                  <div className="space-y-2 p-4 font-mono text-[8px]">

                    <ActivityLine text="Zora is online" />

                    <ActivityLine
                      text={`${tasks.length} task${tasks.length === 1 ? "" : "s"} loaded`}
                    />

                    <ActivityLine
                      text={
                        highPriorityTasks.length > 0
                          ? `${highPriorityTasks.length} priority task detected`
                          : "No urgent tasks detected"
                      }
                    />

                    <ActivityLine text="Ready for your next move" />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                COMPLETED
            ================================================= */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-xl lg:col-span-12">

              <HudCorners subtle />

              <div className="relative mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05]">

                    <Check
                      size={18}
                      className="text-emerald-400"
                    />

                  </div>

                  <div>

                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-400">
                      COMPLETED
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Finished Tasks
                    </h2>

                  </div>

                </div>

                <span className="font-mono text-[9px] text-slate-600">
                  {completedTasks.length} DONE
                </span>

              </div>

              {completedTasks.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.08] p-7 text-center">

                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-700">
                    No completed tasks yet
                  </p>

                </div>

              ) : (

                <div className="grid gap-2.5 md:grid-cols-2">

                  {completedTasks.map((task) => (

                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />

                  ))}

                </div>

              )}

            </section>

          </div>

          {/* =====================================================
              NAVIGATION
          ===================================================== */}

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.05] pt-5">

            <QuickLink
              href="/calendar"
              icon={<CalendarDays size={14} />}
              label="Calendar"
            />

            <QuickLink
              href="/goals"
              icon={<Target size={14} />}
              label="Goals"
            />

            <QuickLink
              href="/tutor"
              icon={<Sparkles size={14} />}
              label="Zora Tutor"
            />

          </div>

        </div>

        {/* =====================================================
            CREATE TASK MODAL
        ===================================================== */}

        {showCreate && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">

            <div className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[#050e18]/95 p-7 shadow-[0_0_80px_rgba(34,211,238,0.08)]">

              <HudCorners />

              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-slate-600 transition hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="relative mb-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">

                    <Target
                      size={19}
                      className="text-cyan-400"
                    />

                  </div>

                  <div>

                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-400">
                      NEW TASK
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                      What needs to be done?
                    </h2>

                  </div>

                </div>

              </div>

              <div className="relative space-y-4">

                {/* TITLE */}

                <div>

                  <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.2em] text-slate-600">
                    Task title
                  </label>

                  <input
                    value={newTitle}
                    onChange={(e) =>
                      setNewTitle(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        newTitle.trim()
                      ) {
                        createTask();
                      }
                    }}
                    placeholder="e.g. Finish physics assignment"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                    autoFocus
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.2em] text-slate-600">
                    Details
                  </label>

                  <textarea
                    value={newDescription}
                    onChange={(e) =>
                      setNewDescription(e.target.value)
                    }
                    placeholder="Add any details you need..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                  />

                </div>

                {/* PRIORITY */}

                <div>

                  <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.2em] text-slate-600">
                    Priority
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {(
                      ["LOW", "MEDIUM", "HIGH"] as Priority[]
                    ).map((priority) => (

                      <button
                        key={priority}
                        type="button"
                        onClick={() =>
                          setNewPriority(priority)
                        }
                        className={`rounded-xl border px-3 py-3 text-[10px] font-semibold transition ${
                          newPriority === priority
                            ? priority === "HIGH"
                              ? "border-red-400/30 bg-red-400/[0.08] text-red-300"
                              : priority === "MEDIUM"
                                ? "border-amber-400/30 bg-amber-400/[0.08] text-amber-300"
                                : "border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300"
                            : "border-white/[0.07] bg-white/[0.025] text-slate-600 hover:text-white"
                        }`}
                      >
                        {priority}
                      </button>

                    ))}

                  </div>

                </div>

                {/* DUE */}

                <div>

                  <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.2em] text-slate-600">
                    Due date
                  </label>

                  <input
                    type="date"
                    value={newDue}
                    onChange={(e) =>
                      setNewDue(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                  />

                </div>

                {/* CREATE */}

                <button
                  type="button"
                  onClick={createTask}
                  disabled={!newTitle.trim()}
                  className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-300/30 bg-cyan-400/[0.1] font-bold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/[0.15] disabled:cursor-not-allowed disabled:opacity-30"
                >

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <Plus
                    size={16}
                    className="relative"
                  />

                  <span className="relative">
                    Create Task
                  </span>

                </button>

              </div>

            </div>

          </div>

        )}

      </main>
    </>
  );
}

/* =========================================================
   HUD CORNERS
========================================================= */

function HudCorners({
  subtle = false,
}: {
  subtle?: boolean;
}) {
  const opacity = subtle
    ? "opacity-40"
    : "opacity-70";

  return (
    <>
      <div
        className={`pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-cyan-400/30 ${opacity}`}
      />

      <div
        className={`pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-cyan-400/30 ${opacity}`}
      />

      <div
        className={`pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-cyan-400/30 ${opacity}`}
      />

      <div
        className={`pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-cyan-400/30 ${opacity}`}
      />
    </>
  );
}

/* =========================================================
   TELEMETRY CARD
========================================================= */

function TelemetryCard({
  icon,
  label,
  value,
  status,
  bars,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: string;
  bars: number;
}) {
  const activeBars =
    label === "COMPLETION"
      ? Math.round(bars / 8.5)
      : Math.min(bars + 2, 12);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050e18]/65 p-4 backdrop-blur-xl transition hover:border-cyan-400/15">

      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-400/[0.025] blur-2xl" />

      <div className="relative flex items-start justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-400">
          {icon}
        </div>

        <span className="font-mono text-[8px] tracking-[0.15em] text-slate-600">
          {status}
        </span>

      </div>

      <p className="relative mt-4 font-mono text-[8px] uppercase tracking-[0.2em] text-slate-600">
        {label}
      </p>

      <div className="relative mt-1 flex items-end gap-2">

        <p className="font-mono text-2xl font-semibold text-slate-200">
          {value}
        </p>

      </div>

      <div className="relative mt-3 flex gap-1">

        {Array.from({ length: 12 }).map((_, index) => (

          <div
            key={index}
            className={`h-1 flex-1 transition ${
              index < activeBars
                ? "bg-cyan-400/50"
                : "bg-white/[0.04]"
            }`}
          />

        ))}

      </div>

    </div>
  );
}

/* =========================================================
   PROGRESS CORE
========================================================= */

function ProgressCore({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center">

      <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-cyan-400/10 border-r-cyan-400/60 border-t-cyan-400/70" />

      <div className="absolute inset-3 animate-[spin_13s_linear_infinite_reverse] rounded-full border border-blue-400/10 border-b-blue-400/50" />

      <div className="absolute inset-7 rounded-full border border-dashed border-cyan-400/15" />

      <div className="absolute inset-[43px] rounded-full bg-cyan-400/[0.04] shadow-[0_0_70px_rgba(34,211,238,0.15)]" />

      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/[0.07]">

        <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.9)]" />

      </div>

      <div className="absolute text-center">

        <p className="font-mono text-2xl font-bold text-cyan-200">
          {percentage}%
        </p>

        <p className="mt-1 font-mono text-[7px] tracking-[0.3em] text-slate-600">
          COMPLETE
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   TASK ROW
========================================================= */

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const priorityClass =
    task.priority === "HIGH"
      ? "border-red-400/20 bg-red-400/[0.06] text-red-300"
      : task.priority === "MEDIUM"
        ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-300"
        : "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300";

  return (
    <div
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 transition ${
        task.completed
          ? "border-white/[0.04] bg-white/[0.015] opacity-55"
          : "border-white/[0.06] bg-black/[0.12] hover:border-cyan-400/15 hover:bg-cyan-400/[0.02]"
      }`}
    >

      {/* tiny HUD line */}

      {!task.completed && (
        <div className="absolute left-0 top-0 h-px w-12 bg-gradient-to-r from-cyan-400/40 to-transparent" />
      )}

      {/* CHECK */}

      <button
        type="button"
        onClick={onToggle}
        className="shrink-0"
        aria-label={
          task.completed
            ? "Mark task incomplete"
            : "Complete task"
        }
      >

        {task.completed ? (
          <CheckCircle2
            size={22}
            className="text-emerald-400"
          />
        ) : (
          <Circle
            size={22}
            className="text-slate-700 transition group-hover:text-cyan-400"
          />
        )}

      </button>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <h3
            className={`text-sm font-medium ${
              task.completed
                ? "text-slate-600 line-through"
                : "text-slate-200"
            }`}
          >
            {task.title}
          </h3>

          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[8px] font-semibold tracking-[0.1em] ${priorityClass}`}
          >
            {task.priority}
          </span>

        </div>

        {task.description && (
          <p className="mt-1 truncate text-xs text-slate-600">
            {task.description}
          </p>
        )}

        {task.due && (
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-slate-600">

            <Clock3 size={11} />

            {task.due}

          </div>
        )}

      </div>

      {/* DELETE */}

      <button
        type="button"
        onClick={onDelete}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-700 opacity-0 transition hover:bg-red-400/[0.08] hover:text-red-400 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 size={14} />
      </button>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
  onCreate,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onCreate: () => void;
}) {
  return (
    <div className="relative rounded-2xl border border-dashed border-white/[0.08] bg-black/[0.08] p-10 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-400">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
        {description}
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.1]"
      >
        <Plus size={14} />
        Create Task
      </button>

    </div>
  );
}

/* =========================================================
   SYSTEM ROW
========================================================= */

function SystemRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-black/[0.12] px-4 py-3">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <div className="flex items-center gap-2">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

        <span className="font-mono text-[9px] font-semibold tracking-[0.1em] text-slate-400">
          {value}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   ACTIVITY LINE
========================================================= */

function ActivityLine({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-600">

      <span className="text-cyan-400/50">
        ›
      </span>

      <span>
        {text}
      </span>

    </div>
  );
}

/* =========================================================
   QUICK LINK
========================================================= */

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs text-slate-600 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.03] hover:text-cyan-300"
    >

      {icon}

      {label}

      <ChevronRight
        size={12}
        className="transition group-hover:translate-x-0.5"
      />

    </Link>
  );
}