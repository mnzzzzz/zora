"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  X,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  Transaction,
  getTransactions,
  saveTransactions,
  getFinanceTotals,
} from "@/lib/finance";

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] =
    useState<"income" | "expense">("expense");

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const totals = getFinanceTotals(transactions);

  function handleAddTransaction() {
    const numericAmount = Number(amount);

    if (!title.trim()) {
      alert("Please enter a transaction name.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: numericAmount,
      type,
      date: new Date().toISOString(),
    };

    const updatedTransactions = [
      newTransaction,
      ...transactions,
    ];

    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);

    setTitle("");
    setAmount("");
    setType("expense");
    setShowModal(false);
  }

  function handleDelete(id: string) {
    const updatedTransactions =
      transactions.filter(
        (transaction) => transaction.id !== id
      );

    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  }

  return (
    <main className="min-h-screen bg-[#07111F] px-6 py-8 text-white">

      <div className="mx-auto max-w-6xl">

        {/* ======================================== */}
        {/* HEADER */}
        {/* ======================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <Link
              href="/"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>

              <div className="flex items-center gap-2">
                <Wallet
                  size={17}
                  className="text-cyan-400"
                />

                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  Zora Finance
                </span>
              </div>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Your Finances
              </h1>

              <p className="mt-2 text-gray-400">
                Track your money without the spreadsheet
                nightmare.
              </p>

            </div>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-3 font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/40"
          >
            <Plus size={18} />
            Add Transaction
          </button>

        </div>

        {/* ======================================== */}
        {/* BALANCE */}
        {/* ======================================== */}

        <section className="relative mb-6 overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-indigo-700/20 p-8 shadow-[0_25px_100px_rgba(59,130,246,0.12)]">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">

            <p className="text-sm text-gray-400">
              Total Balance
            </p>

            <div className="mt-2 flex items-center">

              <IndianRupee
                size={30}
                className="text-cyan-300"
              />

              <h2 className="text-5xl font-bold">
                {totals.balance.toLocaleString("en-IN")}
              </h2>

            </div>

            <p className="mt-3 text-sm text-gray-500">
              Income minus expenses
            </p>

          </div>

        </section>

        {/* ======================================== */}
        {/* STATS */}
        {/* ======================================== */}

        <div className="mb-6 grid gap-5 md:grid-cols-3">

          <FinanceStat
            icon={<TrendingUp size={21} />}
            title="Income"
            value={totals.income}
            description="Total money in"
            positive
          />

          <FinanceStat
            icon={<TrendingDown size={21} />}
            title="Expenses"
            value={totals.expenses}
            description="Total money out"
          />

          <FinanceStat
            icon={<Wallet size={21} />}
            title="Transactions"
            value={transactions.length}
            description="Recorded activity"
            isCount
          />

        </div>

        {/* ======================================== */}
        {/* TRANSACTIONS */}
        {/* ======================================== */}

        <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your financial activity.
            </p>

          </div>

          {transactions.length === 0 ? (

            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
                <Wallet
                  size={24}
                  className="text-cyan-400"
                />
              </div>

              <p className="mt-4 font-medium">
                No transactions yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first transaction to start
                tracking your finances.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
              >
                Add transaction
              </button>

            </div>

          ) : (

            <div className="space-y-3">

              {transactions.map((transaction) => (

                <div
                  key={transaction.id}
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/10 p-4 transition hover:border-white/10 hover:bg-white/[0.04]"
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        transaction.type === "income"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight size={20} />
                      ) : (
                        <ArrowDownRight size={20} />
                      )}
                    </div>

                    <div>

                      <p className="font-medium">
                        {transaction.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(
                          transaction.date
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <p
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      ₹
                      {transaction.amount.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <button
                      onClick={() =>
                        handleDelete(transaction.id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 opacity-0 transition hover:bg-red-400/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

      {/* ======================================== */}
      {/* ADD TRANSACTION MODAL */}
      {/* ======================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">

          <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#0B1626] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Add Transaction
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Record income or an expense.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            {/* TITLE */}

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Salary, Food, Subscription"
              className="mb-5 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50"
            />

            {/* AMOUNT */}

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Amount
            </label>

            <div className="relative mb-5">

              <IndianRupee
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="0"
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50"
              />

            </div>

            {/* TYPE */}

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Type
            </label>

            <div className="mb-6 grid grid-cols-2 gap-3">

              <button
                onClick={() => setType("expense")}
                className={`rounded-2xl border p-3 text-sm font-medium transition ${
                  type === "expense"
                    ? "border-red-400/40 bg-red-400/10 text-red-400"
                    : "border-white/10 bg-white/[0.03] text-gray-400"
                }`}
              >
                Expense
              </button>

              <button
                onClick={() => setType("income")}
                className={`rounded-2xl border p-3 text-sm font-medium transition ${
                  type === "income"
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                    : "border-white/10 bg-white/[0.03] text-gray-400"
                }`}
              >
                Income
              </button>

            </div>

            {/* SUBMIT */}

            <button
              onClick={handleAddTransaction}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 py-3.5 font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
            >
              Add Transaction
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

/* ======================================== */
/* STAT CARD */
/* ======================================== */

function FinanceStat({
  icon,
  title,
  value,
  description,
  positive = false,
  isCount = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  positive?: boolean;
  isCount?: boolean;
}) {
  return (
    <div className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          positive
            ? "bg-emerald-400/10 text-emerald-400"
    
            : "bg-cyan-400/10 text-cyan-400"
        }`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-gray-400">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-bold">
        {isCount
          ? value
          : `₹${value.toLocaleString("en-IN")}`}
      </h3>

      <p className="mt-1 text-xs text-gray-600">
        {description}
      </p>

    </div>
  );
}