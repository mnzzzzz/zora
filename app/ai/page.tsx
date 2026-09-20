"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowUp,
  Sparkles,
  Plus,
  Mic,
  Paperclip,
  Brain,
  CalendarDays,
  CheckCircle2,
  FileText,
  Command,
  Loader2,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Cpu,
  Activity,
  Radio,
  ScanLine,
  Terminal,
  Zap,
  ShieldCheck,
  X,
  Bell,
  Clock3,
  Target,
  ChevronRight,
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type DetectedAction = {
  type: "calendar" | "task" | "plan" | "thinking";
  label: string;
  description: string;
  icon: React.ReactNode;
};

const suggestions = [
  {
    icon: <CalendarDays size={18} />,
    title: "Plan my day",
    text: "Create a productive schedule for me",
  },
  {
    icon: <CheckCircle2 size={18} />,
    title: "Manage my tasks",
    text: "Help me organize what I need to do",
  },
  {
    icon: <FileText size={18} />,
    title: "Summarize something",
    text: "Turn my notes into something useful",
  },
  {
    icon: <Brain size={18} />,
    title: "Think with me",
    text: "Help me solve a problem",
  },
];

const processingStates = [
  "INITIALIZING Monobloc CORE...",
  "ANALYZING REQUEST...",
  "SCANNING CONTEXT...",
  "SYNTHESIZING RESPONSE...",
  "OPTIMIZING OUTPUT...",
  "FINALIZING INTELLIGENCE...",
];

function detectAction(text: string): DetectedAction | null {
  const lower = text.toLowerCase();

  if (
    lower.includes("calendar") ||
    lower.includes("schedule") ||
    lower.includes("meeting") ||
    lower.includes("appointment") ||
    lower.includes("tomorrow at") ||
    lower.includes("today at")
  ) {
    return {
      type: "calendar",
      label: "CALENDAR INTENT DETECTED",
      description:
        "Monobloc detected scheduling-related context in your request.",
      icon: <CalendarDays size={18} />,
    };
  }

  if (
    lower.includes("task") ||
    lower.includes("todo") ||
    lower.includes("to-do") ||
    lower.includes("remind me") ||
    lower.includes("need to do")
  ) {
    return {
      type: "task",
      label: "TASK INTENT DETECTED",
      description:
        "Monobloc identified actionable items that may belong in your task system.",
      icon: <CheckCircle2 size={18} />,
    };
  }

  if (
    lower.includes("plan") ||
    lower.includes("organize") ||
    lower.includes("routine") ||
    lower.includes("productive")
  ) {
    return {
      type: "plan",
      label: "PLANNING MODE ENGAGED",
      description:
        "Monobloc is structuring your request into a more organized approach.",
      icon: <Target size={18} />,
    };
  }

  if (
    lower.includes("think") ||
    lower.includes("solve") ||
    lower.includes("analyze") ||
    lower.includes("problem")
  ) {
    return {
      type: "thinking",
      label: "DEEP ANALYSIS MODE",
      description:
        "Monobloc detected a reasoning-heavy request.",
      icon: <Brain size={18} />,
    };
  }

  return null;
}

