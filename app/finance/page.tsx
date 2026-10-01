"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpCircle,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  DollarSign,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

type Goal = {
  id: number;
  name: string;
  target: number;
  saved: number;
};

const TRANSACTIONS_KEY = "Monobloc-transactions";
const GOALS_KEY = "Monoblocance-goals";
const BUDGET_KEY = "Monobloc-finance-budget";

export default function FinancePage() {
  /* =====================================================
     STATE
  ===================================================== */

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [goals, setGoals] = useState<Goal[]>([]);

  const [budget, setBudget] = useState(0);

  const [showTransactionModal, setShowTransactionModal] =
    useState(false);

  const [showGoalModal, setShowGoalModal] =
    useState(false);

  const [selectedGoalId, setSelectedGoalId] =
    useState<number | null>(null);

  /* Transaction form */

  const [transactionTitle, setTransactionTitle] =
    useState("");

  const [transactionAmount, setTransactionAmount] =
    useState("");

  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");

  const [transactionCategory, setTransactionCategory] =
    useState("");

  /* Goal form */

  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalSaved, setGoalSaved] = useState("");

  /* Budget */

  const [budgetInput, setBudgetInput] = useState("");

  /* =====================================================
     LOAD LOCAL DATA
  ===================================================== */

  useEffect(() => {
    try {
      const savedTransactions =
        localStorage.getItem(TRANSACTIONS_KEY);

      const savedGoals =
        localStorage.getItem(GOALS_KEY);

      const savedBudget =
        localStorage.getItem(BUDGET_KEY);

      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);

        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }

      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);

        if (Array.isArray(parsed)) {
          setGoals(parsed);
        }
      }

      if (savedBudget) {
        const parsedBudget = Number(savedBudget);

        if (parsedBudget > 0) {
          setBudget(parsedBudget);
        }
      }
    } catch {
      setTransactions([]);
      setGoals([]);
      setBudget(0);
    }
  }, []);

  /* =====================================================
     SAVE LOCAL DATA
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      TRANSACTIONS_KEY,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      GOALS_KEY,
      JSON.stringify(goals)
    );
  }, [goals]);

  useEffect(() => {
    if (budget > 0) {
      localStorage.setItem(
        BUDGET_KEY,
        String(budget)
      );
    } else {
      localStorage.removeItem(BUDGET_KEY);
    }
  }, [budget]);

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const totalIncome = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );
  }, [transactions]);

  const balance =
    totalIncome - totalExpenses;

  const budgetUsed =
    budget > 0
      ? Math.min(
          (totalExpenses / budget) * 100,
          100
        )
      : 0;

  const remainingBudget =
    budget > 0
      ? Math.max(
          budget - totalExpenses,
          0
        )
      : 0;

  const completedGoals = goals.filter(
    (goal) => goal.saved >= goal.target
  ).length;

  const selectedGoal = goals.find(
    (goal) => goal.id === selectedGoalId
  );

  /* =====================================================
     FORMAT MONEY
  ===================================================== */

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* =====================================================
     ADD TRANSACTION
  ===================================================== */

  const addTransaction = () => {
    const amount = Number(
      transactionAmount
    );

    if (!transactionTitle.trim()) return;
    if (!amount || amount <= 0) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      title: transactionTitle.trim(),
      amount,
      type: transactionType,
      category:
        transactionCategory.trim() ||
        "General",
      date: new Date().toISOString(),
    };

    setTransactions((current) => [
      ...current,
      newTransaction,
    ]);

    setTransactionTitle("");
    setTransactionAmount("");
    setTransactionCategory("");
    setTransactionType("expense");
    setShowTransactionModal(false);
  };

  /* =====================================================
     DELETE TRANSACTION
  ===================================================== */

  const deleteTransaction = (
    id: number
  ) => {
    setTransactions((current) =>
      current.filter(
        (transaction) =>
          transaction.id !== id
      )
    );
  };

  /* =====================================================
     ADD SAVINGS GOAL
  ===================================================== */

  const addGoal = () => {
    const target = Number(goalTarget);
    const saved = Number(goalSaved) || 0;

    if (!goalName.trim()) return;
    if (!target || target <= 0) return;

    const newGoal: Goal = {
      id: Date.now(),
      name: goalName.trim(),
      target,
      saved: Math.min(
        Math.max(saved, 0),
        target
      ),
    };

    setGoals((current) => [
      ...current,
      newGoal,
    ]);

    setGoalName("");
    setGoalTarget("");
    setGoalSaved("");
    setShowGoalModal(false);
    setSelectedGoalId(newGoal.id);
  };

  /* =====================================================
     DELETE GOAL
  ===================================================== */

  const deleteGoal = (id: number) => {
    setGoals((current) =>
      current.filter(
        (goal) => goal.id !== id
      )
    );

    if (selectedGoalId === id) {
      setSelectedGoalId(null);
    }
  };

  /* =====================================================
     UPDATE GOAL
  ===================================================== */

  const updateGoal = (
    id: number,
    amount: number
  ) => {
    if (!amount || amount <= 0) return;

    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              saved: Math.min(
                goal.saved + amount,
                goal.target
              ),
            }
          : goal
      )
    );
  };

  /* =====================================================
     SET BUDGET
  ===================================================== */

  const saveBudget = () => {
    const amount = Number(budgetInput);

    if (!amount || amount <= 0) return;

    setBudget(amount);
    setBudgetInput("");
  };

  /* =====================================================
     RESET BUDGET
  ===================================================== */

  const resetBudget = () => {
    setBudget(0);
  };

  /* =====================================================
     CLOSE MODALS
  ===================================================== */

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setTransactionTitle("");
    setTransactionAmount("");
    setTransactionCategory("");
    setTransactionType("expense");
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    setGoalName("");
    setGoalTarget("");
    setGoalSaved("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="relative min-h-screen bg-black p-4 font-sans text-white antialiased">

      <FloatingSidebar />

      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#050505] p-8 pl-20 shadow-2xl sm:pl-24">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-white">
                <Wallet size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                  Monobloc / FINANCE
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Personal financial command center
                </p>
              </div>

            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Finance
            </h1>

            <p className="mt-1 text-xs text-neutral-400">
              Understand where your money is going.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                setShowTransactionModal(true)
              }
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              <Plus size={16} />
              New Transaction
            </button>

            <div className="ml-1 flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] p-1.5 pr-4">

              <div className="h-8 w-8 rounded-full bg-white p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050505] text-[11px] font-semibold">
                  Z
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Monobloc User
                </p>

                <p className="text-[10px] text-neutral-500">
                  user@Monobloc.app
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <MetricCard
            icon={<Wallet size={16} />}
            label="Balance"
            value={formatMoney(balance)}
            subtext="Income minus expenses"
          />

          <MetricCard
            icon={<ArrowUpCircle size={16} />}
            label="Income"
            value={formatMoney(totalIncome)}
            subtext="Total money received"
            valueClass="text-white"
            iconClass="bg-white/[0.04] text-white"
          />

          <MetricCard
            icon={<ArrowDownCircle size={16} />}
            label="Expenses"
            value={formatMoney(totalExpenses)}
            subtext="Total money spent"
            valueClass="text-neutral-300"
            iconClass="bg-white/[0.04] text-neutral-300"
          />

          <MetricCard
            icon={<DollarSign size={16} />}
            label="Budget Left"
            value={
              budget > 0
                ? formatMoney(
                    remainingBudget
                  )
                : "—"
            }
            subtext={
              budget > 0
                ? `${Math.round(
                    budgetUsed
                  )}% used`
                : "No budget set"
            }
          />

        </section>

        {/* =================================================
            FINANCIAL PROGRESS HERO
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080808] p-7">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-3xl">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-white">
                  <Sparkles size={17} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  FINANCIAL OVERVIEW
                </span>

              </div>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                {transactions.length === 0
                  ? "Ready when you are."
                  : balance >= 0
                  ? "You're in positive territory."
                  : "Let's get spending under control."}
              </h2>

              <p className="mt-1 text-xs leading-5 text-neutral-400">
                {transactions.length === 0
                  ? "Add your first transaction and Monobloc will start tracking your finances."
                  : `${transactions.length} transaction${
                      transactions.length === 1
                        ? ""
                        : "s"
                    } currently tracked in your workspace.`}
              </p>

              <div className="mt-6 max-w-[520px]">

                <div className="mb-2 flex items-center justify-between text-xs">

                  <span className="font-medium text-neutral-400">
                    Monthly Budget
                  </span>

                  <span className="font-semibold text-white">
                    {budget > 0
                      ? `${Math.round(
                          budgetUsed
                        )}%`
                      : "Not set"}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetUsed >= 90
                        ? "bg-red-400"
                        : "bg-white"
                    }`}
                    style={{
                      width:
                        budget > 0
                          ? `${budgetUsed}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>

            <div className="flex shrink-0 items-center justify-center lg:pr-8">

              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] ">

                <div className="text-center">

                  <p
                    className={`text-2xl font-bold ${
                      balance >= 0
                        ? "text-white"
                        : "text-neutral-300"
                    }`}
                  >
                    {formatMoney(balance)}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-wider text-neutral-400">
                    balance
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-12">

          {/* =================================================
              TRANSACTIONS
          ================================================= */}

          <section className="min-h-[560px] rounded-3xl border border-white/[0.07] bg-[#080808] xl:col-span-8">

            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">

              <div>
                <div className="flex items-center gap-2">

                  <CircleDollarSign
                    size={16}
                    className="text-white"
                  />

                  <h2 className="text-sm font-semibold text-white">
                    Transactions
                  </h2>

                  <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] text-neutral-500">
                    {transactions.length}
                  </span>

                </div>

                <p className="mt-1 text-[10px] text-neutral-600">
                  Your recent financial activity
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTransactionModal(
                    true
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                aria-label="Add transaction"
              >
                <Plus size={15} />
              </button>

            </div>

            <div className="max-h-[500px] overflow-y-auto">

              {transactions.length === 0 ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center px-8 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.07] bg-white/[0.03] text-neutral-600">
                    <Wallet size={28} />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-neutral-300">
                    No transactions yet
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-neutral-600">
                    Add your first income or expense to start building your financial overview.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowTransactionModal(
                        true
                      )
                    }
                    className="mt-5 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    <Plus size={14} />
                    Add Transaction
                  </button>

                </div>
              ) : (
                <div className="p-3">

                  {[...transactions]
                    .reverse()
                    .map((transaction) => {

                      const isIncome =
                        transaction.type ===
                        "income";

                      return (
                        <div
                          key={transaction.id}
                          className="group mb-3 flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 transition hover:bg-white/[0.03]"
                        >

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isIncome
                                ? "bg-white/[0.04] text-white"
                                : "bg-white/[0.04] text-neutral-300"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpCircle
                                size={18}
                              />
                            ) : (
                              <ArrowDownCircle
                                size={18}
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-white">
                              {transaction.title}
                            </p>

                            <div className="mt-1 flex items-center gap-2">

                              <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[8px] uppercase tracking-wider text-neutral-500">
                                {transaction.category}
                              </span>

                              <span className="text-[9px] text-neutral-700">
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </span>

                            </div>

                          </div>

                          <p
                            className={`text-sm font-bold ${
                              isIncome
                                ? "text-white"
                                : "text-neutral-300"
                            }`}
                          >
                            {isIncome
                              ? "+"
                              : "-"}
                            {formatMoney(
                              transaction.amount
                            )}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                            className="rounded-lg p-2 text-neutral-700 opacity-0 transition hover:bg-white/[0.04] hover:text-neutral-300 group-hover:opacity-100"
                            aria-label={`Delete ${transaction.title}`}
                          >
                            <Trash2
                              size={14}
                            />
                          </button>

                        </div>
                      );
                    })}

                </div>
              )}

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <aside className="space-y-6 xl:col-span-4">

            {/* BUDGET */}

            <section className="rounded-3xl border border-white/[0.07] bg-[#080808]">

              <div className="border-b border-white/[0.07] p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white">
                    <TrendingUp size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Monthly Budget
                    </p>

                    <p className="mt-0.5 text-[10px] text-neutral-600">
                      Spending control
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-5">

                {budget === 0 ? (
                  <>
                    <p className="text-xs leading-5 text-neutral-500">
                      Set a monthly spending limit to let Monobloc track how much you've used.
                    </p>

                    <div className="mt-5 flex gap-2">

                      <input
                        type="number"
                        min="1"
                        value={budgetInput}
                        onChange={(event) =>
                          setBudgetInput(
                            event.target.value
                          )
                        }
                        placeholder="₹ Monthly budget"
                        className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                      />

                      <button
                        type="button"
                        onClick={saveBudget}
                        className="rounded-xl bg-white px-4 text-xs font-semibold text-white"
                      >
                        Set
                      </button>

                    </div>
                  </>
                ) : (
                  <>

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-neutral-600">
                          Spent
                        </p>

                        <p className="mt-1 text-2xl font-bold text-white">
                          {formatMoney(
                            totalExpenses
                          )}
                        </p>
                      </div>

                      <p className="text-xs text-neutral-500">
                        of{" "}
                        {formatMoney(
                          budget
                        )}
                      </p>

                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.04]">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          budgetUsed >= 90
                            ? "bg-red-400"
                            : "bg-white"
                        }`}
                        style={{
                          width: `${budgetUsed}%`,
                        }}
                      />

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-[9px] text-neutral-600">
                        {Math.round(
                          budgetUsed
                        )}
                        % used
                      </span>

                      <span
                        className={`text-[10px] font-medium ${
                          budgetUsed >= 90
                            ? "text-neutral-300"
                            : "text-white"
                        }`}
                      >
                        {formatMoney(
                          remainingBudget
                        )}{" "}
                        left
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={resetBudget}
                      className="mt-5 text-[9px] text-neutral-700 transition hover:text-neutral-300"
                    >
                      Reset budget
                    </button>

                  </>
                )}

              </div>

            </section>

            {/* Monobloc ASSISTANT */}

            <section className="rounded-3xl border border-white/[0.07] bg-[#080808] p-5">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white">
                  <Sparkles size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Monobloc Assistant
                  </p>

                  <p className="mt-0.5 text-[10px] text-neutral-600">
                    Financial intelligence
                  </p>
                </div>

              </div>

              <div className="space-y-2">

                <StatusRow
                  label="Finance System"
                  value="ONLINE"
                  active
                />

                <StatusRow
                  label="Transactions"
                  value={String(
                    transactions.length
                  )}
                />

                <StatusRow
                  label="Budget"
                  value={
                    budget > 0
                      ? "ACTIVE"
                      : "NOT SET"
                  }
                  active={budget > 0}
                />

                <StatusRow
                  label="Savings Goals"
                  value={String(
                    goals.length
                  )}
                />

              </div>

              <Link
                href="/ai-assistant"
                className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[10px] font-semibold text-white transition hover:bg-white/[0.08]"
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

        {/* =================================================
            SAVINGS GOALS
        ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#080808]">

          <div className="flex items-center justify-between border-b border-white/[0.07] p-5">

            <div>

              <div className="flex items-center gap-2">

                <Target
                  size={16}
                  className="text-white"
                />

                <h2 className="text-sm font-semibold text-white">
                  Savings Goals
                </h2>

                <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] text-neutral-500">
                  {goals.length}
                </span>

              </div>

              <p className="mt-1 text-[10px] text-neutral-600">
                Build toward the things that matter
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowGoalModal(true)
              }
              className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <Plus size={14} />
              Add Goal
            </button>

          </div>

          {goals.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-8 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] text-neutral-700">
                <Target size={24} />
              </div>

              <p className="mt-4 text-xs font-medium text-neutral-500">
                No savings goals yet
              </p>

              <p className="mt-1 max-w-xs text-[10px] leading-5 text-neutral-700">
                Create a savings goal and track how close you are to reaching it.
              </p>

            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">

              {goals.map((goal) => {

                const progress =
                  goal.target > 0
                    ? Math.min(
                        (goal.saved /
                          goal.target) *
                          100,
                        100
                      )
                    : 0;

                const isComplete =
                  progress >= 100;

                const isSelected =
                  selectedGoalId === goal.id;

                return (
                  <button
                    type="button"
                    key={goal.id}
                    onClick={() =>
                      setSelectedGoalId(
                        goal.id
                      )
                    }
                    className={`group relative rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-white/[0.12] bg-white/[0.045]"
                        : "border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.03]"
                    }`}
                  >

                    {isSelected && (
                      <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full bg-white" />
                    )}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isComplete
                              ? "bg-white/[0.04] text-white"
                              : "bg-white/[0.04] text-white"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2
                              size={16}
                            />
                          ) : (
                            <Target
                              size={16}
                            />
                          )}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-xs font-semibold text-white">
                            {goal.name}
                          </p>

                          <p className="mt-1 text-[9px] text-neutral-600">
                            {formatMoney(
                              goal.saved
                            )}{" "}
                            of{" "}
                            {formatMoney(
                              goal.target
                            )}
                          </p>

                        </div>

                      </div>

                      <ChevronRight
                        size={14}
                        className="shrink-0 text-neutral-700 transition group-hover:text-neutral-400"
                      />

                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.04]">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete
                            ? "bg-white"
                            : "bg-white"
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-[9px] text-neutral-600">
                        {Math.round(
                          progress
                        )}
                        %
                      </span>

                      {isComplete ? (
                        <span className="text-[9px] font-semibold text-white">
                          Goal reached
                        </span>
                      ) : (
                        <span className="text-[9px] text-white">
                          Click to manage
                        </span>
                      )}

                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </section>

        {/* =================================================
            SELECTED GOAL CONTROLS
        ================================================= */}

        {selectedGoal && (
          <section className="mt-4 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-white">
                  Selected Goal
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {selectedGoal.name}
                </p>

                <p className="mt-1 text-[10px] text-neutral-600">
                  {formatMoney(
                    selectedGoal.saved
                  )}{" "}
                  saved of{" "}
                  {formatMoney(
                    selectedGoal.target
                  )}
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    updateGoal(
                      selectedGoal.id,
                      100
                    )
                  }
                  disabled={
                    selectedGoal.saved >=
                    selectedGoal.target
                  }
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  + ₹100
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateGoal(
                      selectedGoal.id,
                      500
                    )
                  }
                  disabled={
                    selectedGoal.saved >=
                    selectedGoal.target
                  }
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  + ₹500
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateGoal(
                      selectedGoal.id,
                      1000
                    )
                  }
                  disabled={
                    selectedGoal.saved >=
                    selectedGoal.target
                  }
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  + ₹1,000
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteGoal(
                      selectedGoal.id
                    )
                  }
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold text-neutral-300 transition hover:bg-white/[0.04]"
                >
                  <Trash2
                    size={13}
                  />
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            SYSTEM BAR
        ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#080808] p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white">
                <Zap size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Finance System
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-600">
                  Your financial workspace is running locally.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <SystemBadge
                label="Transactions"
                value={String(
                  transactions.length
                )}
              />

              <SystemBadge
                label="Goals"
                value={String(
                  goals.length
                )}
              />

              <SystemBadge
                label="Completed"
                value={String(
                  completedGoals
                )}
              />

              <SystemBadge
                label="Status"
                value="ONLINE"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            TRANSACTION MODAL
        ================================================= */}

        {showTransactionModal && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeTransactionModal();
              }
            }}
          >

            <div className="w-full max-w-[480px] rounded-3xl border border-white/[0.08] bg-[#050505] p-6 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-white">
                      <Wallet size={15} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      Finance
                    </p>

                  </div>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Add transaction
                  </h2>

                  <p className="mt-1 text-[10px] text-neutral-600">
                    Record income or an expense.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    closeTransactionModal
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-600 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

              <div className="space-y-4">

                {/* TYPE */}

                <div className="grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setTransactionType(
                        "expense"
                      )
                    }
                    className={`rounded-xl border py-3 text-xs font-semibold transition ${
                      transactionType ===
                      "expense"
                        ? "border-white/[0.15] bg-white/[0.05] text-neutral-300"
                        : "border-white/[0.08] bg-white/[0.03] text-neutral-500"
                    }`}
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTransactionType(
                        "income"
                      )
                    }
                    className={`rounded-xl border py-3 text-xs font-semibold transition ${
                      transactionType ===
                      "income"
                        ? "border-white/[0.15] bg-white/[0.05] text-white"
                        : "border-white/[0.08] bg-white/[0.03] text-neutral-500"
                    }`}
                  >
                    Income
                  </button>

                </div>

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-[10px] font-medium text-neutral-500">
                    Name
                  </label>

                  <input
                    value={
                      transactionTitle
                    }
                    onChange={(event) =>
                      setTransactionTitle(
                        event.target.value
                      )
                    }
                    placeholder="What was this for?"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                    autoFocus
                  />

                </div>

                {/* AMOUNT */}

                <div>

                  <label className="mb-2 block text-[10px] font-medium text-neutral-500">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      transactionAmount
                    }
                    onChange={(event) =>
                      setTransactionAmount(
                        event.target.value
                      )
                    }
                    placeholder="₹0"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-[10px] font-medium text-neutral-500">
                    Category
                  </label>

                  <input
                    value={
                      transactionCategory
                    }
                    onChange={(event) =>
                      setTransactionCategory(
                        event.target.value
                      )
                    }
                    placeholder="Food, travel, salary..."
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                  />

                </div>

                {/* ACTIONS */}

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={
                      closeTransactionModal
                    }
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-xs font-semibold text-neutral-500 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addTransaction}
                    disabled={
                      !transactionTitle.trim() ||
                      !Number(
                        transactionAmount
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                    Add Transaction
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            GOAL MODAL
        ================================================= */}

        {showGoalModal && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeGoalModal();
              }
            }}
          >

            <div className="w-full max-w-[480px] rounded-3xl border border-white/[0.08] bg-[#050505] p-6 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-white">
                      <Target size={15} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      Savings
                    </p>

                  </div>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Create a savings goal
                  </h2>

                  <p className="mt-1 text-[10px] text-neutral-600">
                    Decide what you're saving toward.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeGoalModal}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-600 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

              <div className="space-y-4">

                <div>

                  <label className="mb-2 block text-[10px] font-medium text-neutral-500">
                    Goal name
                  </label>

                  <input
                    value={goalName}
                    onChange={(event) =>
                      setGoalName(
                        event.target.value
                      )
                    }
                    placeholder="What are you saving for?"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                    autoFocus
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[10px] font-medium text-neutral-500">
                    Target amount
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={goalTarget}
                    onChange={(event) =>
                      setGoalTarget(
                        event.target.value
                      )
                    }
                    placeholder="₹0"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[10px] font-medium text-neutral-500">
                    Already saved
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={goalSaved}
                    onChange={(event) =>
                      setGoalSaved(
                        event.target.value
                      )
                    }
                    placeholder="₹0"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.2]"
                  />

                </div>

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={
                      closeGoalModal
                    }
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-xs font-semibold text-neutral-500 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addGoal}
                    disabled={
                      !goalName.trim() ||
                      !Number(goalTarget)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                    Create Goal
                  </button>

                </div>

              </div>

            </div>

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
  valueClass = "text-white",
  iconClass = "bg-white/[0.04] text-white",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  valueClass?: string;
  iconClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#080808] p-4 transition hover:bg-white/[0.04]">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-[10px] text-neutral-500">
          {label}
        </span>

      </div>

      <p
        className={`mt-3 truncate text-2xl font-bold ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-neutral-400">
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
    <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">

      <span className="text-[10px] text-neutral-500">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 text-[10px] font-medium ${
          active
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
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
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2">

      <p className="text-[8px] uppercase tracking-[0.15em] text-neutral-600">
        {label}
      </p>

      <p className="mt-0.5 font-mono text-[10px] font-semibold text-white">
        {value}
      </p>

    </div>
  );
}