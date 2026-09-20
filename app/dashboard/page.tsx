"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  Inbox,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Dashboard() {
  const [command, setCommand] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const [focusSeconds, setFocusSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLoaded, setTimerLoaded] = useState(false);

  const [timeframe, setTimeframe] = useState("6M");

  /* =========================================================
     LOAD SAVED DATA
  ========================================================= */

  useEffect(() => {
    const savedTasks = localStorage.getItem("Monoblocrd-tasks");
    const savedFocus = localStorage.getItem("Monobloc-focus-seconds");

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch {
        // Ignore invalid localStorage data
      }
    }

    if (savedFocus) {
      const parsedFocus = Number(savedFocus);
      if (Number.isFinite(parsedFocus) && parsedFocus >= 0) {
        setFocusSeconds(parsedFocus);
      }
    }

    setTimerLoaded(true);
  }, []);

  /* =========================================================
     SAVE TASKS
  ========================================================= */

  useEffect(() => {
    if (!timerLoaded) return;
    localStorage.setItem("Monobloc-dashboard-tasks", JSON.stringify(tasks));
  }, [tasks, timerLoaded]);

  /* =========================================================
     SAVE FOCUS TIME
  ========================================================= */

  useEffect(() => {
    if (!timerLoaded) return;
    localStorage.setItem("Monobloc-focus-seconds", focusSeconds.toString());
  }, [focusSeconds, timerLoaded]);

  /* =========================================================
     FOCUS TIMER
  ========================================================= */

  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setFocusSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerRunning]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatFocusTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${remainingSeconds}s`;
  };

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ]);

    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasks = tasks.filter((task) => task.completed).length;

  const productivity =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const openAI = () => {
    const prompt = command.trim();
    if (!prompt || isThinking) return;

    setIsThinking(true);
    window.location.href = `/ai?prompt=${encodeURIComponent(prompt)}`;
  };

  return (
    <div className="min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      {/* Container Wrapper without Sidebar */}
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 shadow-2xl">
        {/* =========================================================
            HEADER SECTION
        ========================================================= */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              The stage is yours.
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Everything you need, connected in one place.
            </p>
          </div>

          {/* Notifications & Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/inbox"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <Inbox size={18} />
            </Link>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <Bell size={18} />
            </button>

            <div className="ml-2 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-800" />
              </div>
              <div className="text-left text-xs">
                <p className="font-medium text-white">Monobloc User</p>
                <p className="text-[10px] text-slate-400">
                  user@Monobloc.app
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================
            ACTION BUTTONS & AI INPUT BAR
        ========================================================= */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition hover:bg-slate-200">
              Workspace
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10">
              Focus Mode
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10">
              Analytics
            </button>
          </div>

          {/* AI Prompt Input Bar */}
          <div className="relative w-full max-w-sm">
            <Sparkles
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
            />
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && openAI()}
              placeholder="Ask Monobloc anything..."
              className="w-full rounded-full border border-white/10 bg-[#1c1a26] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        {/* =========================================================
            GRID ROW 1: STATS, AI CTA, QUICK TASKS, WORKSPACE
        ========================================================= */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Total Focus & AI Decisions Card */}
          <div className="space-y-6 xl:col-span-4">
            {/* Focus Time Card */}
            <div className="rounded-3xl border border-white/5 bg-[#1b1924] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Focus Time
                </span>
                <button
                  onClick={() => setTimerRunning((prev) => !prev)}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 hover:bg-white/10"
                >
                  {timerRunning ? "Pause" : "Start"} <ChevronDown size={12} />
                </button>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                {formatFocusTime(focusSeconds)}
              </p>
            </div>

            {/* AI Decisions Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-[#251f33] to-[#181622] p-6 text-center">
              <h3 className="text-sm font-semibold text-white">
                Decisions Powered by Data
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                Move beyond guesswork with AI-driven productivity insights
                tailored to your workflow.
              </p>
              <button
                onClick={openAI}
                className="mt-5 w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-xs font-medium text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
              >
                Explore AI Insights
              </button>
            </div>
          </div>

          {/* Quick Task List */}
          <div className="rounded-3xl border border-white/5 bg-[#1b1924] p-6 xl:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Task List</h3>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white">
                {completedTasks}/{tasks.length} Done
              </span>
            </div>

            <div className="mb-3 flex gap-2">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a new task..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="max-h-[220px] space-y-2.5 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-500">
                  No active tasks. Add one above!
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={16}
                        className={
                          task.completed ? "text-purple-400" : "text-slate-600"
                        }
                      />
                      <span
                        className={`text-xs ${
                          task.completed
                            ? "text-slate-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Workspace Overview */}
          <div className="rounded-3xl border border-white/5 bg-[#1b1924] p-6 xl:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Workspace</h3>
              <Link
                href="/tasks"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                See all <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Completed"
                value={completedTasks.toString()}
                subtext="Tasks total"
              />
              <MetricCard
                title="Productivity"
                value={`${productivity}%`}
                subtext="Completion rate"
              />
              <MetricCard
                title="Focus Time"
                value={formatFocusTime(focusSeconds)}
                subtext="Total session"
              />
              <MetricCard
                title="Active Goals"
                value="4"
                subtext="In progress"
              />
            </div>
          </div>
        </div>

        {/* =========================================================
            GRID ROW 2: PERFORMANCE / PRODUCTIVITY CHART
        ========================================================= */}
        <div className="rounded-3xl border border-white/5 bg-[#1b1924] p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-sm font-semibold text-white">
              Productivity Performance
            </h3>

            <div className="flex rounded-full border border-white/5 bg-[#14131a] p-1">
              {["1D", "1W", "1M", "6M", "1Y"].map((item) => (
                <button
                  key={item}
                  onClick={() => setTimeframe(item)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    timeframe === item
                      ? "bg-white/10 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Productivity Graph */}
          <div className="relative h-52 w-full">
            <div className="absolute left-[46%] top-4 z-10 -translate-x-1/2 rounded-xl border border-white/10 bg-[#252233] p-2.5 text-center shadow-xl">
              <p className="text-[10px] text-slate-400">1st Jun 2026</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-bold text-white">88% Peak</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400">
                  +35%
                </span>
              </div>
            </div>

            <svg
              className="h-full w-full"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,50 Q 100,140 200,90 T 400,100 T 500,130 T 600,70 T 800,110 T 1000,90 L 1000,200 L 0,200 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 0,50 Q 100,140 200,90 T 400,100 T 500,130 T 600,70 T 800,110 T 1000,90"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
              />
              <circle
                cx="500"
                cy="130"
                r="5"
                fill="#f472b6"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <line
                x1="500"
                y1="130"
                x2="500"
                y2="200"
                stroke="#f472b6"
                strokeDasharray="3 3"
                opacity="0.6"
              />
            </svg>

            <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-[10px] text-slate-600">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between px-6 text-[11px] text-slate-500">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
              (m) => (
                <span key={m}>{m}</span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function MetricCard({
  title,
  value,
  subtext,
}: {
  title: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition hover:bg-white/5">
      <p className="text-[11px] font-medium text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
      <p className="mt-1 text-[10px] text-slate-500">{subtext}</p>
    </div>
  );
}