"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Circle,
  Clock3,
  Command,
  Cpu,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Radio,
  Search,
  Send,
  Signal,
  Sparkles,
  UserPlus,
  Users,
  Video,
  Wifi,
  X,
  Zap,
} from "lucide-react";

import FloatingSidebar from "@/components/floatingsidebar";
import { createClient } from "@/lib/supabase/client";

/* =========================================================
   TYPES
========================================================= */

type UserStatus = "online" | "away" | "offline";

type User = {
  id: string;
  name: string;
  username: string;
  initials: string;
  status: UserStatus;
  role: string;
  lastSeen?: string;
  avatar_url?: string | null;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  createdAt?: string;
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
  created_at?: string;
};

type Toast = {
  id: number;
  title: string;
  description: string;
  type: "success" | "info" | "error";
};

/* =========================================================
   PAGE
========================================================= */

export default function ConnectPage() {
  const supabase = useMemo(() => createClient(), []);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

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

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [toasts, setToasts] =
    useState<Toast[]>([]);

  const [systemTime, setSystemTime] =
    useState(new Date());

  /* =====================================================
     TOAST SYSTEM
  ===================================================== */

  const showToast = (
    title: string,
    description: string,
    type: Toast["type"] = "info"
  ) => {
    const id = Date.now() + Math.random();

    setToasts((current) => [
      ...current,
      {
        id,
        title,
        description,
        type,
      },
    ]);

    window.setTimeout(() => {
      setToasts((current) =>
        current.filter(
          (toast) => toast.id !== id
        )
      );
    }, 3500);
  };

  /* =====================================================
     LIVE CLOCK
  ===================================================== */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    if (!selectedUserId) return;

    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 80);
  }, [
    selectedUserId,
    conversations,
  ]);

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

      await Promise.all([
        loadProfile(user.id),
        loadConnections(user.id),
        loadPendingRequests(user.id),
      ]);
    };

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  const loadProfile = async (
    userId: string
  ) => {
    const {
      data,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !data) {
      console.error(profileError);

      setError(
        "Could not load your Monobloc Profile"
      );

      return;
    }

    const profile: User = {
      id: data.id,
      name: data.name || "Monobloc Profile",
      username: data.username || "user",
      initials:
        data.initials ||
        getInitials(data.name || "Monobloc User"),
      role: data.role || "Monobloc Member",
      status: data.status || "online",
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
      setSelectedUserId(null);
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
        name: profile.name || "Monobloc User",
        username: profile.username || "user",
        initials:
          profile.initials ||
          getInitials(
            profile.name || "Monobloc User"
          ),
        role:
          profile.role || "Monobloc Member",
        status:
          profile.status || "offline",
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
                timestamp: formatTimestamp(
                  msg.created_at
                ),
                createdAt:
                  msg.created_at,
                read: Boolean(msg.read),
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
        `Monobloc-messages-${currentUserId}`
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

              const formattedMessage: Message =
                {
                  id: newMessage.id,
                  senderId:
                    newMessage.sender_id,
                  text: newMessage.text,
                  timestamp:
                    formatTimestamp(
                      newMessage.created_at
                    ),
                  createdAt:
                    newMessage.created_at,
                  read:
                    newMessage.sender_id ===
                    currentUserId
                      ? true
                      : newMessage.read,
                };

              const isIncoming =
                newMessage.sender_id !==
                currentUserId;

              if (
                isIncoming &&
                newMessage.conversation_id !==
                  conversations.find(
                    (item) =>
                      item.userId ===
                      selectedUserId
                  )?.id
              ) {
                showToast(
                  "New transmission",
                  "You received a new message.",
                  "info"
                );
              }

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
  }, [
    currentUserId,
    supabase,
    selectedUserId,
    conversations,
  ]);

  /* =====================================================
     REALTIME MESSAGE READ STATUS
  ===================================================== */

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(
        `Monobloc-message-read-${currentUserId}`
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const updated =
            payload.new as {
              id: string;
              read: boolean;
            };

          setConversations((current) =>
            current.map((conversation) => ({
              ...conversation,
              messages:
                conversation.messages.map(
                  (msg) =>
                    msg.id === updated.id
                      ? {
                          ...msg,
                          read:
                            updated.read,
                        }
                      : msg
                ),
            }))
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

    if (!query) {
      return [...users].sort(
        (a, b) => {
          const aOnline =
            a.status === "online" ? 1 : 0;

          const bOnline =
            b.status === "online" ? 1 : 0;

          return bOnline - aOnline;
        }
      );
    }

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

    if (unreadMessages.length === 0) {
      return;
    }

    await supabase
      .from("messages")
      .update({
        read: true,
      })
      .in(
        "id",
        unreadMessages.map(
          (msg) => msg.id
        )
      );

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
            item.messages.map((msg) =>
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
  };

  /* =====================================================
     GET OR CREATE CONVERSATION
  ===================================================== */

  const getOrCreateConversation =
    async (
      otherUserId: string
    ): Promise<string | null> => {
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
            "Could not create communication channel."
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
      !currentUserId ||
      sendingMessage
    ) {
      return;
    }

    setSendingMessage(true);
    setMessage("");

    const conversationId =
      await getOrCreateConversation(
        selectedUserId
      );

    if (!conversationId) {
      setMessage(cleanMessage);
      setSendingMessage(false);
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

      showToast(
        "Transmission failed",
        "Your message could not be delivered.",
        "error"
      );
    }

    setSendingMessage(false);
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
      !currentUserId ||
      sendingRequest
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
      setError(userError.message);
      setSendingRequest(false);
      return;
    }

    if (!targetUser) {
      setError(
        `No Monobloc user found with @${username}.`
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
      } else {
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
      setError(insertError.message);
      setSendingRequest(false);
      return;
    }

    setNewUsername("");
    setShowNewConnection(false);
    setSendingRequest(false);

    showToast(
      "Connection request sent",
      `@${username} will receive your request.`,
      "success"
    );
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

    showToast(
      "Connection established",
      "This user is now part of your Monobloc network.",
      "success"
    );
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
        `Monobloc-connections-${currentUserId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "connections",
        },
        async () => {
          await Promise.all([
            loadConnections(
              currentUserId
            ),
            loadPendingRequests(
              currentUserId
            ),
          ]);
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
     HELPERS
  ===================================================== */

  const statusText = (
    status: UserStatus
  ) => {
    if (status === "online")
      return "Online";

    if (status === "away")
      return "Away";

    return "Offline";
  };

  const statusClass = (
    status: UserStatus
  ) => {
    if (status === "online") {
      return "bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)]";
    }

    if (status === "away") {
      return "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,.45)]";
    }

    return "bg-slate-600";
  };

  const getConversation = (
    userId: string
  ) =>
    conversations.find(
      (item) =>
        item.userId === userId
    );

  const getLastMessage = (
    userId: string
  ) => {
    const conversation =
      getConversation(userId);

    if (
      !conversation ||
      conversation.messages.length === 0
    ) {
      return "Start a transmission";
    }

    return conversation.messages[
      conversation.messages.length - 1
    ].text;
  };

  const getLastMessageTime = (
    userId: string
  ) => {
    const conversation =
      getConversation(userId);

    if (
      !conversation ||
      conversation.messages.length === 0
    ) {
      return "";
    }

    return conversation.messages[
      conversation.messages.length - 1
    ].timestamp;
  };

  const getUnreadForUser = (
    userId: string
  ) => {
    const conversation =
      getConversation(userId);

    if (!conversation) return 0;

    return conversation.messages.filter(
      (msg) =>
        msg.senderId !== currentUserId &&
        !msg.read
    ).length;
  };

  const totalMessages =
    conversations.reduce(
      (total, conversation) =>
        total +
        conversation.messages.length,
      0
    );

  const onlineCount =
    users.filter(
      (user) =>
        user.status === "online"
    ).length;

  const conversationStartedAt =
    selectedConversation?.messages[0]
      ?.createdAt;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030814] text-white">
        <FloatingSidebar />

        <main className="min-h-screen px-4 py-5 md:pl-[150px] lg:pl-[165px] xl:pl-[175px]">
          <div className="flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-3xl border border-cyan-400/20" />

                <div className="absolute inset-2 animate-pulse rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06]" />

                <Cpu
                  size={28}
                  className="relative z-10 text-cyan-400"
                />
              </div>

              <p className="text-sm font-bold tracking-wide">
                INITIALIZING Monobloc NETWORK
              </p>

              <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>

              <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-slate-600">
                Synchronizing communication layer
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
    <div className="min-h-screen bg-[#030814] text-white">
      <FloatingSidebar />

      {/* TOASTS */}

      <div className="pointer-events-none fixed right-4 top-4 z-[500] flex w-[min(390px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-300 rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl ${
              toast.type === "success"
                ? "border-cyan-400/20 bg-[#071b25]/95"
                : toast.type === "error"
                  ? "border-red-400/20 bg-[#200b12]/95"
                  : "border-blue-400/20 bg-[#071222]/95"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  toast.type === "error"
                    ? "bg-red-400/10 text-red-300"
                    : "bg-cyan-400/10 text-cyan-400"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCheck size={16} />
                ) : toast.type === "error" ? (
                  <X size={16} />
                ) : (
                  <Radio size={16} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold">
                  {toast.title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {toast.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <main className="relative min-h-screen overflow-hidden px-4 py-5 md:pl-[150px] md:pr-6 lg:pl-[165px] lg:pr-8 xl:pl-[175px]">
        {/* =================================================
           AMBIENCE
        ================================================= */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-[5%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.035] blur-[140px]" />

          <div className="absolute bottom-[5%] right-[5%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.04] blur-[160px]" />

          <div className="absolute left-[55%] top-[40%] h-72 w-72 rounded-full bg-cyan-400/[0.02] blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize:
                "64px 64px",
            }}
          />

          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1650px]">
          {/* =================================================
             HEADER
          ================================================= */}

          <header className="relative mb-5 overflow-hidden rounded-[30px] border border-white/10 bg-[#081322]/85 backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/[0.05] blur-[90px]" />

            <div className="relative flex flex-col gap-5 p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.14] to-blue-500/[0.06]">
                  <Users
                    size={24}
                    className="text-cyan-300"
                  />

                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400/50" />

                    <span className="relative h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-400">
                      Monobloc OS / CONNECT
                    </p>

                    <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-cyan-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                      System Live
                    </span>
                  </div>

                  <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                    Communication
                    <span className="ml-2 text-cyan-400">
                      Center
                    </span>
                  </h1>

                  <p className="mt-2 text-xs text-slate-500 md:text-sm">
                    Your private Monobloc network is online and synchronized.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-2.5 md:block">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={13}
                      className="text-cyan-400"
                    />

                    <span className="font-mono text-xs text-slate-400">
                      {systemTime.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-slate-700">
                    System Time
                  </p>
                </div>

                <div className="hidden rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-2.5 lg:block">
                  <div className="flex items-center gap-2">
                    <Signal
                      size={13}
                      className="text-cyan-400"
                    />

                    <span className="text-xs font-semibold text-slate-300">
                      Network Stable
                    </span>
                  </div>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-slate-700">
                    Realtime Layer
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNewConnection(true)
                  }
                  className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_35px_rgba(34,211,238,.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(34,211,238,.2)]"
                >
                  <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />

                  <UserPlus
                    size={16}
                    className="relative"
                  />

                  <span className="relative">
                    Connect
                  </span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center gap-2 border-t border-white/[0.07] px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-slate-600">
              <Zap
                size={12}
                className="text-cyan-400"
              />

              Monobloc neural communication layer active

              <div className="ml-auto hidden items-center gap-2 md:flex">
                <Wifi
                  size={11}
                  className="text-cyan-400"
                />

                <span>
                  Secure realtime channel
                </span>
              </div>
            </div>
          </header>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300 backdrop-blur-xl">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="ml-4 text-red-300/60 transition hover:text-red-300"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* =================================================
             NETWORK STRIP
          ================================================= */}

          <section className="mb-5 overflow-hidden rounded-[25px] border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.07] via-blue-500/[0.035] to-transparent backdrop-blur-xl">
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08]">
                <div className="absolute inset-0 animate-pulse rounded-xl bg-cyan-400/[0.04]" />

                <Radio
                  size={18}
                  className="relative text-cyan-300"
                />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-400">
                  Monobloc Network Intelligence
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {onlineCount} active ·{" "}
                  {users.length} total connections ·{" "}
                  {totalMessages} transmissions ·{" "}
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "inbox clear"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <NetworkMetric
                  label="UPTIME"
                  value="99.9%"
                />

                <NetworkMetric
                  label="STATUS"
                  value="OPTIMAL"
                  cyan
                />

                <div className="hidden h-9 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-2 text-[10px] text-slate-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                  </span>

                  LIVE SYNC
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
             PENDING REQUESTS
          ================================================= */}

          {pendingRequests.length > 0 && (
            <section className="mb-5 overflow-hidden rounded-[26px] border border-cyan-400/10 bg-[#081322]/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Bell size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-400">
                      Incoming Signals
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-300">
                      Connection requests awaiting response
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.08] px-3 py-1.5 text-[10px] font-bold text-cyan-300">
                  {pendingRequests.length} NEW
                </span>
              </div>

              <div className="space-y-2 p-3 md:p-4">
                {pendingRequests.map(
                  (request) => (
                    <PendingRequest
                      key={request.id}
                      request={request}
                      onAccept={() =>
                        void acceptRequest(
                          request
                        )
                      }
                      onReject={() =>
                        void rejectRequest(
                          request
                        )
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* =================================================
             COMMUNICATION CENTER
          ================================================= */}

          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#07101d]/90 shadow-[0_30px_100px_rgba(0,0,0,.28)] backdrop-blur-2xl">
            <div className="grid min-h-[720px] xl:grid-cols-[310px_minmax(0,1fr)_260px]">
              {/* =============================================
                 CONNECTIONS
              ============================================= */}

              <aside
                className={`border-r border-white/[0.08] bg-[#07101d]/70 ${
                  mobileChatOpen
                    ? "hidden xl:block"
                    : "block"
                }`}
              >
                <div className="border-b border-white/[0.08] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Command
                        size={14}
                        className="text-cyan-400"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                        Directory
                      </span>
                    </div>

                    <span className="text-[9px] font-mono text-slate-700">
                      {users.length.toString().padStart(
                        2,
                        "0"
                      )} USERS
                    </span>
                  </div>

                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search your network..."
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/25 focus:bg-cyan-400/[0.025]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">
                      Active Connections
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-300">
                      {filteredUsers.length}{" "}
                      people
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(true)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-slate-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="max-h-[570px] space-y-1 overflow-y-auto px-2 pb-4">
                  {filteredUsers.map(
                    (user) => {
                      const active =
                        selectedUserId ===
                        user.id;

                      const unread =
                        getUnreadForUser(
                          user.id
                        );

                      return (
                        <button
                          type="button"
                          key={user.id}
                          onClick={() =>
                            void selectConversation(
                              user.id
                            )
                          }
                          className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3 text-left transition-all duration-300 ${
                            active
                              ? "border border-cyan-400/15 bg-gradient-to-r from-cyan-400/[0.09] to-transparent shadow-[0_8px_30px_rgba(34,211,238,.04)]"
                              : "border border-transparent hover:bg-white/[0.035]"
                          }`}
                        >
                          {active && (
                            <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-r-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.8)]" />
                          )}

                          <Avatar
                            user={user}
                            active={active}
                            size="md"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={`flex-1 truncate text-sm font-bold ${
                                  active
                                    ? "text-white"
                                    : "text-slate-300"
                                }`}
                              >
                                {user.name}
                              </p>

                              <span className="shrink-0 text-[8px] text-slate-700">
                                {getLastMessageTime(
                                  user.id
                                )}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center gap-2">
                              <p className="min-w-0 flex-1 truncate text-[10px] text-slate-600">
                                {getLastMessage(
                                  user.id
                                )}
                              </p>

                              {unread > 0 && (
                                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400 px-1.5 text-[8px] font-black text-[#03101a] shadow-[0_0_15px_rgba(34,211,238,.35)]">
                                  {unread > 99
                                    ? "99+"
                                    : unread}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight
                            size={13}
                            className={`shrink-0 transition-all ${
                              active
                                ? "translate-x-0 text-cyan-400"
                                : "-translate-x-1 text-slate-800 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`}
                          />
                        </button>
                      );
                    }
                  )}

                  {filteredUsers.length ===
                    0 && (
                    <div className="px-5 py-16 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025]">
                        <Users
                          size={22}
                          className="text-slate-700"
                        />
                      </div>

                      <p className="text-sm font-semibold text-slate-500">
                        Network empty
                      </p>

                      <p className="mt-2 text-[11px] leading-5 text-slate-700">
                        Connect with someone to establish your first Monobloc channel.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewConnection(
                            true
                          )
                        }
                        className="mt-5 text-[10px] font-bold uppercase tracking-wider text-cyan-400"
                      >
                        + Add connection
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[0.07] p-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
                      <Activity
                        size={14}
                        className="text-cyan-400"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-slate-500">
                        NETWORK ACTIVITY
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-700">
                        {onlineCount} nodes currently active
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* =============================================
                 CHAT
              ============================================= */}

              <div
                className={`min-w-0 flex-col ${
                  mobileChatOpen
                    ? "flex"
                    : "hidden xl:flex"
                }`}
              >
                {selectedUser ? (
                  <>
                    {/* CHAT HEADER */}

                    <header className="flex items-center justify-between border-b border-white/[0.08] bg-[#091421]/60 px-4 py-4 backdrop-blur-xl md:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileChatOpen(false)
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:text-cyan-400 xl:hidden"
                        >
                          <ArrowLeft size={17} />
                        </button>

                        <Avatar
                          user={selectedUser}
                          active
                          size="lg"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-sm font-black text-white md:text-base">
                              {selectedUser.name}
                            </h2>

                            <span
                              className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                                selectedUser.status ===
                                "online"
                                  ? "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-400"
                                  : "border-white/10 bg-white/[0.03] text-slate-600"
                              }`}
                            >
                              {statusText(
                                selectedUser.status
                              )}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-[10px] text-slate-600">
                            @{selectedUser.username}{" "}
                            <span className="mx-1">
                              ·
                            </span>
                            {selectedUser.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <ChatActionButton
                          icon={
                            <Phone size={15} />
                          }
                          label="Voice call"
                          className="hidden sm:flex"
                        />

                        <ChatActionButton
                          icon={
                            <Video size={16} />
                          }
                          label="Video call"
                          className="hidden sm:flex"
                        />

                        <ChatActionButton
                          icon={
                            <MoreHorizontal
                              size={17}
                            />
                          }
                          label="More options"
                        />
                      </div>
                    </header>

                    {/* CHANNEL BAR */}

                    <div className="flex items-center gap-2 border-b border-white/[0.05] bg-cyan-400/[0.015] px-5 py-2.5 text-[9px] uppercase tracking-[0.14em] text-slate-700">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                      </span>

                      Secure realtime channel

                      <span className="ml-auto hidden font-mono text-[9px] md:block">
                        CHANNEL ACTIVE
                      </span>
                    </div>

                    {/* MESSAGES */}

                    <div
                      ref={messageContainerRef}
                      className="relative flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-[#040a12]/30 p-4 md:p-6"
                    >
                      {selectedMessages.length ===
                      0 ? (
                        <div className="flex min-h-[500px] items-center justify-center">
                          <div className="max-w-sm text-center">
                            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                              <div className="absolute inset-0 animate-pulse rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04]" />

                              <div className="absolute inset-3 rounded-2xl bg-cyan-400/[0.06]" />

                              <MessageCircle
                                size={29}
                                className="relative text-cyan-400"
                              />
                            </div>

                            <p className="text-xl font-black">
                              Channel ready
                            </p>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              Establish the first transmission with{" "}
                              <span className="font-semibold text-slate-400">
                                {selectedUser.name}
                              </span>
                              .
                            </p>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-slate-700">
                              <Zap
                                size={11}
                                className="text-cyan-500"
                              />

                              Awaiting transmission
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {selectedMessages.map(
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

                              const showDate =
                                !previous ||
                                !isSameDay(
                                  previous.createdAt,
                                  msg.createdAt
                                );

                              return (
                                <div
                                  key={msg.id}
                                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                                >
                                  {showDate && (
                                    <div className="my-6 flex items-center gap-3">
                                      <div className="h-px flex-1 bg-white/[0.06]" />

                                      <span className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-700">
                                        {formatMessageDate(
                                          msg.createdAt
                                        )}
                                      </span>

                                      <div className="h-px flex-1 bg-white/[0.06]" />
                                    </div>
                                  )}

                                  <div
                                    className={`flex ${
                                      isMine
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`flex max-w-[90%] gap-2.5 md:max-w-[76%] ${
                                        isMine
                                          ? "flex-row-reverse"
                                          : ""
                                      }`}
                                    >
                                      {!isMine &&
                                        showAvatar && (
                                          <div className="mt-auto">
                                            <Avatar
                                              user={
                                                selectedUser
                                              }
                                              size="sm"
                                            />
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
                                          className={`relative rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                            isMine
                                              ? "rounded-br-md bg-gradient-to-br from-cyan-400 to-blue-500 font-medium text-white shadow-[0_10px_30px_rgba(34,211,238,.08)]"
                                              : "rounded-bl-md border border-white/[0.09] bg-white/[0.045] text-slate-300"
                                          }`}
                                        >
                                          {msg.text}
                                        </div>

                                        <div
                                          className={`mt-1.5 flex items-center gap-1.5 px-1 text-[8px] uppercase tracking-wide text-slate-700 ${
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
                                                className="text-cyan-400"
                                              />
                                            ) : (
                                              <Check
                                                size={11}
                                              />
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}

                          <div
                            ref={
                              messagesEndRef
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* COMPOSER */}

                    <div className="border-t border-white/[0.08] bg-[#07101d]/70 p-4 backdrop-blur-xl md:p-5">
                      <div
                        className={`rounded-2xl border p-2 transition-all duration-300 ${
                          message.trim()
                            ? "border-cyan-400/25 bg-cyan-400/[0.025] shadow-[0_0_35px_rgba(34,211,238,.04)]"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 sm:flex">
                            <Sparkles
                              size={15}
                              className={
                                message.trim()
                                  ? "text-cyan-400"
                                  : ""
                              }
                            />
                          </div>

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
                            disabled={
                              sendingMessage
                            }
                            placeholder={`Transmit to ${selectedUser.name}...`}
                            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-slate-700 disabled:opacity-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              void sendMessage()
                            }
                            disabled={
                              !message.trim() ||
                              sendingMessage
                            }
                            className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_8px_25px_rgba(34,211,238,.12)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100"
                            aria-label="Send message"
                          >
                            {sendingMessage ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                              <Send
                                size={16}
                                className="ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-3 pb-1 pt-1">
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-700">
                            Enter to transmit
                          </p>

                          <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em] text-slate-700">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                            Realtime encrypted
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-10">
                    <div className="max-w-sm text-center">
                      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                        <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/[0.02]" />

                        <Users
                          size={30}
                          className="relative text-slate-700"
                        />
                      </div>

                      <p className="text-lg font-bold text-slate-400">
                        No channel selected
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Select someone from your Monobloc network to begin communicating.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* =============================================
                 INTELLIGENCE PANEL
              ============================================= */}

              <aside className="hidden border-l border-white/[0.08] bg-[#07101d]/60 xl:block">
                <div className="border-b border-white/[0.08] p-5">
                  <div className="flex items-center gap-2">
                    <Cpu
                      size={15}
                      className="text-cyan-400"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                      Intelligence
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Monobloc communication analysis
                  </p>
                </div>

                {selectedUser ? (
                  <div className="space-y-4 p-4">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          user={selectedUser}
                          active
                          size="lg"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {selectedUser.name}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-slate-600">
                            @{selectedUser.username}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                        <span
                          className={`h-2 w-2 rounded-full ${statusClass(
                            selectedUser.status
                          )}`}
                        />

                        <span className="text-[10px] text-slate-500">
                          {statusText(
                            selectedUser.status
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <IntelligenceCard
                        label="EXCHANGED"
                        value={selectedMessages.length.toString()}
                        icon={
                          <MessageCircle
                            size={13}
                          />
                        }
                      />

                      <IntelligenceCard
                        label="UNREAD"
                        value={getUnreadForUser(
                          selectedUser.id
                        ).toString()}
                        icon={
                          <Bell size={13} />
                        }
                      />
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                          Channel Activity
                        </p>

                        <Activity
                          size={14}
                          className="text-cyan-400"
                        />
                      </div>

                      <div className="mt-5 flex h-20 items-end gap-1">
                        {[30, 55, 38, 72, 46, 88, 64, 92, 52, 78, 45, 68].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-400/10 to-cyan-400/40 transition-all hover:from-cyan-400/30 hover:to-cyan-300"
                              style={{
                                height: `${height}%`,
                              }}
                            />
                          )
                        )}
                      </div>

                      <div className="mt-3 flex justify-between text-[8px] uppercase tracking-wider text-slate-700">
                        <span>Low</span>
                        <span>Realtime</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/[0.08] bg-gradient-to-br from-cyan-400/[0.05] to-transparent p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={14}
                          className="text-cyan-400"
                        />

                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                          Monobloc Insight
                        </p>
                      </div>

                      <p className="mt-3 text-[11px] leading-5 text-slate-600">
                        {selectedMessages.length ===
                        0
                          ? "This channel is ready. Send the first message to begin building communication history."
                          : `This communication channel contains ${selectedMessages.length} recorded transmission${
                              selectedMessages.length ===
                              1
                                ? ""
                                : "s"
                            }.`}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                        Channel Established
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        {conversationStartedAt
                          ? new Date(
                              conversationStartedAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Awaiting first transmission"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Cpu
                      size={24}
                      className="mx-auto mb-4 text-slate-800"
                    />

                    <p className="text-xs text-slate-600">
                      Intelligence module waiting for an active channel.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </section>

          {/* =================================================
             NETWORK STATS
          ================================================= */}

          <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatusCard
              icon={<Users size={17} />}
              label="Connections"
              value={users.length.toString()}
              detail={`${onlineCount} currently online`}
            />

            <StatusCard
              icon={
                <MessageCircle size={17} />
              }
              label="Transmissions"
              value={totalMessages.toString()}
              detail="Across all channels"
            />

            <StatusCard
              icon={<Bell size={17} />}
              label="Unread"
              value={unreadCount.toString()}
              detail={
                unreadCount > 0
                  ? "Awaiting attention"
                  : "Inbox clear"
              }
            />

            <StatusCard
              icon={<Signal size={17} />}
              label="Network"
              value="LIVE"
              detail="Realtime systems operational"
              cyan
            />
          </section>
        </div>

        {/* =================================================
           ADD CONNECTION MODAL
        ================================================= */}

        {showNewConnection && (
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020611]/75 px-4 backdrop-blur-xl"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowNewConnection(false);
              }
            }}
          >
            <div className="relative w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200 overflow-hidden rounded-[32px] border border-white/10 bg-[#081321] shadow-[0_30px_100px_rgba(0,0,0,.6)]">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.07] blur-[100px]" />

              <div className="relative border-b border-white/[0.08] p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-400">
                      <UserPlus size={21} />

                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                        Expand Network
                      </p>

                      <h2 className="mt-1 text-2xl font-black">
                        Add connection
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(false)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-600 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <div className="relative p-6">
                <p className="mb-4 text-xs leading-6 text-slate-500">
                  Enter the Monobloc username of the person you want to add to your communication network.
                </p>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-cyan-400">
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
                        event.key === "Enter"
                      ) {
                        void addConnection();
                      }
                    }}
                    placeholder="username"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                  />
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">
                    <Sparkles
                      size={14}
                      className="text-cyan-400"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400">
                      Connection Protocol
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-600">
                      They will receive an incoming request and must approve it before a communication channel is opened.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowNewConnection(false)
                    }
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.025] py-3.5 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
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
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 text-sm font-black text-white shadow-[0_10px_30px_rgba(34,211,238,.12)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                  >
                    {sendingRequest ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Send request
                      </>
                    )}
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
   AVATAR
