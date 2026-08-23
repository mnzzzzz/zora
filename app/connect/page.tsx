"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Circle,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  UserPlus,
  Users,
  Video,
  Phone,
  X,
  Zap,
} from "lucide-react";

import FloatingSidebar from "@/components/floatingsidebar";

type User = {
  id: string;
  name: string;
  username: string;
  initials: string;
  status: "online" | "away" | "offline";
  role: string;
  lastSeen?: string;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
};

type Conversation = {
  userId: string;
  messages: Message[];
};

const currentUserId = "me";

export default function ConnectPage() {
  const [users] = useState<User[]>([]);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selectedUserId, setSelectedUserId] =
    useState<string>("");

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showNewConnection, setShowNewConnection] =
    useState(false);
  const [newUsername, setNewUsername] = useState("");

  const [mobileChatOpen, setMobileChatOpen] =
    useState(false);

  /* =====================================================
     LOAD LOCAL DATA
  ===================================================== */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "zora-connect-conversations"
      );

      if (saved) {
        setConversations(JSON.parse(saved));
      }
    } catch {
      setConversations([]);
    }
  }, []);

  /* =====================================================
     SAVE LOCAL DATA
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "zora-connect-conversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  /* =====================================================
     SELECTED USER
  ===================================================== */

  const selectedUser = users.find(
    (user) => user.id === selectedUserId
  );

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.userId === selectedUserId
    );

  const selectedMessages =
    selectedConversation?.messages || [];

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [search, users]);

  /* =====================================================
     UNREAD
  ===================================================== */

  const unreadCount = conversations.reduce(
    (total, conversation) => {
      return (
        total +
        conversation.messages.filter(
          (msg) =>
            msg.senderId !== currentUserId &&
            !msg.read
        ).length
      );
    },
    0
  );

  /* =====================================================
     SELECT CONVERSATION
  ===================================================== */

  const selectConversation = (userId: string) => {
    setSelectedUserId(userId);
    setMobileChatOpen(true);

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.userId !== userId) {
          return conversation;
        }

        return {
          ...conversation,
          messages: conversation.messages.map(
            (msg) =>
              msg.senderId !== currentUserId
                ? {
                    ...msg,
                    read: true,
                  }
                : msg
          ),
        };
      })
    );
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = () => {
    if (!message.trim() || !selectedUserId) {
      return;
    }

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: currentUserId,
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      read: true,
    };

    setConversations((current) => {
      const exists = current.some(
        (conversation) =>
          conversation.userId === selectedUserId
      );

      if (!exists) {
        return [
          ...current,
          {
            userId: selectedUserId,
            messages: [newMessage],
          },
        ];
      }

      return current.map((conversation) =>
        conversation.userId === selectedUserId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                newMessage,
              ],
            }
          : conversation
      );
    });

    setMessage("");
  };

  /* =====================================================
     KEYBOARD SEND
  ===================================================== */

  const handleMessageKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /* =====================================================
     ADD CONNECTION
  ===================================================== */

  const addConnection = () => {
    if (!newUsername.trim()) return;

    setNewUsername("");
    setShowNewConnection(false);
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const statusText = (status: User["status"]) => {
    if (status === "online") return "Online";
    if (status === "away") return "Away";
    return "Offline";
  };

  const statusClass = (status: User["status"]) => {
    if (status === "online") {
      return "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.8)]";
    }

    if (status === "away") {
      return "bg-yellow-400";
    }

    return "bg-slate-600";
  };

  /* =====================================================
     LAST MESSAGE
  ===================================================== */

  const getLastMessage = (userId: string) => {
    const conversation = conversations.find(
      (item) => item.userId === userId
    );

    if (!conversation || conversation.messages.length === 0) {
      return "Start a conversation";
    }

    return conversation.messages[
      conversation.messages.length - 1
    ].text;
  };

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
          md:pl-[220px]
          md:pr-6
          lg:pl-[235px]
          lg:pr-8
        "
      >
        {/* =================================================
            AMBIENCE
        ================================================= */}

        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[20%] top-[10%] h-80 w-80 rounded-full bg-cyan-500/[0.04] blur-[120px]" />

          <div className="absolute right-[10%] bottom-[10%] h-96 w-96 rounded-full bg-blue-600/[0.04] blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1500px]">
          {/* =================================================
              HEADER
          ================================================= */}

          <header className="mb-5 rounded-[28px] border border-white/10 bg-[#0b1525]/85 backdrop-blur-2xl">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Users
                    size={22}
                    className="text-cyan-300"
                  />

                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0b1525] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.8)]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                      ZORA / CONNECT
                    </p>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2 py-0.5 text-[9px] font-semibold text-cyan-400">
                      LIVE
                    </span>
                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                    Connect
                  </h1>

                  <p className="mt-1 text-xs text-slate-500 md:text-sm">
                    Talk to people inside your Zora workspace.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 md:flex">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.8)]" />

                  <span className="text-xs text-slate-400">
                    Communication online
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNewConnection(true)
                  }
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-bold transition hover:scale-[1.02]"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">
                    Add person
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-[11px] text-slate-600">
              <Zap
                size={13}
                className="text-cyan-400"
              />

              Zora communication layer active

              <span className="ml-auto hidden font-mono md:block">
                ENCRYPTED WORKSPACE
              </span>
            </div>
          </header>

          {/* =================================================
              COMMAND STRIP
          ================================================= */}

          <section className="mb-5 rounded-[24px] border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.06] via-blue-500/[0.03] to-transparent p-4 backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                <Sparkles
                  size={18}
                  className="text-cyan-300"
                />
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Zora Network
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {users.length} people connected to your workspace
                  {unreadCount > 0
                    ? ` · ${unreadCount} unread message${
                        unreadCount === 1 ? "" : "s"
                      }`
                    : " · All caught up"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Circle
                  size={8}
                  className="fill-cyan-400 text-cyan-400"
                />
                Network stable
              </div>
            </div>
          </section>

          {/* =================================================
              COMMUNICATION CENTER
          ================================================= */}

          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a1322]/90 shadow-2xl backdrop-blur-2xl">
            <div className="grid min-h-[650px] lg:grid-cols-[320px_minmax(0,1fr)]">
              {/* =================================================
                  PEOPLE PANEL
              ================================================= */}

              <aside
                className={`
                  border-r border-white/10
                  ${
                    mobileChatOpen
                      ? "hidden lg:block"
                      : "block"
                  }
                `}
              >
                {/* Search */}

                <div className="border-b border-white/10 p-4">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search people..."
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
                    />
                  </div>
                </div>

                {/* People header */}

                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
                      Connections
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {filteredUsers.length} people
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(true)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* People */}

                <div className="space-y-1 px-2 pb-4">
                  {filteredUsers.map((user) => {
                    const active =
                      selectedUserId === user.id;

                    const unread =
                      conversations
                        .find(
                          (conversation) =>
                            conversation.userId ===
                            user.id
                        )
                        ?.messages.filter(
                          (msg) =>
                            msg.senderId !==
                              currentUserId &&
                            !msg.read
                        ).length || 0;

                    return (
                      <button
                        type="button"
                        key={user.id}
                        onClick={() =>
                          selectConversation(user.id)
                        }
                        className={`group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                          active
                            ? "border border-cyan-400/10 bg-cyan-400/[0.07]"
                            : "border border-transparent hover:bg-white/[0.035]"
                        }`}
                      >
                        {/* Avatar */}

                        <div className="relative shrink-0">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xs font-bold ${
                              active
                                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                                : "border-white/10 bg-white/[0.04] text-slate-400"
                            }`}
                          >
                            {user.initials}
                          </div>

                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a1322] ${statusClass(
                              user.status
                            )}`}
                          />
                        </div>

                        {/* Info */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-sm font-semibold ${
                                active
                                  ? "text-white"
                                  : "text-slate-300"
                              }`}
                            >
                              {user.name}
                            </p>

                            {unread > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1.5 text-[9px] font-bold text-[#04111b]">
                                {unread}
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-[11px] text-slate-600">
                            {getLastMessage(user.id)}
                          </p>
                        </div>

                        <ChevronRight
                          size={14}
                          className={`shrink-0 transition ${
                            active
                              ? "text-cyan-400"
                              : "text-slate-800 group-hover:text-slate-500"
                          }`}
                        />
                      </button>
                    );
                  })}

                  {filteredUsers.length === 0 && (
                    <div className="px-4 py-12 text-center">
                      <Users
                        size={24}
                        className="mx-auto mb-3 text-slate-700"
                      />

                      <p className="text-sm text-slate-500">
                        No connections found.
                      </p>

                      <p className="mt-1 text-xs text-slate-700">
                        Try another search.
                      </p>
                    </div>
                  )}
                </div>
              </aside>

              {/* =================================================
                  CHAT PANEL
              ================================================= */}

              <div
                className={`
                  flex min-w-0 flex-col
                  ${
                    mobileChatOpen
                      ? "flex"
                      : "hidden lg:flex"
                  }
                `}
              >
                {selectedUser ? (
                  <>
                    {/* CHAT HEADER */}

                    <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileChatOpen(false)
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 lg:hidden"
                        >
                          <ArrowLeft size={16} />
                        </button>

                        <div className="relative shrink-0">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] text-xs font-bold text-cyan-300">
                            {selectedUser.initials}
                          </div>

                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a1322] ${statusClass(
                              selectedUser.status
                            )}`}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="truncate text-sm font-bold text-white md:text-base">
                              {selectedUser.name}
                            </h2>

                            {selectedUser.status ===
                              "online" && (
                              <span className="hidden rounded-full bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400 sm:inline">
                                Online
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-xs text-slate-600">
                            {selectedUser.username} ·{" "}
                            {selectedUser.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-cyan-400 sm:flex"
                          aria-label="Voice call"
                        >
                          <Phone size={16} />
                        </button>

                        <button
                          type="button"
                          className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-cyan-400 sm:flex"
                          aria-label="Video call"
                        >
                          <Video size={17} />
                        </button>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
                          aria-label="More options"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </header>

                    {/* SYSTEM LINE */}

                    <div className="flex items-center gap-2 border-b border-white/5 px-5 py-2.5 text-[10px] text-slate-700">
                      <Sparkles
                        size={12}
                        className="text-cyan-500"
                      />

                      Zora communication channel established

                      <span className="ml-auto hidden font-mono md:block">
                        SECURE
                      </span>
                    </div>

                    {/* MESSAGES */}

                    <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
                      {selectedMessages.length === 0 ? (
                        <div className="flex h-full min-h-[400px] items-center justify-center">
                          <div className="max-w-sm text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06]">
                              <MessageCircle
                                size={27}
                                className="text-cyan-400"
                              />
                            </div>

                            <p className="text-lg font-bold">
                              Start the conversation
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Send a message to{" "}
                              {selectedUser.name} and get
                              things moving.
                            </p>
                          </div>
                        </div>
                      ) : (
                        selectedMessages.map(
                          (msg, index) => {
                            const isMine =
                              msg.senderId ===
                              currentUserId;

                            const previous =
                              selectedMessages[
                                index - 1
                              ];

                            const showAvatar =
                              !previous ||
                              previous.senderId !==
                                msg.senderId;

                            return (
                              <div
                                key={msg.id}
                                className={`flex ${
                                  isMine
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`flex max-w-[85%] gap-2.5 md:max-w-[70%] ${
                                    isMine
                                      ? "flex-row-reverse"
                                      : "flex-row"
                                  }`}
                                >
                                  {!isMine &&
                                    showAvatar && (
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[9px] font-bold text-slate-500">
                                        {
                                          selectedUser.initials
                                        }
                                      </div>
                                    )}

                                  {!isMine &&
                                    !showAvatar && (
                                      <div className="w-8 shrink-0" />
                                    )}

                                  <div
                                    className={`${
                                      isMine
                                        ? "items-end"
                                        : "items-start"
                                    } flex min-w-0 flex-col`}
                                  >
                                    <div
                                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                        isMine
                                          ? "rounded-br-md bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_8px_30px_rgba(34,211,238,.08)]"
                                          : "rounded-bl-md border border-white/10 bg-white/[0.045] text-slate-300"
                                      }`}
                                    >
                                      {msg.text}
                                    </div>

                                    <div
                                      className={`mt-1.5 flex items-center gap-1.5 px-1 text-[9px] text-slate-700 ${
                                        isMine
                                          ? "flex-row-reverse"
                                          : ""
                                      }`}
                                    >
                                      <span>
                                        {msg.timestamp}
                                      </span>

                                      {isMine &&
                                        (msg.read ? (
                                          <CheckCheck
                                            size={12}
                                            className="text-cyan-500"
                                          />
                                        ) : (
                                          <Check
                                            size={12}
                                          />
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )
                      )}
                    </div>

                    {/* COMPOSER */}

                    <div className="border-t border-white/10 p-4 md:p-5">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-2 transition focus-within:border-cyan-400/20 focus-within:bg-white/[0.035]">
                        <div className="flex items-center gap-2">
                          <input
                            value={message}
                            onChange={(e) =>
                              setMessage(e.target.value)
                            }
                            onKeyDown={
                              handleMessageKeyDown
                            }
                            placeholder={`Message ${selectedUser.name}...`}
                            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-700"
                          />

                          <button
                            type="button"
                            onClick={sendMessage}
                            disabled={!message.trim()}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                            aria-label="Send message"
                          >
                            <Send
                              size={16}
                              className="ml-0.5"
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-3 pb-1 pt-1">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-700">
                            ENTER TO SEND
                          </p>

                          <div className="flex items-center gap-1.5 text-[9px] text-slate-700">
                            <Circle
                              size={7}
                              className="fill-cyan-400 text-cyan-400"
                            />
                            Zora network
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-10">
                    <div className="text-center">
                      <Users
                        size={32}
                        className="mx-auto mb-4 text-slate-700"
                      />

                      <p className="font-semibold text-slate-400">
                        Select a connection
                      </p>

                      <p className="mt-1 text-xs text-slate-700">
                        Choose someone to start communicating.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              BOTTOM STATUS
          ================================================= */}

          <section className="mt-5 grid gap-4 md:grid-cols-3">
            <StatusCard
              icon={<Users size={17} />}
              label="Connections"
              value={users.length.toString()}
            />

            <StatusCard
              icon={<MessageCircle size={17} />}
              label="Messages"
              value={conversations
                .reduce(
                  (total, conversation) =>
                    total + conversation.messages.length,
                  0
                )
                .toString()}
            />

            <StatusCard
              icon={<Bell size={17} />}
              label="Unread"
              value={unreadCount.toString()}
            />
          </section>
        </div>

        {/* =================================================
            ADD CONNECTION MODAL
        ================================================= */}

        {showNewConnection && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowNewConnection(false);
              }
            }}
          >
            <div className="w-full max-w-[460px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0a1423] shadow-2xl">
              {/* Top glow */}

              <div className="relative border-b border-white/10 p-6">
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-[80px]" />

                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <UserPlus size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                        New connection
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Add someone
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(false)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-slate-600 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="mb-3 text-xs text-slate-500">
                  Enter their Zora username.
                </p>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                    @
                  </span>

                  <input
                    autoFocus
                    value={newUsername}
                    onChange={(e) =>
                      setNewUsername(
                        e.target.value.replace(
                          /^@/,
                          ""
                        )
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addConnection();
                      }
                    }}
                    placeholder="username"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3 text-xs text-slate-500">
                  <Sparkles
                    size={14}
                    className="shrink-0 text-cyan-400"
                  />

                  Connections let you communicate directly
                  inside Zora.
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(false)
                    }
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addConnection}
                    disabled={!newUsername.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <UserPlus size={16} />
                    Connect
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

/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1525]/70 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>

        <ArrowRight
          size={14}
          className="text-slate-800"
        />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
          {label}
        </p>

        <p className="text-xl font-bold text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}