"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ChatMessage, getConversationById, messagesByUserId } from "@/components/chats/chat-data";
import { cn } from "@/lib/utils";
import CallIcon from "../icons/chats/CallIcon";
import VideoIcon from "../icons/chats/VideoIcon";
import WarningIcon from "../icons/chats/WarningIcon";
import PlusChatIcon from "../icons/chats/PlusChatIcon";
import ImageIcon from "../icons/chats/ImageIcon";
import MicIcon from "../icons/chats/MicIcon";
import EmojiIcon from "../icons/chats/EmojiIcon";

type ChatAreaProps = {
  chatId: number;
};

export default function ChatArea({ chatId }: ChatAreaProps) {
  const [draftMessage, setDraftMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<number, ChatMessage[]>>(() => ({
    ...messagesByUserId,
  }));
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedUser = getConversationById(chatId);
  const messages = chatMessages[chatId] ?? [];

  useEffect(() => {
    setDraftMessage("");
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <section className="flex min-h-[70vh] w-full items-center justify-center rounded-xl border bg-card text-card-foreground">
        <p className="text-sm text-muted-foreground">Conversation not found.</p>
      </section>
    );
  }

  const handleSendMessage = () => {
    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage) {
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((currentChatMessages) => ({
      ...currentChatMessages,
      [chatId]: [
        ...(currentChatMessages[chatId] ?? []),
        {
          id: Date.now(),
          sender: "me",
          text: trimmedMessage,
          time: formattedTime,
        },
      ],
    }));

    setDraftMessage("");
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[16px]      ">
      <div className=" bg bg-[#0a1929] px-4 py-3 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard/chats"
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted lg:hidden"
              aria-label="Back to conversations"
            >
              <span className="text-lg leading-none">←</span>
            </Link>
            <div className={`relative flex size-11 shrink-0 items-center justify-center rounded-full   bg-[#1a2336] text-sm font-semibold text-white ${selectedUser.status === "online" ? " border border-[#E9201D]" : "border-0 "}`}>
              {selectedUser.name
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
              {selectedUser.status === "online" ? (
                <span className="absolute bottom-1 right-1 size-1.5 rounded-full   bg-emerald-500" />
              ) : (
                <span className="absolute -bottom-1 -right-1 rounded-full border border-[#505B86]   px-1.5 py-0.5 text-[8px] text-[#00FA26]  leading-none shadow-sm whitespace-nowrap">
                  {selectedUser.lastActive ?? "Inactive"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base text-white font-medium sm:text-base">{selectedUser.name}</p>

            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className=" p-3 cursor-pointer hover:bg-[#45537b] rounded-xl">
              <CallIcon />
            </button>
            <button className=" p-3 cursor-pointer hover:bg-[#45537b] rounded-xl">
              <VideoIcon />
            </button>
            <button className=" p-3 cursor-pointer hover:bg-[#45537b] rounded-xl">
              <WarningIcon />
            </button>
          </div>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5 bg-[#07121d]">
        <div className="flex min-h-full flex-col justify-end space-y-1">
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const nextMessage = messages[index + 1];
            const hasPreviousFromSameSender = previousMessage?.sender === message.sender;
            const hasNextFromSameSender = nextMessage?.sender === message.sender;

            return (
              <div
                key={message.id}
                className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}
              >
                <div>
                  {!hasPreviousFromSameSender ? (
                    <p
                      className={cn(
                        "mb-1 text-[11px]",
                        message.sender === "me"
                          ? "text-right text-xs text-[#8C9196]"
                          : "text-left text-xs text-[#8C9196]"
                      )}
                    >
                      {message.time}
                    </p>
                  ) : null}
                  <div
                    className={cn(
                      "w-fit max-w-[85%] rounded-2xl px-3 py-2 text-sm sm:max-w-105",
                      message.sender === "me"
                        ? "bg-[#5f6ca0] text-base text-white"
                        : "bg-[#17212c] text-base text-[#B2B5B8]",
                      !hasPreviousFromSameSender && !hasNextFromSameSender
                        ? message.sender === "me"
                          ? "rounded-br-none"
                          : "rounded-bl-none"
                        : "",
                      message.sender === "me"
                        ? hasPreviousFromSameSender
                          ? "rounded-tr-none"
                          : ""
                        : hasPreviousFromSameSender
                          ? "rounded-tl-none"
                          : "",
                      message.sender === "me"
                        ? hasNextFromSameSender
                          ? "rounded-br-none"
                          : ""
                        : hasNextFromSameSender
                          ? "rounded-bl-none"
                          : ""
                    )}
                  >
                    <p className="whitespace-pre-wrap wrap-anywhere">{message.text}</p>

                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="  p-4 sm:p-5 bg-[#07121d]">


        <div className=" flex items-center gap-3">

          <button>
            <PlusChatIcon />
          </button>
          <button>
            <ImageIcon />
          </button>

          <div className=" flex-1 relative ">
            <button className=" absolute  right-4 top-1/2 -translate-y-1/2">

              <EmojiIcon />
            </button>
            <input
              type="text"
              name=""
              id=""
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              className=" w-full p-4  bg-[#0a1929] rounded-full placeholder:text-sm placeholder:text-[#8C9196] text-white"
              placeholder="Type message..."
            />
          </div>

          <button onClick={handleSendMessage}>
            <MicIcon />
          </button>


        </div>
      </div>


    </section>
  );
}
