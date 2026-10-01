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

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
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

  /* ----------------------------- Multiplayer ----------------------------- */

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

  /* --------------------------------- AI --------------------------------- */

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

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);

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

  /* ------------------------------ Input -------------------------------- */

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

  /* ------------------------------ New Chat ------------------------------ */

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

  /* -------------------------------- Copy -------------------------------- */

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

  /* ------------------------------- Invite ------------------------------- */

  async function invitePeople() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setInviteCopied(true);

      window.setTimeout(() => {
        setInviteCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Invite copy failed:", error);
    }
  }

  /* ------------------------------- Files -------------------------------- */

  function handleFiles(files: FileList | null) {
    if (!files) return;

    setSelectedFiles((current) => [
      ...current,
      ...Array.from(files),
    ]);
  }

  function removeFile(index: number) {
    setSelectedFiles((current) =>
      current.filter(
        (_, fileIndex) => fileIndex !== index
      )
    );
  }

  /* ------------------------------- Voice -------------------------------- */

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
        current
          ? `${current} ${transcript}`
          : transcript
      );

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    };

    recognition.onerror = (event: any) => {
      console.error(
        "Speech recognition error:",
        event
      );

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

  /* ------------------------------- Helpers ------------------------------ */

  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const hasMessages = messages.length > 0;

  /* -------------------------------- Render ------------------------------- */

  return (
    <>
      <div className="min-h-screen bg-[#080808] text-white">
        <FloatingSidebar />

        <div className="min-h-screen">
          {/* -------------------------------- Header -------------------------------- */}

          <header className="fixed left-0 right-0 top-0 z-40">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-white/[0.04] hover:text-white"
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
                  className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-neutral-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  New chat

                  <ChevronDown
                    size={14}
                    className="text-neutral-700"
                  />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowMembers(true)
                  }
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <Users size={15} />

                  <span className="hidden sm:inline">
                    Members
                  </span>
                </button>

                <button
                  type="button"
                  onClick={invitePeople}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-neutral-400 transition hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                >
                  {inviteCopied
                    ? "Copied"
                    : "Invite"}
                </button>
              </div>
            </div>
          </header>

          {/* -------------------------------- Main -------------------------------- */}

          <main className="min-h-screen pb-40 pt-20">
            {!hasMessages ? (
              <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-6">
                <div className="w-full max-w-2xl text-center">
                  <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                    <Sparkles
                      size={22}
                      className="text-white/80"
                    />
                  </div>

                  <h1 className="text-2xl font-medium tracking-tight text-white">
                    How can I help?
                  </h1>

                  <p className="mt-2 text-sm text-neutral-600">
                    Ask anything, or bring your team
                    into the conversation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-3xl px-5">
                <div className="space-y-8">
                  {messages.map((message) => {
                    const isAgent =
                      message.authorType ===
                      "agent";

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
                                ? "bg-white/[0.08] text-white/80"
                                : "bg-white/[0.05] text-neutral-500",
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
                                ? "text-xs font-medium text-white/80"
                                : "text-xs font-medium text-neutral-500"
                            }
                          >
                            {message.authorName}
                          </span>

                          <span className="text-[10px] text-neutral-700">
                            {formatTime(
                              message.timestamp
                            )}
                          </span>
                        </div>

                        <div className="pl-8 text-[15px] leading-7 text-neutral-300">
                          <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:text-white prose-a:text-white prose-strong:text-white prose-code:text-neutral-200 prose-pre:border prose-pre:border-white/[0.06] prose-pre:bg-black/40">
                            <ReactMarkdown
                              remarkPlugins={[
                                remarkGfm,
                              ]}
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
                            className="mt-2 flex items-center gap-1.5 text-xs text-neutral-700 opacity-0 transition hover:text-neutral-400 group-hover:opacity-100"
                          >
                            {copied ===
                            message.id ? (
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

                  {/* AI request loader — kept intentionally */}
                  {loading && (
                    <div className="flex items-center gap-3 pl-8 text-sm text-neutral-600">
                      <Loader2
                        size={15}
                        className="animate-spin text-white/60"
                      />

                      Monobloc is thinking...
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* -------------------------------- Composer -------------------------------- */}

          <div className="fixed bottom-0 left-0 right-0 z-30">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808] via-[#080808]/95 to-transparent" />

            <div className="relative mx-auto w-full max-w-3xl px-5 pb-5">
              <div className="rounded-2xl border border-white/[0.10] bg-[#111111] shadow-2xl shadow-black/50">
                {/* Selected files */}

                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-b border-white/[0.06] px-4 py-3">
                    {selectedFiles.map(
                      (file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex max-w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5"
                        >
                          <Paperclip
                            size={12}
                            className="text-neutral-600"
                          />

                          <span className="max-w-[180px] truncate text-xs text-neutral-500">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeFile(index)
                            }
                            className="text-neutral-700 hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="flex items-end gap-2 px-3 py-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      handleFiles(
                        event.target.files
                      );

                      if (
                        fileInputRef.current
                      ) {
                        fileInputRef.current.value =
                          "";
                      }
                    }}
                  />

                  {/* Attach */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-white/[0.05] hover:text-white"
                    aria-label="Attach files"
                  >
                    <Paperclip size={17} />
                  </button>

                  {/* Text input */}

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Monobloc..."
                    rows={1}
                    disabled={loading}
                    className="max-h-[180px] min-h-[36px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-5 text-white outline-none placeholder:text-neutral-700"
                  />

                  {/* Voice */}

                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={[
                      "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      listening
                        ? "bg-white/[0.08] text-white"
                        : "text-neutral-600 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                    aria-label="Voice input"
                  >
                    <Mic
                      size={17}
                      className={
                        listening
                          ? "animate-pulse"
                          : ""
                      }
                    />
                  </button>

                  {/* Send */}

                  <button
                    type="button"
                    onClick={() =>
                      void sendMessage()
                    }
                    disabled={
                      !input.trim() || loading
                    }
                    className={[
                      "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      input.trim() && !loading
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "bg-white/[0.05] text-neutral-700",
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

              <p className="mt-2 text-center text-[10px] text-neutral-800">
                Monobloc can make mistakes. Check
                important information.
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------- Members Drawer -------------------------------- */}

        {showMembers && (
          <div className="fixed inset-0 z-[200]">
            <button
              type="button"
              onClick={() =>
                setShowMembers(false)
              }
              className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
              aria-label="Close members"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/[0.08] bg-[#0c0c0c] shadow-2xl shadow-black/60">
              {/* Drawer header */}

              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <div>
                  <h2 className="text-sm font-medium text-white">
                    Members
                  </h2>

                  <p className="mt-0.5 text-xs text-neutral-700">
                    People and agents in this
                    conversation
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowMembers(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Members */}

              <div className="flex-1 overflow-y-auto p-5">
                {participants.length === 0 ? (
                  <div className="flex min-h-[240px] items-center justify-center text-center">
                    <div>
                      <Users
                        size={20}
                        className="mx-auto mb-3 text-neutral-800"
                      />

                      <p className="text-sm text-neutral-500">
                        No other participants yet.
                      </p>

                      <p className="mt-1 text-xs text-neutral-700">
                        Invite someone to collaborate
                        in this conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participants.map(
                      (participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.03]"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-xs text-neutral-500">
                            {participant.type ===
                            "agent" ? (
                              <Sparkles size={14} />
                            ) : (
                              participant.name
                                .slice(0, 1)
                                .toUpperCase()
                            )}
                          </div>

                          <div>
                            <p className="text-sm text-neutral-300">
                              {participant.name}
                            </p>

                            {participant.role && (
                              <p className="text-xs text-neutral-700">
                                {
                                  participant.role
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Invite */}

              <div className="border-t border-white/[0.06] p-5">
                <button
                  type="button"
                  onClick={invitePeople}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-neutral-400 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
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