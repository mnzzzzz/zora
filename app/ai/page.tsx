"use client";

import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Loader2,
  Mic,
  Paperclip,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import FloatingSidebar from "@/components/floatingsidebar";

type Message = {
  id: string;
  authorId: string;
  authorName: string;
  authorType: "human" | "agent";
  content: string;
  timestamp: number;
};

type Participant = {
  id: string;
  name: string;
  type: "human" | "agent";
  role?: string;
  online?: boolean;
};

const WORKSPACE_ID = "current-workspace";

/* ─────────────────────────────────────────────
   SCI-FI BOOT SCREEN
───────────────────────────────────────────── */

function AIBootScreen() {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "ESTABLISHING NEURAL LINK",
    "LOADING WORKSPACE CONTEXT",
    "SYNCING MEMORY",
    "INITIALIZING MODEL",
    "PREPARING INTELLIGENCE",
  ];

  useEffect(() => {
    const start = performance.now();
    const duration = 1700;

    let animationFrame: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const percentage = Math.min(
        100,
        Math.round((elapsed / duration) * 100)
      );

      setProgress(percentage);

      const nextStatus = Math.min(
        statuses.length - 1,
        Math.floor((percentage / 100) * statuses.length)
      );

      setStatusIndex(nextStatus);

      if (percentage < 100) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#030308] text-white">
      {/* Ambient purple glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/[0.08] blur-[120px]" />

      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:50px_50px]" />

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[scan_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

      {/* Top branding */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Sparkles
            size={13}
            className="text-purple-300"
          />

          <span className="text-[11px] font-medium tracking-[0.45em] text-purple-200">
            MONOBLOC AI
          </span>
        </div>

        <p className="text-[8px] tracking-[0.5em] text-slate-600">
          THINKING&nbsp;&nbsp;•&nbsp;&nbsp;ANALYZING&nbsp;&nbsp;•&nbsp;&nbsp;PREPARING
        </p>
      </div>

      {/* Left system diagnostics */}
      <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="border-l border-purple-400/20 pl-5">
          {[
            "CONTEXT LOADED",
            "MEMORY SYNCED",
            "MODEL ONLINE",
            statuses[statusIndex],
          ].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="mb-5 flex items-center gap-3"
            >
              <span
                className={[
                  "h-1 w-1 rounded-full",
                  index === 3
                    ? "bg-purple-300 shadow-[0_0_10px_rgba(168,85,247,.9)]"
                    : "bg-purple-500/40",
                ].join(" ")}
              />

              <span
                className={[
                  "text-[8px] tracking-[0.35em]",
                  index === 3
                    ? "text-purple-300"
                    : "text-slate-700",
                ].join(" ")}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right diagnostic */}
      <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="flex items-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-500/30" />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300 shadow-[0_0_12px_rgba(168,85,247,.9)]" />

              <span className="text-[8px] tracking-[0.3em] text-purple-300">
                MULTI-AGENT
              </span>
            </div>

            <span className="text-[8px] tracking-[0.3em] text-slate-700">
              COLLABORATION
            </span>
          </div>
        </div>
      </div>

      {/* Central reactor */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Outer rings */}
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/[0.08]" />

        <div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/[0.12] border-dashed" />

        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/[0.12]" />

        {/* Orbit 1 */}
        <div className="absolute left-1/2 top-1/2 h-[240px] w-[110px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_4s_linear_infinite] rounded-[50%] border border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,.12)]" />

        {/* Orbit 2 */}
        <div className="absolute left-1/2 top-1/2 h-[110px] w-[250px] -translate-x-1/2 -translate-y-1/2 rotate-45 animate-[orbitReverse_5s_linear_infinite] rounded-[50%] border border-purple-300/50" />

        {/* Orbit 3 */}
        <div className="absolute left-1/2 top-1/2 h-[250px] w-[100px] -translate-x-1/2 -translate-y-1/2 -rotate-45 animate-[orbit_6s_linear_infinite] rounded-[50%] border border-purple-500/30" />

        {/* Orbit particles */}
        <div className="absolute left-1/2 top-1/2 h-[250px] w-[100px] -translate-x-1/2 -translate-y-1/2 -rotate-45 animate-[orbit_6s_linear_infinite]">
          <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_15px_4px_rgba(168,85,247,.7)]" />
        </div>

        {/* Central glow */}
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-2xl" />

        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/30 bg-purple-500/[0.06] shadow-[0_0_60px_rgba(168,85,247,.35)]" />

        {/* Core */}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white shadow-[0_0_15px_5px_rgba(192,132,252,.9)]" />

        {/* Crosshair */}
        <div className="absolute left-1/2 top-[-70px] h-[140px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent" />

        <div className="absolute left-[-70px] top-1/2 h-px w-[140px] -translate-y-1/2 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      </div>

      {/* Bottom status */}
      <div className="absolute bottom-14 left-1/2 w-[280px] -translate-x-1/2 text-center">
        <p className="mb-4 text-[9px] tracking-[0.45em] text-purple-200/80">
          {statuses[statusIndex]}
          <span className="animate-pulse">...</span>
        </p>

        <div className="relative h-[2px] overflow-hidden rounded-full bg-purple-950">
          <div
            className="h-full bg-gradient-to-r from-purple-700 via-purple-300 to-white shadow-[0_0_12px_rgba(168,85,247,.9)] transition-[width] duration-100"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[7px] tracking-[0.3em] text-slate-700">
            SYSTEM INITIALIZATION
          </span>

          <span className="font-mono text-[9px] text-purple-300">
            {String(progress).padStart(3, "0")}%
          </span>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[7px] tracking-[0.45em] text-slate-800">
          MORE THAN AN AI · YOUR INTELLIGENCE PARTNER
        </p>
      </div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(45deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-315deg);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AI PAGE
───────────────────────────────────────────── */

export default function AIPage() {
  const [booting, setBooting] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>(
    []
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [listening, setListening] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);

  /* Boot screen */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooting(false);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }, 1850);

    return () => window.clearTimeout(timer);
  }, []);

  /* Local multiplayer channel */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel(
      `monobloc-ai-${WORKSPACE_ID}`
    );

    channelRef.current = channel;

    channel.onmessage = (event) => {
      const data = event.data;

      if (data?.type === "message") {
        setMessages((current) => {
          if (
            current.some(
              (message) => message.id === data.message.id
            )
          ) {
            return current;
          }

          return [...current, data.message];
        });
      }

      if (data?.type === "participants") {
        setParticipants(data.participants || []);
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  function broadcastMessage(message: Message) {
    channelRef.current?.postMessage({
      type: "message",
      message,
    });
  }

  function createMessage(
    authorId: string,
    authorName: string,
    authorType: "human" | "agent",
    content: string
  ): Message {
    return {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      authorId,
      authorName,
      authorType,
      content,
      timestamp: Date.now(),
    };
  }

  async function askAI(
    userMessage: string,
    history: Message[]
  ) {
    try {
      setLoading(true);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
          workspaceId: WORKSPACE_ID,
          participants,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed.");
      }

      const data = await response.json();

      const aiText =
        data?.response ||
        data?.text ||
        data?.content ||
        data?.message;

      if (!aiText) {
        throw new Error("No response received from AI.");
      }

      const aiMessage = createMessage(
        "monobloc",
        "Monobloc",
        "agent",
        aiText
      );

      setMessages((current) => [...current, aiMessage]);
      broadcastMessage(aiMessage);
    } catch (error) {
      console.error(error);

      const errorMessage = createMessage(
        "monobloc",
        "Monobloc",
        "agent",
        "I couldn't complete that request. Please try again."
      );

      setMessages((current) => [...current, errorMessage]);
      broadcastMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const trimmed = input.trim();

    if (!trimmed || loading) return;

    const userMessage = createMessage(
      "local-user",
      "You",
      "human",
      trimmed
    );

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    broadcastMessage(userMessage);

    const shouldAskAI =
      /@monobloc\b/i.test(trimmed) ||
      /@ai\b/i.test(trimmed);

    if (shouldAskAI) {
      await askAI(trimmed, nextMessages);
    }

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function handleInput(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    setInput(event.target.value);

    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(
      event.target.scrollHeight,
      180
    )}px`;
  }

  function newChat() {
    setMessages([]);
    setInput("");
    setSelectedFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  async function copyMessage(
    messageId: string,
    content: string
  ) {
    try {
      await navigator.clipboard.writeText(content);

      setCopied(messageId);

      window.setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  async function invitePeople() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setInviteCopied(true);

      window.setTimeout(() => {
        setInviteCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Invite copy failed:", error);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;

    setSelectedFiles((current) => [
      ...current,
      ...Array.from(files),
    ]);
  }

  function removeFile(index: number) {
    setSelectedFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index)
    );
  }

  function toggleVoiceInput() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert(
        "Voice input isn't supported by this browser."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop?.();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript || "";

      if (!transcript) return;

      setInput((current) =>
        current ? `${current} ${transcript}` : transcript
      );

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      console.error(error);
      setListening(false);
    }
  }

  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* SCI-FI BOOT */}
      {booting && <AIBootScreen />}

      <div
        className={[
          "min-h-screen bg-[#070B14] text-white transition-opacity duration-500",
          booting
            ? "pointer-events-none opacity-0"
            : "opacity-100",
        ].join(" ")}
      >
        <FloatingSidebar />

        <div className="min-h-screen">
          {/* Top bar */}
          <header className="fixed left-0 right-0 top-0 z-40">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                  aria-label="Go to dashboard"
                >
                  <Plus
                    size={17}
                    className="rotate-45"
                  />
                </button>

                <div className="h-5 w-px bg-white/[0.08]" />

                <button
                  type="button"
                  onClick={newChat}
                  className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  New chat
                  <ChevronDown
                    size={14}
                    className="text-slate-600"
                  />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMembers(true)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <Users size={15} />

                  <span className="hidden sm:inline">
                    Members
                  </span>
                </button>

                <button
                  type="button"
                  onClick={invitePeople}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition hover:border-purple-400/30 hover:bg-purple-500/[0.06] hover:text-white"
                >
                  {inviteCopied ? "Copied" : "Invite"}
                </button>
              </div>
            </div>
          </header>

          {/* Conversation */}
          <main className="min-h-screen pb-40 pt-20">
            {!hasMessages ? (
              <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-6">
                <div className="w-full max-w-2xl text-center">
                  <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-500/[0.07]">
                    <Sparkles
                      size={22}
                      className="text-purple-300"
                    />
                  </div>

                  <h1 className="text-2xl font-medium tracking-tight">
                    How can I help?
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Ask anything, or bring your team into the
                    conversation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-3xl px-5">
                <div className="space-y-8">
                  {messages.map((message) => {
                    const isAgent =
                      message.authorType === "agent";

                    return (
                      <article
                        key={message.id}
                        className="group"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div
                            className={[
                              "flex h-6 w-6 items-center justify-center rounded-full",
                              isAgent
                                ? "bg-purple-500/[0.10] text-purple-300"
                                : "bg-white/[0.06] text-slate-400",
                            ].join(" ")}
                          >
                            {isAgent ? (
                              <Sparkles size={12} />
                            ) : (
                              <span className="text-[10px]">
                                Y
                              </span>
                            )}
                          </div>

                          <span
                            className={
                              isAgent
                                ? "text-xs font-medium text-purple-200"
                                : "text-xs font-medium text-slate-400"
                            }
                          >
                            {message.authorName}
                          </span>

                          <span className="text-[10px] text-slate-700">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>

                        <div className="pl-8 text-[15px] leading-7 text-slate-300">
                          <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:text-white prose-a:text-purple-300 prose-strong:text-white prose-code:text-purple-200 prose-pre:border prose-pre:border-white/[0.06] prose-pre:bg-black/30">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              void copyMessage(
                                message.id,
                                message.content
                              )
                            }
                            className="mt-2 flex items-center gap-1.5 text-xs text-slate-700 opacity-0 transition hover:text-slate-400 group-hover:opacity-100"
                          >
                            {copied === message.id ? (
                              <>
                                <Check size={12} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}

                  {loading && (
                    <div className="flex items-center gap-3 pl-8 text-sm text-slate-500">
                      <Loader2
                        size={15}
                        className="animate-spin text-purple-300"
                      />
                      Monobloc is thinking...
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Composer */}
          <div className="fixed bottom-0 left-0 right-0 z-30">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070B14] via-[#070B14]/95 to-transparent" />

            <div className="relative mx-auto w-full max-w-3xl px-5 pb-5">
              <div className="rounded-2xl border border-white/[0.10] bg-[#101218] shadow-2xl shadow-black/30">
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-b border-white/[0.06] px-4 py-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex max-w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5"
                      >
                        <Paperclip
                          size={12}
                          className="text-slate-500"
                        />

                        <span className="max-w-[180px] truncate text-xs text-slate-400">
                          {file.name}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeFile(index)
                          }
                          className="text-slate-600 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2 px-3 py-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      handleFiles(event.target.files);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
                    aria-label="Attach files"
                  >
                    <Paperclip size={17} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Monobloc..."
                    rows={1}
                    disabled={loading}
                    className="max-h-[180px] min-h-[36px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-5 text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={[
                      "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      listening
                        ? "bg-purple-500/10 text-purple-300"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                    aria-label="Voice input"
                  >
                    <Mic
                      size={17}
                      className={
                        listening ? "animate-pulse" : ""
                      }
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || loading}
                    className={[
                      "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      input.trim() && !loading
                        ? "bg-purple-500 text-white hover:bg-purple-400"
                        : "bg-white/[0.05] text-slate-700",
                    ].join(" ")}
                    aria-label="Send message"
                  >
                    {loading ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowUp size={17} />
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-2 text-center text-[10px] text-slate-700">
                Monobloc can make mistakes. Check important
                information.
              </p>
            </div>
          </div>
        </div>

        {/* Members */}
        {showMembers && (
          <div className="fixed inset-0 z-[200]">
            <button
              type="button"
              onClick={() => setShowMembers(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              aria-label="Close members"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/[0.08] bg-[#0b0d12] shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <div>
                  <h2 className="text-sm font-medium text-white">
                    Members
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-600">
                    People and agents in this conversation
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMembers(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {participants.length === 0 ? (
                  <div className="flex min-h-[240px] items-center justify-center text-center">
                    <div>
                      <Users
                        size={20}
                        className="mx-auto mb-3 text-slate-700"
                      />

                      <p className="text-sm text-slate-400">
                        No other participants yet.
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Invite someone to collaborate in this
                        conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.03]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-xs text-slate-400">
                          {participant.type === "agent" ? (
                            <Sparkles size={14} />
                          ) : (
                            participant.name
                              .slice(0, 1)
                              .toUpperCase()
                          )}
                        </div>

                        <div>
                          <p className="text-sm text-slate-300">
                            {participant.name}
                          </p>

                          {participant.role && (
                            <p className="text-xs text-slate-600">
                              {participant.role}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.06] p-5">
                <button
                  type="button"
                  onClick={invitePeople}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-300 hover:border-purple-400/30 hover:bg-purple-500/[0.06] hover:text-white"
                >
                  {inviteCopied
                    ? "Invite link copied"
                    : "Invite people"}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}