import ConversationDetails from "@/components/Tutor/chats/ConversationDetails";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatsDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      <ConversationDetails chatId={id} />
    </div>
  );
}
