"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Circle,
  Filter,
  Inbox as InboxIcon,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Pin,
  Search,
  Send,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

type Source =
  | "gmail"
  | "instagram"
  | "whatsapp"
  | "discord"
  | "sms"
  | "Monobloc";

type Message = {
  id: number;
  sender: string;
  handle?: string;
  preview: string;
  content: string;
  source: Source;
  time: string;
  unread: boolean;
  important?: boolean;
  pinned?: boolean;
  category: "priority" | "personal" | "work" | "social";
  avatar: string;
};

const messages: Message[] = [
  {
    id: 1,
    sender: "Arjun Mehta",
    handle: "arjun@venturelabs.com",
    preview: "Hey, I looked through the Monobloc deck. Can we talk tomorrow?",
    content:
      "Hey Monicca, I looked through the Monobloc deck and the concept is genuinely interesting. I'd love to understand more about your long-term vision and where you see the product going. Can we schedule a call tomorrow?",
    source: "gmail",
    time: "2m",
    unread: true,
    important: true,
    category: "work",
    avatar: "AM",
  },
  {
    id: 2,
    sender: "Nithish",
    handle: "@nithish",
    preview: "The latest build is working now 😭",
    content:
      "The latest build is working now 😭 I fixed the issue that was causing the page to break. Check it when you can.",
    source: "whatsapp",
    time: "8m",
    unread: true,
    important: true,
    category: "work",
    avatar: "N",
  },
  {
    id: 3,
    sender: "Monobloc Team",
    handle: "Discord",
    preview: "Dushyanth uploaded a new marketing idea.",
    content:
      "Dushyanth uploaded a new marketing idea in the #marketing channel. There are also two new replies on the launch discussion.",
    source: "discord",
    time: "21m",
    unread: true,
    category: "work",
    avatar: "ZT",
  },
  {
    id: 4,
    sender: "Sarah",
    handle: "@sarah.exe",
    preview: "YOU ARE NOT READY FOR WHAT HAPPENED TODAY",
    content:
      "YOU ARE NOT READY FOR WHAT HAPPENED TODAY. I need to tell you everything immediately 😭",
    source: "instagram",
    time: "35m",
    unread: false,
    category: "personal",
    avatar: "S",
  },
  {
    id: 5,
    sender: "College Updates",
    handle: "SMS",
    preview: "Reminder: Your upcoming academic schedule has been updated.",
    content:
      "Reminder: Your upcoming academic schedule has been updated. Please check your student portal for additional details.",
    source: "sms",
    time: "1h",
    unread: false,
    category: "personal",
    avatar: "CU",
  },
  {
    id: 6,
    sender: "Monobloc Intelligence",
    handle: "Monobloc",
    preview: "You have 3 messages that may need your attention.",
    content:
      "I detected 3 messages across your connected inboxes that appear to need your attention. Two are work-related and one is personal.",
    source: "Monobloc",
    time: "2h",
    unread: false,
    important: true,
    category: "priority",
    avatar: "ZI",
  },
  {
    id: 7,
    sender: "Discord Community",
    handle: "#general",
    preview: "12 new messages in the last hour.",
    content:
      "There are 12 new messages in the general channel. Monobloc grouped them together because none currently appear to require a direct response.",
    source: "discord",
    time: "3h",
    unread: false,
    category: "social",
    avatar: "DC",
  },
];

const sources: {
  id: Source | "all";
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: "all",
    label: "All",
    icon: <InboxIcon size={14} />,
  },
  {
    id: "gmail",
    label: "Gmail",
    icon: <Mail size={14} />,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <MessageCircle size={14} />,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <Camera size={14} />,
  },
  {
    id: "discord",
    label: "Discord",
    icon: <Users size={14} />,
  },
  {
    id: "sms",
    label: "SMS",
    icon: <Phone size={14} />,
  },
];

