"use client";

import { useState } from "react";
import {
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";

type Activity = {
  title: string;
  description: string;
  time: string;
};

export default function ActivityCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = () => {
    if (!title.trim()) return;

    const now = new Date();

    setActivities([
      {
        title,
        description,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...activities,
    ]);

    setTitle("");
    setDescription("");
  };

  const deleteActivity = (index: number) => {
    setActivities(
      activities.filter((_, i) => i !== index)
    );
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827]/70 p-6 shadow-2xl backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400">
          <Clock3 className="text-white" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Recent Activity
          </h2>

          <p className="text-sm text-gray-400">
            Track everything you've done.
          </p>
        </div>
      </div>

      {/* Add Activity */}
      <div className="mb-6 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity title..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none resize-none"
        />

        <button
          onClick={addActivity}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold transition hover:scale-[1.02]"
        >
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-gray-400">
          No activity yet.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    {activity.title}
                  </h3>

                  {activity.description && (
                    <p className="mt-1 text-sm text-gray-400">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-gray-500">
                    {activity.time}
                  </p>
                </div>

                <button
                  onClick={() => deleteActivity(index)}
                  className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}