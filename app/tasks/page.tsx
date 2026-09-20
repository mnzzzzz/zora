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
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Plus,
  Search,
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
    <div className="relative min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      {/* Floating Sidebar */}
      <FloatingSidebar />

      {/* Main Content Container (Shifted right with pl-20 sm:pl-24) */}
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 pl-20 shadow-2xl sm:pl-24">
        {/* =========================================================
            HEADER SECTION
        ========================================================= */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Mission Control
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Stay on top of what matters. Monoblocps your tasks, priorities, and progress organized.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <Bell size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
            >
              <Plus size={16} />
              New Task
            </button>

            <div className="ml-2 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-800" />
              </div>
              <div className="text-left text-xs">
                <p className="font-medium text-white">Monobloc User</p>
                <p className="text-[10px] text-slate-400">user@Monobloc.app</p>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================
            METRICS / TELEMETRY CARDS
        ========================================================= */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Activity size={16} />}
            label="Active Tasks"
            value={String(activeTasks.length)}
            subtext="In progress"
          />
          <MetricCard
            icon={<CheckCircle2 size={16} />}
            label="Completed"
            value={String(completedTasks.length)}
            subtext="Finished tasks"
          />
          <MetricCard
            icon={<AlertTriangle size={16} />}
            label="High Priority"
            value={String(highPriorityTasks.length)}
            subtext={
              highPriorityTasks.length > 0 ? "Requires attention" : "Clear"
            }
          />
          <MetricCard
            icon={<Target size={16} />}
            label="Completion"
            value={`${completionPercentage}%`}
            subtext="Overall score"
          />
        </section>

        {/* =========================================================
            PROGRESS BANNER
        ========================================================= */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#251f33] via-[#1b1924] to-[#181622] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  <Sparkles size={16} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Your Progress
                </span>
              </div>

              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                {tasks.length === 0
                  ? "Ready when you are."
                  : `You're ${completionPercentage}% through your tasks.`}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {tasks.length === 0
                  ? "Create your first task and Monobloc will start tracking your productivity."
                  : highPriorityTasks.length > 0
                  ? `${highPriorityTasks.length} high-priority task${
                      highPriorityTasks.length === 1 ? "" : "s"
                    } need your attention.`
                  : "Everything is under control. Keep up the momentum!"}
              </p>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Overall Completion</span>
                  <span className="text-white">{completionPercentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Completion Badge */}
            <div className="flex items-center justify-center lg:pr-6">
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-center shadow-lg shadow-purple-500/10">
                <span className="text-2xl font-bold text-white">
                  {completionPercentage}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT GRID: TASKS & Monobloc OVERVIEW
        ========================================================= */}
        <div className="mb-6 grid gap-6 lg:grid-cols-12">
          {/* Active Tasks List (8 Cols) */}
          <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6 lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Active Tasks
                </h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white">
                  {activeTasks.length} Pending
                </span>
              </div>
            </div>

            {activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center">
                <Target size={28} className="text-slate-600" />
                <p className="mt-3 text-xs text-slate-400">
                  No active tasks right now.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10"
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

          {/* Monobloc Insights / Status (4 Cols) */}
          <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6 lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <Sparkles size={16} />
              </div>
              <h3 className="text-sm font-semibold text-white">Monoblocistant</h3>
            </div>

            <div className="mt-4 space-y-2.5">
              <StatusRow
                label="Task System"
                value="ONLINE"
                active
              />
              <StatusRow
                label="Priority Alert"
                value={
                  highPriorityTasks.length > 0 ? "ATTENTION" : "CLEAR"
                }
                active={highPriorityTasks.length > 0}
              />
              <StatusRow
                label="Pending Items"
                value={`${activeTasks.length}`}
                active={activeTasks.length > 0}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-[#14131a] p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-xs font-semibold text-white">
                  Monobloc Intelligence
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {tasks.length === 0
                  ? "Your workspace is clear and ready for action."
                  : highPriorityTasks.length > 0
                  ? "High-priority tasks detected. Tackle those first for maximum impact."
                  : "Good task velocity today. Focus on steady execution."}
              </p>
            </div>
          </section>
        </div>

        {/* =========================================================
            FINISHED TASKS SECTION
        ========================================================= */}
        <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Completed Tasks
            </h3>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white">
              {completedTasks.length} Done
            </span>
          </div>

          {completedTasks.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">
              No completed tasks yet. Keep pushing forward!
            </p>
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

        {/* Quick Navigation Links */}
        <div className="mt-6 flex flex-wrap gap-2 pt-2">
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
            label="Monobloc Tutor"
          />
        </div>
      </div>

      {/* =========================================================
          CREATE TASK MODAL
      ========================================================= */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#1b1924] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                <Target size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Create New Task
                </h3>
                <p className="text-xs text-slate-400">
                  Add details to track your activity
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Task Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && newTitle.trim() && createTask()
                  }
                  placeholder="e.g., Finish chemistry assignment"
                  className="w-full rounded-2xl border border-white/10 bg-[#14131a] px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add additional notes or subtasks..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#14131a] px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setNewPriority(priority)}
                        className={`rounded-2xl border py-2 text-xs font-medium transition ${
                          newPriority === priority
                            ? priority === "HIGH"
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                              : priority === "MEDIUM"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                              : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                            : "border-white/10 bg-[#14131a] text-slate-400 hover:text-white"
                        }`}
                      >
                        {priority}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#14131a] px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500/50"
                />
              </div>

              <button
                type="button"
                onClick={createTask}
                disabled={!newTitle.trim()}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-30"
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
    <div className="rounded-2xl border border-white/5 bg-[#1b1924] p-4 transition hover:bg-white/5">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300">
          {icon}
        </div>
        <span className="text-[10px] text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-[10px] text-slate-400">{subtext}</p>
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
      ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
      : task.priority === "MEDIUM"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
      : "border-purple-500/20 bg-purple-500/10 text-purple-400";

  return (
    <div
      className={`group flex items-center justify-between rounded-2xl border p-3.5 transition ${
        task.completed
          ? "border-white/5 bg-white/[0.01] opacity-50"
          : "border-white/5 bg-white/[0.02] hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="text-slate-400 transition hover:text-white"
        >
          {task.completed ? (
            <CheckCircle2 size={18} className="text-purple-400" />
          ) : (
            <Circle size={18} />
          )}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                task.completed ? "text-slate-500 line-through" : "text-white"
              }`}
            >
              {task.title}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${priorityStyle}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
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
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={`text-xs font-semibold ${
          active ? "text-purple-400" : "text-slate-500"
        }`}
      >
        {value}
      </span>
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
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {icon}
      {label}
      <ArrowUpRight size={12} />
    </Link>
  );
}