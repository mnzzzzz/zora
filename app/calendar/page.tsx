"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Sparkles,
  X,
  Command,
  Zap,
  Check,
} from "lucide-react";
import FloatingSidebar from "@/components/floatingsidebar";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("zora-calendar-events") ||
        localStorage.getItem("calendar-events");

      if (saved) {
        setEvents(JSON.parse(saved));
      }
    } catch {
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "zora-calendar-events",
      JSON.stringify(events)
    );

    localStorage.setItem(
      "calendar-events",
      JSON.stringify(events)
    );
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
  });

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const selectedDateKey = getDateKey(selectedDate);
  const todayKey = getDateKey(new Date());

  const selectedEvents = events
    .filter((event) => event.date === selectedDateKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  const createEvent = () => {
    if (!title.trim() || !time) return;

    const newEvent: CalendarEvent = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      date: selectedDateKey,
      time,
      description: description.trim() || undefined,
    };

    setEvents((current) => [...current, newEvent]);

    setTitle("");
    setTime("");
    setDescription("");
    setShowCreate(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((current) =>
      current.filter((event) => event.id !== id)
    );
  };

  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const currentDateText = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <FloatingSidebar />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          px-4
          py-5
          sm:px-5
          md:pl-[205px]
          md:pr-6
          lg:pl-[220px]
          lg:pr-7
          xl:pl-[225px]
          xl:pr-8
        "
      >
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">

          {/* HEADER */}

          <header className="mb-5 overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1525]/90 backdrop-blur-2xl">
            <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <CalendarDays
                      className="text-cyan-300"
                      size={20}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
                      ZORA / CALENDAR
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600">
                      Command center
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Calendar
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Everything important, exactly when you need it.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-right md:block">
                  <p className="font-mono text-base font-semibold text-cyan-300">
                    {currentTime}
                  </p>

                  <p className="text-[10px] text-slate-600">
                    {currentDateText}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToday}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setShowCreate(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-bold shadow-[0_0_25px_rgba(34,211,238,0.12)] transition hover:scale-[1.02]"
                >
                  <Plus size={16} />
                  Add event
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-5 py-2.5 text-[10px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.8)]" />
              Zora calendar system online

              <span className="ml-auto hidden font-mono text-slate-700 md:block">
                LOCAL STORAGE
              </span>
            </div>
          </header>

          {/* COMMAND PANEL */}

          <section className="mb-5 rounded-[22px] border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.06] via-blue-500/[0.04] to-transparent p-4 backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                <Sparkles
                  size={18}
                  className="text-cyan-300"
                />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Zora Command
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your calendar is ready. Add events when you need them.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDate(new Date());
                  setShowCreate(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                <Command size={14} />
                Create event
              </button>
            </div>
          </section>

          {/* MAIN */}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">

            {/* CALENDAR */}

            <section className="min-w-0 rounded-[26px] border border-white/10 bg-[#0b1525]/90 p-5 backdrop-blur-2xl md:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                    Timeline
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {monthName} {year}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousMonth}
                    aria-label="Previous month"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:bg-white/10 hover:text-white"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={nextMonth}
                    aria-label="Next month"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:bg-white/10 hover:text-white"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-7">
                {[
                  "SUN",
                  "MON",
                  "TUE",
                  "WED",
                  "THU",
                  "FRI",
                  "SAT",
                ].map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-[9px] font-semibold tracking-[0.2em] text-slate-700"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-white/10">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[92px] border-b border-r border-white/5 bg-black/10"
                      />
                    );
                  }

                  const date = new Date(year, month, day);
                  const key = getDateKey(date);

                  const dayEvents = events.filter(
                    (event) => event.date === key
                  );

                  const isToday = key === todayKey;
                  const isSelected = key === selectedDateKey;

                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={`group relative min-h-[92px] min-w-0 border-b border-r border-white/5 p-2 text-left transition ${
                        isSelected
                          ? "bg-cyan-400/[0.08]"
                          : "bg-white/[0.01] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                          isToday
                            ? "bg-cyan-400 text-[#04111b] shadow-[0_0_15px_rgba(34,211,238,.3)]"
                            : "text-slate-500 group-hover:text-white"
                        }`}
                      >
                        {day}
                      </div>

                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="truncate rounded-md border border-cyan-400/10 bg-cyan-400/10 px-1.5 py-1 text-[9px] text-cyan-300"
                          >
                            {event.title}
                          </div>
                        ))}

                        {dayEvents.length > 2 && (
                          <p className="px-1 text-[9px] text-slate-700">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* SIDE PANEL */}

            <aside className="min-w-0 space-y-5">

              <section className="rounded-[26px] border border-white/10 bg-[#0b1525]/90 p-5 backdrop-blur-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
                      Selected date
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      {selectedDate.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </h2>
                  </div>

                  <Clock3
                    className="text-cyan-400"
                    size={18}
                  />
                </div>

                {selectedEvents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-7 text-center">
                    <CalendarDays
                      size={23}
                      className="mx-auto mb-3 text-slate-700"
                    />

                    <p className="text-xs font-medium text-slate-500">
                      Nothing scheduled
                    </p>

                    <p className="mt-1 text-[10px] text-slate-700">
                      This day is currently clear.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowCreate(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2 text-[10px] font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                      <Plus size={13} />
                      Add event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="group rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-cyan-400/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words text-xs font-semibold text-white">
                              {event.title}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400">
                              <Clock3 size={11} />
                              {event.time}
                            </p>

                            {event.description && (
                              <p className="mt-2 break-words text-[10px] leading-5 text-slate-600">
                                {event.description}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteEvent(event.id)}
                            className="shrink-0 opacity-0 transition group-hover:opacity-100"
                            aria-label={`Delete ${event.title}`}
                          >
                            <X
                              size={14}
                              className="text-slate-700 hover:text-red-400"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* SYSTEM STATUS */}

              <section className="rounded-[26px] border border-white/10 bg-[#0b1525]/90 p-5 backdrop-blur-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                    <Zap
                      size={16}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      Calendar system
                    </p>

                    <p className="text-[10px] text-slate-700">
                      Local workspace
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">
                      Events stored
                    </span>

                    <span className="font-mono text-slate-400">
                      {events.length}
                    </span>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">
                      Storage
                    </span>

                    <span className="flex items-center gap-1 text-cyan-400">
                      <Check size={12} />
                      Local
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>

        {/* CREATE EVENT */}

        {showCreate && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-5 backdrop-blur-md"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowCreate(false);
              }
            }}
          >
            <div className="w-full max-w-[460px] rounded-[26px] border border-white/10 bg-[#0b1525] p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    New event
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Add to calendar
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-600 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[10px] font-medium text-slate-500">
                    Event name
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you need to remember?"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-medium text-slate-500">
                    Time
                  </label>

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs text-white outline-none focus:border-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-medium text-slate-500">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional details..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/40"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-xs font-semibold text-slate-500 transition hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={createEvent}
                    disabled={!title.trim() || !time}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={15} />
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}