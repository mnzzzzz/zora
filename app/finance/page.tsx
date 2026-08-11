"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
} from "lucide-react";
import DashboardButton from "@/components/dashboardbutton";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
};

type Budget = {
  id: number;
  name: string;
  limit: number;
};

type Goal = {
  id: number;
  title: string;
  target: number;
  saved: number;
};

export default function FinancePage() {
  // Transaction Inputs
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [type, setType] = useState<"Income" | "Expense">("Expense");

  // Budget Inputs
  const [budgetName, setBudgetName] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  // Goal Inputs
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  // Data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Calculations
  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Income")
        .reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const expenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Expense")
        .reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const balance = income - expenses;

  const savings = goals.reduce((a, b) => a + b.saved, 0);

  // Add Transaction
  function addTransaction() {
    if (!title || !amount) return;

    setTransactions([
      {
        id: Date.now(),
        title,
        amount: Number(amount),
        category: category || "General",
        type,
      },
      ...transactions,
    ]);

    setTitle("");
    setAmount("");
    setCategory("");
  }

  function deleteTransaction(id: number) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  // Add Budget
  function addBudget() {
    if (!budgetName || !budgetLimit) return;

    setBudgets([
      ...budgets,
      {
        id: Date.now(),
        name: budgetName,
        limit: Number(budgetLimit),
      },
    ]);

    setBudgetName("");
    setBudgetLimit("");
  }

  function deleteBudget(id: number) {
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  // Add Goal
  function addGoal() {
    if (!goalTitle || !goalTarget) return;

    setGoals([
      ...goals,
      {
        id: Date.now(),
        title: goalTitle,
        target: Number(goalTarget),
        saved: 0,
      },
    ]);

    setGoalTitle("");
    setGoalTarget("");
  }

  function deleteGoal(id: number) {
    setGoals(goals.filter((g) => g.id !== id));
  }

  function addSavings(id: number) {
    const value = Number(prompt("Amount to save?"));

    if (isNaN(value) || value <= 0) return;

    setGoals(
      goals.map((g) =>
        g.id === id
          ? {
              ...g,
              saved: g.saved + value,
            }
          : g
      )
    );
  }

  return (
    <main className="min-h-screen p-10 text-white">
      {/* Dashboard Navigation */}
      <div className="mb-6">
        <DashboardButton />
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Finance</h1>

        <p className="mt-2 text-gray-400">
          Track your finances, budgets and savings goals.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 lg:grid-cols-4">
        <StatCard
          title="Balance"
          value={`₹${balance.toLocaleString()}`}
          icon={<Wallet size={22} />}
        />

        <StatCard
          title="Income"
          value={`₹${income.toLocaleString()}`}
          icon={<ArrowUpCircle size={22} />}
        />

        <StatCard
          title="Expenses"
          value={`₹${expenses.toLocaleString()}`}
          icon={<ArrowDownCircle size={22} />}
        />

        <StatCard
          title="Savings"
          value={`₹${savings.toLocaleString()}`}
          icon={<PiggyBank size={22} />}
        />
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        {/* Left Side */}
        <div className="space-y-8 xl:col-span-2">
          {/* Add Transaction */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Transactions
              </h2>

              <button
                onClick={addTransaction}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 font-medium transition hover:scale-105"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Transaction title"
                className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "Income" | "Expense")
                }
                className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              >
                <option>Expense</option>
                <option>Income</option>
              </select>
            </div>

            <button
              onClick={addTransaction}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold transition hover:scale-[1.02]"
            >
              Add Transaction
            </button>
          </div>

          {/* Transaction List */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-2xl font-semibold">
              Recent Transactions
            </h2>

            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-gray-400">
                No transactions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {transaction.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        {transaction.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`font-semibold ${
                          transaction.type === "Income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "Income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString()}
                      </span>

                      <button
                        onClick={() =>
                          deleteTransaction(transaction.id)
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-8">
          {/* Budgets */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-2xl font-semibold">
              Budgets
            </h2>

            <div className="space-y-3">
              <input
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="Budget category"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="Budget limit"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <button
                onClick={addBudget}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold transition hover:scale-[1.02]"
              >
                Add Budget
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {budgets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-gray-400">
                  No budgets created.
                </div>
              ) : (
                budgets.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {budget.name}
                      </h3>

                      <p className="text-sm text-gray-400">
                        ₹{budget.limit.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Savings Goals */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-2xl font-semibold">
              Savings Goals
            </h2>

            <div className="space-y-3">
              <input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="Goal name"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <input
                type="number"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                placeholder="Target amount"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <button
                onClick={addGoal}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold transition hover:scale-[1.02]"
              >
                Add Goal
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {goals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-gray-400">
                  No savings goals.
                </div>
              ) : (
                goals.map((goal) => {
                  const progress =
                    goal.target === 0
                      ? 0
                      : (goal.saved / goal.target) * 100;

                  return (
                    <div
                      key={goal.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {goal.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-400">
                            ₹{goal.saved.toLocaleString()} / ₹
                            {goal.target.toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                          }}
                        />
                      </div>

                      <button
                        onClick={() => addSavings(goal.id)}
                        className="mt-4 w-full rounded-xl bg-blue-500/20 py-2 transition hover:bg-blue-500/30"
                      >
                        Add Savings
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/10">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-3 shadow-lg shadow-cyan-500/20">
          {icon}
        </div>
      </div>
    </div>
  );
}