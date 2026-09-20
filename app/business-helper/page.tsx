"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  BriefcaseBusiness,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Check,
  X,
  TrendingUp,
  Users,
  Target,
  Wallet,
  MessageSquareText,
  FileText,
  Megaphone,
  Lightbulb,
  Brain,
  Send,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ShieldCheck,
} from "lucide-react";

type Priority = "HIGH" | "MEDIUM" | "LOW";

type ActionItem = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
};

export default function BusinessHelperPage() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  const [actions, setActions] = useState<ActionItem[]>([]);

  const [showActionModal, setShowActionModal] = useState(false);
  const [newAction, setNewAction] = useState("");
  const [newPriority, setNewPriority] =
    useState<Priority>("MEDIUM");

  const [revenue, setRevenue] = useState("");
  const [customers, setCustomers] = useState("");

  const [editingSnapshot, setEditingSnapshot] =
    useState(false);

  function toggleAction(id: number) {
    setActions((current) =>
      current.map((action) =>
        action.id === id
          ? {
              ...action,
              completed: !action.completed,
            }
          : action
      )
    );
  }

  function addAction() {
    if (!newAction.trim()) return;

    setActions((current) => [
      ...current,
      {
        id: Date.now(),
        title: newAction.trim(),
        description: "Founder priority",
        priority: newPriority,
        completed: false,
      },
    ]);

    setNewAction("");
    setNewPriority("MEDIUM");
    setShowActionModal(false);
  }

  function askMonobloc
    if (!question.trim()) return;

    setSubmittedQuestion(question.trim());
    setQuestion("");
  }

  const completedActions = actions.filter(
    (action) => action.completed
  ).length;

  const activeActions = actions.length - completedActions;

  function askMonobloc() {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <FloatingSidebar />

      <main className="relative min-h-screen overflow-hidden bg-[#070707] pl-[90px] text-white">
        {/* =====================================================
            BACKGROUND
        ===================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-[8%] h-72 w-72 rounded-full bg-purple-500/[0.045] blur-[130px]" />

          <div className="absolute bottom-[10%] right-[5%] h-96 w-96 rounded-full bg-violet-500/[0.035] blur-[150px]" />

          <div className="absolute left-[45%] top-[45%] h-72 w-72 rounded-full bg-purple-500/[0.02] blur-[140px]" />
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="relative z-10 px-5 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="mb-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/[0.09] shadow-[0_0_30px_rgba(168,85,247,0.08)]">
                      <BriefcaseBusiness
                        size={22}
                        className="text-purple-300"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-400">
                        MonoblocINESS
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        FOUNDER WORKSPACE
                      </p>
                    </div>
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Business Helper
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    One workspace for the decisions, priorities,
                    numbers, and work that keep your business moving.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#101010] px-4 py-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

                  <span className="text-xs font-medium text-slate-500">
                    Monoblocelligence Online
                  </span>
                </div>
              </div>
            </header>

            {/* =================================================
                SNAPSHOT
            ================================================= */}

            <section className="mb-6 rounded-[28px] border border-white/10 bg-[#101010]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-7">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-400">
                      Business Snapshot
                    </p>

                    <span className="rounded-full border border-purple-400/10 bg-purple-400/[0.05] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-purple-300">
                      Private
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold">
                    Your numbers. Your call.
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Add your own business data. Nothing is pre-filled.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditingSnapshot(
                      (current) => !current
                    )
                  }
                  className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-purple-400/20 hover:bg-purple-400/[0.04] hover:text-white"
                >
                  {editingSnapshot ? (
                    <>
                      <Check size={15} />
                      Done
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      Add numbers
                    </>
                  )}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <BusinessMetric
                  icon={<CircleDollarSign size={18} />}
                  label="Revenue"
                  value={revenue ? `₹${revenue}` : "—"}
                  editing={editingSnapshot}
                  inputValue={revenue}
                  placeholder="Enter revenue"
                  onChange={setRevenue}
                />

                <BusinessMetric
                  icon={<Users size={18} />}
                  label="Customers"
                  value={customers || "—"}
                  editing={editingSnapshot}
                  inputValue={customers}
                  placeholder="Enter customers"
                  onChange={setCustomers}
                />

                <BusinessMetric
                  icon={<TrendingUp size={18} />}
                  label="Growth"
                  value="—"
                />

                <BusinessMetric
                  icon={<Target size={18} />}
                  label="Target"
                  value="—"
                />
              </div>
            </section>

            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div className="grid gap-6 lg:grid-cols-12">

              {/* ===============================================
                  PRIORITIES
              =============================================== */}

              <section className="rounded-[28px] border border-white/10 bg-[#101010]/95 p-6 backdrop-blur-xl lg:col-span-7">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-400">
                      Execution
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Founder priorities
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Decide what actually needs your attention.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowActionModal(true)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/[0.06] text-purple-300 transition hover:bg-purple-400/[0.1]"
                    aria-label="Add priority"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {actions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
                      <Target
                        size={20}
                        className="text-slate-600"
                      />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      No priorities yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
                      Add the next thing your business needs
                      to accomplish.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowActionModal(true)
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-400"
                    >
                      <Plus size={15} />
                      Add priority
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {actions.map((action) => (
                      <ActionRow
                        key={action.id}
                        action={action}
                        onToggle={() =>
                          toggleAction(action.id)
                        }
                      />
                    ))}
                  </div>
                )}

                {actions.length > 0 && (
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-xs text-slate-600">
                      {activeActions} active ·{" "}
                      {completedActions} completed
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setShowActionModal(true)
                      }
                      className="text-xs font-semibold text-purple-400 transition hover:text-purple-300"
                    >
                      Add another →
                    </button>
                  </div>
                )}
              </section>

              {/* ===============================================
                  AI BUSINESS ADVISOR
              =============================================== */}

              <section className="relative overflow-hidden rounded-[28px] border border-purple-400/10 bg-[#101010]/95 p-6 backdrop-blur-xl lg:col-span-5">
                <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-purple-500/[0.045] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/[0.07]">
                      <Brain
                        size={21}
                        className="text-purple-300"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                        Monoblocelligence
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Business Advisor
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-500">
                    Ask Monobloc to help you think through a
                    business decision, strategy, customer issue,
                    or next move.
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Lightbulb size={14} />
                      Try asking
                    </div>

                    <div className="mt-3 space-y-2">
                      <Suggestion
                        text="How should I prioritize my next week?"
                        onClick={() =>
                          setQuestion(
                            "How should I prioritize my next week?"
                          )
                        }
                      />

                      <Suggestion
                        text="How can I get my first 100 customers?"
                        onClick={() =>
                          setQuestion(
                            "How can I get my first 100 customers?"
                          )
                        }
                      />

                      <Suggestion
                        text="Help me validate my pricing."
                        onClick={() =>
                          setQuestion(
                            "Help me validate my pricing."
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        value={question}
                        onChange={(e) =>
                          setQuestion(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            askMonobloc();
                          }
                        }}
                        placeholder="Ask Monobloc..."
                        className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-11 text-sm font-medium text-white outline-none transition placeholder:text-slate-700 focus:border-purple-400/40 focus:bg-purple-400/[0.02]"
                      />

                      <button
                        type="button"
                        onClick={askMonobloc}
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-purple-500 text-white transition hover:bg-purple-400"
                        aria-label="Ask Monobloc"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>

                  {submittedQuestion && (
                    <div className="mt-4 rounded-xl border border-purple-400/10 bg-purple-400/[0.04] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-400">
                        Request received
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {submittedQuestion}
                      </p>

                      <p className="mt-3 text-xs text-slate-600">
                        Connect your Business Helper AI
                        workflow to generate the response.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* ===============================================
                  BUSINESS MODULES
              =============================================== */}

              <section className="lg:col-span-12">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-400">
                    Business Modules
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Run your business from one place.
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <BusinessModule
                    icon={<Users size={20} />}
                    title="Customers"
                    description="Keep track of customers, relationships, and follow-ups."
                    href="/connect"
                  />

                  <BusinessModule
                    icon={<Wallet size={20} />}
                    title="Finance"
                    description="Review your business finances and understand your numbers."
                    href="/finance"
                  />

                  <BusinessModule
                    icon={<Megaphone size={20} />}
                    title="Marketing"
                    description="Plan campaigns, content, and your next growth experiment."
                  />

                  <BusinessModule
                    icon={<FileText size={20} />}
                    title="Documents"
                    description="Keep important business documents and files within reach."
                    href="/documents"
                  />
                </div>
              </section>

              {/* ===============================================
                  DECISION CENTER
              =============================================== */}

              <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101010]/95 p-7 lg:col-span-8">
                <div className="absolute right-[-80px] bottom-[-100px] h-64 w-64 rounded-full bg-purple-500/[0.035] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/[0.06]">
                      <Sparkles
                        size={21}
                        className="text-purple-400"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                        Decision Center
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Think before you move.
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <DecisionCard
                      icon={<Target size={18} />}
                      title="What next?"
                      description="Identify the highest-impact move."
                    />

                    <DecisionCard
                      icon={<TrendingUp size={18} />}
                      title="Where to grow?"
                      description="Find opportunities worth testing."
                    />

                    <DecisionCard
                      icon={<ShieldCheck size={18} />}
                      title="Risk check"
                      description="Pressure-test a business decision."
                    />
                  </div>
                </div>
              </section>

              {/* ===============================================
                  ACTIVITY
              =============================================== */}

              <section className="rounded-[28px] border border-white/10 bg-[#101010]/95 p-6 lg:col-span-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
                    <Clock3
                      size={18}
                      className="text-slate-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                      Workspace
                    </p>

                    <h2 className="font-semibold">
                      Business activity
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <ActivityRow
                    icon={<Target size={15} />}
                    title="Priorities"
                    value={`${actions.length}`}
                  />

                  <ActivityRow
                    icon={<Check size={15} />}
                    title="Completed"
                    value={`${completedActions}`}
                  />

                  <ActivityRow
                    icon={<MessageSquareText size={15} />}
                    title="AI requests"
                    value={submittedQuestion ? "1" : "0"}
                  />
                </div>
              </section>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-5 text-[10px] uppercase tracking-[0.2em] text-slate-700 sm:flex-row">
              <span>Monobloc BUSINESS HELPER</span>

              <span>
                {actions.length === 0
                  ? "Ready for your first priority"
                  : `${activeActions} active priorities`}
              </span>

              <Link
                href="/"
                className="transition hover:text-purple-400"
              >
                Return to command center →
              </Link>
            </footer>
          </div>
        </div>

        {/* =====================================================
            ADD PRIORITY MODAL
        ===================================================== */}

        {showActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">
            <div className="w-full max-w-md rounded-[26px] border border-white/10 bg-[#101010] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                    Execution
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Add priority
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    What needs to get done?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowActionModal(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-500 transition hover:text-white"
                  aria-label="Close"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Priority
                </label>

                <input
                  autoFocus
                  value={newAction}
                  onChange={(e) =>
                    setNewAction(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addAction();
                    }
                  }}
                  placeholder="e.g. Contact potential customer"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm font-medium text-white outline-none placeholder:text-slate-700 focus:border-purple-400/40"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Importance
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(["HIGH", "MEDIUM", "LOW"] as Priority[]).map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() =>
                          setNewPriority(priority)
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                          newPriority === priority
                            ? "border-purple-400/30 bg-purple-400/[0.08] text-purple-300"
                            : "border-white/10 bg-white/[0.02] text-slate-600 hover:text-slate-300"
                        }`}
                      >
                        {priority}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={addAction}
                disabled={!newAction.trim()}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-500 text-sm font-bold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={17} />
                Add priority
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}



function BusinessMetric({
  icon,
  label,
  value,
  editing = false,
  inputValue = "",
  placeholder,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  editing?: boolean;
  inputValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/[0.05] text-purple-400">
          {icon}
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
          {label}
        </span>
      </div>

      {editing && onChange ? (
        <input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3 text-sm font-semibold text-white outline-none placeholder:text-slate-700 focus:border-purple-400/30"
        />
      ) : (
        <p className="mt-5 text-2xl font-bold tracking-tight">
          {value}
        </p>
      )}
    </div>
  );
}


function ActionRow({
  action,
  onToggle,
}: {
  action: ActionItem;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-left transition hover:border-purple-400/15 hover:bg-white/[0.025]"
    >
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
          action.completed
            ? "border-purple-400 bg-purple-500 text-white"
            : "border-white/15 bg-transparent text-transparent group-hover:border-purple-400/40"
        }`}
      >
        <Check size={13} strokeWidth={3} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              action.completed
                ? "text-slate-600 line-through"
                : "text-white"
            }`}
          >
            {action.title}
          </p>

          <PriorityBadge priority={action.priority} />
        </div>

        <p className="mt-1 text-xs text-slate-700">
          {action.description}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="shrink-0 text-slate-700 transition group-hover:translate-x-1 group-hover:text-purple-400"
      />
    </button>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Priority;
}) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[8px] font-bold tracking-wider ${
        priority === "HIGH"
          ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
          : priority === "MEDIUM"
            ? "border-amber-400/15 bg-amber-400/[0.05] text-amber-300"
            : "border-white/10 bg-white/[0.03] text-slate-500"
      }`}
    >
      {priority}
    </span>
  );
}


