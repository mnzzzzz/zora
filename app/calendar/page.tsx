"use client";

import { useMemo, useState } from "react";
import DashboardButton from "@/components/dashboardbutton";

interface Event {
  title: string;
  date: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toKey(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");

  return `${year}-${m}-${d}`;
}

function mondayIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(firstOfMonth.getDay());

  const cells: {
    day: number;
    year: number;
    month: number;
    inCurrentMonth: boolean;
  }[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = leadingBlanks - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      year: month === 0 ? year - 1 : year,
      month: month === 0 ? 11 : month - 1,
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      year,
      month,
      inCurrentMonth: true,
    });
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  let trailingDay = 1;

  while (cells.length % 7 !== 0) {
    cells.push({
      day: trailingDay,
      year: nextYear,
      month: nextMonth,
      inCurrentMonth: false,
    });

    trailingDay++;
  }

  return cells;
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);

  const todayKey = toKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);

  const [title, setTitle] = useState("");
  const [events, setEvents] = useState<Event[]>([]);

  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};

    for (const event of events) {
      if (!map[event.date]) {
        map[event.date] = [];
      }

      map[event.date].push(event);
    }

    return map;
  }, [events]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(todayKey);
  };

  const addEvent = () => {
    if (!title.trim() || !selectedDate) return;

    setEvents((prev) => [
      ...prev,
      {
        title: title.trim(),
        date: selectedDate,
      },
    ]);

    setTitle("");
  };

  const removeEvent = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedDateLabel = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);

    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const selectedDateEvents = eventsByDate[selectedDate] ?? [];

  const monthEventCount = events.filter((e) =>
    e.date.startsWith(
      `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`
    )
  ).length;

  const miniGrid = grid;

  return (
    <main className="min-h-screen bg-[#0b0f1a] p-6 text-white sm:p-10">
      <div className="mb-8">
        {/* Dashboard Navigation */}
        <DashboardButton />

        <h1 className="mb-2 text-4xl font-bold">
          Calendar
        </h1>

        <p className="text-gray-400">
          Schedule and manage your events.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">

        {/* Main calendar */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                Today
              </button>

              <button
                onClick={goToPrevMonth}
                aria-label="Previous month"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
              >
                ‹
              </button>

              <button
                onClick={goToNextMonth}
                aria-label="Next month"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {grid.map((cell, i) => {
              const key = toKey(
                cell.year,
                cell.month,
                cell.day
              );

              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const dayEvents = eventsByDate[key] ?? [];

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(key)}
                  className={[
                    "flex min-h-[84px] flex-col items-start rounded-2xl border p-2 text-left transition",
                    cell.inCurrentMonth
                      ? "bg-white/[0.03]"
                      : "bg-white/[0.01] opacity-40",
                    isSelected
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-white/10 hover:border-white/20 hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white"
                        : "text-gray-300",
                    ].join(" ")}
                  >
                    {cell.day}
                  </span>

                  <div className="mt-1 flex w-full flex-col gap-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <span
                        key={idx}
                        className="truncate rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[11px] text-blue-200"
                      >
                        {event.title}
                      </span>
                    ))}

                    {dayEvents.length > 2 && (
                      <span className="text-[11px] text-gray-500">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Mini calendar */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-1">
                  {day[0]}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {miniGrid.map((cell, i) => {
                const key = toKey(
                  cell.year,
                  cell.month,
                  cell.day
                );

                const isToday = key === todayKey;
                const isSelected = key === selectedDate;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(key)}
                    className={[
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs",
                      !cell.inCurrentMonth
                        ? "text-gray-600"
                        : "text-gray-200",
                      isToday
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white"
                        : "",
                      isSelected && !isToday
                        ? "border border-blue-400"
                        : "",
                    ].join(" ")}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">
              Events this month
            </p>

            <p className="mt-1 text-3xl font-bold">
              {monthEventCount}
            </p>
          </div>

          {/* Selected day + add event */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="mb-1 text-sm text-gray-400">
              Selected date
            </p>

            <p className="mb-4 text-sm font-semibold">
              {selectedDateLabel}
            </p>

            <div className="mb-4 flex flex-col gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && addEvent()
                }
                placeholder="Event title"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />

              <button
                onClick={addEvent}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold"
              >
                Add Event
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {selectedDateEvents.length === 0 && (
                <p className="text-sm text-gray-500">
                  No events on this date.
                </p>
              )}

              {selectedDateEvents.map((event, index) => {
                const globalIndex = events.indexOf(event);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm">
                      {event.title}
                    </span>

                    <button
                      onClick={() => removeEvent(globalIndex)}
                      aria-label={`Remove ${event.title}`}
                      className="text-gray-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}