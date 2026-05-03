"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CallIcon from "../../icons/chats/CallIcon";
import VideoIcon from "../../icons/chats/VideoIcon";
import WarningIcon from "../../icons/chats/WarningIcon";
import PlusChatIcon from "../../icons/chats/PlusChatIcon";
import ImageIcon from "../../icons/chats/ImageIcon";
import MicIcon from "../../icons/chats/MicIcon";
import EmojiIcon from "../../icons/chats/EmojiIcon";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import Image from "next/image";

type ChatAreaProps = {
  chatId: string;
};

export default function ChatArea({ chatId }: ChatAreaProps) {
  const [draftMessage, setDraftMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Replace this with your actual logged-in admin ID from your auth state/context
  const MY_ID = "cmm1euh120000kgqgmimhm6gf";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const res = await ChatsService.getConversationById({ id: chatId, token });

      console.log("res==========", res);

      setMessages(res?.data?.items || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
    setDraftMessage("");
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!draftMessage.trim()) return;

    // Local UI update (Optimistic UI)
    const newMessage = {
      id: Date.now().toString(),
      senderId: MY_ID,
      content: { text: draftMessage },
      createdAt: new Date().toISOString(),
      kind: "TEXT",
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraftMessage("");

    // API Call would go here:
    // ChatsService.sendMessage({ conversationId: chatId, text: draftMessage, ... })
  };

  const handleComposerKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="bg-[#0a1929] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard/chats" className="lg:hidden text-white">
              ←
            </Link>
            <div className="size-11 rounded-full bg-[#1a2336] flex items-center justify-center text-white font-bold border border-[#1F283D]">
              {/* Profile placeholder logic */}
              {messages[0]?.sender?.name?.slice(0, 2).toUpperCase() || "CH"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base text-white font-medium">
                {messages[0]?.sender?.name || "Conversation"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-3 hover:bg-[#45537b] rounded-xl transition-colors">
              <CallIcon />
            </button>
            <button className="p-3 hover:bg-[#45537b] rounded-xl transition-colors">
              <VideoIcon />
            </button>
            <button className="p-3 hover:bg-[#45537b] rounded-xl transition-colors">
              <WarningIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5 bg-[#07121d] custom-scrollbar">
        <div className="flex flex-col space-y-2">
          {isLoading ? (
            <p className="text-center text-[#5F6CA0] py-10">
              Loading messages...
            </p>
          ) : (
            messages.map((message, index) => {
              const isMe = message.senderId === MY_ID;
              const prevMsg = messages[index - 1];
              const isSameAsPrev = prevMsg?.senderId === message.senderId;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col",
                    isMe ? "items-end" : "items-start",
                  )}
                >
                  {!isSameAsPrev && (
                    <span className="text-[10px] text-[#5F6CA0] mb-1 px-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                  <div
                    className={cn(
                      "w-fit max-w-[85%] px-4 py-2 text-sm rounded-2xl",
                      isMe
                        ? "bg-[#5f6ca0] text-white rounded-tr-none"
                        : "bg-[#17212c] text-[#B2B5B8] rounded-tl-none",
                      isSameAsPrev &&
                        (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl"),
                    )}
                  >
                    {message.kind === "TEXT" ? (
                      <p className="whitespace-pre-wrap wrap-break-word">
                        {message.content?.text}
                      </p>
                    ) : message.kind === "IMAGE" ? (
                      <div className="relative size-60 rounded-lg overflow-hidden">
                        <Image
                          src={message.media_Url}
                          alt="chat-img"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 bg-[#07121d]">
        <div className="flex items-center gap-3">
          <button className="hover:opacity-80 transition-opacity">
            <PlusChatIcon />
          </button>
          <button className="hover:opacity-80 transition-opacity">
            <ImageIcon />
          </button>

          <div className="flex-1 relative">
            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <EmojiIcon />
            </button>
            <input
              type="text"
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={handleComposerKeyDown}
              className="w-full p-4 bg-[#0a1929] rounded-full placeholder:text-[#8C9196] text-white outline-none focus:ring-1 ring-[#5f6ca0]"
              placeholder="Type message..."
            />
          </div>

          <button
            onClick={handleSendMessage}
            className="hover:scale-110 transition-transform"
          >
            {draftMessage.trim() ? (
              <div className="bg-[#E9201D] p-2 rounded-full">
                <PlusChatIcon className="rotate-45" />
              </div>
            ) : (
              <MicIcon />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
