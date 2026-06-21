"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import { showErrorToast } from "@/lib/hotToast";
import { cn } from "@/lib/utils";
import { connectSocket } from "@/lib/Socket";

import CallIcon from "../../icons/chats/CallIcon";
import VideoIcon from "../../icons/chats/VideoIcon";
import WarningIcon from "../../icons/chats/WarningIcon";
import PlusChatIcon from "../../icons/chats/PlusChatIcon";
import ImageIcon from "../../icons/chats/ImageIcon";
import MicIcon from "../../icons/chats/MicIcon";
import CallScreen from "./CallScreen";
import EmojiIcon from "../../icons/chats/EmojiIcon";

type ChatAreaProps = {
  chatId: string;
};

const getMessageConversationId = (message: any) =>
  message?.conversation_id || message?.conversationId;

const getMessageContent = (message: any) => {
  if (typeof message?.content === "string") return message.content;
  return message?.content?.text || "";
};

const getMessageCreatedAt = (message: any) =>
  message?.created_at || message?.createdAt;

const getAttachmentUrl = (attachment: any) =>
  attachment?.url ||
  attachment?.file_path ||
  attachment?.filePath ||
  attachment?.media_url ||
  attachment?.mediaUrl ||
  attachment?.media_Url;

const getMessageImageUrl = (message: any) =>
  getAttachmentUrl(message?.attachments?.[0]) ||
  message?.attachment?.url ||
  message?.file_path ||
  message?.filePath ||
  message?.media_url ||
  message?.mediaUrl ||
  message?.media_Url;

const getMessageImageUrls = (message: any) => {
  const attachmentUrls = Array.isArray(message?.attachments)
    ? message.attachments
        .map((attachment: any) => getAttachmentUrl(attachment))
        .filter(Boolean)
    : [];

  const singleUrl = getMessageImageUrl(message);
  return attachmentUrls.length > 0 || !singleUrl ? attachmentUrls : [singleUrl];
};

const getMessageId = (message: any) =>
  message?.id || message?._id || message?.clientId;

const getMessageSenderId = (message: any) =>
  message?.sender?.id || message?.senderId || message?.sender_id;

const sortMessagesByCreatedAt = (items: any[]) => {
  return [...items].sort((a, b) => {
    const first = new Date(getMessageCreatedAt(a) || 0).getTime();
    const second = new Date(getMessageCreatedAt(b) || 0).getTime();

    return first - second;
  });
};

const normalizeMessage = (message: any, fallback: any = {}) => {
  const source = message?.data || message?.message || message;
  const createdAt =
    getMessageCreatedAt(source) ||
    fallback.createdAt ||
    new Date().toISOString();
  const sourceUrl = getMessageImageUrl(source);
  const attachments =
    source?.attachments ||
    (sourceUrl
      ? [
          {
            url: sourceUrl,
          },
        ]
      : fallback.attachments || []);

  return {
    ...fallback,
    ...source,
    id: getMessageId(source) || fallback.id,
    conversationId: getMessageConversationId(source) || fallback.conversationId,
    conversation_id:
      getMessageConversationId(source) || fallback.conversation_id,
    content:
      typeof source?.content === "string"
        ? { text: source.content }
        : source?.content || fallback.content,
    attachments,
    createdAt,
    created_at: createdAt,
  };
};

