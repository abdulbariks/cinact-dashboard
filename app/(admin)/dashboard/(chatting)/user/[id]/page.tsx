import ConversationDetails from "@/components/chats/ConversationDetails";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      <ConversationDetails userId={id} />
    </div>
  );
}
