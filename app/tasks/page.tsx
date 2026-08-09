"use client";

import { useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";

export default function TasksPage() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (!task.trim()) return;

    setTasks((current) => [...current, task.trim()]);
    setTask("");
  };

  const deleteTask = (index: number) => {
    setTasks((current) => current.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-[#07111F] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="mt-2 text-gray-400">
            Keep track of everything you need to get done.
          </p>
        </div>

        <div className="mb-8 flex gap-3">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Add a task..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-500/50"
          />

          <button
            onClick={addTask}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 font-semibold transition hover:scale-[1.02]"
          >
            <Plus size={20} />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
              <CheckCircle2 className="mx-auto mb-4 text-blue-400" size={40} />

              <h2 className="text-lg font-semibold">
                No tasks yet
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Add your first task above.
              </p>
            </div>
          ) : (
            tasks.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-blue-400"
                />

                <span className="flex-1">{item}</span>

                <button
                  onClick={() => deleteTask(index)}
                  className="rounded-xl p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}