export default function InboxPage() {
  const [selectedSource, setSelectedSource] =
    useState<Source | "all">("all");

  const [selectedCategory, setSelectedCategory] =
    useState<"all" | Message["category"]>("all");

  const [selectedMessageId, setSelectedMessageId] =
    useState<number | null>(1);

  const [search, setSearch] = useState("");
  const [readMessages, setReadMessages] = useState<number[]>([]);
  const [starredMessages, setStarredMessages] = useState<number[]>([]);
  const [archivedMessages, setArchivedMessages] = useState<number[]>([]);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const sourceMatch =
        selectedSource === "all" ||
        message.source === selectedSource;

      const categoryMatch =
        selectedCategory === "all" ||
        message.category === selectedCategory;

      const searchMatch =
        message.sender.toLowerCase().includes(search.toLowerCase()) ||
        message.preview.toLowerCase().includes(search.toLowerCase()) ||
        message.content.toLowerCase().includes(search.toLowerCase());

      return (
        sourceMatch &&
        categoryMatch &&
        searchMatch &&
        !archivedMessages.includes(message.id)
      );
    });
  }, [
    selectedSource,
    selectedCategory,
    search,
    archivedMessages,
  ]);

  const selectedMessage =
    filteredMessages.find(
      (message) => message.id === selectedMessageId
    ) ||
    filteredMessages[0] ||
    null;

  const priorityCount = messages.filter(
    (message) =>
      message.important &&
      !archivedMessages.includes(message.id)
  ).length;

  function openMessage(id: number) {
    setSelectedMessageId(id);

    setReadMessages((current) =>
      current.includes(id) ? current : [...current, id]
    );

    setMobileDetailOpen(true);
  }

  function toggleStar(id: number) {
    setStarredMessages((current) =>
      current.includes(id)
        ? current.filter((messageId) => messageId !== id)
        : [...current, id]
    );
  }

  function archiveMessage(id: number) {
    setArchivedMessages((current) =>
      current.includes(id) ? current : [...current, id]
    );

    if (selectedMessageId === id) {
      setSelectedMessageId(null);
    }

    setMobileDetailOpen(false);
  }

  function markAllRead() {
    setReadMessages(
      messages
        .filter((message) => message.unread)
        .map((message) => message.id)
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      {/* Floating Sidebar */}
      <FloatingSidebar />

      {/* Main Content Area Container (Shifted right using pl-20 sm:pl-24) */}
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 pl-20 sm:pl-24 shadow-2xl">
        
        {/* HEADER SECTION */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Inbox
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              One command center · Multiple inboxes connected in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <Bell size={18} />
            </button>

            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>

            <div className="ml-2 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-800" />
              </div>
              <div className="text-left text-xs">
                <p className="font-medium text-white">Monobloc User</p>
                <p className="text-[10px] text-slate-400">user@Monobloc.app</p>
              </div>
            </div>
          </div>
        </header>

        {/* AI PRIORITY BANNER */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#251f33] via-[#1b1924] to-[#181622] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
                <Sparkles size={18} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    Monobloc sorted your communications
                  </h3>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {priorityCount} conversations need attention. Everything else is organized automatically.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCategory("priority")}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20"
            >
              View Priorities
            </button>
          </div>
        </section>

        {/* SOURCE FILTERS */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto">
          {sources.map((source) => {
            const active = selectedSource === source.id;

            return (
              <button
                key={source.id}
                type="button"
                onClick={() => setSelectedSource(source.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {source.icon}
                {source.label}
              </button>
            );
          })}
        </div>

        {/* INBOX MAIN GRID */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#1b1924]">
          <div className="flex flex-col gap-4 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search across inboxes..."
                className="w-full rounded-full border border-white/10 bg-[#14131a] py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "all", label: "All" },
                { id: "priority", label: "Priority" },
                { id: "work", label: "Work" },
                { id: "personal", label: "Personal" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      filter.id as "all" | Message["category"]
                    )
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === filter.id
                      ? "bg-white/10 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid min-h-[600px] lg:grid-cols-12">
            {/* MESSAGE LIST */}
            <div className="border-r border-white/5 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                <span className="text-xs font-medium text-slate-400">
                  Unified Feed
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                  {filteredMessages.length} messages
                </span>
              </div>

              <div className="max-h-[550px] divide-y divide-white/5 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
                    <InboxIcon size={24} className="text-slate-600" />
                    <p className="mt-2 text-xs text-slate-400">
                      No messages found.
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message) => {
                    const isSelected =
                      selectedMessage?.id === message.id;
                    const isRead =
                      !message.unread ||
                      readMessages.includes(message.id);

                    return (
                      <button
                        key={message.id}
                        type="button"
                        onClick={() => openMessage(message.id)}
                        className={`flex w-full items-start gap-3 p-4 text-left transition ${
                          isSelected
                            ? "bg-white/5"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-xs font-bold text-purple-300">
                          {message.avatar}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-xs ${
                                !isRead
                                  ? "font-bold text-white"
                                  : "font-medium text-slate-300"
                              }`}
                            >
                              {message.sender}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {message.time}
                            </span>
                          </div>

                          <p
                            className={`mt-1 truncate text-xs ${
                              !isRead
                                ? "text-slate-300"
                                : "text-slate-500"
                            }`}
                          >
                            {message.preview}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <SourceBadge source={message.source} />
                            <span className="text-[10px] text-slate-500">
                              {message.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* MESSAGE DETAIL */}
            <div
              className={`lg:col-span-7 ${
                mobileDetailOpen
                  ? "fixed inset-0 z-50 flex flex-col bg-[#1b1924] p-6 lg:static"
                  : "hidden lg:block"
              }`}
            >
              {selectedMessage ? (
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMobileDetailOpen(false)}
                          className="rounded-lg border border-white/10 p-1 text-slate-400 lg:hidden"
                        >
                          <ArrowLeft size={16} />
                        </button>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-xs font-bold text-purple-300">
                          {selectedMessage.avatar}
                        </div>

                        <div>
                          <h2 className="text-sm font-semibold text-white">
                            {selectedMessage.sender}
                          </h2>
                          <p className="text-[10px] text-slate-400">
                            {selectedMessage.handle || "Connected Inbox"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStar(selectedMessage.id)}
                          className={`rounded-full p-2 transition ${
                            starredMessages.includes(selectedMessage.id)
                              ? "bg-amber-500/20 text-amber-400"
                              : "text-slate-500 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Star size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => archiveMessage(selectedMessage.id)}
                          className="rounded-full p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                        >
                          <Archive size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <SourceBadge source={selectedMessage.source} />
                      <p className="mt-4 text-sm font-medium leading-relaxed text-slate-200">
                        {selectedMessage.content}
                      </p>
                    </div>
                  </div>

                  <div className="m-6 rounded-2xl border border-white/5 bg-[#14131a] p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-purple-400" />
                      <span className="text-xs font-semibold text-white">
                        Monobloc Assistance
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                      >
                        Summarize
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                      >
                        Create Task
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                      >
                        Draft Reply
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-500">
                  <MessageCircle size={28} />
                  <p className="mt-2 text-xs">
                    Select a conversation to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONNECTED INBOXES */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Connected Networks
            </h3>
            <button className="text-xs text-slate-400 hover:text-white">
              Manage connections
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <ConnectionCard
              icon={<Mail size={16} />}
              name="Gmail"
              status="Connected"
              active
            />
            <ConnectionCard
              icon={<MessageCircle size={16} />}
              name="WhatsApp"
              status="Connected"
              active
            />
            <ConnectionCard
              icon={<Camera size={16} />}
              name="Instagram"
              status="Not connected"
              active={false}
            />
            <ConnectionCard
              icon={<Users size={16} />}
              name="Discord"
              status="Connected"
              active
            />
            <ConnectionCard
              icon={<Phone size={16} />}
              name="SMS"
              status="Coming soon"
              active={false}
            />
          </div>
        </section>

      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

function SourceBadge({ source }: { source: Source }) {
  const config: Record<
    Source,
    {
      label: string;
      className: string;
    }
  > = {
    gmail: {
      label: "Gmail",
      className: "border-red-500/20 bg-red-500/10 text-red-400",
    },
    instagram: {
      label: "Instagram",
      className: "border-pink-500/20 bg-pink-500/10 text-pink-400",
    },
    whatsapp: {
      label: "WhatsApp",
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },
    discord: {
      label: "Discord",
      className: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    },
    sms: {
      label: "SMS",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    },
    Monobloc: {
      label: "Monobloc",
      className: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    },
  };

  const item = config[source];

  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function ConnectionCard({
  icon,
  name,
  status,
  active,
}: {
  icon: ReactNode;
  name: string;
  status: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#1b1924] p-3.5 transition hover:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-white">{name}</p>
          <p
            className={`text-[10px] ${
              active ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {status}
          </p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-600" />
    </div>
  );
}