"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Clock3,
  X,
  ArrowLeft,
} from "lucide-react";

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  /* =====================================================
     DATE HELPERS
  ===================================================== */

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const selectedDateKey = formatDateKey(selectedDate);

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  /* =====================================================
     CALENDAR DAYS
  ===================================================== */

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentDate]);

  /* =====================================================
     EVENTS FOR SELECTED DAY
  ===================================================== */

  const selectedEvents = events
    .filter((event) => event.date === selectedDateKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  /* =====================================================
     UPCOMING EVENTS
  ===================================================== */

  const upcomingEvents = [...events]
    .filter((event) => !event.completed)
    .sort((a, b) => {
      return `${a.date}${a.time}`.localeCompare(
        `${b.date}${b.time}`
      );
    })
    .slice(0, 5);

  /* =====================================================
     MONTH NAVIGATION
  ===================================================== */

  const changeMonth = (amount: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + amount,
        1
      )
    );
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  /* =====================================================
     ADD EVENT
  ===================================================== */

  const addEvent = () => {
    if (!eventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: eventTitle.trim(),
      date: selectedDateKey,
      time: eventTime || "00:00",
      description: eventDescription.trim(),
      completed: false,
    };

    setEvents((current) => [...current, newEvent]);

    setEventTitle("");
    setEventTime("");
    setEventDescription("");

    setShowModal(false);
  };

  /* =====================================================
     DELETE EVENT
  ===================================================== */

  const deleteEvent = (id: number) => {
    setEvents((current) =>
      current.filter((event) => event.id !== id)
    );
  };

  /* =====================================================
     COMPLETE EVENT
  ===================================================== */

  const toggleEvent = (id: number) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              completed: !event.completed,
            }
          : event
      )
    );
  };

  /* =====================================================
     FORMAT SELECTED DATE
  ===================================================== */

  const selectedDateLabel = selectedDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen px-5 py-6 text-white sm:px-7 lg:px-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="mb-6 rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]">

              <CalendarDays size={25} />

            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Zora Calendar
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Calendar
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Plan your time. Make it count.
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
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold transition hover:scale-[1.02]"
            >
              <Plus size={17} />
              Add event
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">

        {/* =================================================
            CALENDAR
        ================================================= */}

        <section className="rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-5 backdrop-blur-xl sm:p-7">

          {/* Calendar navigation */}

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                {monthName}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Select a day to view your schedule.
              </p>

            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={goToday}
                className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
              >
                Today
              </button>

              <button
                onClick={() => changeMonth(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => changeMonth(1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

          {/* Weekdays */}

          <div className="mb-2 grid grid-cols-7">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                {day}
              </div>
            ))}

          </div>

          {/* Days */}

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

            {calendarDays.map((day, index) => {

              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[70px] rounded-xl sm:min-h-[90px]"
                  />
                );
              }

              const dayKey = formatDateKey(day);

              const dayEvents = events.filter(
                (event) => event.date === dayKey
              );

              const isSelected =
                dayKey === selectedDateKey;

              const isToday =
                dayKey === formatDateKey(new Date());

              return (
                <button
                  key={dayKey}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative
                    min-h-[70px]
                    rounded-xl
                    border
                    p-2
                    text-left
                    transition
                    sm:min-h-[90px]
                    ${
                      isSelected
                        ? "border-cyan-400/40 bg-cyan-400/[0.08]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }
                  `}
                >

                  {/* Date number */}

                  <div
                    className={`
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      text-xs
                      font-semibold
                      ${
                        isToday
                          ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                          : isSelected
                          ? "text-cyan-300"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {day.getDate()}
                  </div>

                  {/* Event indicators */}

                  <div className="mt-2 space-y-1">

                    {dayEvents
                      .slice(0, 2)
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`
                            truncate
                            rounded-md
                            px-1.5
                            py-1
                            text-[9px]
                            ${
                              event.completed
                                ? "bg-slate-700/40 text-slate-600 line-through"
                                : "bg-cyan-400/10 text-cyan-300"
                            }
                          `}
                        >
                          {event.title}
                        </div>
                      ))}

                    {dayEvents.length > 2 && (
                      <p className="px-1 text-[9px] text-slate-600">
                        +{dayEvents.length - 2} more
                      </p>
                    )}

                  </div>

                </button>
              );
            })}

          </div>

        </section>

        {/* =================================================
            SELECTED DAY
        ================================================= */}

        <section className="rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

          <div className="mb-6">

            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              Selected day
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {selectedDateLabel}
            </h2>

          </div>

          {/* Add event */}

          <button
            onClick={() => setShowModal(true)}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-cyan-400/20 bg-cyan-400/[0.04] py-4 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.07]"
          >
            <Plus size={17} />
            Add event to this day
          </button>

          {/* Events */}

          {selectedEvents.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">

              <Clock3
                size={28}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-400">
                Nothing scheduled.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Your day is wide open.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {selectedEvents.map((event) => (

                <div
                  key={event.id}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                >

                  <div className="flex items-start gap-3">

                    <button
                      onClick={() => toggleEvent(event.id)}
                      className="mt-0.5 shrink-0"
                    >
                      <CheckCircle2
                        size={20}
                        className={
                          event.completed
                            ? "text-cyan-400"
                            : "text-slate-600 transition hover:text-cyan-400"
                        }
                      />
                    </button>

                    <div className="min-w-0 flex-1">

                      <p
                        className={
                          event.completed
                            ? "font-semibold text-slate-600 line-through"
                            : "font-semibold text-white"
                        }
                      >
                        {event.title}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                        <Clock3 size={13} />

                        {event.time}

                      </div>

                      {event.description && (
                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          {event.description}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="rounded-lg p-2 text-slate-700 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

      {/* =================================================
          UPCOMING
      ================================================= */}

      <section className="mt-6 rounded-[30px] border border-white/10 bg-[#0b1422]/80 p-6 backdrop-blur-xl">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Your schedule
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Upcoming events
            </h2>

          </div>

          <CalendarDays
            size={20}
            className="text-slate-600"
          />

        </div>

        {upcomingEvents.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-7 text-center">

            <p className="text-sm text-slate-500">
              No upcoming events.
            </p>

            <p className="mt-1 text-xs text-slate-700">
              Add something to your calendar and it will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">

            {upcomingEvents.map((event) => (

              <button
                key={event.id}
                onClick={() => {
                  const date = new Date(
                    `${event.date}T00:00:00`
                  );

                  setSelectedDate(date);
                  setCurrentDate(date);
                }}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-semibold text-white">
                      {event.title}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(
                        `${event.date}T00:00:00`
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {event.time}
                    </p>

                  </div>

                  <ChevronRight
                    size={15}
                    className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                  />

                </div>

              </button>

            ))}

          </div>

        )}

      </section>

      {/* =================================================
          ADD EVENT MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[#0b1422] p-6 shadow-2xl">

            {/* Modal header */}

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                  New event
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Add to your calendar
                </h2>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            {/* Event title */}

            <div className="space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Event name
                </label>

                <input
                  autoFocus
                  value={eventTitle}
                  onChange={(e) =>
                    setEventTitle(e.target.value)
                  }
                  placeholder="What are you doing?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              {/* Time */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Time
                </label>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) =>
                    setEventTime(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/30"
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={eventDescription}
                  onChange={(e) =>
                    setEventDescription(e.target.value)
                  }
                  rows={3}
                  placeholder="Add some details..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

              </div>

              {/* Date */}

              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">

                <p className="text-xs text-slate-600">
                  Scheduled for
                </p>

                <p className="mt-1 text-sm font-medium text-slate-300">
                  {selectedDateLabel}
                </p>

              </div>

              {/* Buttons */}

              <div className="flex gap-3">

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={addEvent}
                  disabled={!eventTitle.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create event
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}