========================================================= */

function Avatar({
  user,
  active = false,
  size = "md",
}: {
  user: User;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 rounded-lg text-[8px]"
      : size === "lg"
        ? "h-12 w-12 rounded-xl text-xs"
        : "h-11 w-11 rounded-xl text-[10px]";

  return (
    <div className="relative shrink-0">
      <div
        className={`flex ${sizeClass} items-center justify-center overflow-hidden border font-black ${
          active
            ? "border-cyan-400/25 bg-cyan-400/[0.1] text-cyan-300"
            : "border-white/10 bg-white/[0.04] text-slate-400"
        }`}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          user.initials
        )}
      </div>

      <span
        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#07101d] ${
          user.status === "online"
            ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.9)]"
            : user.status === "away"
              ? "bg-yellow-400"
              : "bg-slate-600"
        }`}
      />
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
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [user, setUser] =
    useState<User | null>(null);

  const [processing, setProcessing] =
    useState(false);

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
          name:
            data.name || "Monobloc User",
          username:
            data.username || "user",
          initials:
            data.initials ||
            getInitials(
              data.name || "Monobloc User"
            ),
          role:
            data.role || "Monobloc Member",
          status:
            data.status || "offline",
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
    return (
      <div className="h-20 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.015]" />
    );
  }

  const handleAccept = async () => {
    setProcessing(true);
    await onAccept();
    setProcessing(false);
  };

  const handleReject = async () => {
    setProcessing(true);
    await onReject();
    setProcessing(false);
  };

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-cyan-400/15 hover:bg-cyan-400/[0.015] sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar
          user={user}
          size="md"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-white">
              {user.name}
            </p>

            <span className="text-[8px] text-slate-700">
              @{user.username}
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-600">
            Incoming connection request ·{" "}
            {user.role}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={processing}
          onClick={() =>
            void handleReject()
          }
          className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40 sm:flex-none"
        >
          Decline
        </button>

        <button
          type="button"
          disabled={processing}
          onClick={() =>
            void handleAccept()
          }
          className="flex min-w-[95px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40 sm:flex-none"
        >
          {processing ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Check size={14} />
          )}

          Accept
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   CHAT ACTION BUTTON
========================================================= */

function ChatActionButton({
  icon,
  label,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-cyan-400/[0.06] hover:text-cyan-400 ${className}`}
    >
      {icon}
    </button>
  );
}

