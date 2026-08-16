"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  Filter,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";

type Category =
  | "Study"
  | "Work"
  | "Personal"
  | "Startup"
  | "Health";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  category: Category;
  completed: boolean;
  favorite: boolean;
  due: string;
  duration: number;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [taskInput, setTaskInput] = useState("");
  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState<
    "All" | "Today" | "Upcoming" | "Completed"
  >("All");

  const [priority, setPriority] =
    useState<Priority>("Medium");

  const [category, setCategory] =
    useState<Category>("Personal");

  const [showCategoryMenu, setShowCategoryMenu] =
    useState(false);

  const [showFilters, setShowFilters] =
    useState(false);

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const remaining = tasks.length - completed;

  const productivityScore =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "Completed") {
        return task.completed;
      }

      if (activeFilter === "Today") {
        return task.due
          .toLowerCase()
          .includes("today");
      }

      if (activeFilter === "Upcoming") {
        return (
          !task.completed &&
          !task.due
            .toLowerCase()
            .includes("today")
        );
      }

      return true;
    });
  }, [tasks, search, activeFilter]);

  const addTask = () => {
    if (!taskInput.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: taskInput.trim(),
      priority,
      category,
      completed: false,
      favorite: false,
      due: "Today · 9:00 PM",
      duration: 30,
    };

    setTasks((current) => [
      newTask,
      ...current,
    ]);

    setTaskInput("");
  };

  const quickAdd = (
    title: string,
    selectedCategory: Category
  ) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      priority: "Medium",
      category: selectedCategory,
      completed: false,
      favorite: false,
      due: "Today · 9:00 PM",
      duration: 30,
    };

    setTasks((current) => [
      newTask,
      ...current,
    ]);
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

  const toggleFavorite = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              favorite: !task.favorite,
            }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((current) =>
      current.filter(
        (task) => task.id !== id
      )
    );
  };

  const clearCompleted = () => {
    setTasks((current) =>
      current.filter(
        (task) => !task.completed
      )
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050A13] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute right-[-150px] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-400">
              <Sparkles size={15} />
              Good afternoon, Early Bird
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your Tasks
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Turn plans into progress. Stay focused,
              prioritize what matters, and make today count.
            </p>

          </div>

          {/* STREAK */}

          <div className="flex items-center gap-4 rounded-3xl border border-orange-400/10 bg-orange-400/[0.04] px-5 py-4 backdrop-blur-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10">
              <Flame
                className="text-orange-400"
                size={24}
              />
            </div>

            <div>

              <p className="text-2xl font-bold">
                0 days
              </p>

              <p className="text-xs text-gray-500">
                Current productivity streak
              </p>

            </div>

          </div>

        </header>

        {/* STATS */}

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <Stat
            icon={<ListTodo size={18} />}
            label="Total tasks"
            value={tasks.length}
            iconClass="text-blue-400"
          />

          <Stat
            icon={<Clock3 size={18} />}
            label="Remaining"
            value={remaining}
            iconClass="text-yellow-400"
          />

          <Stat
            icon={<CheckCircle2 size={18} />}
            label="Completed"
            value={completed}
            iconClass="text-emerald-400"
          />

          <Stat
            icon={<Target size={18} />}
            label="Productivity"
            value={`${productivityScore}%`}
            iconClass="text-purple-400"
          />

        </section>

        {/* AI CARD */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-blue-400/10 bg-gradient-to-r from-blue-500/[0.10] via-cyan-400/[0.04] to-transparent p-5 backdrop-blur-xl sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                <Sparkles
                  className="text-blue-400"
                  size={22}
                />
              </div>

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <h2 className="font-semibold">
                    Zora's suggestion
                  </h2>

                  <span className="rounded-md bg-blue-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                    AI
                  </span>

                </div>

                <p className="max-w-2xl text-sm leading-6 text-gray-400">

                  {tasks.length === 0 ? (
                    <>
                      Your task list is empty. Add something
                      you need to accomplish and Zora will help
                      you stay on track.
                    </>
                  ) : (
                    <>
                      You have{" "}
                      <span className="font-semibold text-white">
                        {
                          tasks.filter(
                            (t) =>
                              t.priority === "High" &&
                              !t.completed
                          ).length
                        }{" "}
                        high-priority tasks
                      </span>
                      . Consider finishing the most urgent
                      one before starting something new.
                    </>
                  )}

                </p>

              </div>

            </div>

            <button className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20">

              <Zap size={16} />

              Optimize tasks

            </button>

          </div>

        </section>

        {/* ADD TASK */}

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-2xl sm:p-5">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Plus
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                value={taskInput}
                onChange={(e) =>
                  setTaskInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
                placeholder="What needs to get done?"
                className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/40 focus:bg-white/[0.04]"
              />

            </div>

            {/* CATEGORY */}

            <div className="relative">

              <button
                onClick={() =>
                  setShowCategoryMenu(
                    !showCategoryMenu
                  )
                }
                className="flex h-14 w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-gray-400 transition hover:bg-white/[0.08] hover:text-white lg:w-40"
              >

                {category}

                <ChevronDown size={15} />

              </button>

              {showCategoryMenu && (
                <div className="absolute left-0 top-[62px] z-50 w-full rounded-2xl border border-white/10 bg-[#0B1422] p-2 shadow-2xl lg:w-40">

                  {(
                    [
                      "Study",
                      "Work",
                      "Personal",
                      "Startup",
                      "Health",
                    ] as Category[]
                  ).map((item) => (

                    <button
                      key={item}
                      onClick={() => {
                        setCategory(item);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-xs transition ${
                        category === item
                          ? "bg-blue-500/15 text-blue-300"
                          : "text-gray-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>

                  ))}

                </div>
              )}

            </div>

            {/* PRIORITY */}

            <div className="flex h-14 rounded-2xl border border-white/10 bg-white/[0.04] p-1">

              {(
                [
                  "High",
                  "Medium",
                  "Low",
                ] as Priority[]
              ).map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    setPriority(item)
                  }
                  className={`rounded-xl px-3 text-[11px] font-medium transition ${
                    priority === item
                      ? item === "High"
                        ? "bg-red-400/10 text-red-400"
                        : item === "Medium"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-emerald-400/10 text-emerald-400"
                      : "text-gray-600 hover:text-gray-300"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

            <button
              onClick={addTask}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-7 font-semibold shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
            >

              <Plus size={18} />

              Add task

            </button>

          </div>

        </section>

        {/* TOOLBAR */}

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-2">

            {(
              [
                "All",
                "Today",
                "Upcoming",
                "Completed",
              ] as const
            ).map((filter) => (

              <button
                key={filter}
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                  activeFilter === filter
                    ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20"
                    : "bg-white/[0.035] text-gray-500 hover:bg-white/[0.07] hover:text-gray-300"
                }`}
              >
                {filter}
              </button>

            ))}

          </div>

          <div className="flex gap-2">

            <div className="relative flex-1 lg:w-56">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search tasks..."
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600 focus:border-blue-500/30"
              />

            </div>

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs text-gray-500 transition hover:text-white"
            >

              <Filter size={14} />

              Filters

            </button>

          </div>

        </div>

        {/* FILTER PANEL */}

        {showFilters && (

          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">

            <div className="flex flex-wrap gap-2">

              <span className="mr-2 py-2 text-xs text-gray-500">
                Priority:
              </span>

              {(
                [
                  "High",
                  "Medium",
                  "Low",
                ] as Priority[]
              ).map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    setPriority(item)
                  }
                  className={`rounded-lg px-3 py-2 text-xs ${
                    priority === item
                      ? "bg-blue-500/15 text-blue-300"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

        )}

        {/* TASK HEADER */}

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              {activeFilter === "All"
                ? "My tasks"
                : activeFilter}
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              {filteredTasks.length} tasks shown
            </p>

          </div>

          {completed > 0 && (

            <button
              onClick={clearCompleted}
              className="flex items-center gap-2 text-xs text-gray-600 transition hover:text-red-400"
            >

              <Trash2 size={14} />

              Clear completed

            </button>

          )}

        </div>

        {/* TASK LIST */}

        <section className="space-y-3">

          {filteredTasks.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">

                <CheckCircle2
                  size={30}
                  className="text-blue-400"
                />

              </div>

              <h3 className="text-lg font-semibold">
                No tasks yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
                Your workspace is clear. Add your first
                task above and start getting things done.
              </p>

              <button
                onClick={() =>
                  document
                    .querySelector("input")
                    ?.focus()
                }
                className="mt-6 rounded-xl bg-blue-500/10 px-4 py-2.5 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20"
              >
                <span className="flex items-center gap-2">
                  <Plus size={14} />
                  Create your first task
                </span>
              </button>

            </div>

          ) : (

            filteredTasks.map((task) => (

              <TaskCard
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                toggleFavorite={toggleFavorite}
                deleteTask={deleteTask}
              />

            ))

          )}

        </section>

        {/* BOTTOM GRID */}

        <div className="mt-8 grid gap-4 lg:grid-cols-2">

          {/* WEEKLY PRODUCTIVITY */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <BarChart3
                    size={17}
                    className="text-blue-400"
                  />

                  <h3 className="font-semibold">
                    This week
                  </h3>

                </div>

                <p className="mt-1 text-xs text-gray-600">
                  Your productivity activity
                </p>

              </div>

              <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                +18%
              </span>

            </div>

            <div className="flex h-36 items-end justify-between gap-2">

              {[42, 65, 48, 82, 68, 91, 76].map(
                (value, index) => (

                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >

                    <div
                      className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-blue-600/60 to-cyan-400/80 transition-all hover:from-blue-500 hover:to-cyan-300"
                      style={{
                        height: `${value}%`,
                      }}
                    />

                    <span className="text-[10px] text-gray-600">
                      {
                        [
                          "M",
                          "T",
                          "W",
                          "T",
                          "F",
                          "S",
                          "S",
                        ][index]
                      }
                    </span>

                  </div>

                )
              )}

            </div>

          </section>

          {/* ACHIEVEMENT */}

          <section className="relative overflow-hidden rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.035] p-5 backdrop-blur-xl">

            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative">

              <div className="mb-5 flex items-center gap-2">

                <Trophy
                  size={18}
                  className="text-yellow-400"
                />

                <h3 className="font-semibold">
                  Daily achievement
                </h3>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10">

                  <Target
                    size={28}
                    className="text-yellow-400"
                  />

                </div>

                <div className="flex-1">

                  <h4 className="font-semibold">
                    Task Slayer
                  </h4>

                  <p className="mt-1 text-xs text-gray-600">
                    Complete 5 tasks today
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (completed / 5) * 100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                <span className="text-sm font-semibold text-yellow-400">
                  {Math.min(completed, 5)}/5
                </span>

              </div>

            </div>

          </section>

        </div>

        {/* QUICK ADD */}

        <section className="mt-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5">

          <div className="mb-4 flex items-center gap-2">

            <Zap
              size={17}
              className="text-cyan-400"
            />

            <h3 className="font-semibold">
              Quick add
            </h3>

          </div>

          <div className="flex flex-wrap gap-2">

            <QuickButton
              label=" Study for 30 min"
              onClick={() =>
                quickAdd(
                  "Study for 30 minutes",
                  "Study"
                )
              }
            />

            <QuickButton
              label=" Work on Zora"
              onClick={() =>
                quickAdd(
                  "Work on Zora",
                  "Startup"
                )
              }
            />

            <QuickButton
              label=" Finish coding"
              onClick={() =>
                quickAdd(
                  "Finish coding",
                  "Work"
                )
              }
            />

            <QuickButton
              label=" Take a break"
              onClick={() =>
                quickAdd(
                  "Take a break",
                  "Health"
                )
              }
            />

            <QuickButton
              label=" Plan tomorrow"
              onClick={() =>
                quickAdd(
                  "Plan tomorrow",
                  "Personal"
                )
              }
            />

          </div>

        </section>

        {/* FOOTER */}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-6 text-xs text-gray-700 sm:flex-row">

          <div className="flex items-center gap-2">

            <Sparkles size={13} />

            Zora is keeping you on track.

          </div>

          <div className="flex items-center gap-2">

            <CalendarDays size={13} />

            Today · Stay productive

          </div>

        </div>

      </div>

    </main>
  );
}

/* ================================= */
/* STAT CARD */
/* ================================= */

function Stat({
  icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition hover:bg-white/[0.055]">

      <div className={`mb-3 ${iconClass}`}>
        {icon}
      </div>

      <p className="text-2xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-600">
        {label}
      </p>

    </div>
  );
}

/* ================================= */
/* TASK CARD */
/* ================================= */

function TaskCard({
  task,
  toggleTask,
  toggleFavorite,
  deleteTask,
}: {
  task: Task;
  toggleTask: (id: number) => void;
  toggleFavorite: (id: number) => void;
  deleteTask: (id: number) => void;
}) {
  const priorityStyles = {
    High:
      "bg-red-400/10 text-red-400 border-red-400/10",

    Medium:
      "bg-yellow-400/10 text-yellow-400 border-yellow-400/10",

    Low:
      "bg-emerald-400/10 text-emerald-400 border-emerald-400/10",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        task.completed
          ? "border-white/[0.05] bg-white/[0.02] opacity-65"
          : "border-white/10 bg-white/[0.035] hover:-translate-y-[2px] hover:border-blue-400/20 hover:bg-white/[0.055]"
      }`}
    >

      {/* PRIORITY LINE */}

      <div
        className={`absolute bottom-0 left-0 top-0 w-[2px] ${
          task.priority === "High"
            ? "bg-red-400"
            : task.priority === "Medium"
            ? "bg-yellow-400"
            : "bg-emerald-400"
        }`}
      />

      <div className="flex items-center gap-4">

        {/* COMPLETE */}

        <button
          onClick={() =>
            toggleTask(task.id)
          }
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
            task.completed
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
              : "border-white/10 bg-white/5 text-gray-600 hover:border-blue-400/40 hover:bg-blue-400/5 hover:text-blue-400"
          }`}
        >

          {task.completed ? (
            <Check size={18} />
          ) : (
            <span className="h-3 w-3 rounded-full border border-current" />
          )}

        </button>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <p
              className={`text-sm font-semibold ${
                task.completed
                  ? "text-gray-600 line-through"
                  : "text-gray-200"
              }`}
            >
              {task.title}
            </p>

            <span
              className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>

          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-600">

            <span>
              {task.category}
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-700" />

            <span className="flex items-center gap-1">

              <Clock3 size={11} />

              {task.duration} min

            </span>

            <span className="h-1 w-1 rounded-full bg-gray-700" />

            <span>
              {task.due}
            </span>

          </div>

        </div>

        {/* FAVORITE */}

        <button
          onClick={() =>
            toggleFavorite(task.id)
          }
          className={`hidden rounded-xl p-2 transition sm:block ${
            task.favorite
              ? "text-yellow-400"
              : "text-gray-700 hover:text-gray-400"
          }`}
        >

          <Star
            size={17}
            fill={
              task.favorite
                ? "currentColor"
                : "none"
            }
          />

        </button>

        {/* DELETE */}

        <button
          onClick={() =>
            deleteTask(task.id)
          }
          className="rounded-xl p-2 text-gray-700 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
        >

          <Trash2 size={17} />

        </button>

      </div>

    </div>
  );
}

/* ================================= */
/* QUICK ADD BUTTON */
/* ================================= */

function QuickButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs text-gray-500 transition hover:border-blue-400/20 hover:bg-blue-400/[0.06] hover:text-blue-300"
    >
      {label}
    </button>
  );
}