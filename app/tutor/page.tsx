"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  FileText,
  Brain,
  Layers3,
  Send,
  Play,
  Clock3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Link as LinkIcon,
  Lightbulb,
  Timer,
  Pause,
  RotateCcw,
  Activity,
  Zap,
  Radio,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

const STUDY_TIME_KEY = "zora-study-time";
const STUDY_SESSION_KEY = "zora-study-session";

export default function TutorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [question, setQuestion] = useState("");

  const [summary, setSummary] = useState(
    "Paste a YouTube video above and Zora will turn it into clear, structured study material."
  );

  /* =========================================================
     STUDY TIMER
  ========================================================= */

  const [isStudying, setIsStudying] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [totalStudySeconds, setTotalStudySeconds] = useState(0);

  /*
    Load saved study time.
    Everything is stored locally for now.
  */
  useEffect(() => {
    const savedTotal = localStorage.getItem(STUDY_TIME_KEY);
    const savedSession = localStorage.getItem(STUDY_SESSION_KEY);

    if (savedTotal) {
      setTotalStudySeconds(Number(savedTotal) || 0);
    }

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);

        if (session?.startedAt) {
          const elapsed = Math.floor(
            (Date.now() - session.startedAt) / 1000
          );

          setSessionSeconds(Math.max(0, elapsed));
          setIsStudying(true);
        }
      } catch {
        localStorage.removeItem(STUDY_SESSION_KEY);
      }
    }
  }, []);

  /*
    Live timer.
  */
  useEffect(() => {
    if (!isStudying) return;

    const interval = window.setInterval(() => {
      setSessionSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isStudying]);

  /*
    Persist total study time whenever it changes.
  */
  useEffect(() => {
    localStorage.setItem(
      STUDY_TIME_KEY,
      String(totalStudySeconds)
    );
  }, [totalStudySeconds]);

  /*
    When the page is closed/refreshed while studying,
    calculate the current session from its start time.
  */
  useEffect(() => {
    const handleBeforeUnload = () => {
      const storedSession = localStorage.getItem(
        STUDY_SESSION_KEY
      );

      if (!storedSession) return;

      try {
        const session = JSON.parse(storedSession);

        if (session?.startedAt) {
          const elapsed = Math.floor(
            (Date.now() - session.startedAt) / 1000
          );

          const existingTotal =
            Number(localStorage.getItem(STUDY_TIME_KEY)) || 0;

          localStorage.setItem(
            STUDY_TIME_KEY,
            String(existingTotal + Math.max(0, elapsed))
          );
        }
      } catch {
        // Ignore malformed local storage.
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, []);

  function startStudy() {
    if (isStudying) return;

    localStorage.setItem(
      STUDY_SESSION_KEY,
      JSON.stringify({
        startedAt: Date.now() - sessionSeconds * 1000,
      })
    );

    setIsStudying(true);
  }

  function pauseStudy() {
    if (!isStudying) return;

    const storedSession = localStorage.getItem(
      STUDY_SESSION_KEY
    );

    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);

        if (session?.startedAt) {
          const elapsed = Math.floor(
            (Date.now() - session.startedAt) / 1000
          );

          setTotalStudySeconds(
            (current) => current + Math.max(0, elapsed)
          );
        }
      } catch {
        // Ignore malformed storage.
      }
    }

    localStorage.removeItem(STUDY_SESSION_KEY);
    setIsStudying(false);
  }

  function resetSession() {
    if (isStudying) {
      pauseStudy();
    }

    setSessionSeconds(0);
    localStorage.removeItem(STUDY_SESSION_KEY);
  }

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  const totalHours = Math.floor(totalStudySeconds / 3600);

  const totalMinutes = Math.floor(
    (totalStudySeconds % 3600) / 60
  );

  const totalDisplay =
    totalHours > 0
      ? `${totalHours}h ${totalMinutes}m`
      : `${totalMinutes}m`;

  /* =========================================================
     VIDEO ANALYSIS
  ========================================================= */

  async function analyzeVideo() {
    if (!youtubeUrl.trim()) return;

    setLoading(true);
    setAnalyzed(false);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: youtubeUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Tutor API unavailable");
      }

      const data = await response.json();

      setSummary(
        data.summary ||
          "Zora finished analyzing the video, but no summary was returned."
      );

      setAnalyzed(true);
    } catch {
      setSummary(
        "The Zora Tutor interface is ready. Connect the Tutor API to generate the real AI summary from this video."
      );

      setAnalyzed(true);
    } finally {
      setLoading(false);
    }
  }

  function askTutor() {
    if (!question.trim()) return;

    setQuestion("");
  }

  const systemStatus = useMemo(
    () => (isStudying ? "ACTIVE" : "STANDBY"),
    [isStudying]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-6 py-8 text-white">
      {/* =====================================================
          JARVIS ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />

        {/* HUD grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Sparkles
                  size={22}
                  className="text-cyan-300"
                />

                <div className="absolute inset-0 animate-ping rounded-2xl border border-cyan-400/20" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  ZORA INTELLIGENCE
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isStudying
                        ? "animate-pulse bg-emerald-400"
                        : "bg-cyan-400"
                    }`}
                  />

                  <span className="text-xs text-slate-500">
                    SYSTEM {systemStatus}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Zora Tutor
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Your intelligent study command center.
              Analyze lectures, extract concepts, ask questions,
              and track your learning time.
            </p>
          </div>

          {/* System telemetry */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Telemetry
              icon={<Cpu size={15} />}
              label="CORE"
              value="ONLINE"
            />

            <Telemetry
              icon={<Radio size={15} />}
              label="TUTOR"
              value="READY"
            />

            <Telemetry
              icon={<Activity size={15} />}
              label="SESSION"
              value={isStudying ? "LIVE" : "IDLE"}
            />
          </div>
        </div>

        {/* =====================================================
            STUDY COMMAND DECK
        ===================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-[32px] border border-cyan-400/15 bg-[#07131f]/80 p-6 shadow-[0_0_80px_rgba(6,182,212,0.06)] backdrop-blur-2xl sm:p-8">
          <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full border border-cyan-400/10" />

          <div className="absolute bottom-[-120px] right-[20%] h-72 w-72 rounded-full bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  <Zap size={14} />
                  Study Command Deck
                </div>

                <h2 className="mt-2 text-2xl font-bold">
                  Learning session
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Zora is tracking your study time locally.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/5 px-4 py-2">
                <ShieldCheck
                  size={15}
                  className="text-cyan-400"
                />

                <span className="text-xs text-slate-400">
                  Local session tracking
                </span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
              {/* LIVE TIMER */}

              <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-black/20 p-6 lg:col-span-7">
                <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Current session
                    </span>

                    {isStudying && (
                      <span className="flex items-center gap-2 text-xs text-emerald-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        RECORDING
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="font-mono text-5xl font-bold tracking-tight text-cyan-300 sm:text-6xl">
                        {formatTime(sessionSeconds)}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {isStudying
                          ? "Stay focused. Zora is counting."
                          : "Start when you're ready."}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!isStudying ? (
                        <button
                          type="button"
                          onClick={startStudy}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                        >
                          <Play size={16} fill="currentColor" />
                          Start Study
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={pauseStudy}
                          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                        >
                          <Pause size={16} />
                          Pause
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={resetSession}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 transition hover:text-white"
                        aria-label="Reset study session"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>

                  {/* progress line */}

                  <div className="mt-6 h-px overflow-hidden bg-white/10">
                    {isStudying && (
                      <div className="h-full w-1/3 animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    )}
                  </div>
                </div>
              </div>

              {/* TOTAL TIME */}

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Lifetime study time
                    </p>

                    <h3 className="mt-3 text-4xl font-bold">
                      {totalDisplay}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                    <Timer
                      size={21}
                      className="text-blue-400"
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat
                    label="Sessions"
                    value="Tracked locally"
                  />

                  <MiniStat
                    label="Status"
                    value={isStudying ? "Focused" : "Waiting"}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            YOUTUBE INPUT
        ===================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
          <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                <Play
                  size={20}
                  className="text-red-400"
                  fill="currentColor"
                />
              </div>

              <div>
                <h2 className="font-semibold">
                  Neural video intake
                </h2>

                <p className="text-sm text-slate-500">
                  Feed Zora a YouTube lecture or tutorial.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <LinkIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  value={youtubeUrl}
                  onChange={(e) =>
                    setYoutubeUrl(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      analyzeVideo();
                    }
                  }}
                  placeholder="Paste YouTube link here..."
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>

              <button
                onClick={analyzeVideo}
                disabled={
                  loading || !youtubeUrl.trim()
                }
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-7 font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Video
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <TutorTag text="AI SUMMARY" />
              <TutorTag text="KEY CONCEPTS" />
              <TutorTag text="STUDY NOTES" />
              <TutorTag text="QUIZ" />
              <TutorTag text="FLASHCARDS" />
            </div>
          </div>
        </section>

        {/* =====================================================
            VIDEO PREVIEW
        ===================================================== */}

        {youtubeUrl && (
          <section className="mb-6 overflow-hidden rounded-[30px] border border-white/10 bg-black/20">
            <div className="relative flex aspect-video max-h-[500px] items-center justify-center bg-gradient-to-br from-[#101d31] to-[#050b14]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.08),transparent_35%)]" />

              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                  <Play
                    size={28}
                    className="ml-1 text-cyan-300"
                    fill="currentColor"
                  />
                </div>

                <p className="mt-4 font-medium">
                  Video signal detected
                </p>

                <p className="mt-1 max-w-md truncate px-5 text-sm text-slate-500">
                  {youtubeUrl}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            STUDY DASHBOARD
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* SUMMARY */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl lg:col-span-8">
            <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
                    <FileText
                      size={21}
                      className="text-cyan-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                      AI GENERATED
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Video Summary
                    </h2>
                  </div>
                </div>

                {analyzed && (
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                    <CheckCircle2 size={13} />
                    Analyzed
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/10 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {summary}
                </p>
              </div>
            </div>
          </section>

          {/* OVERVIEW */}

          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl lg:col-span-4">
            <h2 className="font-semibold">
              Intelligence Overview
            </h2>

            <div className="mt-5 space-y-3">
              <InfoRow
                icon={<Clock3 size={17} />}
                title="Session"
                value={formatTime(sessionSeconds)}
              />

              <InfoRow
                icon={<BookOpen size={17} />}
                title="Analysis"
                value={analyzed ? "Complete" : "Waiting"}
              />

              <InfoRow
                icon={<Lightbulb size={17} />}
                title="Concepts"
                value={analyzed ? "Extracted" : "Waiting"}
              />
            </div>
          </section>

          {/* =====================================================
              STUDY TOOLS
          ===================================================== */}

          <section className="lg:col-span-12">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Intelligence Modules
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Deploy a study module.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StudyTool
                icon={<FileText size={21} />}
                title="Study Notes"
                description="Convert the lecture into structured notes."
              />

              <StudyTool
                icon={<Brain size={21} />}
                title="AI Quiz"
                description="Test your understanding with generated questions."
              />

              <StudyTool
                icon={<Layers3 size={21} />}
                title="Flashcards"
                description="Generate rapid-revision cards."
              />

              <StudyTool
                icon={<Sparkles size={21} />}
                title="Key Concepts"
                description="Extract the ideas that matter most."
              />
            </div>
          </section>

          {/* =====================================================
              ASK ZORA
          ===================================================== */}

          <section className="relative overflow-hidden rounded-[30px] border border-cyan-400/10 bg-gradient-to-br from-cyan-500/[0.08] via-blue-500/[0.05] to-transparent p-7 lg:col-span-12">
            <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Brain
                    size={21}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                    Neural Interface
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Ask Zora
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      askTutor();
                    }
                  }}
                  placeholder="Ask something about what you just learned..."
                  className="h-14 flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
                />

                <button
                  onClick={askTutor}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-semibold text-blue-700 transition hover:-translate-y-0.5"
                >
                  Ask Zora
                  <Send size={17} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER SYSTEM STATUS */}

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/5 pt-5 text-[10px] uppercase tracking-[0.2em] text-slate-700 sm:flex-row">
          <span>ZORA TUTOR SYSTEM</span>

          <span>
            {isStudying
              ? "Study session in progress"
              : "Awaiting input"}
          </span>

          <Link
            href="/dashboard"
            className="transition hover:text-cyan-400"
          >
            Return to command center →
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   TELEMETRY
========================================================= */

function Telemetry({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-[10px] uppercase tracking-[0.15em]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xs font-semibold text-cyan-300">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-xs font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   TAG
========================================================= */

function TutorTag({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium tracking-[0.08em] text-slate-400">
      {text}
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/10 p-4">
      <div className="flex items-center gap-3">
        <div className="text-cyan-400">
          {icon}
        </div>

        <span className="text-sm text-slate-400">
          {title}
        </span>
      </div>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   STUDY TOOL
========================================================= */

function StudyTool({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group relative overflow-hidden rounded-[25px] border border-white/10 bg-white/[0.045] p-5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
    >
      <div className="absolute right-[-30px] top-[-30px] h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
            {icon}
          </div>

          <ChevronRight
            size={17}
            className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
          />
        </div>

        <h3 className="mt-5 font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-700 transition group-hover:text-cyan-400">
          Open module
          <ArrowUpRight size={12} />
        </div>
      </div>
    </button>
  );
}