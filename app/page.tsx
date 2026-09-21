"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Inbox,
  MessageSquare,
  MoreHorizontal,
  Play,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react"

import FloatingSidebar from "@/components/floatingsidebar"

type Task = {
  id: number
  title: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  completed: boolean
}

const initialTasks: Task[] = []

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [command, setCommand] = useState("")
  const [focusSeconds, setFocusSeconds] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Load saved data
  useEffect(() => {
    const savedTasks = localStorage.getItem("Monobloc-dashboard-tasks")
    const savedFocus = localStorage.getItem("zora-focus-seconds")

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch {
        setTasks([])
      }
    }

    if (savedFocus) {
      setFocusSeconds(Number(savedFocus))
    }
  }, [])

  // Save tasks
  useEffect(() => {
    localStorage.setItem(
      "Monobloc-dashboard-tasks",
      JSON.stringify(tasks)
    )
  }, [tasks])

  // Save focus time
  useEffect(() => {
    localStorage.setItem(
      "zora-focus-seconds",
      String(focusSeconds)
    )
  }, [focusSeconds])

  // Focus timer
  useEffect(() => {
    if (!isFocusMode) return

    const interval = setInterval(() => {
      setFocusSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isFocusMode])

  const completedTasks = tasks.filter((task) => task.completed).length
  const activeTasks = tasks.filter((task) => !task.completed).length
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "HIGH" && !task.completed
  ).length

  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const addTask = () => {
    const title = window.prompt("Enter a task")

    if (!title?.trim()) return

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      priority: "MEDIUM",
      completed: false,
    }

    setTasks((current) => [...current, newTask])
  }

  const openAI = () => {
    if (!command.trim()) return

    setIsThinking(true)

    window.location.href = `/ai-assistant?prompt=${encodeURIComponent(
      command.trim()
    )}`
  }

  return (
    <>
      {/* Sidebar */}
      <FloatingSidebar />

      {/* Main dashboard */}
      <main className="min-h-screen pl-20 sm:pl-24 bg-[#05030d] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10">

          {/* Header */}
          <header className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-purple-400">
                MONOBLOC OS
              </p>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                The stage is yours.
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Your workspace, intelligence and execution layer.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/inbox"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/[0.08]"
              >
                <Inbox className="h-5 w-5 text-white/70" />
              </Link>

              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/[0.08]">
                <Bell className="h-5 w-5 text-white/70" />
              </button>

              <div className="ml-1 flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 text-xs font-bold">
                  M
                </div>

                <span className="hidden text-sm text-white/70 sm:block">
                  Monobloc
                </span>
              </div>
            </div>
          </header>

          {/* Quick controls */}
          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Workspace */}
            <Link
              href="/tasks"
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:border-purple-400/30 hover:bg-white/[0.055]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>

                <ChevronRight className="h-4 w-4 text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60" />
              </div>

              <p className="text-sm font-medium">Workspace</p>
              <p className="mt-1 text-xs text-white/40">
                Manage your missions and tasks
              </p>
            </Link>

            {/* Focus */}
            <button
              onClick={() => setIsFocusMode((current) => !current)}
              className={`group rounded-2xl border p-5 text-left backdrop-blur-xl transition ${
                isFocusMode
                  ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                  : "border-white/10 bg-white/[0.035] hover:border-cyan-400/20 hover:bg-white/[0.055]"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  {isFocusMode ? (
                    <Clock3 className="h-5 w-5 text-cyan-400" />
                  ) : (
                    <Play className="h-5 w-5 text-cyan-400" />
                  )}
                </div>

                <span
                  className={`text-xs ${
                    isFocusMode
                      ? "text-cyan-400"
                      : "text-white/30"
                  }`}
                >
                  {isFocusMode ? "ACTIVE" : "START"}
                </span>
              </div>

              <p className="text-sm font-medium">Focus Mode</p>

              <p className="mt-1 font-mono text-xs text-white/40">
                {formatTime(focusSeconds)}
              </p>
            </button>

            {/* Analytics */}
            <Link
              href="/goals"
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:border-pink-400/20 hover:bg-white/[0.055]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
                  <TrendingUp className="h-5 w-5 text-pink-400" />
                </div>

                <ChevronRight className="h-4 w-4 text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60" />
              </div>

              <p className="text-sm font-medium">Analytics</p>

              <p className="mt-1 text-xs text-white/40">
                Track goals and performance
              </p>
            </Link>
          </section>

          {/* AI command center */}
          <section className="mb-6 overflow-hidden rounded-3xl border border-purple-400/15 bg-gradient-to-br from-purple-500/[0.08] via-white/[0.025] to-cyan-400/[0.05] p-6 shadow-2xl shadow-purple-950/20">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-400/20">
                <Sparkles className="h-5 w-5 text-purple-300" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Ask Monobloc
                </p>

                <p className="text-xs text-white/40">
                  Tell your AI OS what you want to accomplish.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    openAI()
                  }
                }}
                placeholder="Ask Monobloc anything..."
                className="h-12 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-purple-400/40"
              />

              <button
                onClick={openAI}
                disabled={!command.trim() || isThinking}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap className="h-4 w-4" />

                {isThinking ? "Opening..." : "Ask Zora"}
              </button>
            </div>
          </section>

          {/* Focus + AI Decisions */}
          <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Focus Time */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Focus Time
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Your accumulated focus session
                  </p>
                </div>

                <Clock3 className="h-5 w-5 text-cyan-400" />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-4xl font-semibold tracking-tight">
                    {formatTime(focusSeconds)}
                  </p>

                  <p className="mt-2 text-xs text-white/35">
                    {isFocusMode
                      ? "Focus session running"
                      : "Start Focus Mode to begin"}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setIsFocusMode((current) => !current)
                  }
                  className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  {isFocusMode ? "Pause" : "Start"}
                </button>
              </div>
            </div>

            {/* AI Decisions */}
            <div className="rounded-3xl border border-purple-400/15 bg-purple-500/[0.045] p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    AI Decisions
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Monobloc intelligence layer
                  </p>
                </div>

                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/15 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />

                  <div>
                    <p className="text-sm text-white/75">
                      No new AI decisions yet.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Ask Monobloc to analyze your tasks,
                      schedule or workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tasks */}
          <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Task List
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Your active workspace missions
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/tasks"
                  className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:bg-white/[0.05] hover:text-white sm:block"
                >
                  View all
                </Link>

                <button
                  onClick={addTask}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Task
                </button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-center">
                <CheckCircle2 className="mb-3 h-8 w-8 text-white/15" />

                <p className="text-sm text-white/45">
                  No tasks yet
                </p>

                <p className="mt-1 text-xs text-white/25">
                  Add your first task to start building your workspace.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-black/10 p-4 text-left transition hover:bg-white/[0.04]"
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        task.completed
                          ? "border-cyan-400 bg-cyan-400"
                          : "border-white/20"
                      }`}
                    >
                      {task.completed && (
                        <CheckCircle2 className="h-4 w-4 text-black" />
                      )}
                    </div>

                    <span
                      className={`flex-1 text-sm ${
                        task.completed
                          ? "text-white/25 line-through"
                          : "text-white/70"
                      }`}
                    >
                      {task.title}
                    </span>

                    <span
                      className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                        task.priority === "HIGH"
                          ? "bg-red-400/10 text-red-300"
                          : task.priority === "MEDIUM"
                          ? "bg-yellow-400/10 text-yellow-300"
                          : "bg-green-400/10 text-green-300"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Workspace metrics */}
          <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Active Tasks
                </p>

                <Target className="h-4 w-4 text-purple-400" />
              </div>

              <p className="text-2xl font-semibold">
                {activeTasks}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Completed
                </p>

                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              </div>

              <p className="text-2xl font-semibold">
                {completedTasks}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-white/35">
                  High Priority
                </p>

                <Zap className="h-4 w-4 text-red-400" />
              </div>

              <p className="text-2xl font-semibold">
                {highPriorityTasks}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Completion
                </p>

                <TrendingUp className="h-4 w-4 text-pink-400" />
              </div>

              <p className="text-2xl font-semibold">
                {completionRate}%
              </p>
            </div>
          </section>

          {/* Productivity performance */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Productivity Performance
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Based on your current workspace activity
                </p>
              </div>

              <button className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white/60">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="flex h-48 items-end gap-2">
              {[18, 28, 22, 36, 30, 48, 42, 55, 44, 64, 52, 72, 61, 78].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex flex-1 flex-col justify-end"
                  >
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-purple-500/20 to-cyan-400/50 transition group-hover:from-purple-500/40 group-hover:to-cyan-400/80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex justify-between text-[10px] text-white/20">
              <span>Start</span>
              <span>Current</span>
            </div>
          </section>

          {/* Bottom navigation shortcuts */}
          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <Link
              href="/calendar"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:bg-white/[0.05]"
            >
              <CalendarDays className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-white/50">
                Calendar
              </span>
            </Link>

            <Link
              href="/notes"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:bg-white/[0.05]"
            >
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-white/50">
                Notes
              </span>
            </Link>

            <Link
              href="/documents"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:bg-white/[0.05]"
            >
              <Inbox className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-white/50">
                Documents
              </span>
            </Link>

            <Link
              href="/connect"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:bg-white/[0.05]"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-white/50">
                Connect
              </span>
            </Link>

          </section>

        </div>
      </main>
    </>
  )
}