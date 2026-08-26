"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

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
import { createClient } from "@/lib/supabase/client";

/* =========================================================
   TYPES
========================================================= */

type User = {
  id: string;
  name: string;
  username: string;
  initials: string;
  status: "online" | "away" | "offline";
  role: string;
  lastSeen?: string;
  avatar_url?: string | null;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
};

type Conversation = {
  id: string;
  userId: string;
  messages: Message[];
};

type Connection = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
};

/* =========================================================
   PAGE
========================================================= */

export default function ConnectPage() {
  // IMPORTANT:
  // Create the Supabase client inside the component.
  // This prevents Vercel/Next.js from trying to initialize
  // the browser client while statically building the page.
  const supabase = useMemo(() => createClient(), []);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [currentProfile, setCurrentProfile] =
    useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [connections, setConnections] =
    useState<Connection[]>([]);

  const [pendingRequests, setPendingRequests] =
    useState<Connection[]>([]);

  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [showNewConnection, setShowNewConnection] =
    useState(false);

  const [newUsername, setNewUsername] =
    useState("");

  const [mobileChatOpen, setMobileChatOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [sendingRequest, setSendingRequest] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD USER
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (authError || !user) {
        setError("You are not signed in.");
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      await loadProfile(user.id);
      await loadConnections(user.id);
      await loadPendingRequests(user.id);
    };

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  const loadProfile = async (userId: string) => {
    const { data, error: profileError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (profileError) {
      console.error(profileError);

      setError(
        "Could not load your Zora profile."
      );

      setLoading(false);
      return;
    }

    const profile: User = {
      id: data.id,
      name: data.name,
      username: data.username,
      initials: data.initials,
      role: data.role,
      status: data.status,
      avatar_url: data.avatar_url,
    };

    setCurrentProfile(profile);
  };

  /* =====================================================
     LOAD CONNECTIONS
  ===================================================== */

  const loadConnections = async (
    userId: string
  ) => {
    const {
      data,
      error: connectionError,
    } = await supabase
      .from("connections")
      .select("*")
      .or(
        `requester_id.eq.${userId},receiver_id.eq.${userId}`
      )
      .eq("status", "accepted");

    if (connectionError) {
      console.error(connectionError);
      setLoading(false);
      return;
    }

    const connectionRows =
      (data || []) as Connection[];

    setConnections(connectionRows);

    const otherUserIds =
      connectionRows.map((connection) =>
        connection.requester_id === userId
          ? connection.receiver_id
          : connection.requester_id
      );

    if (otherUserIds.length === 0) {
      setUsers([]);
      setConversations([]);
      setLoading(false);
      return;
    }

    const {
      data: profiles,
      error: profilesError,
    } = await supabase
      .from("profiles")
      .select("*")
      .in("id", otherUserIds);

    if (profilesError) {
      console.error(profilesError);
      setLoading(false);
      return;
    }

    const formattedUsers: User[] =
      (profiles || []).map((profile) => ({
        id: profile.id,
        name: profile.name,
        username: profile.username,
        initials: profile.initials,
        role: profile.role,
        status: profile.status,
        avatar_url: profile.avatar_url,
      }));

    setUsers(formattedUsers);

    setSelectedUserId((current) => {
      if (
        current &&
        formattedUsers.some(
          (user) => user.id === current
        )
      ) {
        return current;
      }

      return formattedUsers[0]?.id ?? null;
    });

    await loadConversations(
      userId,
      formattedUsers
    );

    setLoading(false);
  };

  /* =====================================================
     LOAD PENDING REQUESTS
  ===================================================== */

  const loadPendingRequests = async (
    userId: string
  ) => {
    const {
      data,
      error: requestError,
    } = await supabase
      .from("connections")
      .select("*")
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (requestError) {
      console.error(requestError);
      return;
    }

    setPendingRequests(
      (data || []) as Connection[]
    );
  };

  /* =====================================================
     LOAD CONVERSATIONS
  ===================================================== */

  const loadConversations = async (
    userId: string,
    connectionUsers: User[]
  ) => {
    const {
      data: memberships,
      error: memberError,
    } = await supabase
      .from("conversation_members")
      .select(
        "conversation_id,user_id"
      )
      .eq("user_id", userId);

    if (memberError) {
      console.error(memberError);
      return;
    }

    if (
      !memberships ||
      memberships.length === 0
    ) {
      setConversations([]);
      return;
    }

    const conversationIds =
      memberships.map(
        (membership) =>
          membership.conversation_id
      );

    const {
      data: allMembers,
      error: allMembersError,
    } = await supabase
      .from("conversation_members")
      .select(
        "conversation_id,user_id"
      )
      .in(
        "conversation_id",
        conversationIds
      );

    if (allMembersError) {
      console.error(allMembersError);
      return;
    }

    const {
      data: messages,
      error: messagesError,
    } = await supabase
      .from("messages")
      .select("*")
      .in(
        "conversation_id",
        conversationIds
      )
      .order("created_at", {
        ascending: true,
      });

    if (messagesError) {
      console.error(messagesError);
      return;
    }

    const formattedConversations: Conversation[] =
      conversationIds
        .map((conversationId) => {
          const members =
            allMembers?.filter(
              (member) =>
                member.conversation_id ===
                conversationId
            ) || [];

          const otherMember =
            members.find(
              (member) =>
                member.user_id !== userId
            );

          if (!otherMember) return null;

          const userExists =
            connectionUsers.some(
              (user) =>
                user.id ===
                otherMember.user_id
            );

          if (!userExists) return null;

          const conversationMessages: Message[] =
            (messages || [])
              .filter(
                (msg) =>
                  msg.conversation_id ===
                  conversationId
              )
              .map((msg) => ({
                id: msg.id,
                senderId: msg.sender_id,
                text: msg.text,
                timestamp:
                  formatTimestamp(
                    msg.created_at
                  ),
                read: msg.read,
              }));

          return {
            id: conversationId,
            userId:
              otherMember.user_id,
            messages:
              conversationMessages,
          };
        })
        .filter(
          (
            conversation
          ): conversation is Conversation =>
            conversation !== null
        );

    setConversations(
      formattedConversations
    );
  };

  /* =====================================================
     REALTIME MESSAGES
  ===================================================== */

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(
        `zora-messages-${currentUserId}`
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage =
            payload.new as {
              id: string;
              conversation_id: string;
              sender_id: string;
              text: string;
              read: boolean;
              created_at: string;
            };

          const {
            data: membership,
          } = await supabase
            .from("conversation_members")
            .select(
              "conversation_id,user_id"
            )
            .eq(
              "conversation_id",
              newMessage.conversation_id
            )
            .eq(
              "user_id",
              currentUserId
            )
            .maybeSingle();

          if (!membership) return;

          setConversations(
            (current) => {
              const conversationExists =
                current.some(
                  (conversation) =>
                    conversation.id ===
                    newMessage.conversation_id
                );

              if (!conversationExists) {
                return current;
              }

              const formattedMessage:
                Message = {
                id: newMessage.id,
                senderId:
                  newMessage.sender_id,
                text: newMessage.text,
                timestamp:
                  formatTimestamp(
                    newMessage.created_at
                  ),
                read:
                  newMessage.sender_id ===
                  currentUserId
                    ? true
                    : newMessage.read,
              };

              return current.map(
                (conversation) => {
                  if (
                    conversation.id !==
                    newMessage.conversation_id
                  ) {
                    return conversation;
                  }

                  const alreadyExists =
                    conversation.messages.some(
                      (msg) =>
                        msg.id ===
                        newMessage.id
                    );

                  if (alreadyExists) {
                    return conversation;
                  }

                  return {
                    ...conversation,
                    messages: [
                      ...conversation.messages,
                      formattedMessage,
                    ],
                  };
                }
              );
            }
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [currentUserId, supabase]);

  /* =====================================================
     SELECTED USER
  ===================================================== */

  const selectedUser = users.find(
    (user) =>
      user.id === selectedUserId
  );

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.userId ===
        selectedUserId
    );

  const selectedMessages =
    selectedConversation?.messages ||
    [];

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(query) ||
        user.username
          .toLowerCase()
          .includes(query) ||
        user.role
          .toLowerCase()
          .includes(query)
    );
  }, [search, users]);

  /* =====================================================
     UNREAD
  ===================================================== */

  const unreadCount =
    conversations.reduce(
      (total, conversation) =>
        total +
        conversation.messages.filter(
          (msg) =>
            msg.senderId !==
              currentUserId &&
            !msg.read
        ).length,
      0
    );

  /* =====================================================
     SELECT CONVERSATION
  ===================================================== */

  const selectConversation = async (
    userId: string
  ) => {
    setSelectedUserId(userId);
    setMobileChatOpen(true);

    const conversation =
      conversations.find(
        (item) =>
          item.userId === userId
      );

    if (!conversation) return;

    const unreadMessages =
      conversation.messages.filter(
        (msg) =>
          msg.senderId !==
            currentUserId &&
          !msg.read
      );

    for (const unreadMessage of unreadMessages) {
      await supabase
        .from("messages")
        .update({ read: true })
        .eq(
          "id",
          unreadMessage.id
        );
    }

    if (unreadMessages.length > 0) {
      setConversations((current) =>
        current.map((item) => {
          if (
            item.id !==
            conversation.id
          ) {
            return item;
          }

          return {
            ...item,
            messages:
              item.messages.map(
                (msg) =>
                  msg.senderId !==
                  currentUserId
                    ? {
                        ...msg,
                        read: true,
                      }
                    : msg
              ),
          };
        })
      );
    }
  };

  /* =====================================================
     GET OR CREATE CONVERSATION
  ===================================================== */

  const getOrCreateConversation =
    async (
      otherUserId: string
    ) => {
      if (!currentUserId) return null;

      const existing =
        conversations.find(
          (conversation) =>
            conversation.userId ===
            otherUserId
        );

      if (existing) {
        return existing.id;
      }

      const {
        data: myMemberships,
      } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq(
          "user_id",
          currentUserId
        );

      if (myMemberships) {
        for (const membership of myMemberships) {
          const {
            data: otherMembership,
          } = await supabase
            .from("conversation_members")
            .select(
              "conversation_id,user_id"
            )
            .eq(
              "conversation_id",
              membership.conversation_id
            )
            .eq(
              "user_id",
              otherUserId
            )
            .maybeSingle();

          if (otherMembership) {
            await loadConversations(
              currentUserId,
              users
            );

            return membership.conversation_id;
          }
        }
      }

      const {
        data: conversation,
        error: conversationError,
      } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

      if (
        conversationError ||
        !conversation
      ) {
        console.error(
          conversationError
        );

        setError(
          conversationError?.message ||
            "Could not create conversation."
        );

        return null;
      }

      const {
        error: membersError,
      } = await supabase
        .from("conversation_members")
        .insert([
          {
            conversation_id:
              conversation.id,
            user_id:
              currentUserId,
          },
          {
            conversation_id:
              conversation.id,
            user_id:
              otherUserId,
          },
        ]);

      if (membersError) {
        console.error(
          membersError
        );

        await supabase
          .from("conversations")
          .delete()
          .eq(
            "id",
            conversation.id
          );

        setError(
          membersError.message
        );

        return null;
      }

      setConversations((current) => [
        ...current,
        {
          id: conversation.id,
          userId: otherUserId,
          messages: [],
        },
      ]);

      return conversation.id;
    };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = async () => {
    const cleanMessage =
      message.trim();

    if (
      !cleanMessage ||
      !selectedUserId ||
      !currentUserId
    ) {
      return;
    }

    setMessage("");

    const conversationId =
      await getOrCreateConversation(
        selectedUserId
      );

    if (!conversationId) {
      setMessage(cleanMessage);
      return;
    }

    const {
      error: messageError,
    } = await supabase
      .from("messages")
      .insert({
        conversation_id:
          conversationId,
        sender_id:
          currentUserId,
        text: cleanMessage,
        read: false,
      });

    if (messageError) {
      console.error(
        messageError
      );

      setMessage(cleanMessage);

      setError(
        messageError.message
      );
    }
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleMessageKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void sendMessage();
    }
  };

  /* =====================================================
     ADD CONNECTION
  ===================================================== */

  const addConnection = async () => {
    if (
      !newUsername.trim() ||
      !currentUserId
    ) {
      return;
    }

    setSendingRequest(true);
    setError("");

    const username =
      newUsername
        .trim()
        .toLowerCase()
        .replace(/^@/, "");

    const {
      data: targetUser,
      error: userError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq(
        "username",
        username
      )
      .maybeSingle();

    if (userError) {
      console.error(userError);
      setError(userError.message);
      setSendingRequest(false);
      return;
    }

    if (!targetUser) {
      setError(
        `No Zora user found with @${username}.`
      );

      setSendingRequest(false);
      return;
    }

    if (
      targetUser.id ===
      currentUserId
    ) {
      setError(
        "You can't connect with yourself 😭"
      );

      setSendingRequest(false);
      return;
    }

    const {
      data: existingConnection,
    } = await supabase
      .from("connections")
      .select("*")
      .or(
        `and(requester_id.eq.${currentUserId},receiver_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},receiver_id.eq.${currentUserId})`
      )
      .maybeSingle();

    if (existingConnection) {
      if (
        existingConnection.status ===
        "accepted"
      ) {
        setError(
          "You're already connected with this person."
        );
      } else if (
        existingConnection.status ===
        "pending"
      ) {
        setError(
          "A connection request already exists."
        );
      }

      setSendingRequest(false);
      return;
    }

    const {
      error: insertError,
    } = await supabase
      .from("connections")
      .insert({
        requester_id:
          currentUserId,
        receiver_id:
          targetUser.id,
        status: "pending",
      });

    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      setSendingRequest(false);
      return;
    }

    setNewUsername("");
    setShowNewConnection(false);
    setSendingRequest(false);
  };

  /* =====================================================
     ACCEPT REQUEST
  ===================================================== */

  const acceptRequest = async (
    connection: Connection
  ) => {
    const {
      error: updateError,
    } = await supabase
      .from("connections")
      .update({
        status: "accepted",
      })
      .eq(
        "id",
        connection.id
      );

    if (updateError) {
      console.error(updateError);
      setError(updateError.message);
      return;
    }

    setPendingRequests(
      (current) =>
        current.filter(
          (request) =>
            request.id !==
            connection.id
        )
    );

    if (currentUserId) {
      await loadConnections(
        currentUserId
      );
    }
  };

  /* =====================================================
     REJECT REQUEST
  ===================================================== */

  const rejectRequest = async (
    connection: Connection
  ) => {
    const {
      error: deleteError,
    } = await supabase
      .from("connections")
      .delete()
      .eq(
        "id",
        connection.id
      );

    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message);
      return;
    }

    setPendingRequests(
      (current) =>
        current.filter(
          (request) =>
            request.id !==
            connection.id
        )
    );
  };

  /* =====================================================
     CONNECTION REALTIME
  ===================================================== */

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(
        `zora-connections-${currentUserId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "connections",
        },
        async () => {
          await loadConnections(
            currentUserId
          );

          await loadPendingRequests(
            currentUserId
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [currentUserId, supabase]);

  /* =====================================================
     STATUS
  ===================================================== */

  const statusText = (
    status: User["status"]
  ) => {
    if (status === "online")
      return "Online";

    if (status === "away")
      return "Away";

    return "Offline";
  };

  const statusClass = (
    status: User["status"]
  ) => {
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

  const getLastMessage = (
    userId: string
  ) => {
    const conversation =
      conversations.find(
        (item) =>
          item.userId === userId
      );

    if (
      !conversation ||
      conversation.messages.length ===
        0
    ) {
      return "Start a conversation";
    }

    return conversation.messages[
      conversation.messages.length - 1
    ].text;
  };

  /* =====================================================
     STATS
  ===================================================== */

  const totalMessages =
    conversations.reduce(
      (total, conversation) =>
        total +
        conversation.messages.length,
      0
    );

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b16] text-white">
        <FloatingSidebar />

        <main className="min-h-screen px-4 py-5 md:pl-[150px] lg:pl-[165px] xl:pl-[175px]">
          <div className="flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Sparkles
                  size={22}
                  className="animate-pulse text-cyan-400"
                />
              </div>

              <p className="text-sm font-semibold">
                Connecting to Zora...
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Loading your workspace
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <FloatingSidebar />

      <main className="relative min-h-screen overflow-hidden px-4 py-5 md:pl-[150px] md:pr-6 lg:pl-[165px] lg:pr-8 xl:pl-[175px]">
        {/* AMBIENCE */}

        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[20%] top-[10%] h-80 w-80 rounded-full bg-cyan-500/[0.04] blur-[120px]" />

          <div className="absolute bottom-[10%] right-[10%] h-96 w-96 rounded-full bg-blue-600/[0.04] blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
              backgroundSize:
                "70px 70px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1500px]">
          {/* HEADER */}

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
                    setShowNewConnection(
                      true
                    )
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

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="text-red-300/60 hover:text-red-300"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* COMMAND STRIP */}

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
                  {users.length}{" "}
                  {users.length === 1
                    ? "person"
                    : "people"}{" "}
                  connected to your workspace
                  {unreadCount > 0
                    ? ` · ${unreadCount} unread message${
                        unreadCount ===
                        1
                          ? ""
                          : "s"
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

          {/* PENDING REQUESTS */}

          {pendingRequests.length > 0 && (
            <section className="mb-5 rounded-[24px] border border-cyan-400/10 bg-[#0b1525]/80 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                    Connection Requests
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    Someone wants to connect
                  </p>
                </div>

                <span className="rounded-full bg-cyan-400 px-2 py-1 text-[9px] font-bold text-[#04111b]">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="space-y-2">
                {pendingRequests.map(
                  (request) => (
                    <PendingRequest
                      key={request.id}
                      request={request}
                      onAccept={() =>
                        acceptRequest(
                          request
                        )
                      }
                      onReject={() =>
                        rejectRequest(
                          request
                        )
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* COMMUNICATION CENTER */}

          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a1322]/90 shadow-2xl backdrop-blur-2xl">
            <div className="grid min-h-[650px] lg:grid-cols-[320px_minmax(0,1fr)]">
              {/* PEOPLE */}

              <aside
                className={`border-r border-white/10 ${
                  mobileChatOpen
                    ? "hidden lg:block"
                    : "block"
                }`}
              >
                <div className="border-b border-white/10 p-4">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search people..."
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
                    />
                  </div>
                </div>

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
                      setShowNewConnection(
                        true
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div className="space-y-1 px-2 pb-4">
                  {filteredUsers.map(
                    (user) => {
                      const active =
                        selectedUserId ===
                        user.id;

                      const unread =
                        conversations
                          .find(
                            (
                              conversation
                            ) =>
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
                            void selectConversation(
                              user.id
                            )
                          }
                          className={`group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                            active
                              ? "border border-cyan-400/10 bg-cyan-400/[0.07]"
                              : "border border-transparent hover:bg-white/[0.035]"
                          }`}
                        >
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

                              {unread >
                                0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1.5 text-[9px] font-bold text-[#04111b]">
                                  {unread}
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-[11px] text-slate-600">
                              {getLastMessage(
                                user.id
                              )}
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
                    }
                  )}

                  {filteredUsers.length ===
                    0 && (
                    <div className="px-4 py-12 text-center">
                      <Users
                        size={24}
                        className="mx-auto mb-3 text-slate-700"
                      />

                      <p className="text-sm text-slate-500">
                        No connections found.
                      </p>

                      <p className="mt-1 text-xs text-slate-700">
                        Add someone to start connecting.
                      </p>
                    </div>
                  )}
                </div>
              </aside>

              {/* CHAT */}

              <div
                className={`flex min-w-0 flex-col ${
                  mobileChatOpen
                    ? "flex"
                    : "hidden lg:flex"
                }`}
              >
                {selectedUser ? (
                  <>
                    <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileChatOpen(
                              false
                            )
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
                            @{selectedUser.username}{" "}
                            ·{" "}
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

                    <div className="flex items-center gap-2 border-b border-white/5 px-5 py-2.5 text-[10px] text-slate-700">
                      <Sparkles
                        size={12}
                        className="text-cyan-500"
                      />

                      Zora communication channel established

                      <span className="ml-auto hidden font-mono md:block">
                        REALTIME
                      </span>
                    </div>

                    {/* MESSAGES */}

                    <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
                      {selectedMessages.length ===
                      0 ? (
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
                              {
                                selectedUser.name
                              }{" "}
                              and get things moving.
                            </p>
                          </div>
                        </div>
                      ) : (
                        selectedMessages.map(
                          (
                            msg,
                            index
                          ) => {
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
                                    className={`flex min-w-0 flex-col ${
                                      isMine
                                        ? "items-end"
                                        : "items-start"
                                    }`}
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
                                        {
                                          msg.timestamp
                                        }
                                      </span>

                                      {isMine &&
                                        (msg.read ? (
                                          <CheckCheck
                                            size={12}
                                            className="text-cyan-500"
                                          />
                                        ) : (
                                          <Check size={12} />
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
                            onChange={(event) =>
                              setMessage(
                                event.target.value
                              )
                            }
                            onKeyDown={
                              handleMessageKeyDown
                            }
                            placeholder={`Message ${selectedUser.name}...`}
                            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-700"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              void sendMessage()
                            }
                            disabled={
                              !message.trim()
                            }
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

                            Realtime
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

          {/* STATUS */}

          <section className="mt-5 grid gap-4 md:grid-cols-3">
            <StatusCard
              icon={<Users size={17} />}
              label="Connections"
              value={users.length.toString()}
            />

            <StatusCard
              icon={
                <MessageCircle size={17} />
              }
              label="Messages"
              value={totalMessages.toString()}
            />

            <StatusCard
              icon={<Bell size={17} />}
              label="Unread"
              value={unreadCount.toString()}
            />
          </section>
        </div>

        {/* ADD CONNECTION MODAL */}

        {showNewConnection && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowNewConnection(
                  false
                );
              }
            }}
          >
            <div className="w-full max-w-[460px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0a1423] shadow-2xl">
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
                      setShowNewConnection(
                        false
                      )
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
                    onChange={(event) =>
                      setNewUsername(
                        event.target.value.replace(
                          /^@/,
                          ""
                        )
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        void addConnection();
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

                  They'll receive a connection request inside Zora.
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(
                        false
                      )
                    }
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void addConnection()
                    }
                    disabled={
                      !newUsername.trim() ||
                      sendingRequest
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <UserPlus size={16} />

                    {sendingRequest
                      ? "Sending..."
                      : "Connect"}
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
   PENDING REQUEST
========================================================= */

function PendingRequest({
  request,
  onAccept,
  onReject,
}: {
  request: Connection;
  onAccept: () => void;
  onReject: () => void;
}) {
  // IMPORTANT:
  // This component also gets its own browser Supabase client.
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            request.requester_id
          )
          .single();

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          username:
            data.username,
          initials:
            data.initials,
          role: data.role,
          status:
            data.status,
          avatar_url:
            data.avatar_url,
        });
      }
    };

    void load();
  }, [
    request.requester_id,
    supabase,
  ]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] text-xs font-bold text-cyan-300">
          {user.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>

          <p className="text-xs text-slate-600">
            @{user.username}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white/[0.05] hover:text-white sm:flex-none"
        >
          Decline
        </button>

        <button
          type="button"
          onClick={onAccept}
          className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-white sm:flex-none"
        >
          Accept
        </button>
      </div>
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
  icon: ReactNode;
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

/* =========================================================
   TIME FORMATTER
========================================================= */

function formatTimestamp(
  timestamp: string
) {
  const date = new Date(timestamp);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}