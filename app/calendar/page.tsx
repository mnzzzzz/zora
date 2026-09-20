"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
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
  Target,
  Trash2,
  X,
  Zap,
  Bot,
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
      action: "create";
      title: string;
      date: string;
      time: string;
      description?: string;
      reply: string;
    }
  | {
      action: "delete";
      eventTitle?: string;
      date?: string;
      reply: string;
    }
  | {
      action: "list";
      reply: string;
    }
  | {
      action: "none";
      reply: string;
    };

const getDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const cleanJson = (text: string) => {
  return text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(
    () => new Date(2000, 0, 1)
  );

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    () => new Date(2000, 0, 1)
  );

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const [now, setNow] = useState<Date | null>(null);

  const [monoblocPrompt, setMonoblocPrompt] = useState("");
  const [MonoblocReply, setMonoblocReply] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<MonoblocCalendarAction | null>(null);

  /*
   * HYDRATION-SAFE CLOCK
   */
  useEffect(() => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
    setNow(today);

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /*
   * LOAD EVENTS
   */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("Monobloc-calendar-events") ||
        localStorage.getItem("calendar-events");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setEvents(parsed);
        }
      }
    } catch {
      setEvents([]);
    }
  }, []);

  /*
   * SAVE EVENTS
   */
  useEffect(() => {
    localStorage.setItem(
      "Monobloc-calendar-events",
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

  const selectedDateKey = getDateKey(selectedDate);

  const todayKey = now
    ? getDateKey(now)
    : getDateKey(currentDate);

  const selectedEvents = events
    .filter((event) => event.date === selectedDateKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingEvents = [...events]
    .filter((event) => event.date >= todayKey)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);

      if (dateCompare !== 0) return dateCompare;

      return a.time.localeCompare(b.time);
    })
    .slice(0, 3);

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

  const sendToMonobloc = async () => {
    const userMessage = monoblocPrompt.trim();

    if (!userMessage || isThinking) return;

    setIsThinking(true);
    setMonoblocReply("");
    setPendingAction(null);

    const today = new Date();

    const calendarContext =
      events.length > 0
        ? events
            .sort((a, b) => {
              const dateCompare = a.date.localeCompare(b.date);

              if (dateCompare !== 0) return dateCompare;

              return a.time.localeCompare(b.time);
            })
            .map(
              (event) =>
                `- "${event.title}" on ${event.date} at ${event.time}${
                  event.description
                    ? ` — ${event.description}`
                    : ""
                }`
            )
            .join("\n")
        : "No events currently exist.";

    const aiMessage = `You are Monobloc Calendar AI.

IMPORTANT:
Today is ${getDateKey(today)}.
Current local time is ${today.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}.

Existing calendar events:
${calendarContext}

Return ONLY valid JSON.
Do not use Markdown.
Do not wrap the JSON in \`\`\`.

Use EXACTLY one of these formats:

For creating an event:
{
  "action": "create",
  "title": "Event title",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "description": "Optional description",
  "reply": "A short natural confirmation"
}

For deleting an event:
{
  "action": "delete",
  "eventTitle": "Name of event to delete",
  "date": "YYYY-MM-DD or empty string if unknown",
  "reply": "A short explanation"
}

For answering questions about the calendar:
{
  "action": "list",
  "reply": "Helpful answer based ONLY on the existing events"
}

If no calendar action should happen:
{
  "action": "none",
  "reply": "Helpful conversational response"
}

RULES:
- Interpret relative dates such as tomorrow, next Monday, this Friday using today's date.
- Dates MUST use YYYY-MM-DD.
- Times MUST use 24-hour HH:MM format.
- If the user does not specify a time when creating an event, use "09:00".
- Never invent existing events.
- Keep reply short and natural.
- Do not include any text outside JSON.

User request:
${userMessage}`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: aiMessage,
        }),
      });

      const rawText = await response.text();

      let apiData: {
        response?: string;
        error?: string;
      };

      try {
        apiData = JSON.parse(rawText);
      } catch {
        console.error(
          "Monobloc API returned non-JSON:",
          rawText
        );

        setMonoblocReply(
          "Monobloc couldn't reach the AI system correctly. The API returned an invalid response."
        );

        return;
      }

      if (!response.ok) {
        setMonoblocReply(
          apiData.error ||
            "Monobloc couldn't complete that request."
        );

        return;
      }

      if (!apiData.response) {
        setMonoblocReply(
          "Monobloc received an empty response."
        );

        return;
      }

      let action: MonoblocCalendarAction;

      try {
        action = JSON.parse(
          cleanJson(apiData.response)
        ) as MonoblocCalendarAction;
      } catch {
        console.error(
          "Could not parse Monobloc calendar response:",
          apiData.response
        );

        setMonoblocReply(apiData.response);

        return;
      }

      setMonoblocReply(action.reply || "Done.");

      if (action.action === "create") {
        if (
          !action.title ||
          !action.date ||
          !action.time
        ) {
          setMonoblocReply(
            "I understood that you want to create an event, but some details were missing."
          );

          return;
        }

        setPendingAction(action);

        const eventDate = new Date(
          `${action.date}T12:00:00`
        );

        if (!Number.isNaN(eventDate.getTime())) {
          setSelectedDate(eventDate);
          setCurrentDate(eventDate);
        }
      }

      if (action.action === "delete") {
        setPendingAction(action);
      }
    } catch (error) {
      console.error(
        "Monobloc calendar error:",
        error
      );

      setMonoblocReply(
        "Connection error. Monobloc couldn't complete that request."
      );
    } finally {
      setIsThinking(false);
    }
  };

  const confirmMonoblocAction = () => {
    if (!pendingAction) return;

    if (pendingAction.action === "create") {
      const newEvent: CalendarEvent = {
        id:
          typeof crypto !== "undefined" &&
          crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        title: pendingAction.title,
        date: pendingAction.date,
        time: pendingAction.time,
        description:
          pendingAction.description?.trim() ||
          undefined,
      };

      setEvents((current) => [
        ...current,
        newEvent,
      ]);

      const eventDate = new Date(
        `${pendingAction.date}T12:00:00`
      );

      if (!Number.isNaN(eventDate.getTime())) {
        setSelectedDate(eventDate);
        setCurrentDate(eventDate);
      }

      setMonoblocReply(
        `Done — **${pendingAction.title}** is now on your calendar.`
      );
    }

    if (pendingAction.action === "delete") {
      const targetTitle =
        pendingAction.eventTitle
          ?.trim()
          .toLowerCase();

      if (!targetTitle) {
        setMonoblocReply(
          "I couldn't determine which event you wanted to delete."
        );

        setPendingAction(null);

        return;
      }

      const matches = events.filter((event) => {
        const titleLower =
          event.title.toLowerCase();

        const titleMatches =
          titleLower === targetTitle ||
          titleLower.includes(targetTitle) ||
          targetTitle.includes(titleLower);

        const dateMatches =
          !pendingAction.date ||
          event.date === pendingAction.date;

        return titleMatches && dateMatches;
      });

      if (matches.length === 0) {
        setMonoblocReply(
          `I couldn't find a matching event called "${pendingAction.eventTitle}".`
        );

        setPendingAction(null);

        return;
      }

      const idsToDelete = new Set(
        matches.map((event) => event.id)
      );

      setEvents((current) =>
        current.filter(
          (event) => !idsToDelete.has(event.id)
        )
      );

      setMonoblocReply(
        `Done — removed ${matches.length} event${
          matches.length === 1 ? "" : "s"
        } from your calendar.`
      );
    }

    setPendingAction(null);
    setMonoblocPrompt("");
  };

  const cancelMonoblocAction = () => {
    setPendingAction(null);
    setMonoblocReply(
      "Okay, I didn't make any changes."
    );
  };

  const currentTime = now
    ? now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const currentDateText = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Loading...";

  return (
    <div className="relative min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      {/* FLOATING SIDEBAR */}
      <FloatingSidebar />

      {/* MAIN WORKSPACE */}
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 pl-20 shadow-2xl sm:pl-24">
        {/* HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-400">
                  Monobloc / CALENDAR
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Intelligent scheduling
                </p>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Calendar
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Stay organized. Monobloc keeps your schedule under control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-right lg:block">
              <p className="font-mono text-sm font-semibold text-purple-300">
                {currentTime}
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                {currentDateText}
              </p>
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedDate(new Date());
                setShowCreate(true);
              }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
            >
              <Plus size={16} />
              Add Event
            </button>

            <div className="ml-1 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="h-full w-full rounded-full bg-[#17151f]" />
              </div>

              <div className="text-left">
                <p className="text-xs font-medium text-white">
                  Monobloc User
                </p>

                <p className="text-[10px] text-slate-500">
                  user@Monobloc.app
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* METRICS */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<CalendarDays size={16} />}
            label="Events"
            value={String(events.length)}
            subtext="Total scheduled"
          />

          <MetricCard
            icon={<Clock3 size={16} />}
            label="Today"
            value={String(
              events.filter(
                (event) => event.date === todayKey
              ).length
            )}
            subtext="Today's events"
          />

          <MetricCard
            icon={<Activity size={16} />}
            label="Upcoming"
            value={String(
              events.filter(
                (event) => event.date >= todayKey
              ).length
            )}
            subtext="Future events"
          />

          <MetricCard
            icon={<Target size={16} />}
            label="System"
            value="ON"
            subtext="Calendar active"
          />
        </section>

        {/* AI PROGRESS / COMMAND BANNER */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#251f33] via-[#1b1924] to-[#181622] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  <Sparkles size={16} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Monobloc Intelligence
                </span>
              </div>

              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                Your schedule, handled by Monobloc.
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Ask Monobloc to create events, remove events, or tell you what is coming up.
              </p>

              <div className="mt-5 flex gap-2">
                <input
                  value={monoblocPrompt}
                  onChange={(e) =>
                    setMonoblocPrompt(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendToMonobloc();
                    }
                  }}
                  placeholder='Try: "Schedule physics tomorrow at 6 PM"'
                  disabled={isThinking}
                  className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#14131a] px-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/50 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={sendToMonobloc}
                  disabled={
                    !monoblocPrompt.trim() ||
                    isThinking
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {isThinking ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Schedule study tomorrow at 6 PM",
                  "What do I have this week?",
                  "Add a meeting Monday at 4 PM",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() =>
                      setMonoblocPrompt(example)
                    }
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>

              {(MonoblocReply || isThinking) && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#14131a] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <Bot size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-purple-400">
                        Monobloc
                      </p>

                      {isThinking ? (
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Loader2
                            size={13}
                            className="animate-spin text-purple-400"
                          />
                          Thinking through your schedule...
                        </div>
                      ) : (
                        <p className="mt-1 text-xs leading-6 text-slate-300">
                          {MonoblocReply}
                        </p>
                      )}

                      {pendingAction &&
                        !isThinking && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={
                                confirmMonoblocAction
                              }
                              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-[10px] font-semibold text-white transition hover:opacity-90"
                            >
                              <Check size={13} />
                              Confirm
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelMonoblocAction
                              }
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* UPCOMING SUMMARY */}
            <div className="min-w-[220px] lg:pr-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Upcoming
                </p>

                <CalendarDays
                  size={15}
                  className="text-purple-400"
                />
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
                  <p className="text-xs text-slate-500">
                    Nothing upcoming.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
                    >
                      <p className="truncate text-xs font-medium text-white">
                        {event.title}
                      </p>

                      <p className="mt-1 text-[10px] text-purple-400">
                        {event.date} · {event.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* CALENDAR */}
          <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6 xl:col-span-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={16}
                    className="text-purple-400"
                  />

                  <h3 className="text-sm font-semibold text-white">
                    Calendar
                  </h3>
                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  Select a date to view scheduled events.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToday}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={previousMonth}
                  aria-label="Previous month"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft size={15} />
                </button>

                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {monthName} {year}
              </h2>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-[10px] text-slate-500">
                  {events.length} events
                </span>
              </div>
            </div>

            {/* WEEKDAYS */}
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
                  className="py-2 text-center text-[9px] font-semibold tracking-[0.15em] text-slate-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* CALENDAR GRID */}
            <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-white/5">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[105px] border-b border-r border-white/5 bg-black/10"
                    />
                  );
                }

                const date = new Date(
                  year,
                  month,
                  day
                );

                const key = getDateKey(date);

                const dayEvents = events.filter(
                  (event) => event.date === key
                );

                const isToday =
                  key === todayKey;

                const isSelected =
                  key === selectedDateKey;

                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() =>
                      setSelectedDate(date)
                    }
                    className={`group relative min-h-[105px] min-w-0 border-b border-r border-white/5 p-2.5 text-left transition ${
                      isSelected
                        ? "bg-purple-500/[0.08]"
                        : "bg-white/[0.01] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition ${
                        isToday
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                          : isSelected
                          ? "bg-purple-500/10 text-purple-300"
                          : "text-slate-500 group-hover:text-white"
                      }`}
                    >
                      {day}
                    </div>

                    <div className="mt-2 space-y-1">
                      {dayEvents
                        .slice(0, 2)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="truncate rounded-md border border-purple-500/10 bg-purple-500/10 px-1.5 py-1 text-[9px] text-purple-300"
                          >
                            {event.title}
                          </div>
                        ))}

                      {dayEvents.length > 2 && (
                        <p className="px-1 text-[9px] text-slate-600">
                          +
                          {dayEvents.length - 2}{" "}
                          more
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="space-y-6 xl:col-span-4">
            {/* SELECTED DATE */}
            <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Selected Date
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-white">
                    {selectedDate.toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock3 size={17} />
                </div>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
                  <CalendarDays
                    size={25}
                    className="text-slate-600"
                  />

                  <p className="mt-3 text-xs font-medium text-slate-400">
                    Nothing scheduled
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    This day is currently clear.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCreate(true)
                    }
                    className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Add Event
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedEvents.map(
                    (event) => (
                      <div
                        key={event.id}
                        className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words text-xs font-semibold text-white">
                              {event.title}
                            </p>

                            <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-purple-400">
                              <Clock3 size={11} />
                              {event.time}
                            </p>

                            {event.description && (
                              <p className="mt-2 break-words text-[10px] leading-5 text-slate-500">
                                {event.description}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteEvent(
                                event.id
                              )
                            }
                            className="shrink-0 opacity-0 transition group-hover:opacity-100"
                            aria-label={`Delete ${event.title}`}
                          >
                            <Trash2
                              size={14}
                              className="text-slate-600 transition hover:text-rose-400"
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* SYSTEM STATUS */}
            <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Zap size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Calendar System
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    AI-assisted workspace
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <StatusRow
                  label="Calendar System"
                  value="ONLINE"
                  active
                />

                <StatusRow
                  label="Monobloc Intelligence"
                  value="ONLINE"
                  active
                />

                <StatusRow
                  label="Events Stored"
                  value={String(events.length)}
                  active={
                    events.length > 0
                  }
                />

                <StatusRow
                  label="Storage"
                  value="LOCAL"
                  active
                />
              </div>
            </section>

            {/* QUICK LINKS */}
            <section className="rounded-3xl border border-white/5 bg-[#1b1924] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Quick Navigation
                </h3>

                <ArrowRight
                  size={15}
                  className="text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <QuickLink
                  href="/tasks"
                  icon={<Target size={14} />}
                  label="Mission Control"
                />

                <QuickLink
                  href="/goals"
                  icon={<Target size={14} />}
                  label="Goals"
                />

                <QuickLink
                  href="/tutor"
                  icon={<Sparkles size={14} />}
                  label="Monobloc Tutor"
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreate(false);
            }
          }}
        >
          <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-[#1b1924] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-400">
                  New Event
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Add to Calendar
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-500 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-5 rounded-2xl border border-purple-500/10 bg-purple-500/[0.05] px-4 py-3">
              <p className="text-[10px] text-purple-300">
                Scheduling for{" "}
                {selectedDate.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Event Name
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="What do you need to remember?"
                  className="h-11 w-full rounded-2xl border border-white/10 bg-[#14131a] px-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Time
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                  className="h-11 w-full rounded-2xl border border-white/10 bg-[#14131a] px-4 text-xs text-white outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Optional details..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#14131a] p-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-purple-500/50"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createEvent}
                  disabled={
                    !title.trim() || !time
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={15} />
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1b1924] p-4 transition hover:bg-white/5">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300">
          {icon}
        </div>

        <span className="text-[10px] text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-400">
        {subtext}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span
        className={`text-xs font-semibold ${
          active
            ? "text-purple-400"
            : "text-slate-500"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      <span className="flex items-center gap-2">
        <span className="text-purple-400">
          {icon}
        </span>

        {label}
      </span>

      <ArrowRight size={13} />
    </a>
  );
}