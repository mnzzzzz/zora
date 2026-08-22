"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  ChevronRight,
  DollarSign,
  Plus,
  Target,
  Trash2,
  Wallet,
  X,
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

export default function FinancePage() {
  /* =====================================================
     STATE
  ===================================================== */

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [budget, setBudget] = useState<number>(0);

  const [showTransactionModal, setShowTransactionModal] =
    useState(false);

  const [showGoalModal, setShowGoalModal] = useState(false);

  /* Transaction form */

  const [transactionTitle, setTransactionTitle] = useState("");
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
     CALCULATIONS
  ===================================================== */

  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const balance = totalIncome - totalExpenses;

  const budgetUsed =
    budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;

  const remainingBudget =
    budget > 0 ? Math.max(budget - totalExpenses, 0) : 0;

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
    const amount = Number(transactionAmount);

    if (!transactionTitle.trim()) return;
    if (!amount || amount <= 0) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      title: transactionTitle.trim(),
      amount,
      type: transactionType,
      category:
        transactionCategory.trim() || "General",
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

  const deleteTransaction = (id: number) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  };

  /* =====================================================
     ADD GOAL
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
      saved: Math.min(saved, target),
    };

    setGoals((current) => [...current, newGoal]);

    setGoalName("");
    setGoalTarget("");
    setGoalSaved("");
    setShowGoalModal(false);
  };

  /* =====================================================
     DELETE GOAL
  ===================================================== */

  const deleteGoal = (id: number) => {
    setGoals((current) =>
      current.filter((goal) => goal.id !== id)
    );
  };

  /* =====================================================
     UPDATE GOAL SAVINGS
  ===================================================== */

  const updateGoal = (id: number, amount: number) => {
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
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen px-5 py-6 text-white sm:px-7 lg:px-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="mb-6 rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <Wallet size={25} />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Zora Finance
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Finance
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Understand where your money is going.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <button
              onClick={() => setShowTransactionModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold transition hover:scale-[1.02]"
            >
              <Plus size={17} />
              Add transaction
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Balance */}

        <div className="rounded-[26px] border border-white/10 bg-[#0b1422]/80 p-5 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Balance
            </p>

            <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-400">
              <Wallet size={17} />
            </div>

          </div>

          <p className="mt-5 text-3xl font-bold">
            {formatMoney(balance)}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Income minus expenses
          </p>

        </div>

        {/* Income */}

        <div className="rounded-[26px] border border-white/10 bg-[#0b1422]/80 p-5 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Income
            </p>

            <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-400">
              <ArrowUpCircle size={17} />
            </div>

          </div>

          <p className="mt-5 text-3xl font-bold text-emerald-400">
            {formatMoney(totalIncome)}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Total money received
          </p>

        </div>

        {/* Expenses */}

        <div className="rounded-[26px] border border-white/10 bg-[#0b1422]/80 p-5 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Expenses
            </p>

            <div className="rounded-xl bg-red-400/10 p-2 text-red-400">
              <ArrowDownCircle size={17} />
            </div>

          </div>

          <p className="mt-5 text-3xl font-bold text-red-400">
            {formatMoney(totalExpenses)}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Total money spent
          </p>

        </div>

        {/* Budget */}

        <div className="rounded-[26px] border border-white/10 bg-[#0b1422]/80 p-5 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Budget remaining
            </p>

            <div className="rounded-xl bg-blue-400/10 p-2 text-blue-400">
              <DollarSign size={17} />
            </div>

          </div>

          <p className="mt-5 text-3xl font-bold">
            {budget > 0
              ? formatMoney(remainingBudget)
              : "—"}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            {budget > 0
              ? `${Math.round(budgetUsed)}% used`
              : "Set a budget below"}
          </p>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        <section className="rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Activity
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Transactions
              </h2>

            </div>

            <button
              onClick={() => setShowTransactionModal(true)}
              className="rounded-xl bg-white/[0.04] p-2 text-slate-400 transition hover:bg-cyan-400/10 hover:text-cyan-400"
            >
              <Plus size={18} />
            </button>

          </div>

          {transactions.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">

              <Wallet
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-400">
                No transactions yet.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Add your first transaction to start tracking.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {[...transactions]
                .reverse()
                .map((transaction) => (

                  <div
                    key={transaction.id}
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                  >

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        transaction.type === "income"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle size={20} />
                      ) : (
                        <ArrowDownCircle size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold">
                        {transaction.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {transaction.category}
                      </p>

                    </div>

                    <p
                      className={`text-sm font-bold ${
                        transaction.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      {formatMoney(transaction.amount)}
                    </p>

                    <button
                      onClick={() =>
                        deleteTransaction(transaction.id)
                      }
                      className="rounded-lg p-2 text-slate-700 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* =================================================
            BUDGET
        ================================================= */}

        <section className="rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
            Monthly planning
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Budget
          </h2>

          {budget === 0 ? (

            <div className="mt-6">

              <p className="text-sm text-slate-500">
                How much can you spend this month?
              </p>

              <div className="mt-4 flex gap-2">

                <input
                  type="number"
                  min="0"
                  value={budgetInput}
                  onChange={(e) =>
                    setBudgetInput(e.target.value)
                  }
                  placeholder="Monthly budget"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

                <button
                  onClick={saveBudget}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 text-sm font-semibold"
                >
                  Set
                </button>

              </div>

            </div>

          ) : (

            <div className="mt-6">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-xs text-slate-600">
                    Spent
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {formatMoney(totalExpenses)}
                  </p>

                </div>

                <p className="text-sm text-slate-500">
                  of {formatMoney(budget)}
                </p>

              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.06]">

                <div
                  className={`h-full rounded-full transition-all ${
                    budgetUsed >= 90
                      ? "bg-red-400"
                      : "bg-gradient-to-r from-blue-500 to-cyan-400"
                  }`}
                  style={{
                    width: `${budgetUsed}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs">

                <span className="text-slate-600">
                  {Math.round(budgetUsed)}% used
                </span>

                <span className="text-slate-500">
                  {formatMoney(remainingBudget)} left
                </span>

              </div>

              <button
                onClick={() => setBudget(0)}
                className="mt-6 text-xs text-slate-600 transition hover:text-red-400"
              >
                Reset budget
              </button>

            </div>

          )}

        </section>

      </div>

      {/* =================================================
          SAVINGS GOALS
      ================================================= */}

      <section className="mt-6 rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Long term
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Savings goals
            </h2>

          </div>

          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-400"
          >
            <Plus size={16} />
            Add goal
          </button>

        </div>

        {goals.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">

            <Target
              size={28}
              className="mx-auto mb-3 text-slate-700"
            />

            <p className="text-sm text-slate-400">
              No savings goals yet.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Create a goal and track your progress.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {goals.map((goal) => {

              const progress =
                goal.target > 0
                  ? Math.min(
                      (goal.saved / goal.target) * 100,
                      100
                    )
                  : 0;

              return (

                <div
                  key={goal.id}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-400">
                        <Target size={17} />
                      </div>

                      <div>

                        <p className="font-semibold">
                          {goal.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {formatMoney(goal.saved)} of{" "}
                          {formatMoney(goal.target)}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-700 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-xs text-slate-600">
                      {Math.round(progress)}%
                    </span>

                    {progress < 100 && (

                      <button
                        onClick={() => {
                          const amount = Number(
                            window.prompt(
                              "How much would you like to add?"
                            )
                          );

                          if (amount > 0) {
                            updateGoal(goal.id, amount);
                          }
                        }}
                        className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                      >
                        Add savings
                      </button>

                    )}

                    {progress >= 100 && (
                      <span className="text-xs font-semibold text-emerald-400">
                        Goal reached
                      </span>
                    )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </section>

      {/* =================================================
          TRANSACTION MODAL
      ================================================= */}

      {showTransactionModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[#0b1422] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                  Finance
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Add transaction
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowTransactionModal(false)
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-5">

              {/* Type */}

              <div className="grid grid-cols-2 gap-2">

                <button
                  onClick={() =>
                    setTransactionType("expense")
                  }
                  className={`rounded-xl border py-3 text-sm font-semibold ${
                    transactionType === "expense"
                      ? "border-red-400/30 bg-red-400/10 text-red-400"
                      : "border-white/10 bg-white/[0.03] text-slate-500"
                  }`}
                >
                  Expense
                </button>

                <button
                  onClick={() =>
                    setTransactionType("income")
                  }
                  className={`rounded-xl border py-3 text-sm font-semibold ${
                    transactionType === "income"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                      : "border-white/10 bg-white/[0.03] text-slate-500"
                  }`}
                >
                  Income
                </button>

              </div>

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Name
                </label>

                <input
                  value={transactionTitle}
                  onChange={(e) =>
                    setTransactionTitle(e.target.value)
                  }
                  placeholder="What was this for?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              {/* Amount */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={transactionAmount}
                  onChange={(e) =>
                    setTransactionAmount(e.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              {/* Category */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category
                </label>

                <input
                  value={transactionCategory}
                  onChange={(e) =>
                    setTransactionCategory(e.target.value)
                  }
                  placeholder="Food, travel, salary..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              {/* Actions */}

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setShowTransactionModal(false)
                  }
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={addTransaction}
                  disabled={
                    !transactionTitle.trim() ||
                    !Number(transactionAmount)
                  }
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add transaction
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

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[#0b1422] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                  Savings
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Create a goal
                </h2>

              </div>

              <button
                onClick={() => setShowGoalModal(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Goal name
                </label>

                <input
                  value={goalName}
                  onChange={(e) =>
                    setGoalName(e.target.value)
                  }
                  placeholder="What are you saving for?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Target amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={goalTarget}
                  onChange={(e) =>
                    setGoalTarget(e.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Already saved
                </label>

                <input
                  type="number"
                  min="0"
                  value={goalSaved}
                  onChange={(e) =>
                    setGoalSaved(e.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-slate-400"
                >
                  Cancel
                </button>

                <button
                  onClick={addGoal}
                  disabled={
                    !goalName.trim() ||
                    !Number(goalTarget)
                  }
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create goal
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}