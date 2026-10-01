"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
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
  const [newPriority, setNewPriority] = useState<Priority>("MEDIUM");
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
    () => activeTasks.filter((task) => task.priority === "HIGH"),
    [activeTasks]
  );

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);

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
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <div className="relative min-h-screen bg-[#050505] font-sans text-white antialiased">
      {/* Floating Sidebar */}
      <FloatingSidebar />

      {/* Main */}
      <main className="min-h-screen pl-20 sm:pl-24">
        <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
          {/* HEADER */}
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/30">
                  Monobloc / Tasks
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                Mission Control
              </h1>

              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-white/35">
                Stay on top of what matters. Manage your tasks, priorities,
                and progress from one workspace.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              >
                <Bell size={17} />
              </button>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
              >
                <Plus size={15} />
                New Task
              </button>

              <div className="ml-1 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pr-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                  <span className="text-[10px] font-bold">M</span>
                </div>

                <div className="text-left">
                  <p className="text-xs font-medium text-white">
                    Monobloc User
                  </p>
                  <p className="text-[10px] text-white/30">
                    user@monobloc.app
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* METRICS */}
          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Activity size={15} />}
              label="Active Tasks"
              value={String(activeTasks.length)}
              subtext="In progress"
            />

            <MetricCard
              icon={<CheckCircle2 size={15} />}
              label="Completed"
              value={String(completedTasks.length)}
              subtext="Finished tasks"
            />

            <MetricCard
              icon={<AlertTriangle size={15} />}
              label="High Priority"
              value={String(highPriorityTasks.length)}
              subtext={
                highPriorityTasks.length > 0
                  ? "Requires attention"
                  : "Clear"
              }
            />

            <MetricCard
              icon={<Target size={15} />}
              label="Completion"
              value={`${completionPercentage}%`}
              subtext="Overall progress"
            />
          </section>

          {/* PROGRESS */}
          <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/[0.025] blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                    <Sparkles size={15} />
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Your Progress
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {tasks.length === 0
                    ? "Ready when you are."
                    : `You're ${completionPercentage}% through your tasks.`}
                </h2>

                <p className="mt-1.5 text-xs text-white/35">
                  {tasks.length === 0
                    ? "Create your first task and Monobloc will start tracking your productivity."
                    : highPriorityTasks.length > 0
                    ? `${highPriorityTasks.length} high-priority task${
                        highPriorityTasks.length === 1 ? "" : "s"
                      } need your attention.`
                    : "Everything is under control. Keep up the momentum."}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider">
                    <span className="text-white/30">
                      Overall Completion
                    </span>
                    <span className="text-white/70">
                      {completionPercentage}%
                    </span>
                  </div>

                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Completion */}
              <div className="flex items-center justify-center lg:pr-8">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-center">
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    {completionPercentage}%
                  </span>

                  <span className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* TASKS + SYSTEM STATUS */}
          <div className="mb-6 grid gap-6 lg:grid-cols-12">
            {/* ACTIVE TASKS */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 lg:col-span-8">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-semibold text-white">
                    Active Tasks
                  </h3>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-medium text-white/40">
                    {activeTasks.length} PENDING
                  </span>
                </div>
              </div>

              {activeTasks.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 p-10 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Target size={19} className="text-white/30" />
                  </div>

                  <p className="mt-4 text-xs text-white/35">
                    No active tasks right now.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="mt-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Create Task
                  </button>
                </div>
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

            {/* MONOBLOC STATUS */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 lg:col-span-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Sparkles size={15} className="text-white/70" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Monobloc Intelligence
                </h3>
              </div>

              <div className="mt-5 space-y-2">
                <StatusRow
                  label="Task System"
                  value="ONLINE"
                  active
                />

                <StatusRow
                  label="Priority Alert"
                  value={
                    highPriorityTasks.length > 0
                      ? "ATTENTION"
                      : "CLEAR"
                  }
                  active={highPriorityTasks.length > 0}
                />

                <StatusRow
                  label="Pending Items"
                  value={`${activeTasks.length}`}
                  active={activeTasks.length > 0}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                    System Insight
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-white/35">
                  {tasks.length === 0
                    ? "Your workspace is clear and ready for action."
                    : highPriorityTasks.length > 0
                    ? "High-priority tasks detected. Tackle those first."
                    : "Good task velocity. Focus on steady execution."}
                </p>
              </div>
            </section>
          </div>

          {/* COMPLETED */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Completed Tasks
              </h3>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-medium text-white/40">
                {completedTasks.length} DONE
              </span>
            </div>

            {completedTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-white/25">
                  No completed tasks yet.
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

          {/* QUICK NAVIGATION */}
          <div className="mt-6 flex flex-wrap gap-2">
            <QuickLink
              href="/calendar"
              icon={<CalendarDays size={13} />}
              label="Calendar"
            />

            <QuickLink
              href="/goals"
              icon={<Target size={13} />}
              label="Goals"
            />

            <QuickLink
              href="/tutor"
              icon={<Sparkles size={13} />}
              label="Monobloc Tutor"
            />
          </div>
        </div>
      </main>

      {/* CREATE TASK MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-white/30 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X size={17} />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Target size={17} className="text-white/70" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">
                  Create New Task
                </h3>

                <p className="mt-0.5 text-[10px] text-white/30">
                  Add details to track your activity.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Task Title
                </label>

                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    newTitle.trim() &&
                    createTask()
                  }
                  placeholder="e.g. Finish chemistry assignment"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-white/20 outline-none transition focus:border-white/25 focus:bg-white/[0.05]"
                  autoFocus
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Description
                </label>

                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add additional notes or subtasks..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-white/20 outline-none transition focus:border-white/25 focus:bg-white/[0.05]"
                />
              </div>

              {/* PRIORITY */}
              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Priority
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setNewPriority(priority)}
                        className={`rounded-2xl border py-2.5 text-[10px] font-semibold tracking-wide transition ${
                          newPriority === priority
                            ? "border-white/30 bg-white text-black"
                            : "border-white/10 bg-white/[0.03] text-white/35 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {priority}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* DUE DATE */}
              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Due Date
                </label>

                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white outline-none transition focus:border-white/25"
                />
              </div>

              {/* CREATE */}
              <button
                type="button"
                onClick={createTask}
                disabled={!newTitle.trim()}
                className="mt-2 w-full rounded-full bg-white py-3 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-25"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60">
          {icon}
        </div>

        <span className="text-[9px] uppercase tracking-wider text-white/25">
          {label}
        </span>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-white/30">
        {subtext}
      </p>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const priorityStyle =
    task.priority === "HIGH"
      ? "border-white/20 bg-white/[0.08] text-white"
      : task.priority === "MEDIUM"
      ? "border-white/10 bg-white/[0.04] text-white/60"
      : "border-white/5 bg-white/[0.02] text-white/35";

  return (
    <div
      className={`group flex items-center justify-between rounded-2xl border p-3.5 transition ${
        task.completed
          ? "border-white/5 bg-white/[0.01] opacity-40"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 text-white/30 transition hover:text-white"
          aria-label={
            task.completed ? "Mark task incomplete" : "Complete task"
          }
        >
          {task.completed ? (
            <CheckCircle2 size={18} className="text-white" />
          ) : (
            <Circle size={18} />
          )}
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs ${
                task.completed
                  ? "text-white/30 line-through"
                  : "text-white"
              }`}
            >
              {task.title}
            </span>

            <span
              className={`rounded-full border px-2 py-0.5 text-[8px] font-semibold tracking-wide ${priorityStyle}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mt-1 truncate text-[10px] text-white/25">
              {task.description}
            </p>
          )}

          {task.due && (
            <p className="mt-1 text-[9px] text-white/20">
              Due {task.due}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
        className="ml-3 shrink-0 text-white/15 opacity-0 transition hover:text-white group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function StatusRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
      <span className="text-[10px] text-white/35">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active ? "bg-white/70" : "bg-white/15"
          }`}
        />

        <span
          className={`text-[9px] font-semibold tracking-wide ${
            active ? "text-white/70" : "text-white/25"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

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
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-[10px] font-medium text-white/40 transition hover:bg-white/[0.07] hover:text-white"
    >
      {icon}
      {label}
      <ArrowUpRight size={11} />
    </Link>
  );
}