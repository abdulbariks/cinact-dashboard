import GroupConversationDetails from "@/components/chats/GroupConversationDetails";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      <GroupConversationDetails groupId={id} />
    </div>
  );
}
