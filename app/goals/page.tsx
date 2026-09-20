"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Flag,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

type Goal = {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  target: number;
  deadline: string;
};

const STORAGE_KEY = "Monoblocls";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("PERSONAL");
  const [newTarget, setNewTarget] = useState("100");
  const [newDeadline, setNewDeadline] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  /*
   * LOAD GOALS
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setGoals([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setGoals(parsed);
      }
    } catch {
      setGoals([]);
    }
  }, []);

  /*
   * SAVE GOALS
   */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(goals)
    );
  }, [goals]);

  /*
   * SEARCH
   */
  const filteredGoals = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return goals;

    return goals.filter(
      (goal) =>
        goal.title.toLowerCase().includes(query) ||
        goal.description.toLowerCase().includes(query) ||
        goal.category.toLowerCase().includes(query)
    );
  }, [goals, search]);

  /*
   * SELECTED GOAL
   */
  const selectedGoal = goals.find(
    (goal) => goal.id === selectedGoalId
  );

  /*
   * STATISTICS
   */
  const completedGoals = goals.filter(
    (goal) => goal.progress >= goal.target
  ).length;

  const activeGoals = goals.filter(
    (goal) => goal.progress < goal.target
  ).length;

  const highPriorityGoals = goals.filter(
    (goal) => goal.progress < goal.target * 0.25
  ).length;

  const overallProgress =
    goals.length === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => {
            const percentage =
              goal.target > 0
                ? Math.min(
                    (goal.progress / goal.target) * 100,
                    100
                  )
                : 0;

            return sum + percentage;
          }, 0) / goals.length
        );

  /*
   * CREATE GOAL
   */
  const createGoal = () => {
    if (!newTitle.trim()) return;

    const targetNumber = Math.max(
      Number(newTarget) || 100,
      1
    );

    const goal: Goal = {
      id: Date.now(),
      title: newTitle.trim(),
      description:
        newDescription.trim() ||
        "No description added.",
      category: newCategory,
      progress: 0,
      target: targetNumber,
      deadline: newDeadline,
    };

    setGoals((current) => [goal, ...current]);
    setSelectedGoalId(goal.id);

    setNewTitle("");
    setNewDescription("");
    setNewCategory("PERSONAL");
    setNewTarget("100");
    setNewDeadline("");
    setShowCreate(false);
  };

  /*
   * UPDATE PROGRESS
   */
  const updateProgress = (
    id: number,
    amount: number
  ) => {
    setIsSaving(true);

    setGoals((current) =>
      current.map((goal) => {
        if (goal.id !== id) return goal;

        return {
          ...goal,
          progress: Math.max(
            0,
            Math.min(
              goal.progress + amount,
              goal.target
            )
          ),
        };
      })
    );

    window.setTimeout(() => {
      setIsSaving(false);
    }, 250);
  };

  /*
   * DELETE GOAL
   */
  const deleteGoal = (id: number) => {
    setGoals((current) =>
      current.filter((goal) => goal.id !== id)
    );

    if (selectedGoalId === id) {
      setSelectedGoalId(null);
    }
  };

  /*
   * RESET CREATE FORM
   */
  const closeCreate = () => {
    setShowCreate(false);
    setNewTitle("");
    setNewDescription("");
    setNewCategory("PERSONAL");
    setNewTarget("100");
    setNewDeadline("");
  };

  /*
   * KEYBOARD SHORTCUT
   */
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setShowCreate(true);
      }

      if (event.key === "Escape") {
        closeCreate();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      <FloatingSidebar />

      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 pl-20 shadow-2xl sm:pl-24">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <Target size={20} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-400">
                  MonoblocOALS
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Personal achievement system
                </p>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Goals
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Define what matters. Track your progress. Make it happen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* NOTIFICATION */}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* NEW GOAL */}

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
            >
              <Plus size={16} />
              New Goal
            </button>

            {/* USER */}

            <div className="ml-1 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#17151f] text-[11px] font-semibold">
                  Z
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Monobloc User
                </p>

                <p className="text-[10px] text-slate-500">
                  user@Monobloc.app
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <MetricCard
            icon={<Target size={16} />}
            label="Active Goals"
            value={String(activeGoals)}
            subtext="In progress"
          />

          <MetricCard
            icon={<CheckCircle2 size={16} />}
            label="Completed"
            value={String(completedGoals)}
            subtext="Goals achieved"
          />

          <MetricCard
            icon={<Flag size={16} />}
            label="Needs Focus"
            value={String(highPriorityGoals)}
            subtext="Below 25%"
          />

          <MetricCard
            icon={<TrendingUp size={16} />}
            label="Completion"
            value={`${overallProgress}%`}
            subtext="Overall progress"
          />
        </section>

        {/* =====================================================
            PROGRESS HERO
        ===================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#251f33] via-[#1b1924] to-[#181622] p-7">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  <Sparkles size={17} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  YOUR PROGRESS
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                {goals.length === 0
                  ? "Ready when you are."
                  : overallProgress >= 100
                  ? "Everything is complete."
                  : "Keep moving forward."}
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                {goals.length === 0
                  ? "Create your first goal and Monobloc will start tracking your progress."
                  : `${activeGoals} active goal${
                      activeGoals === 1 ? "" : "s"
                    } currently in your workspace.`}
              </p>

              <div className="mt-6 max-w-[520px]">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-400">
                    Overall Completion
                  </span>

                  <span className="font-semibold text-white">
                    {overallProgress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{
                      width: `${overallProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CIRCLE */}

            <div className="flex shrink-0 items-center justify-center lg:pr-8">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/[0.04] shadow-[0_0_35px_rgba(168,85,247,0.12)]">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">
                    {overallProgress}%
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                    completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your goals..."
              className="h-11 w-full rounded-xl border border-white/5 bg-[#1b1924] pl-11 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/40"
            />
          </div>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 bg-[#1b1924] text-slate-500 transition hover:bg-white/5 hover:text-white"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-12">

          {/* =================================================
              ACTIVE GOALS
          ================================================= */}

          <section className="min-h-[620px] rounded-3xl border border-white/5 bg-[#1b1924] xl:col-span-8">

            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <Target
                    size={16}
                    className="text-purple-400"
                  />

                  <h2 className="text-sm font-semibold text-white">
                    Active Goals
                  </h2>

                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-slate-500">
                    {filteredGoals.length}
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-slate-600">
                  Everything you're working toward
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 transition hover:bg-purple-500/20"
                aria-label="Create goal"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="max-h-[560px] overflow-y-auto">

              {filteredGoals.length === 0 ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center px-8 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/5 bg-white/[0.03] text-slate-600">
                    <Target size={28} />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-300">
                    {search
                      ? "No goals found"
                      : "No goals yet"}
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
                    {search
                      ? "Try another search term."
                      : "Create your first goal and start turning plans into progress."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowCreate(true)
                      }
                      className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      <Plus size={14} />
                      Create Goal
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3">
                  {filteredGoals.map((goal) => {
                    const percentage =
                      goal.target > 0
                        ? Math.min(
                            Math.round(
                              (goal.progress /
                                goal.target) *
                                100
                            ),
                            100
                          )
                        : 0;

                    const isSelected =
                      selectedGoalId === goal.id;

                    const isComplete =
                      percentage >= 100;

                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() =>
                          setSelectedGoalId(
                            goal.id
                          )
                        }
                        className={`group relative mb-3 w-full rounded-2xl border p-5 text-left transition ${
                          isSelected
                            ? "border-purple-500/20 bg-purple-500/[0.06]"
                            : "border-white/5 bg-white/[0.015] hover:bg-white/[0.035]"
                        }`}
                      >

                        {isSelected && (
                          <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full bg-purple-500" />
                        )}

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex min-w-0 gap-3">

                            <div
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isComplete
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-purple-500/10 text-purple-400"
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle2
                                  size={17}
                                />
                              ) : (
                                <Target
                                  size={17}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">

                                <p className="truncate text-sm font-semibold text-white">
                                  {goal.title}
                                </p>

                                <span className="rounded-full bg-white/5 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                                  {goal.category}
                                </span>

                              </div>

                              <p className="mt-1.5 line-clamp-2 text-[10px] leading-5 text-slate-600">
                                {goal.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">

                            <div className="text-right">
                              <p
                                className={`text-sm font-bold ${
                                  isComplete
                                    ? "text-green-400"
                                    : "text-purple-400"
                                }`}
                              >
                                {percentage}%
                              </p>

                              <p className="text-[9px] text-slate-700">
                                {goal.progress}/
                                {goal.target}
                              </p>
                            </div>

                            <ChevronRight
                              size={15}
                              className="text-slate-700 transition group-hover:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* PROGRESS */}

                        <div className="mt-5">

                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-wider text-slate-600">
                              Progress
                            </span>

                            <span className="text-[9px] text-slate-600">
                              {goal.deadline
                                ? `Due ${goal.deadline}`
                                : "No deadline"}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isComplete
                                  ? "bg-green-500"
                                  : "bg-gradient-to-r from-purple-500 to-pink-500"
                              }`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              Monobloc ASSISTANT / SELECTED GOAL
          ================================================= */}

          <aside className="space-y-6 xl:col-span-4">

            {/* SELECTED GOAL */}

            <section className="rounded-3xl border border-white/5 bg-[#1b1924]">

              <div className="border-b border-white/5 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Target size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Goal Focus
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      Selected objective
                    </p>
                  </div>
                </div>
              </div>

              {selectedGoal ? (
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {selectedGoal.title}
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-slate-600">
                        {selectedGoal.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteGoal(
                          selectedGoal.id
                        )
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-red-400/10 hover:text-red-400"
                      aria-label="Delete goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="mt-6">

                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">
                          {selectedGoal.target >
                          0
                            ? Math.min(
                                Math.round(
                                  (selectedGoal.progress /
                                    selectedGoal.target) *
                                    100
                                ),
                                100
                              )
                            : 0}
                          %
                        </p>

                        <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">
                          completion
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-semibold text-purple-400">
                          {selectedGoal.progress}
                          /
                          {selectedGoal.target}
                        </p>

                        <p className="mt-1 text-[9px] text-slate-700">
                          current / target
                        </p>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (selectedGoal.progress /
                              selectedGoal.target) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        updateProgress(
                          selectedGoal.id,
                          1
                        )
                      }
                      className="rounded-xl border border-white/5 bg-white/[0.03] py-3 text-center transition hover:bg-purple-500/10"
                    >
                      <p className="text-sm font-bold text-purple-400">
                        +1
                      </p>

                      <p className="mt-1 text-[8px] text-slate-600">
                        progress
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateProgress(
                          selectedGoal.id,
                          5
                        )
                      }
                      className="rounded-xl border border-white/5 bg-white/[0.03] py-3 text-center transition hover:bg-purple-500/10"
                    >
                      <p className="text-sm font-bold text-purple-400">
                        +5
                      </p>

                      <p className="mt-1 text-[8px] text-slate-600">
                        progress
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateProgress(
                          selectedGoal.id,
                          10
                        )
                      }
                      className="rounded-xl border border-white/5 bg-white/[0.03] py-3 text-center transition hover:bg-purple-500/10"
                    >
                      <p className="text-sm font-bold text-purple-400">
                        +10
                      </p>

                      <p className="mt-1 text-[8px] text-slate-600">
                        progress
                      </p>
                    </button>
                  </div>

                  {selectedGoal.deadline && (
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                      <span className="text-[10px] text-slate-600">
                        Deadline
                      </span>

                      <span className="text-[10px] font-medium text-slate-300">
                        {selectedGoal.deadline}
                      </span>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] text-slate-700">
                    <Circle size={23} />
                  </div>

                  <p className="mt-4 text-xs font-medium text-slate-500">
                    No goal selected
                  </p>

                  <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-slate-700">
                    Select a goal to view its progress and update it.
                  </p>

                </div>
              )}
            </section>

            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

            <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-5">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Zap size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Monobloc Assistant
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    Goal intelligence
                  </p>
                </div>
              </div>

              <div className="space-y-2">

                <StatusRow
                  label="Goal System"
                  value="ONLINE"
                  active
                />

                <StatusRow
                  label="Progress Tracking"
                  value="ACTIVE"
                  active
                />

                <StatusRow
                  label="Active Goals"
                  value={String(activeGoals)}
                />

                <StatusRow
                  label="Completion"
                  value={`${overallProgress}%`}
                />

              </div>

              <Link
                href="/ai-assistant"
                className="mt-5 flex items-center justify-between rounded-xl border border-purple-500/10 bg-purple-500/[0.04] px-4 py-3 text-[10px] font-semibold text-purple-400 transition hover:bg-purple-500/[0.08]"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={13} />
                  Ask Monobloc
                </span>

                <ArrowRight size={13} />
              </Link>
            </section>

          </aside>
        </div>

        {/* =====================================================
            BOTTOM SYSTEM BAR
        ===================================================== */}

        <section className="mt-6 rounded-3xl border border-white/5 bg-[#1b1924] p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <TrendingUp size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Goal System
                </p>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Your objectives are being tracked locally.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <SystemBadge
                label="Goals"
                value={String(goals.length)}
              />

              <SystemBadge
                label="Active"
                value={String(activeGoals)}
              />

              <SystemBadge
                label="Completed"
                value={String(completedGoals)}
              />

              <SystemBadge
                label="Status"
                value="ONLINE"
              />

            </div>
          </div>
        </section>

        {/* =====================================================
            CREATE GOAL MODAL
        ===================================================== */}

        {showCreate && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closeCreate();
              }
            }}
          >
            <div className="w-full max-w-[480px] rounded-3xl border border-white/10 bg-[#17151f] p-6 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <Target size={15} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-400">
                      New Goal
                    </p>
                  </div>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Define your objective
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Monobloc will track your progress.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCreate}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-slate-600 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

              <div className="space-y-4">

                {/* TITLE */}

                <div>
                  <label className="mb-2 block text-[10px] font-medium text-slate-500">
                    Goal name
                  </label>

                  <input
                    value={newTitle}
                    onChange={(event) =>
                      setNewTitle(
                        event.target.value
                      )
                    }
                    placeholder="What do you want to achieve?"
                    autoFocus
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-purple-500/40"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-2 block text-[10px] font-medium text-slate-500">
                    Description
                  </label>

                  <textarea
                    value={newDescription}
                    onChange={(event) =>
                      setNewDescription(
                        event.target.value
                      )
                    }
                    placeholder="What does success look like?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-purple-500/40"
                  />
                </div>

                {/* CATEGORY */}

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="mb-2 block text-[10px] font-medium text-slate-500">
                      Category
                    </label>

                    <select
                      value={newCategory}
                      onChange={(event) =>
                        setNewCategory(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-[#1b1924] px-3 text-xs text-white outline-none focus:border-purple-500/40"
                    >
                      <option value="PERSONAL">
                        Personal
                      </option>

                      <option value="CAREER">
                        Career
                      </option>

                      <option value="STUDY">
                        Study
                      </option>

                      <option value="HEALTH">
                        Health
                      </option>

                      <option value="BUSINESS">
                        Business
                      </option>

                      <option value="FINANCE">
                        Finance
                      </option>
                    </select>
                  </div>

                  {/* TARGET */}

                  <div>
                    <label className="mb-2 block text-[10px] font-medium text-slate-500">
                      Target
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={newTarget}
                      onChange={(event) =>
                        setNewTarget(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs text-white outline-none focus:border-purple-500/40"
                    />
                  </div>

                </div>

                {/* DEADLINE */}

                <div>
                  <label className="mb-2 block text-[10px] font-medium text-slate-500">
                    Deadline
                  </label>

                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(event) =>
                      setNewDeadline(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs text-white outline-none focus:border-purple-500/40"
                  />
                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeCreate}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-xs font-semibold text-slate-500 transition hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={createGoal}
                    disabled={!newTitle.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={15} />
                    Create Goal
                  </button>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* SAVING INDICATOR */}

        {isSaving && (
          <div className="fixed bottom-6 right-6 z-[250] flex items-center gap-2 rounded-full border border-white/10 bg-[#17151f] px-4 py-2.5 text-[10px] font-medium text-slate-400 shadow-2xl">
            <Loader2
              size={13}
              className="animate-spin text-purple-400"
            />
            Saving progress
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
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

        <span className="text-[10px] text-slate-500">
          {label}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-400">
        {subtext}
      </p>

    </div>
  );
}

/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">

      <span className="text-[10px] text-slate-500">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 text-[10px] font-medium ${
          active
            ? "text-purple-400"
            : "text-slate-500"
        }`}
      >
        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
        )}

        {value}
      </span>

    </div>
  );
}

/* =========================================================
   SYSTEM BADGE
========================================================= */

function SystemBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2">

      <p className="text-[8px] uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-0.5 font-mono text-[10px] font-semibold text-purple-400">
        {value}
      </p>

    </div>
  );
}