function Suggestion({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-xs text-slate-500 transition hover:border-purple-400/15 hover:bg-purple-400/[0.03] hover:text-slate-300"
    >
      <span>{text}</span>

      <ArrowUpRight
        size={13}
        className="ml-3 shrink-0 text-slate-700"
      />
    </button>
  );
}

/* =========================================================
   BUSINESS MODULE
========================================================= */

function BusinessModule({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/[0.06] text-purple-400">
          {icon}
        </div>

        <ArrowUpRight
          size={17}
          className="text-slate-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-400"
        />
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-700 transition group-hover:text-purple-400">
        Open module
        <ChevronRight size={12} />
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101010]/95 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-[#131313]"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101010]/95 p-5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-[#131313]"
    >
      {content}
    </button>
  );
}

/* =========================================================
   DECISION CARD
========================================================= */

function DecisionCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-left transition hover:border-purple-400/15 hover:bg-purple-400/[0.025]"
    >
      <div className="flex items-center justify-between">
        <div className="text-purple-400">
          {icon}
        </div>

        <ArrowRight
          size={14}
          className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-purple-400"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        {description}
      </p>
    </button>
  );
}


function ActivityRow({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-slate-600">
          {icon}
        </span>

        <span className="text-xs text-slate-500">
          {title}
        </span>
      </div>

      <span className="text-xs font-semibold text-slate-300">
        {value}
      </span>
    </div>
  );
}