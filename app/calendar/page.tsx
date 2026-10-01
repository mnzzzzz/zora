"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import FloatingSidebar from "@/components/floatingsidebar";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
};

type MonoblocCalendarAction =
  | {
      type: "create";
      title: string;
      date: string;
      time: string;
      description?: string;
    }
  | {
      type: "delete";
      title: string;
      date?: string;
    }
  | {
      type: "list";
    }
  | {
      type: "none";
    };

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function cleanJson(text: string) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2000, 0, 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [description, setDescription] = useState("");

  const [now, setNow] = useState(new Date());

  const [monoblocPrompt, setMonoblocPrompt] = useState("");
  const [monoblocReply, setMonoblocReply] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const [pendingAction, setPendingAction] =
    useState<MonoblocCalendarAction | null>(null);

  useEffect(() => {
    const current = new Date();

    setCurrentDate(current);
    setSelectedDate(current);
    setNow(current);

    try {
      const stored =
        localStorage.getItem("Monobloc-calendar-events") ||
        localStorage.getItem("calendar-events");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setEvents(parsed);
        }
      }
    } catch {
      console.error("Failed to load calendar events");
    }

    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("Monobloc-calendar-events", JSON.stringify(events));
      localStorage.setItem("calendar-events", JSON.stringify(events));
    } catch {
      console.error("Failed to save calendar events");
    }
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
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

  const selectedDateKey = getDateKey(selectedDate);
  const todayKey = getDateKey(now);

  const selectedEvents = useMemo(() => {
    return events
      .filter((event) => event.date === selectedDateKey)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [events, selectedDateKey]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((event) => {
        return event.date >= todayKey;
      })
      .sort((a, b) => {
        const first = `${a.date} ${a.time}`;
        const second = `${b.date} ${b.time}`;

        return first.localeCompare(second);
      })
      .slice(0, 3);
  }, [events, todayKey]);

  const createEvent = () => {
    if (!title.trim()) return;

    const event: CalendarEvent = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      date: selectedDateKey,
      time,
      description: description.trim() || undefined,
    };

    setEvents((prev) => [...prev, event]);

    setTitle("");
    setTime("09:00");
    setDescription("");
    setShowCreate(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const sendToMonobloc = async () => {
    const prompt = monoblocPrompt.trim();

    if (!prompt || isThinking) return;

    setIsThinking(true);
    setMonoblocReply("");
    setPendingAction(null);

    const calendarContext = {
      today: getDateKey(now),
      currentTime: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      events: events.map((event) => ({
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description || "",
      })),
    };

    const systemInstruction = `
You are Monobloc Calendar Intelligence.

You help the user manage their calendar.

Today's date is ${calendarContext.today}.
Current time is ${calendarContext.currentTime}.

Existing calendar events:
${JSON.stringify(calendarContext.events, null, 2)}

The user request is:
"${prompt}"

Return ONLY valid JSON using exactly this structure:

{
  "reply": "short natural-language response",
  "action": {
    "type": "create" | "delete" | "list" | "none",
    "title": "",
    "date": "",
    "time": "",
    "description": ""
  }
}

Rules:

1. For creating an event:
- type must be "create"
- provide title
- provide date as YYYY-MM-DD
- provide time as HH:MM
- description can be empty

2. For deleting an event:
- type must be "delete"
- title should identify the event
- date can be provided if known

3. For listing calendar information:
- type must be "list"

4. For normal conversation:
- type must be "none"

Never invent existing events.
If the user asks for a date relative to today, calculate it correctly.
Keep reply concise.
`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: systemInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();

      const raw =
        data?.text ||
        data?.response ||
        data?.content ||
        data?.message ||
        "";

      const parsed = JSON.parse(cleanJson(raw));

      const action: MonoblocCalendarAction = parsed.action || {
        type: "none",
      };

      setMonoblocReply(
        parsed.reply || "I processed your calendar request."
      );

      if (action.type === "create" || action.type === "delete") {
        setPendingAction(action);
      }
    } catch (error) {
      console.error(error);

      setMonoblocReply(
        "I couldn't process that request right now. Try again."
      );
    } finally {
      setIsThinking(false);
    }
  };

  const confirmMonoblocAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "create") {
      const newEvent: CalendarEvent = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        title: pendingAction.title,
        date: pendingAction.date,
        time: pendingAction.time,
        description: pendingAction.description || undefined,
      };

      setEvents((prev) => [...prev, newEvent]);

      const createdDate = new Date(
        `${pendingAction.date}T${pendingAction.time || "00:00"}`
      );

      if (!Number.isNaN(createdDate.getTime())) {
        setSelectedDate(createdDate);
        setCurrentDate(createdDate);
      }

      setMonoblocReply(
        `Added "${pendingAction.title}" to your calendar.`
      );
    }

    if (pendingAction.type === "delete") {
      const normalizedTitle = pendingAction.title
        .toLowerCase()
        .trim();

      let deleted = false;

      setEvents((prev) => {
        const next = prev.filter((event) => {
          const titleMatches =
            event.title.toLowerCase().includes(normalizedTitle) ||
            normalizedTitle.includes(event.title.toLowerCase());

          const dateMatches =
            !pendingAction.date || event.date === pendingAction.date;

          if (titleMatches && dateMatches && !deleted) {
            deleted = true;
            return false;
          }

          return true;
        });

        return next;
      });

      setMonoblocReply(
        deleted
          ? `Removed "${pendingAction.title}" from your calendar.`
          : `I couldn't find an event matching "${pendingAction.title}".`
      );
    }

    setPendingAction(null);
  };

  const cancelMonoblocAction = () => {
    setPendingAction(null);
    setMonoblocReply("Action cancelled.");
  };

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingSidebar />

      <main className="min-h-screen pl-0 lg:pl-[76px]">
        <div className="min-h-screen bg-black">
          {/* HEADER */}
          <header className="border-b border-white/[0.07] px-6 py-5 lg:px-10">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[#080808]">
                  <CalendarDays size={19} strokeWidth={1.7} />
                </div>

                <div>
                  <div className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                    Monobloc
                  </div>

                  <h1 className="text-xl font-semibold tracking-tight">
                    Calendar
                  </h1>

                  <p className="mt-0.5 text-xs text-neutral-500">
                    Your schedule, organized by Monobloc.
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-7 md:flex">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-xs text-neutral-500">
                    <Clock3 size={13} />
                    Local time
                  </div>

                  <div className="mt-1 text-sm font-medium text-neutral-200">
                    {formattedTime}
                  </div>
                </div>

                <div className="h-8 w-px bg-white/[0.08]" />

                <div className="text-right">
                  <div className="text-xs text-neutral-500">Today</div>

                  <div className="mt-1 text-sm font-medium text-neutral-200">
                    {formattedDate}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#080808] text-neutral-400 transition hover:border-white/[0.15] hover:bg-[#111111] hover:text-white"
                >
                  <Bell size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                <Plus size={16} />
                Add Event
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] px-6 py-7 lg:px-10">
            {/* METRICS */}
            <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MetricCard
                label="Events"
                value={events.length}
                icon={<CalendarDays size={15} />}
              />

              <MetricCard
                label="Today"
                value={
                  events.filter((event) => event.date === todayKey).length
                }
                icon={<Clock3 size={15} />}
              />

              <MetricCard
                label="Upcoming"
                value={upcomingEvents.length}
                icon={<ArrowRight size={15} />}
              />

              <MetricCard
                label="System"
                value="Ready"
                icon={<Zap size={15} />}
              />
            </section>

            {/* MONOBLOC INTELLIGENCE */}
            <section className="mb-7 rounded-2xl border border-white/[0.07] bg-[#050505] p-5">
              <div className="mb-4 flex items-start justify-between gap-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#0A0A0A]">
                    <Sparkles size={16} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium">
                        Monobloc Intelligence
                      </h2>

                      <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[9px] uppercase tracking-wider text-neutral-500">
                        AI
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-neutral-500">
                      Tell Monobloc what you need to schedule.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    value={monoblocPrompt}
                    onChange={(event) =>
                      setMonoblocPrompt(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        sendToMonobloc();
                      }
                    }}
                    placeholder='Try "Schedule a meeting tomorrow at 4pm"...'
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0A0A0A] px-4 pr-12 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-white/[0.18]"
                  />

                  <button
                    type="button"
                    onClick={sendToMonobloc}
                    disabled={!monoblocPrompt.trim() || isThinking}
                    className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-white text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
                  >
                    {isThinking ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "What's on my calendar today?",
                  "Schedule a meeting tomorrow at 4pm",
                  "Delete my meeting tomorrow",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setMonoblocPrompt(example)}
                    className="rounded-md border border-white/[0.06] bg-[#080808] px-3 py-1.5 text-[11px] text-neutral-500 transition hover:border-white/[0.12] hover:bg-[#111111] hover:text-neutral-300"
                  >
                    {example}
                  </button>
                ))}
              </div>

              {monoblocReply && (
                <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#080808] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Sparkles size={14} className="text-neutral-400" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm leading-6 text-neutral-300">
                        {monoblocReply}
                      </p>

                      {pendingAction &&
                        (pendingAction.type === "create" ||
                          pendingAction.type === "delete") && (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={confirmMonoblocAction}
                              className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-neutral-200"
                            >
                              <Check size={13} />
                              Confirm
                            </button>

                            <button
                              type="button"
                              onClick={cancelMonoblocAction}
                              className="rounded-md border border-white/[0.08] px-3 py-2 text-xs text-neutral-400 transition hover:bg-[#111111] hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* UPCOMING */}
            <section className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">Upcoming</h2>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    Your next scheduled events.
                  </p>
                </div>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.07] bg-[#050505] px-5 py-8 text-center">
                  <CalendarDays
                    size={18}
                    className="mx-auto mb-2 text-neutral-700"
                  />
                  <p className="text-xs text-neutral-600">
                    No upcoming events.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => {
                        const date = new Date(`${event.date}T${event.time}`);

                        if (!Number.isNaN(date.getTime())) {
                          setSelectedDate(date);
                          setCurrentDate(date);
                        }
                      }}
                      className="group rounded-xl border border-white/[0.07] bg-[#050505] p-4 text-left transition hover:border-white/[0.13] hover:bg-[#080808]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">
                          {event.date}
                        </span>

                        <span className="text-xs text-neutral-500">
                          {event.time}
                        </span>
                      </div>

                      <div className="truncate text-sm font-medium text-neutral-200">
                        {event.title}
                      </div>

                      {event.description && (
                        <p className="mt-1 truncate text-xs text-neutral-600">
                          {event.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* CALENDAR + SIDE PANEL */}
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
              {/* CALENDAR */}
              <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050505]">
                <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      {monthName} {year}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-600">
                      Select a date to view or manage events.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={goToday}
                      className="mr-2 rounded-md border border-white/[0.07] px-3 py-2 text-xs text-neutral-400 transition hover:bg-[#111111] hover:text-white"
                    >
                      Today
                    </button>

                    <button
                      type="button"
                      onClick={previousMonth}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.07] text-neutral-500 transition hover:bg-[#111111] hover:text-white"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={nextMonth}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.07] text-neutral-500 transition hover:bg-[#111111] hover:text-white"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b border-white/[0.07]">
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
                      className="border-r border-white/[0.05] px-2 py-3 text-center text-[9px] font-medium tracking-[0.15em] text-neutral-600 last:border-r-0"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-[105px] border-b border-r border-white/[0.05] bg-[#020202]"
                        />
                      );
                    }

                    const date = new Date(year, month, day);
                    const dateKey = getDateKey(date);

                    const dayEvents = events
                      .filter((event) => event.date === dateKey)
                      .sort((a, b) =>
                        a.time.localeCompare(b.time)
                      );

                    const isToday = dateKey === todayKey;
                    const isSelected = dateKey === selectedDateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`group relative min-h-[105px] border-b border-r border-white/[0.05] p-2 text-left transition ${
                          isSelected
                            ? "bg-[#0A0A0A]"
                            : "bg-black hover:bg-[#080808]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                              isToday
                                ? "bg-white font-semibold text-black"
                                : isSelected
                                ? "border border-white/[0.12] text-white"
                                : "text-neutral-500 group-hover:text-neutral-300"
                            }`}
                          >
                            {day}
                          </span>

                          {dayEvents.length > 0 && (
                            <span className="text-[9px] text-neutral-700">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="truncate rounded border border-white/[0.06] bg-[#0A0A0A] px-1.5 py-1 text-[9px] text-neutral-400"
                            >
                              <span className="mr-1 text-neutral-600">
                                {event.time}
                              </span>
                              {event.title}
                            </div>
                          ))}

                          {dayEvents.length > 3 && (
                            <div className="px-1.5 text-[9px] text-neutral-700">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* RIGHT PANEL */}
              <aside className="space-y-5">
                {/* SELECTED DATE */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#050505] p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                        Selected date
                      </div>

                      <h3 className="mt-1 text-base font-medium">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCreate(true)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.07] text-neutral-400 transition hover:bg-[#111111] hover:text-white"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {selectedEvents.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/[0.07] px-4 py-7 text-center">
                      <p className="text-xs text-neutral-600">
                        Nothing scheduled.
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowCreate(true)}
                        className="mt-3 text-xs text-neutral-400 underline underline-offset-4 hover:text-white"
                      >
                        Create an event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedEvents.map((event) => (
                        <div
                          key={event.id}
                          className="group rounded-lg border border-white/[0.06] bg-[#080808] p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-medium text-neutral-200">
                                    {event.title}
                                  </div>

                                  <div className="mt-1 text-[10px] text-neutral-600">
                                    {event.time}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => deleteEvent(event.id)}
                                  className="opacity-0 transition group-hover:opacity-100"
                                >
                                  <Trash2
                                    size={13}
                                    className="text-red-400/70 hover:text-red-400"
                                  />
                                </button>
                              </div>

                              {event.description && (
                                <p className="mt-2 text-[10px] leading-4 text-neutral-600">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* SYSTEM STATUS */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#050505] p-5">
                  <div className="mb-4 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                    System status
                  </div>

                  <div className="space-y-3">
                    <StatusRow
                      label="Calendar"
                      value="Synced"
                      active
                    />

                    <StatusRow
                      label="Local storage"
                      value="Connected"
                      active
                    />

                    <StatusRow
                      label="Monobloc AI"
                      value={isThinking ? "Thinking" : "Ready"}
                      active={!isThinking}
                    />
                  </div>
                </section>

                {/* QUICK NAVIGATION */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#050505] p-5">
                  <div className="mb-4 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                    Quick navigation
                  </div>

                  <div className="space-y-1">
                    <QuickLink
                      label="Previous month"
                      icon={<ArrowLeft size={13} />}
                      onClick={previousMonth}
                    />

                    <QuickLink
                      label="Today"
                      icon={<CalendarDays size={13} />}
                      onClick={goToday}
                    />

                    <QuickLink
                      label="Next month"
                      icon={<ArrowRight size={13} />}
                      onClick={nextMonth}
                    />
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE EVENT MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#080808] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div>
                <h2 className="text-sm font-medium">Create event</h2>

                <p className="mt-1 text-xs text-neutral-600">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-[#111111] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  autoFocus
                  placeholder="Event title"
                  className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0A0A0A] px-3 text-sm text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Time
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-white/[0.18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={3}
                  placeholder="Optional description"
                  className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0A0A0A] px-3 py-3 text-sm text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.18]"
                />
              </div>

              <button
                type="button"
                onClick={createEvent}
                disabled={!title.trim()}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
              >
                <Check size={15} />
                Create event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#050505] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600">
          {label}
        </span>

        <span className="text-neutral-600">{icon}</span>
      </div>

      <div className="mt-3 text-xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">{label}</span>

      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active ? "bg-white" : "bg-neutral-700"
          }`}
        />

        <span className="text-[10px] text-neutral-600">
          {value}
        </span>
      </div>
    </div>
  );
}

function QuickLink({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-neutral-500 transition hover:bg-[#0A0A0A] hover:text-white"
    >
      <span className="text-neutral-600">{icon}</span>
      {label}
    </button>
  );
}