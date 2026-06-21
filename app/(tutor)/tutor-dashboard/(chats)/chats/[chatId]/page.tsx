import ChatArea from "@/components/Tutor/chats/ChatArea";
import React from "react";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function page({ params }: ChatPageProps) {
  const { chatId } = await params;

  return <ChatArea chatId={chatId} />;
}