function getRandomProcessingState(index: number) {
  return processingStates[index % processingStates.length];
}

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [showTransmission, setShowTransmission] = useState(false);
  const [transmissionText, setTransmissionText] = useState("");
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [corePulse, setCorePulse] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const promptSentRef = useRef(false);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setProcessingIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setProcessingIndex((current) => current + 1);
    }, 1050);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");

    if (prompt && !promptSentRef.current) {
      promptSentRef.current = true;

      window.history.replaceState({}, "", "/ai-assistant");

      window.setTimeout(() => {
        sendMessage(prompt);
      }, 350);
    }
  }, []);

  const sendMessage = async (text?: string) => {
    const textToSend = (text ?? message).trim();

    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: textToSend,
    };

    setLastUserMessage(textToSend);
    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setIsLoading(true);
    setCorePulse(true);
    setShowTransmission(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const rawText = await response.text();

      let data: {
        response?: string;
        text?: string;
        message?: string;
        content?: string;
        error?: string;
      };

      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("Monobloc API returned non-JSON:", rawText);

        throw new Error(
          `The Monobloc API returned HTML instead of JSON. HTTP status: ${response.status}. Check that app/api/ai/route.ts exists and your /api/ai endpoint is working.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Monobloc API request failed with status ${response.status}.`
        );
      }

      const aiText =
        data.response ||
        data.text ||
        data.content ||
        data.message;

      if (!aiText) {
        throw new Error("Monobloc received an empty response from the AI.");
      }

      setTransmissionText("INTELLIGENCE SYNTHESIS COMPLETE");
      setShowTransmission(true);

      window.setTimeout(() => {
        setShowTransmission(false);
      }, 2600);

      window.setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: aiText,
        };

        setMessages((current) => [...current, assistantMessage]);
      }, 450);
    } catch (error) {
      console.error("Monobloc AI error:", error);

      const errorText =
        error instanceof Error
          ? error.message
          : "An unknown error occurred.";

      setTransmissionText("CONNECTION INTERRUPTED");
      setShowTransmission(true);

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `## Connection error

**Monobloc couldn't complete that request.**

${errorText}`,
      };

      setMessages((current) => [...current, errorMessage]);
    } finally {
      window.setTimeout(() => {
        setIsLoading(false);
        setCorePulse(false);
      }, 600);
    }
  };

  const handleSubmit = () => {
    sendMessage();
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectSuggestion = (text: string) => {
    if (isLoading) return;
    sendMessage(text);
  };

  const clearChat = () => {
    if (isLoading) return;

    setMessages([]);
    setMessage("");
    setShowTransmission(false);

    window.history.replaceState({}, "", "/ai-assistant");
  };

  const copyMessage = async (
    content: string,
    id: string
  ) => {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedId(id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const detectedAction = detectAction(lastUserMessage);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09060f] text-white">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[10%] top-[-20%] h-[650px] w-[650px] rounded-full bg-purple-500/[0.08] blur-[160px]" />

        <div className="absolute right-[-15%] top-[15%] h-[600px] w-[600px] rounded-full bg-violet-600/[0.08] blur-[170px]" />

        <div className="absolute bottom-[-25%] left-[30%] h-[650px] w-[650px] rounded-full bg-fuchsia-600/[0.06] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.9) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      </div>

      {/* TRANSMISSION POPUP */}

      {showTransmission && (
        <div className="pointer-events-none fixed left-1/2 top-24 z-[100] w-[calc(100%-40px)] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative overflow-hidden rounded-2xl border border-purple-400/30 bg-[#100a1b]/95 px-5 py-4 shadow-[0_0_70px_rgba(168,85,247,0.18)] backdrop-blur-2xl">
            <div className="absolute inset-y-0 left-0 w-1 bg-purple-400" />

            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-400/10">
                <Radio
                  size={17}
                  className="animate-pulse text-purple-300"
                />

                <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-purple-300" />
              </div>

              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] text-purple-400">
                  Monobloc SYSTEM
                </p>

                <p className="mt-1 text-xs font-semibold tracking-wide text-white">
                  {transmissionText}
                </p>
              </div>

              <Check
                size={18}
                className="ml-auto text-emerald-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}

      <header className="relative z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#09060f]/60 px-5 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] transition hover:border-purple-400/30 hover:bg-purple-400/10"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="hidden h-7 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-3">
            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500 ${
                isLoading
                  ? "scale-110 border-purple-300/50 bg-purple-400/20 shadow-[0_0_35px_rgba(168,85,247,0.35)]"
                  : "border-purple-400/20 bg-purple-400/10"
              }`}
            >
              <Sparkles
                size={19}
                className={
                  isLoading
                    ? "animate-pulse text-purple-100"
                    : "text-purple-300"
                }
              />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#09060f]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold tracking-tight">
                  Monobloc AI
                </p>

                <span className="rounded border border-purple-400/20 bg-purple-400/[0.06] px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-purple-400">
                  v1.0
                </span>
              </div>

              <p className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-600 sm:block">
                Intelligence interface
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              type="button"
              onClick={clearChat}
              disabled={isLoading}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-gray-400 transition hover:border-purple-400/20 hover:bg-purple-400/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={14} />

              <span className="hidden sm:inline">
                Reset
              </span>
            </button>
          )}

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-2 text-[10px] font-medium tracking-wide text-emerald-300 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            CORE ONLINE
          </div>
        </div>
      </header>

      {/* MAIN */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col px-4 sm:px-5">
        {!hasMessages ? (
          <section className="flex flex-1 flex-col items-center justify-center pb-12 pt-16">
            {/* Monobloc CORE */}

            <div className="relative mb-10">
              <div
                className={`absolute inset-[-45px] rounded-full bg-purple-400/[0.08] blur-3xl transition-all duration-500 ${
                  corePulse ? "scale-125 opacity-100" : ""
                }`}
              />

              <div className="absolute inset-[-28px] animate-[spin_16s_linear_infinite] rounded-full border border-dashed border-purple-400/20" />

              <div className="absolute inset-[-15px] animate-[spin_10s_linear_infinite_reverse] rounded-full border border-purple-400/10" />

              <div
                className={`relative flex h-28 w-28 items-center justify-center rounded-[36px] border border-purple-300/20 bg-purple-400/10 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-xl transition duration-500 ${
                  corePulse
                    ? "scale-110 shadow-[0_0_120px_rgba(168,85,247,0.32)]"
                    : ""
                }`}
              >
                <Cpu
                  size={42}
                  className="text-purple-200"
                />

                <div className="absolute bottom-3 flex gap-1">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-purple-300" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-purple-300 [animation-delay:150ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-purple-300 [animation-delay:300ms]" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-400/[0.04] px-3 py-1.5">
                <Activity
                  size={11}
                  className="text-purple-400"
                />

                <span className="text-[9px] font-bold tracking-[0.25em] text-purple-400">
                  Monobloc NEURAL SYSTEM ONLINE
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                What are we
                <span className="block text-purple-400">
                  accomplishing today?
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
                Think of me as your command center. Give me
                the objective and we'll figure out the rest.
              </p>
            </div>

            {/* SYSTEM BAR */}

            <div className="mt-8 flex items-center gap-5 rounded-full border border-white/[0.07] bg-white/[0.025] px-5 py-2.5 font-mono text-[8px] tracking-[0.15em] text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={11}
                  className="text-purple-500"
                />
                SECURE
              </span>

              <span className="h-3 w-px bg-white/10" />

              <span className="flex items-center gap-2">
                <Zap
                  size={11}
                  className="text-purple-500"
                />
                READY
              </span>

              <span className="h-3 w-px bg-white/10" />

              <span className="hidden sm:inline">
                AWAITING COMMAND
              </span>
            </div>

            {/* SUGGESTIONS */}

            <div className="mt-10 grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {suggestions.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => selectSuggestion(item.text)}
                  disabled={isLoading}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-purple-400/[0.045] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="absolute right-3 top-3 font-mono text-[8px] text-slate-800">
                    0{index + 1}
                  </div>

                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/[0.08] text-purple-300 transition group-hover:scale-110 group-hover:bg-purple-400/20">
                    {item.icon}
                  </div>

                  <p className="text-sm font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {item.text}
                  </p>
                </button>
              ))}
            </div>

            <ChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
            />
          </section>
        ) : (
          <section className="flex flex-1 flex-col py-6 sm:py-8">
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
              {/* LIVE SYSTEM STRIP */}

              <div className="mb-6 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                <div className="flex items-center gap-2">
                  <Terminal
                    size={13}
                    className="text-purple-400"
                  />

                  <span className="font-mono text-[9px] tracking-[0.15em] text-slate-500">
                    Monobloc COMMAND INTERFACE
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[8px] text-slate-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                  LIVE
                </div>
              </div>

              {/* DETECTED ACTION */}

              {detectedAction && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-purple-400/20 bg-purple-400/[0.035] animate-in fade-in slide-in-from-top-3 duration-500">
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                      {detectedAction.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold tracking-[0.2em] text-purple-400">
                        {detectedAction.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {detectedAction.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={16}
                      className="text-purple-500"
                    />
                  </div>

                  <div className="h-px bg-gradient-to-r from-purple-400/30 via-purple-400/5 to-transparent" />
                </div>
              )}

              {/* CHAT */}

              <div className="flex-1 space-y-8 pb-8">
                {messages.map((chatMessage, messageIndex) => {
                  const isUser = chatMessage.role === "user";

                  return (
                    <div
                      key={chatMessage.id}
                      className={`animate-in fade-in slide-in-from-bottom-2 duration-500 flex gap-3 sm:gap-4 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="relative mt-1">
                          <div className="absolute inset-[-7px] rounded-xl bg-purple-400/10 blur-md" />

                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-[#110b1c] text-purple-300">
                            <Cpu size={18} />
                          </div>
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[90%] sm:max-w-[80%] ${
                          isUser
                            ? "rounded-[24px] rounded-tr-md border border-purple-300/20 bg-purple-600/90 px-5 py-4 shadow-[0_0_35px_rgba(168,85,247,0.08)]"
                            : "overflow-visible rounded-[24px] rounded-tl-md border border-white/[0.08] bg-[#110b1c]/90 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
                        }`}
                      >
                        {!isUser && (
                          <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-400/10">
                              <Bot
                                size={11}
                                className="text-purple-300"
                              />
                            </span>

                            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-purple-500">
                              Monobloc RESPONSE
                            </span>

                            <span className="ml-auto font-mono text-[8px] text-slate-700">
                              {String(messageIndex + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>
                          </div>
                        )}

                        {isUser ? (
                          <p className="whitespace-pre-wrap text-sm leading-7 text-white">
                            {chatMessage.content}
                          </p>
                        ) : (
                          <div className="text-sm leading-7 text-slate-300">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="mb-4 mt-2 text-2xl font-bold tracking-tight text-white">
                                    {children}
                                  </h1>
                                ),

                                h2: ({ children }) => (
                                  <h2 className="mb-3 mt-5 flex items-center gap-2 text-xl font-bold text-white">
                                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                    {children}
                                  </h2>
                                ),

                                h3: ({ children }) => (
                                  <h3 className="mb-2 mt-4 text-base font-bold text-purple-300">
                                    {children}
                                  </h3>
                                ),

                                p: ({ children }) => (
                                  <p className="mb-3 last:mb-0">
                                    {children}
                                  </p>
                                ),

                                strong: ({ children }) => (
                                  <strong className="font-bold text-white">
                                    {children}
                                  </strong>
                                ),

                                em: ({ children }) => (
                                  <em className="italic text-slate-200">
                                    {children}
                                  </em>
                                ),

                                ul: ({ children }) => (
                                  <ul className="mb-3 ml-5 list-disc space-y-2 last:mb-0 marker:text-purple-400">
                                    {children}
                                  </ul>
                                ),

                                ol: ({ children }) => (
                                  <ol className="mb-3 ml-5 list-decimal space-y-2 last:mb-0 marker:text-purple-400">
                                    {children}
                                  </ol>
                                ),

                                li: ({ children }) => (
                                  <li className="pl-1">
                                    {children}
                                  </li>
                                ),

                                blockquote: ({
                                  children,
                                }) => (
                                  <blockquote className="my-4 rounded-r-xl border-l-2 border-purple-400 bg-purple-400/[0.04] py-2 pl-4 pr-3 italic text-slate-400">
                                    {children}
                                  </blockquote>
                                ),

                                code: ({
                                  children,
                                  className,
                                }) => {
                                  const isBlock =
                                    className?.includes(
                                      "language-"
                                    );

                                  if (isBlock) {
                                    return (
                                      <code className="text-xs leading-6 text-purple-200">
                                        {children}
                                      </code>
                                    );
                                  }

                                  return (
                                    <code className="rounded-md border border-purple-400/10 bg-purple-400/[0.08] px-1.5 py-0.5 font-mono text-[0.85em] text-purple-300">
                                      {children}
                                    </code>
                                  );
                                },

                                pre: ({ children }) => (
                                  <pre className="my-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#07050d] p-4 font-mono text-xs">
                                    {children}
                                  </pre>
                                ),

                                hr: () => (
                                  <hr className="my-5 border-white/10" />
                                ),
                              }}
                            >
                              {chatMessage.content}
                            </ReactMarkdown>
                          </div>
                        )}

                        {!isUser && (
                          <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                            <span className="font-mono text-[8px] tracking-[0.16em] text-slate-700">
                              ANALYSIS COMPLETE
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                copyMessage(
                                  chatMessage.content,
                                  chatMessage.id
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-slate-600 transition hover:border-purple-400/20 hover:text-purple-300"
                              title="Copy response"
                            >
                              {copiedId ===
                              chatMessage.id ? (
                                <Check
                                  size={13}
                                  className="text-emerald-400"
                                />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* JARVIS THINKING SEQUENCE */}

                {isLoading && (
                  <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 flex gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="absolute inset-[-8px] animate-pulse rounded-xl bg-purple-400/10 blur-lg" />

                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-400/10 text-purple-300">
                        <ScanLine
                          size={18}
                          className="animate-pulse"
                        />
                      </div>
                    </div>

                    <div className="min-w-[280px] rounded-[24px] rounded-tl-md border border-purple-400/15 bg-[#110b1c]/95 px-5 py-4 shadow-[0_0_40px_rgba(168,85,247,0.05)] backdrop-blur-xl">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Loader2
                            size={14}
                            className="animate-spin text-purple-400"
                          />

                          <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-purple-400">
                            Monobloc PROCESSING
                          </span>
                        </div>

                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                      </div>

                      <p className="font-mono text-xs tracking-wide text-slate-400">
                        {getRandomProcessingState(
                          processingIndex
                        )}
                      </p>

                      <div className="mt-4 flex gap-1">
                        {processingStates.map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                              index <=
                              processingIndex %
                                processingStates.length
                                ? "bg-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                : "bg-white/[0.06]"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 flex items-center gap-2 font-mono text-[8px] tracking-[0.14em] text-slate-700">
                        <Activity size={10} />
                        NEURAL PIPELINE ACTIVE
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              <ChatInput
                message={message}
                setMessage={setMessage}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                isLoading={isLoading}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   CHAT INPUT
========================================================= */

function ChatInput({
  message,
  setMessage,
  onSubmit,
  onKeyDown,
  isLoading,
}: {
  message: string;
  setMessage: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  isLoading: boolean;
}) {
  return (
    <div className="mt-8 w-full max-w-4xl self-center">
      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#110b1c]/90 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition duration-300 focus-within:border-purple-400/40 focus-within:shadow-[0_0_70px_rgba(168,85,247,0.09)]">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-32 w-80 -translate-x-1/2 rounded-full bg-purple-400/[0.09] blur-3xl" />

        <div className="relative flex items-end gap-1 sm:gap-2">
          <button
            type="button"
            className="mb-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-purple-400/[0.06] hover:text-purple-300 sm:flex"
          >
            <Plus size={20} />
          </button>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            placeholder={
              isLoading
                ? "Monobloc is processing..."
                : "Enter a command for Monobloc..."
            }
            rows={1}
            className="max-h-40 min-h-[52px] flex-1 resize-none bg-transparent px-2 py-4 text-sm leading-6 text-white outline-none placeholder:text-slate-700 disabled:opacity-60"
          />

          <button
            type="button"
            className="mb-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/5 hover:text-purple-300 md:flex"
          >
            <Paperclip size={18} />
          </button>

          <button
            type="button"
            className="mb-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/5 hover:text-purple-300 sm:flex"
          >
            <Mic size={18} />
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!message.trim() || isLoading}
            className="relative mb-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <ArrowUp size={19} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-2">
        <span className="flex items-center gap-2 font-mono text-[8px] tracking-[0.12em] text-slate-700">
          <ShieldCheck size={10} />
          Monobloc INTELLIGENCE INTERFACE
        </span>

        <div className="hidden items-center gap-2 font-mono text-[9px] text-slate-700 sm:flex">
          <Command size={11} />
          <span>ENTER TO TRANSMIT</span>
        </div>
      </div>
    </div>
  );
}