import ChatsLayoutShell from "@/components/Tutor/chats/ChatsLayoutShell";
import React from "react";

export default function TutorChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatsLayoutShell>{children}</ChatsLayoutShell>;
}
