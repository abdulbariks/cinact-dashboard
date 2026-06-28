"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import EditIcon from "../icons/chats/EditIcon";
import SearchIcon from "../icons/SuperAdmindashboard/SearchIcon";
import FilterIcon2 from "../icons/chats/FilterIcon2";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { connectSocket } from "@/lib/Socket";

export default function ChatSidebar() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "DM" | "GROUP">("all");
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef<any>(null);

  // console.log("conversations", conversations);

  // Fetch real data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const res = await ChatsService.getConversations({
          token,
          type: activeTab === "all" ? "" : activeTab,
          limit: 10,
          search,
        });

        if (isMounted) {
          setConversations(
            Array.isArray(res?.data?.data) ? res?.data?.data : [],
          );
        }
      } catch (error) {
        if (isMounted) setConversations([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, search]);

  const filteredConversations = useMemo(() => {
    return conversations?.filter((item) => {
      const displayTitle =
        item.type === "GROUP" ? item.title : item.participant?.name;
      const matchTab = activeTab === "all" ? true : item.type === activeTab;
      const matchSearch = (displayTitle || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [activeTab, search, conversations]);

  const getLastMessageItem = (item: any) =>
    item.last_message || item.messages?.[0];

  const getMessageId = (message: any) =>
    message?.id || message?._id || message?.message_id || message?.messageId;

  const handleMarkConversationRead = useCallback(async (item: any) => {
    if (!item?.id || !item?.unread_messages) return;

    const lastMessageId = getMessageId(getLastMessageItem(item));
    if (!lastMessageId) return;

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === item.id
          ? { ...conversation, unread_messages: 0 }
          : conversation,
      ),
    );

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      await ChatsService.markConversationRead({
        conversationId: item.id,
        token,
        data: {
          up_to_message_id: lastMessageId,
        },
      });
    } catch (error) {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === item.id
            ? { ...conversation, unread_messages: item.unread_messages }
            : conversation,
        ),
      );
    }
  }, []);

  useEffect(() => {
    const activeConversation = conversations.find((item) =>
      pathname?.includes(item.id),
    );

    if (activeConversation?.unread_messages > 0) {
      handleMarkConversationRead(activeConversation);
    }
  }, [conversations, handleMarkConversationRead, pathname]);

  // Real-time socket connection for conversation updates
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    // Handle new message to update conversation preview
    const handleNewMessage = (message: any) => {
      const conversationId =
        message?.conversation_id || message?.conversationId;
      if (!conversationId) return;

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === conversationId);

        if (existingIndex >= 0) {
          const next = [...prev];
          const existing = next[existingIndex];

          // Check if this is a message from current user
          const senderId =
            message?.sender?.id || message?.senderId || message?.sender_id;
          const isFromCurrentUser =
            senderId === existing.participant?.id ||
            senderId === (cookies?.userId || null);

          next[existingIndex] = {
            ...existing,
            last_message: {
              ...message,
              id: message?.id || message?._id,
            },
            // Only increment unread if not from current user and not currently viewing
            unread_messages: pathname?.includes(conversationId)
              ? existing.unread_messages
              : isFromCurrentUser
                ? existing.unread_messages
                : (existing.unread_messages || 0) + 1,
            updatedAt:
              message?.created_at ||
              message?.createdAt ||
              new Date().toISOString(),
          };
          return next;
        }

        // If conversation doesn't exist, we might need to refresh the list
        return prev;
      });
    };

    const handleMessageSent = (message: any) => {
      const conversationId =
        message?.conversation_id || message?.conversationId;
      if (!conversationId) return;

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === conversationId);
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            last_message: {
              ...message,
              id: message?.id || message?._id,
            },
          };
          return next;
        }
        return prev;
      });
    };

    const handleMessageRead = (data: any) => {
      const conversationId = data?.conversation_id || data?.conversationId;
      if (!conversationId) return;

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === conversationId);
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            unread_messages: 0,
          };
          return next;
        }
        return prev;
      });
    };

    socket.off("message:new", handleNewMessage);
    socket.on("message:new", handleNewMessage);
    socket.off("message:sent", handleMessageSent);
    socket.on("message:sent", handleMessageSent);
    socket.off("message:read", handleMessageRead);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:sent", handleMessageSent);
      socket.off("message:read", handleMessageRead);
    };
  }, [pathname]);

  // Helper to get last message preview
  const getLastMessage = (item: any) => {
    const lastMsg = getLastMessageItem(item);
    if (!lastMsg) {
      return item.type === "GROUP" && item.total_members
        ? `${item.total_members} members`
        : "No messages yet";
    }
    if (lastMsg.kind === "IMAGE") return "📷 Photo";
    if (typeof lastMsg.content === "string") return lastMsg.content;
    return lastMsg.content?.text || "Attachment";
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-[#0a1726] p-5 text-card-foreground">
      <div className=" flex items-center justify-between">
        <h2 className="text-lg text-white font-medium ">Conversations</h2>
        <button
          type="button"
          aria-label="Edit conversations"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <EditIcon />
        </button>
      </div>

      <div className=" flex items-center gap-2 my-5">
        <div className="relative  flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="pl-12 pr-4 py-3.5 w-full border border-[#3D4566] rounded-full placeholder:text-[#3D4566] text-white"
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className=" cursor-pointer">
          <FilterIcon2 />
        </button>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(v) => setActiveTab(v as any)}
        className="gap-4"
      >
        <TabsList className="grid h-auto w-full grid-cols-3 bg-transparent p-1 gap-1.5">
          {["all", "DM", "GROUP"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-sm font-normal text-[#B2B5B8] data-[state=active]:text-white data-[state=active]:bg-[#E9201D] cursor-pointer rounded-full py-1.5 border border-[#1F283D] capitalize"
            >
              {tab === "DM" ? "Messages" : tab.toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-[#5F6CA0]">
            Loading conversations...
          </div>
        ) : filteredConversations?.length > 0 ? (
          filteredConversations?.map((item) => {
            const displayTitle =
              item.type === "GROUP" ? item.title : item.participant?.name;
            const initials = (displayTitle || "??")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const avatar =
              item.avatar || item.otherUserAvatar || item.participant?.avatar;
            const lastMessageAt =
              item.last_message?.created_at ||
              item.messages?.[0]?.createdAt ||
              item.updatedAt;

            return (
              <Link
                key={item.id}
                href={`/dashboard/chats/${item.id}`}
                onClick={() => handleMarkConversationRead(item)}
                className={cn(
                  "flex w-full items-start gap-2.5 text-left transition-colors pt-4 px-3 rounded-[10px]",
                  pathname?.includes(item.id)
                    ? "bg-[#5f6ca0]/40"
                    : "bg-transparent hover:bg-[#5f6ca0]/20",
                )}
              >
                <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1a2336] border border-[#1F283D] overflow-hidden">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={displayTitle || "User Avatar"}
                      fill
                      className="object-cover"
                      sizes="44px"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {initials}
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    "min-w-0 flex-1 pb-4",
                    pathname?.includes(item.id)
                      ? "border-0"
                      : "border-b border-[#121D2D]",
                  )}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-3">
                    <p className="text-base text-white font-medium truncate">
                      {displayTitle || "Unknown"}
                    </p>
                    <span className="shrink-0 text-[10px] text-[#777980]">
                      {lastMessageAt
                        ? formatDistanceToNow(new Date(lastMessageAt), {
                            addSuffix: false,
                          })
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-[#B2B5B8]">
                      {getLastMessage(item)}
                    </p>
                    {item.unread_messages > 0 ? (
                      <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-[#E9201D] px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {item.unread_messages}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-10 text-center text-sm text-[#5F6CA0]">
            No conversations found.
          </div>
        )}
      </div>
    </aside>
  );
}