/* =========================================================
   NETWORK METRIC
========================================================= */

function NetworkMetric({
  label,
  value,
  cyan = false,
}: {
  label: string;
  value: string;
  cyan?: boolean;
}) {
  return (
    <div className="hidden text-right sm:block">
      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-700">
        {label}
      </p>

      <p
        className={`mt-1 text-[10px] font-bold ${
          cyan
            ? "text-cyan-400"
            : "text-slate-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INTELLIGENCE CARD
========================================================= */

function IntelligenceCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between text-cyan-400">
        {icon}

        <span className="text-sm font-black">
          {value}
        </span>
      </div>

      <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-700">
        {label}
      </p>
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
  detail,
  cyan = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  cyan?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#081321]/75 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/15">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/[0.025] blur-2xl transition group-hover:bg-cyan-400/[0.06]" />

      <div className="relative flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.08] text-cyan-400">
          {icon}
        </div>

        <ArrowRight
          size={14}
          className="text-slate-800 transition group-hover:translate-x-1 group-hover:text-cyan-400"
        />
      </div>

      <div className="relative mt-5">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
            {label}
          </p>

          <p
            className={`text-xl font-black ${
              cyan
                ? "text-cyan-400"
                : "text-slate-200"
            }`}
          >
            {value}
          </p>
        </div>

        <p className="mt-2 text-[9px] text-slate-700">
          {detail}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}

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

function isSameDay(
  first?: string,
  second?: string
) {
  if (!first || !second) {
    return true;
  }

  const firstDate = new Date(first);
  const secondDate = new Date(second);

  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
}

function formatMessageDate(
  timestamp?: string
) {
  if (!timestamp) {
    return "Conversation";
  }

  const date = new Date(timestamp);
  const today = new Date();

  if (isSameDay(
    timestamp,
    today.toISOString()
  )) {
    return "Today";
  }

  const yesterday = new Date();
  yesterday.setDate(
    yesterday.getDate() - 1
  );

  if (
    isSameDay(
      timestamp,
      yesterday.toISOString()
    )
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        today.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
}