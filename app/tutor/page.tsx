"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function TutorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [question, setQuestion] = useState("");

  const [summary, setSummary] = useState(
    "Paste a YouTube video above and Zora will turn it into clear, structured study material."
  );

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

  return (
    <main className="min-h-screen bg-[#07111F] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* ================================================ */}
        {/* HEADER */}
        {/* ================================================ */}

        <div className="mb-8">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Sparkles
                size={21}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Zora AI
              </p>

              <p className="text-xs text-gray-500">
                Intelligent learning workspace
              </p>
            </div>

          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Zora Tutor
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Turn lectures, tutorials and educational videos into
            clear notes, summaries and study material.
          </p>

        </div>

        {/* ================================================ */}
        {/* YOUTUBE INPUT */}
        {/* ================================================ */}

        <section className="relative mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-7 backdrop-blur-xl">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="4"
                    fill="currentColor"
                    className="text-red-500"
                  />

                  <path
                    d="M10 9L16 12L10 15V9Z"
                    fill="white"
                  />
                </svg>

              </div>

              <div>

                <h2 className="font-semibold">
                  Learn from a YouTube video
                </h2>

                <p className="text-sm text-gray-500">
                  Paste a YouTube URL and let Zora do the heavy lifting.
                </p>

              </div>

            </div>

            <div className="flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <LinkIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
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
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-black/30"
                />

              </div>

              <button
                onClick={analyzeVideo}
                disabled={
                  loading || !youtubeUrl.trim()
                }
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-7 font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Analyzing...
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

              <TutorTag text="AI Summary" />
              <TutorTag text="Key Concepts" />
              <TutorTag text="Study Notes" />
              <TutorTag text="Quiz" />
              <TutorTag text="Flashcards" />

            </div>

          </div>

        </section>

        {/* ================================================ */}
        {/* VIDEO PREVIEW */}
        {/* ================================================ */}

        {youtubeUrl && (
          <section className="mb-6 overflow-hidden rounded-[30px] border border-white/10 bg-black/20">

            <div className="flex aspect-video max-h-[500px] items-center justify-center bg-gradient-to-br from-[#101d31] to-[#050b14]">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">

                  <Play
                    size={28}
                    className="ml-1 text-red-400"
                    fill="currentColor"
                  />

                </div>

                <p className="mt-4 font-medium">
                  YouTube video loaded
                </p>

                <p className="mt-1 max-w-md truncate px-5 text-sm text-gray-500">
                  {youtubeUrl}
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ================================================ */}
        {/* STUDY DASHBOARD */}
        {/* ================================================ */}

        <div className="grid gap-6 lg:grid-cols-12">

          {/* SUMMARY */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl lg:col-span-8">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

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
                      AI Generated
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

                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                  {summary}
                </p>

              </div>

            </div>

          </section>

          {/* STUDY OVERVIEW */}

          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl lg:col-span-4">

            <h2 className="font-semibold">
              Study Overview
            </h2>

            <div className="mt-5 space-y-3">

              <InfoRow
                icon={<Clock3 size={17} />}
                title="Watch time"
                value="—"
              />

              <InfoRow
                icon={<BookOpen size={17} />}
                title="Difficulty"
                value="Not analyzed"
              />

              <InfoRow
                icon={<Lightbulb size={17} />}
                title="Key concepts"
                value="—"
              />

            </div>

          </section>

          {/* ================================================ */}
          {/* STUDY TOOLS */}
          {/* ================================================ */}

          <section className="lg:col-span-12">

            <div className="mb-4">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Study Tools
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Turn the video into something useful.
              </h2>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StudyTool
                icon={<FileText size={21} />}
                title="Study Notes"
                description="Turn the video into structured notes."
              />

              <StudyTool
                icon={<Brain size={21} />}
                title="AI Quiz"
                description="Test yourself on what you learned."
              />

              <StudyTool
                icon={<Layers3 size={21} />}
                title="Flashcards"
                description="Create quick revision cards."
              />

              <StudyTool
                icon={<Sparkles size={21} />}
                title="Key Concepts"
                description="Extract the most important ideas."
              />

            </div>

          </section>

          {/* ================================================ */}
          {/* ASK ZORA */}
          {/* ================================================ */}

          <section className="relative overflow-hidden rounded-[30px] border border-cyan-400/10 bg-gradient-to-br from-cyan-500/[0.08] via-blue-500/[0.05] to-transparent p-7 lg:col-span-12">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

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
                    Ask Zora
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Have a question about this video?
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
                  placeholder="Ask something about what you just watched..."
                  className="h-14 flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 text-sm outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
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

      </div>
    </main>
  );
}

/* ================================================= */
/* TAG */
/* ================================================= */

function TutorTag({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-400">
      {text}
    </div>
  );
}

/* ================================================= */
/* INFO ROW */
/* ================================================= */

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

        <span className="text-sm text-gray-400">
          {title}
        </span>

      </div>

      <span className="text-sm font-medium">
        {value}
      </span>

    </div>
  );
}

/* ================================================= */
/* STUDY TOOL */
/* ================================================= */

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

      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
            {icon}
          </div>

          <ChevronRight
            size={17}
            className="text-gray-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
          />

        </div>

        <h3 className="mt-5 font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {description}
        </p>

      </div>

    </button>
  );
}