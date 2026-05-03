import ChatArea from "@/components/chats/ChatArea";
import { notFound } from "next/navigation";
import React from "react";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function page({ params }: ChatPageProps) {
  const { chatId } = await params;
  // const normalizedChatId = chatIdParam?.trim();

  console.log(chatId);

  // if (!normalizedChatId || !/^\d+$/.test(normalizedChatId)) {
  //   notFound();
  // }

  // const chatId = Number(normalizedChatId);

  // if (Number.isNaN(chatId) || chatId < 1) {
  //   notFound();
  // }

  return <ChatArea chatId={chatId} />;
}