export default function ChatArea({ chatId }: ChatAreaProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{
    type: "audio" | "video";
    isIncoming: boolean;
  } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    type: "audio" | "video";
    caller: {
      id: string;
      name: string;
      avatar: string | null;
    };
  } | null>(null);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSendingRef = useRef(false);
  const lastReadMessageIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const profile = await ChatsService.getMe({ token });
      setCurrentUserId(profile?.data?.data?.id);

      const res = await ChatsService.getConversationById({
        id: chatId,
        token,
        limit: 20,
      });

      const messageData = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.items)
          ? res.data.items
          : [];

      setMessages(
        sortMessagesByCreatedAt(
          messageData.map((msg) => normalizeMessage(msg)),
        ),
      );
    } catch (err: any) {
      showErrorToast(err?.message || "Failed to load chat");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [chatId]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  const markLatestIncomingRead = useCallback(
    async (message: any) => {
      const messageId = getMessageId(message);
      if (!currentUserId) return;
      if (!messageId || lastReadMessageIdRef.current === messageId) return;
      if (getMessageConversationId(message) !== chatId) return;
      if (getMessageSenderId(message) === currentUserId || message.is_me)
        return;

      lastReadMessageIdRef.current = messageId;

      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const at = getMessageCreatedAt(message) || new Date().toISOString();

        await ChatsService.markConversationRead({
          conversationId: chatId,
          token,
          data: {
            up_to_message_id: messageId,
          },
        });

        socketRef.current?.emit("message:read", {
          conversation_id: chatId,
          at: new Date(at).toISOString(),
        });
        socketRef.current?.emit("message:read", {
          conversationId: chatId,
          at: new Date(at).toISOString(),
        });
      } catch (error) {
        console.error("Failed to mark conversation read:", error);
        lastReadMessageIdRef.current = null;
      }
    },
    [chatId, currentUserId],
  );

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    const joinConversation = () => {
      socket.emit("conversation:join", { conversation_id: chatId });
      socket.emit("conversation:join", { conversationId: chatId });
    };

    joinConversation();
    socket.off("connect", joinConversation);
    socket.on("connect", joinConversation);

    const upsertMessage = (message: any) => {
      const normalizedMessage = normalizeMessage(message);
      if (getMessageConversationId(normalizedMessage) !== chatId) return;

      setMessages((prev) => {
        const incomingId = getMessageId(normalizedMessage);
        const incomingClientId = normalizedMessage.clientId;
        const existingIndex = prev.findIndex((m) => {
          const prevId = getMessageId(m);
          return (
            (incomingId && prevId === incomingId) ||
            (incomingClientId && m.clientId === incomingClientId)
          );
        });

        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = normalizeMessage(
            normalizedMessage,
            next[existingIndex],
          );
          return sortMessagesByCreatedAt(next);
        }

        return sortMessagesByCreatedAt([...prev, normalizedMessage]);
      });

      void markLatestIncomingRead(normalizedMessage);
    };

    const upsertCallMessage = (payload: any) => {
      const conversationId =
        payload?.conversation_id || payload?.conversationId;
      if (conversationId !== chatId) return;

      upsertMessage({
        ...(payload?.message || payload),
        conversation_id: conversationId,
        conversationId,
      });
    };

    const handleCallIncoming = (call: any) => {
      const conversationId = call?.conversation_id || call?.conversationId;
      if (conversationId !== chatId) return;

      setIncomingCall({
        type: call.kind === "VIDEO" ? "video" : "audio",
        caller: {
          id: call.caller?.id || "",
          name: call.caller?.name || "Unknown",
          avatar: call.caller?.avatar || null,
        },
      });
    };

    const handleCallDeclined = (payload: any) => {
      const conversationId =
        payload?.conversation_id || payload?.conversationId;
      if (conversationId && conversationId !== chatId) return;

      setActiveCall(null);
      setIncomingCall(null);
    };

    const handleCallEnded = (payload: any) => {
      const conversationId =
        payload?.conversation_id || payload?.conversationId;
      if (conversationId && conversationId !== chatId) return;

      setActiveCall(null);
      setIncomingCall(null);
    };

    socket.off("message:new", upsertMessage);
    socket.on("message:new", upsertMessage);
    socket.off("message:sent", upsertMessage);
    socket.on("message:sent", upsertMessage);
    socket.off("call:message_updated", upsertCallMessage);
    socket.on("call:message_updated", upsertCallMessage);
    socket.off("call:incoming", handleCallIncoming);
    socket.on("call:incoming", handleCallIncoming);
    socket.off("call:declined", handleCallDeclined);
    socket.on("call:declined", handleCallDeclined);
    socket.off("call:ended", handleCallEnded);
    socket.on("call:ended", handleCallEnded);

    return () => {
      socket.off("connect", joinConversation);
      socket.emit("conversation:leave", { conversation_id: chatId });
      socket.emit("conversation:leave", { conversationId: chatId });
      socket.off("message:new", upsertMessage);
      socket.off("message:sent", upsertMessage);
      socket.off("call:message_updated", upsertCallMessage);
      socket.off("call:incoming", handleCallIncoming);
      socket.off("call:declined", handleCallDeclined);
      socket.off("call:ended", handleCallEnded);
    };
  }, [chatId, markLatestIncomingRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (isSendingRef.current) return;

    const text = draftMessage.trim();
    if (!text && attachments.length === 0) return;

    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    const selectedAttachments = attachments;
    const clientId = `client-${Date.now()}`;

    setDraftMessage("");
    setAttachments([]);
    isSendingRef.current = true;
    setIsSending(true);

    const payload = {
      kind: selectedAttachments.length > 0 ? "FILE" : "TEXT",
      content: text,
    };

    const optimisticMessage = normalizeMessage(
      {
        ...payload,
        id: clientId,
        clientId,
        conversationId: chatId,
        senderId: currentUserId,
        is_me: true,
        attachments: selectedAttachments.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        })),
      },
      { createdAt: new Date().toISOString() },
    );

    setMessages((prev) =>
      sortMessagesByCreatedAt([...prev, optimisticMessage]),
    );

    try {
      let response;

      if (selectedAttachments.length > 0) {
        const formData = new FormData();
        formData.append("kind", "FILE");
        if (text) {
          formData.append("content", text);
        }
        selectedAttachments.forEach((file) => {
          formData.append("attachments", file);
        });

        response = await ChatsService.uploadMessage({
          conversationId: chatId,
          token,
          formData,
        });
      } else {
        response = await ChatsService.sendMessage({
          conversationId: chatId,
          token,
          data: {
            kind: "TEXT",
            content: text,
          },
        });
      }

      const savedMessage = normalizeMessage(
        response?.data?.data || response?.data?.item || response?.data,
        optimisticMessage,
      );

      setMessages((prev) => {
        const next = prev.map((message) =>
          getMessageId(message) === clientId || message.clientId === clientId
            ? savedMessage
            : message,
        );
        return sortMessagesByCreatedAt(next);
      });
    } catch (err) {
      console.error("Send failed", err);
      showErrorToast("Message failed to send");
      setDraftMessage(text);
      setAttachments(selectedAttachments);
      setMessages((prev) =>
        prev.filter((message) => getMessageId(message) !== clientId),
      );
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files) return;

    const files = Array.from(input.files).filter((file) =>
      file.type.startsWith("image/"),
    ) as File[];

    if (!files.length) {
      e.target.value = "";
      return;
    }

    setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatPartner =
    messages.find(
      (message) => message.sender?.id && message.sender.id !== currentUserId,
    )?.sender || messages[0]?.sender;

  return (
    <section className="flex h-full w-full flex-col overflow-hidden bg-[#07121d]">
      <div className="bg-[#0a1929] px-4 py-3 flex items-center justify-between border-b border-[#1a2336]">
        <div className="flex items-center gap-3">
          <Link href="/tutor-dashboard/chats" className="lg:hidden text-white">
            ←
          </Link>
          <div className="size-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-bold">
            {chatPartner?.name?.slice(0, 1) || "C"}
          </div>
          <div>
            <p className="text-white font-medium text-sm leading-tight">
              {chatPartner?.name || "User"}
            </p>
            <span className="text-[10px] text-green-500">Online</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
            onClick={() => setActiveCall({ type: "audio", isIncoming: false })}
          >
            <CallIcon />
          </button>
          <button
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
            onClick={() => setActiveCall({ type: "video", isIncoming: false })}
          >
            <VideoIcon />
          </button>
          <Link
            href={`/tutor-dashboard/chats-details/${chatId}`}
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
          >
            <WarningIcon />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('/chat-bg.png')] bg-repeat">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
            <p className="text-white text-xs">Loading...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = getMessageSenderId(msg) === currentUserId || msg.is_me;
            const messageText = getMessageContent(msg);
            const imageUrls = getMessageImageUrls(msg);
            const createdAt = getMessageCreatedAt(msg);

            if (msg.kind === "TEXT" && !messageText && imageUrls.length === 0)
              return null;

            return (
              <div
                key={getMessageId(msg)}
                className={cn(
                  "flex flex-col w-full",
                  isMe ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-2 text-sm rounded-2xl shadow-sm",
                    isMe
                      ? "bg-[#5f6ca0] text-white rounded-tr-none"
                      : "bg-[#17212c] text-[#B2B5B8] rounded-tl-none",
                  )}
                >
                  {imageUrls.map((imageUrl: string) => (
                    <div
                      key={imageUrl}
                      className="relative size-52 rounded-lg overflow-hidden my-1"
                    >
                      <Image
                        src={imageUrl}
                        alt="chat-media"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                  {messageText ? (
                    <p className="whitespace-pre-wrap">{messageText}</p>
                  ) : null}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1">
                  {createdAt
                    ? new Date(createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#0a1929] border-t border-[#1a2336]">
        {attachments.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="rounded-full bg-[#17212c] px-3 py-1 text-xs text-white"
              >
                {file.name}
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2 bg-[#17212c] rounded-full px-4 border border-transparent focus-within:border-[#5f6ca0] transition-all">
          <button className="text-gray-400 hover:text-white">
            <PlusChatIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAttachmentChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white"
          >
            <ImageIcon />
          </button>
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your message..."
            className="flex-1 py-3 bg-transparent text-white outline-none text-sm"
          />
          <button className="text-gray-400 hover:text-white">
            <EmojiIcon />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isSending}
            className={cn(
              "p-2 rounded-full transition-transform active:scale-90",
              draftMessage.trim() || attachments.length > 0
                ? "text-[#E9201D]"
                : "text-gray-400",
              isSending && "opacity-50",
            )}
          >
            {draftMessage.trim() || attachments.length > 0 ? (
              <PlusChatIcon className="rotate-45" />
            ) : (
              <MicIcon />
            )}
          </button>
        </div>
      </div>
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <div className="bg-[#0a1929] border border-[#1a2336] rounded-xl overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-semibold">
                      {incomingCall.type === "video" ? "📹" : "📞"}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {incomingCall.caller.name || "Someone"}
                      </p>
                      <p className="text-[12px] text-[#B2B5B8]">
                        {incomingCall.type === "video"
                          ? "Video Call"
                          : "Audio Call"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCall({
                        type: incomingCall.type,
                        isIncoming: true,
                      });
                      setIncomingCall(null);
                    }}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    ✓
                  </button>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIncomingCall(null);
                      const cookies = parseCookies();
                      const token = cookies.token || cookies.accessToken || "";
                      ChatsService.declineCall({
                        conversationId: chatId,
                        token,
                      }).catch((err) =>
                        console.error("Failed to decline call:", err),
                      );
                    }}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCall && (
        <CallScreen
          conversationId={chatId}
          type={activeCall.type}
          isIncoming={activeCall.isIncoming}
          onCallEnd={() => setActiveCall(null)}
        />
      )}
    </section>
  );
}
