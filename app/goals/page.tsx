   "use client";

import { useState } from "react";
import {
  Target,
  CheckCircle2,
  Flame,
  TrendingUp,
} from "lucide-react";

type Goal = {
  title: string;
  progress: number;
  due: string;
};

export default function GoalsPage() {
  const [goal, setGoal] = useState("");

  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = () => {
    if (!goal.trim()) return;

    setGoals([
      ...goals,
      {
        title: goal,
        progress: 0,
        due: "",
      },
    ]);

    setGoal("");
  };

  return (
   <main className="min-h-screen p-10 text-white">
      <h1 className="text-4xl font-bold">Goals</h1>

      <p className="mt-2 text-gray-400">
        Set and track your personal goals.
      </p>

      {/* Stats */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Target size={22} />}
          title="Goals"
          value={goals.length.toString()}
        />

        <StatCard
          icon={<CheckCircle2 size={22} />}
          title="Completed"
          value="0"
        />

        <StatCard
          icon={<Flame size={22} />}
          title="Streak"
          value="0 Days"
        />

        <StatCard
          icon={<TrendingUp size={22} />}
          title="Progress"
          value={
            goals.length
              ? `${Math.round(
                  goals.reduce((sum, goal) => sum + goal.progress, 0) /
                    goals.length
                )}%`
              : "0%"
          }
        />
      </div>

      {/* Add Goal */}
      <div className="mt-10 flex gap-4">
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter a new goal..."
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 outline-none"
        />

        <button
          onClick={addGoal}
          className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold"
        >
          Add Goal
        </button>
      </div>

      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-semibold">
          Your Goals
        </h2>

        {goals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <Target
              size={48}
              className="mx-auto mb-4 text-blue-400"
            />

            <h2 className="text-2xl font-semibold">
              No goals yet
            </h2>

            <p className="mt-2 text-gray-400">
              Add your first goal to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {goal.title}
                  </h3>

                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                    {goal.due || "No deadline"}
                  </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{
                      width: `${goal.progress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 text-sm text-gray-400">
                  {goal.progress}% Complete
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="text-blue-400">
        {icon}
      </div>

      <div className="mt-4 text-3xl font-bold">
        {value}
      </div>

      <div className="text-gray-400">
        {title}
      </div>
    </div>
  );
}