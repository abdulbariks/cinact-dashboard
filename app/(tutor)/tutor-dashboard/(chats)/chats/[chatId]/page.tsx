import ChatArea from "@/components/Tutor/chats/ChatArea";
import { notFound } from "next/navigation";
import React from "react";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function page({ params }: ChatPageProps) {
  const { chatId } = await params;

  // console.log(chatId);

  return <ChatArea chatId={chatId} />;
}
