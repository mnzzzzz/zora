"use client";

import FloatingSidebar from "@/components/floatingsidebar";

import {
  Target,
  Plus,
  Trash2,
  Check,
  X,
  Zap,
  Brain,
  Activity,
  ChevronRight,
  Clock3,
  Trophy,
  CircleDot,
  Crosshair,
  Cpu,
  Radio,
  Sparkles,
  Gauge,
  ArrowUpRight,
  ScanLine,
  ShieldCheck,
  Command,
  RotateCcw,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

const priorityStyles = {
  Low: {
    badge: "border-white/10 bg-white/[0.04] text-slate-400",
    dot: "bg-slate-500",
  },
  Medium: {
    badge: "border-blue-400/20 bg-blue-400/[0.07] text-blue-300",
    dot: "bg-blue-400",
  },
  High: {
    badge: "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300",
    dot: "bg-cyan-300",
  },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] =
    useState<Goal["priority"]>("Medium");

  const [showCreator, setShowCreator] = useState(false);
  const [saved, setSaved] = useState(false);

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    const stored = localStorage.getItem("zora-goals");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setGoals(parsed);
      }
    } catch {
      setGoals([]);
    }
  }, []);

  /* =========================================================
     SAVE
  ========================================================= */

  useEffect(() => {
    localStorage.setItem("zora-goals", JSON.stringify(goals));
  }, [goals]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const total = goals.length;

    const completed = goals.filter(
      (goal) => goal.completed
    ).length;

    const active = goals.filter(
      (goal) => !goal.completed
    ).length;

    const average =
      total === 0
        ? 0
        : Math.round(
            goals.reduce(
              (sum, goal) => sum + goal.progress,
              0
            ) / total
          );

    const highPriority = goals.filter(
      (goal) =>
        goal.priority === "High" && !goal.completed
    ).length;

    return {
      total,
      completed,
      active,
      average,
      highPriority,
    };
  }, [goals]);

  const selectedGoal = goals.find(
    (goal) => goal.id === selectedId
  );

  /* =========================================================
     CREATE
  ========================================================= */

  const createGoal = () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();

    const goal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      progress: 0,
      deadline,
      priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setGoals((current) => [goal, ...current]);
    setSelectedId(goal.id);

    setTitle("");
    setDescription("");
    setDeadline("");
    setPriority("Medium");
    setShowCreator(false);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteGoal = (id: string) => {
    setGoals((current) =>
      current.filter((goal) => goal.id !== id)
    );

    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  /* =========================================================
     COMPLETE
  ========================================================= */

  const toggleComplete = (id: string) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed: !goal.completed,
              progress: !goal.completed
                ? 100
                : Math.min(goal.progress, 99),
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );
  };

  /* =========================================================
     PROGRESS
  ========================================================= */

  const updateProgress = (
    id: string,
    value: number
  ) => {
    const progress = Math.max(
      0,
      Math.min(100, value)
    );

    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress,
              completed: progress === 100,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );

    setSaved(false);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const saveSelected = () => {
    if (!selectedGoal) return;

    setGoals((current) =>
      current.map((goal) =>
        goal.id === selectedGoal.id
          ? {
              ...goal,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1500);
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date: string) => {
    if (!date) return "No deadline";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      <FloatingSidebar />

      <main className="relative min-h-screen overflow-hidden bg-[#020812] pl-[92px] text-white md:pl-[108px]">

        {/* =====================================================
            JARVIS BACKGROUND
        ===================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          {/* Ambient glow */}

          <div className="absolute left-[5%] top-[8%] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.07] blur-[150px]" />

          <div className="absolute right-[2%] top-[18%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[170px]" />

          <div className="absolute bottom-[-150px] left-[35%] h-[450px] w-[450px] rounded-full bg-violet-600/[0.05] blur-[170px]" />

          {/* HUD grid */}

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(100,220,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,.5) 1px, transparent 1px)",
              backgroundSize: "55px 55px",
            }}
          />

          {/* Scan lines */}

          <div className="absolute left-0 right-0 top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          <div className="absolute left-0 right-0 top-[72%] h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

          {/* Vertical HUD line */}

          <div className="absolute bottom-0 left-[7%] top-0 w-px bg-gradient-to-b from-transparent via-cyan-400/[0.08] to-transparent" />

          {/* Corner markers */}

          <div className="absolute left-8 top-8 h-8 w-8 border-l border-t border-cyan-400/20" />

          <div className="absolute right-8 top-8 h-8 w-8 border-r border-t border-cyan-400/20" />

          <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-cyan-400/20" />

          <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-cyan-400/20" />

        </div>

        <div className="relative z-10 mx-auto max-w-[1550px] px-5 py-6 md:px-8 md:py-8">

          {/* =====================================================
              TOP SYSTEM BAR
          ===================================================== */}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/[0.08] pb-3">

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />

                </span>

                <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-cyan-300">
                  ZORA ONLINE
                </span>

              </div>

              <span className="text-slate-800">
                /
              </span>

              <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600">
                OBJECTIVE SYSTEM
              </span>

            </div>

            <div className="flex items-center gap-4 font-mono text-[9px] tracking-[0.15em] text-slate-700">

              <span className="flex items-center gap-1.5">
                <Radio size={11} />
                LIVE
              </span>

              <span>
                CORE 01
              </span>

              <span>
                SECURE
              </span>

            </div>

          </div>

          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="relative mb-6 overflow-hidden rounded-[30px] border border-cyan-400/[0.12] bg-[#07121f]/80 shadow-[0_0_80px_rgba(0,200,255,0.035)] backdrop-blur-2xl">

            {/* Header HUD lines */}

            <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-cyan-400/40 to-transparent" />

            <div className="absolute bottom-0 left-0 h-px w-1/4 bg-gradient-to-r from-cyan-400/30 to-transparent" />

            <div className="absolute right-8 top-8 opacity-30">
              <ScanLine
                size={100}
                strokeWidth={0.6}
                className="text-cyan-400"
              />
            </div>

            <div className="relative flex flex-col gap-7 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07]">

                    <Crosshair
                      size={22}
                      className="text-cyan-300"
                    />

                    <div className="absolute inset-0 animate-pulse rounded-2xl border border-cyan-400/10" />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
                        ZORA INTELLIGENCE
                      </p>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-2 py-0.5 text-[8px] font-semibold text-emerald-400">
                        ACTIVE
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-slate-600">
                      Goal tracking & progress system
                    </p>

                  </div>

                </div>

                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Your Goals
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Set something you want to achieve,
                  then let Zora keep track of your progress.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreator((value) => !value)
                }
                className="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.13)] transition hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(34,211,238,.22)]"
              >

                {showCreator ? (
                  <>
                    <X size={17} />
                    Close
                  </>
                ) : (
                  <>
                    <Plus
                      size={17}
                      className="transition group-hover:rotate-90"
                    />
                    Create goal
                  </>
                )}

              </button>

            </div>

            {/* Status strip */}

            <div className="flex flex-wrap items-center gap-5 border-t border-white/[0.06] px-6 py-3 md:px-8">

              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={13}
                  className="text-cyan-400"
                />

                <span className="font-mono text-[9px] tracking-[0.15em] text-slate-600">
                  SYSTEM READY
                </span>

              </div>

              <div className="hidden h-3 w-px bg-white/10 sm:block" />

              <div className="font-mono text-[9px] tracking-[0.15em] text-slate-600">
                {stats.active} ACTIVE
              </div>

              <div className="font-mono text-[9px] tracking-[0.15em] text-slate-600">
                {stats.completed} COMPLETED
              </div>

              {stats.highPriority > 0 && (
                <>
                  <div className="hidden h-3 w-px bg-white/10 sm:block" />

                  <div className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.15em] text-cyan-300">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />

                    {stats.highPriority} HIGH PRIORITY

                  </div>
                </>
              )}

              <div className="ml-auto hidden items-center gap-2 font-mono text-[9px] text-slate-700 sm:flex">

                <Cpu size={11} />

                CORE STATUS: NOMINAL

              </div>

            </div>

          </header>

          {/* =====================================================
              CREATE GOAL
          ===================================================== */}

          {showCreator && (
            <section className="relative mb-6 overflow-hidden rounded-[30px] border border-cyan-400/[0.13] bg-[#07121f]/90 p-6 shadow-[0_0_60px_rgba(0,200,255,0.04)] backdrop-blur-2xl md:p-7">

              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/[0.05] blur-3xl" />

              <div className="relative mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07]">

                  <Command
                    size={18}
                    className="text-cyan-300"
                  />

                </div>

                <div>

                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                    NEW GOAL
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell Zora what you want to accomplish.
                  </p>

                </div>

              </div>

              <div className="relative grid gap-5 lg:grid-cols-2">

                <div className="lg:col-span-2">

                  <label className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Goal
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="e.g. Finish my physics project"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                  />

                </div>

                <div className="lg:col-span-2">

                  <label className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Details
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Add some context or describe what success looks like..."
                    className="min-h-[100px] w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Deadline
                  </label>

                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) =>
                      setDeadline(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value as Goal["priority"]
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#081421] px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>

                </div>

              </div>

              <div className="relative mt-5 flex justify-end">

                <button
                  type="button"
                  onClick={createGoal}
                  disabled={!title.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30"
                >

                  <Target size={16} />

                  Add goal

                </button>

              </div>

            </section>
          )}

          {/* =====================================================
              TELEMETRY
          ===================================================== */}

          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <TelemetryCard
              icon={<Target size={17} />}
              label="TOTAL GOALS"
              value={stats.total}
              detail="Tracked"
            />

            <TelemetryCard
              icon={<Activity size={17} />}
              label="IN PROGRESS"
              value={stats.active}
              detail="Active"
            />

            <TelemetryCard
              icon={<Trophy size={17} />}
              label="COMPLETED"
              value={stats.completed}
              detail="Achieved"
            />

            <TelemetryCard
              icon={<Gauge size={17} />}
              label="OVERALL PROGRESS"
              value={`${stats.average}%`}
              detail="Average"
            />

          </section>

          {/* =====================================================
              MAIN GRID
          ===================================================== */}

          <div className="grid gap-6 xl:grid-cols-[1fr_390px]">

            {/* ===================================================
                GOAL BOARD
            =================================================== */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#07121f]/80 p-5 backdrop-blur-2xl md:p-6">

              <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-cyan-400/30 to-transparent" />

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <CircleDot
                      size={14}
                      className="text-cyan-400"
                    />

                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-400">
                      GOAL MATRIX
                    </p>

                  </div>

                  <h2 className="mt-2 text-xl font-bold">
                    Your goals
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Select a goal to view and update it.
                  </p>

                </div>

                <div className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 sm:flex">

                  <Radio
                    size={12}
                    className="text-cyan-400"
                  />

                  <span className="font-mono text-[8px] tracking-[0.15em] text-slate-600">
                    LIVE TRACKING
                  </span>

                </div>

              </div>

              {goals.length === 0 ? (

                <EmptyGoals
                  onCreate={() => setShowCreator(true)}
                />

              ) : (

                <div className="grid gap-3 md:grid-cols-2">

                  {goals.map((goal) => (

                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      selected={selectedId === goal.id}
                      onClick={() =>
                        setSelectedId(goal.id)
                      }
                      formatDate={formatDate}
                    />

                  ))}

                </div>

              )}

            </section>

            {/* ===================================================
                CONTROL PANEL
            =================================================== */}

            <aside className="relative overflow-hidden rounded-[30px] border border-cyan-400/[0.1] bg-[#07121f]/85 backdrop-blur-2xl">

              {!selectedGoal ? (

                <IdleControlPanel />

              ) : (

                <ControlPanel
                  goal={selectedGoal}
                  saved={saved}
                  formatDate={formatDate}
                  onClose={() => setSelectedId(null)}
                  onProgress={(value) =>
                    updateProgress(
                      selectedGoal.id,
                      value
                    )
                  }
                  onComplete={() =>
                    toggleComplete(selectedGoal.id)
                  }
                  onSave={saveSelected}
                  onDelete={() =>
                    deleteGoal(selectedGoal.id)
                  }
                />

              )}

            </aside>

          </div>

          {/* =====================================================
              BOTTOM SYSTEM MESSAGE
          ===================================================== */}

          <div className="mt-5 flex items-center gap-3 border-t border-white/[0.05] pt-4">

            <Sparkles
              size={13}
              className="text-cyan-400"
            />

            <p className="text-[10px] text-slate-600">

              {goals.length === 0
                ? "Zora is ready. Create your first goal to begin."
                : stats.average >= 75
                  ? "You're making strong progress. Keep the momentum going."
                  : stats.highPriority > 0
                    ? "You have high-priority goals that may need attention."
                    : "Zora is tracking your progress in real time."}

            </p>

            <div className="ml-auto hidden font-mono text-[8px] tracking-[0.15em] text-slate-800 sm:block">
              ZORA CORE / NOMINAL
            </div>

          </div>

        </div>
      </main>
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
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07121f]/75 p-4 backdrop-blur-xl transition hover:border-cyan-400/[0.15]">

      <div className="absolute right-0 top-0 h-px w-1/2 bg-gradient-to-l from-cyan-400/20 to-transparent" />

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
          {icon}
        </div>

        <ArrowUpRight
          size={13}
          className="text-slate-800 transition group-hover:text-cyan-400"
        />

      </div>

      <div className="mt-4 flex items-end justify-between">

        <div>

          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-600">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {value}
          </p>

        </div>

        <span className="pb-1 text-[9px] text-slate-700">
          {detail}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   GOAL CARD
========================================================= */

function GoalCard({
  goal,
  selected,
  onClick,
  formatDate,
}: {
  goal: Goal;
  selected: boolean;
  onClick: () => void;
  formatDate: (date: string) => string;
}) {
  const styles = priorityStyles[goal.priority];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-300 ${
        selected
          ? "border-cyan-400/25 bg-cyan-400/[0.055] shadow-[0_0_35px_rgba(34,211,238,0.05)]"
          : "border-white/[0.07] bg-black/10 hover:-translate-y-0.5 hover:border-cyan-400/[0.16] hover:bg-white/[0.025]"
      }`}
    >

      {/* Selected scanner */}

      {selected && (
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      )}

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-start gap-3">

          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06]">

            {goal.completed ? (
              <Check
                size={17}
                className="text-emerald-300"
              />
            ) : (
              <Target
                size={17}
                className="text-cyan-300"
              />
            )}

            {!goal.completed && (
              <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_7px_rgba(103,232,249,0.9)]" />
            )}

          </div>

          <div className="min-w-0">

            <h3
              className={`truncate font-semibold ${
                goal.completed
                  ? "text-slate-500"
                  : "text-white"
              }`}
            >
              {goal.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
              {goal.description ||
                "No additional details added."}
            </p>

          </div>

        </div>

        <ChevronRight
          size={15}
          className={`shrink-0 transition ${
            selected
              ? "translate-x-0.5 text-cyan-400"
              : "text-slate-800 group-hover:translate-x-0.5 group-hover:text-cyan-400"
          }`}
        />

      </div>

      {/* Progress */}

      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between">

          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-700">
            Progress
          </span>

          <span className="font-mono text-[10px] font-semibold text-cyan-300">
            {goal.progress}%
          </span>

        </div>

        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
            style={{
              width: `${goal.progress}%`,
            }}
          />

          {goal.progress > 0 && (
            <div
              className="absolute top-0 h-full w-8 bg-white/30 blur-sm"
              style={{
                left: `calc(${goal.progress}% - 16px)`,
              }}
            />
          )}

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-4 flex items-center justify-between">

        <span
          className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] ${styles.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
          />

          {goal.priority}
        </span>

        <span className="flex items-center gap-1.5 text-[9px] text-slate-700">

          <Clock3 size={11} />

          {formatDate(goal.deadline)}

        </span>

      </div>

    </button>
  );
}

/* =========================================================
   EMPTY GOALS
========================================================= */

function EmptyGoals({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="relative flex min-h-[430px] flex-col items-center justify-center overflow-hidden text-center">

      {/* Radar */}

      <div className="absolute h-64 w-64 rounded-full border border-cyan-400/[0.04]">

        <div className="absolute inset-7 rounded-full border border-cyan-400/[0.05]" />

        <div className="absolute inset-14 rounded-full border border-cyan-400/[0.06]" />

        <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-gradient-to-t from-cyan-400/20 to-transparent" />

      </div>

      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] shadow-[0_0_50px_rgba(34,211,238,0.06)]">

        <Crosshair
          size={31}
          className="text-cyan-400/60"
        />

      </div>

      <p className="relative mt-7 text-sm font-semibold text-slate-400">
        No goals yet
      </p>

      <p className="relative mt-2 max-w-sm text-xs leading-6 text-slate-600">
        Create your first goal and Zora will keep
        track of your progress here.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="relative mt-6 flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.09]"
      >

        <Plus size={15} />

        Create your first goal

      </button>

    </div>
  );
}

/* =========================================================
   IDLE CONTROL PANEL
========================================================= */

function IdleControlPanel() {
  return (
    <div className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden px-6 text-center">

      {/* Radar rings */}

      <div className="absolute h-72 w-72 rounded-full border border-cyan-400/[0.04]">

        <div className="absolute inset-8 rounded-full border border-cyan-400/[0.05]" />

        <div className="absolute inset-16 rounded-full border border-cyan-400/[0.06]" />

      </div>

      <div className="relative flex h-24 w-24 items-center justify-center">

        <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-cyan-400/10 border-t-cyan-400/40" />

        <div className="absolute inset-4 rounded-full border border-blue-400/10 border-b-blue-400/30" />

        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/[0.06]">

          <Crosshair
            size={23}
            className="text-cyan-400/70"
          />

        </div>

      </div>

      <p className="relative mt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
        CONTROL CENTER
      </p>

      <p className="relative mt-3 text-sm font-semibold text-slate-400">
        Select a goal
      </p>

      <p className="relative mt-2 max-w-[260px] text-xs leading-6 text-slate-600">
        Choose an objective from the list to see
        its progress and available actions.
      </p>

      <div className="relative mt-7 flex items-center gap-2 font-mono text-[8px] tracking-[0.2em] text-slate-800">

        <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />

        AWAITING INPUT

      </div>

    </div>
  );
}

/* =========================================================
   CONTROL PANEL
========================================================= */

function ControlPanel({
  goal,
  saved,
  formatDate,
  onClose,
  onProgress,
  onComplete,
  onSave,
  onDelete,
}: {
  goal: Goal;
  saved: boolean;
  formatDate: (date: string) => string;
  onClose: () => void;
  onProgress: (value: number) => void;
  onComplete: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const styles = priorityStyles[goal.priority];

  return (
    <div>

      {/* Header */}

      <div className="relative border-b border-white/[0.07] p-5">

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-cyan-400/30 via-cyan-400/10 to-transparent" />

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,.8)]" />

              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                GOAL CONTROL
              </p>

            </div>

            <p className="mt-2 font-mono text-[8px] tracking-[0.15em] text-slate-700">
              ID / {goal.id.slice(0, 8).toUpperCase()}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-slate-700 transition hover:border-white/10 hover:text-white"
          >
            <X size={15} />
          </button>

        </div>

      </div>

      <div className="p-6">

        {/* Goal title */}

        <div>

          <div className="flex items-center gap-2">

            <span
              className={`rounded-lg border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] ${styles.badge}`}
            >
              {goal.priority}
            </span>

            {goal.completed && (
              <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.05] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                Complete
              </span>
            )}

          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight">
            {goal.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {goal.description ||
              "No additional details added."}
          </p>

        </div>

        {/* Progress core */}

        <div className="mt-8 flex items-center gap-6">

          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">

            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#22d3ee ${goal.progress * 3.6}deg, rgba(255,255,255,0.04) 0deg)`,
              }}
            />

            <div className="absolute inset-[3px] rounded-full bg-[#07121f]" />

            <div className="relative text-center">

              <p className="font-mono text-2xl font-bold text-cyan-300">
                {goal.progress}%
              </p>

              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-slate-700">
                Progress
              </p>

            </div>

          </div>

          <div className="min-w-0">

            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
              STATUS
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-300">
              {goal.completed
                ? "Goal completed"
                : goal.progress === 0
                  ? "Ready to start"
                  : "In progress"}
            </p>

            <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-600">

              <Clock3 size={11} />

              {formatDate(goal.deadline)}

            </div>

          </div>

        </div>

        {/* Slider */}

        <div className="mt-8">

          <div className="mb-3 flex items-center justify-between">

            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-700">
              Update progress
            </span>

            <span className="font-mono text-[9px] text-cyan-400">
              {goal.progress}/100
            </span>

          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={goal.progress}
            onChange={(e) =>
              onProgress(Number(e.target.value))
            }
            className="w-full accent-cyan-400"
          />

          <div className="mt-2 flex justify-between font-mono text-[8px] text-slate-800">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>

        </div>

        {/* AI insight */}

        <div className="mt-7 rounded-2xl border border-cyan-400/[0.1] bg-cyan-400/[0.025] p-4">

          <div className="flex items-center gap-2">

            <Brain
              size={14}
              className="text-cyan-400"
            />

            <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              ZORA INSIGHT
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">

            {goal.completed
              ? "Nice work. This goal is complete."
              : goal.progress >= 75
                ? "You're almost there. Keep the momentum going."
                : goal.progress >= 40
                  ? "Good progress. Keep moving toward the finish line."
                  : goal.progress > 0
                    ? "You've started. A little progress every day adds up."
                    : "This goal hasn't started yet. Pick one small action to begin."}

          </p>

        </div>

        {/* Actions */}

        <div className="mt-6 grid gap-2.5">

          <button
            type="button"
            onClick={onComplete}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.08)] transition hover:-translate-y-0.5"
          >

            {goal.completed ? (
              <>
                <RotateCcw size={15} />
                Reopen goal
              </>
            ) : (
              <>
                <Check size={15} />
                Mark as complete
              </>
            )}

          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-semibold text-slate-300 transition hover:border-cyan-400/15 hover:bg-cyan-400/[0.04]"
          >

            {saved ? (
              <>
                <Check
                  size={15}
                  className="text-emerald-400"
                />

                Saved

              </>
            ) : (
              <>
                <Zap size={15} />

                Save changes

              </>
            )}

          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-400/[0.08] bg-red-400/[0.025] text-xs font-semibold text-red-400/80 transition hover:border-red-400/20 hover:bg-red-400/[0.06]"
          >

            <Trash2 size={14} />

            Delete goal

          </button>

        </div>

      </div>

    </div>
  );
}