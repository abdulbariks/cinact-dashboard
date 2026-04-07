"use client";

import React from "react";
import { usePathname } from "next/navigation";

import ChatSidebar from "@/components/chats/ChatSidebar";
import { cn } from "@/lib/utils";
import PlusIcon from "../icons/SuperAdmindashboard/PlusIcon";

type ChatsLayoutShellProps = {
  children: React.ReactNode;
};

export default function ChatsLayoutShell({ children }: ChatsLayoutShellProps) {
  const pathname = usePathname();
  const isChatRoute = /^\/dashboard\/chats\/\d+$/.test(pathname ?? "");

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden ">
      <div className="flex h-full min-h-0 flex-col ">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl text-[#E6E7E8] font-semibold ">Inbox</h2>
          <button className=" text-sm text-white font-medium flex items-center gap-3 p-3 bg-[#E9201D] rounded-[8px] cursor-pointer">
            <PlusIcon/>
            New Massage
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[415px_minmax(0,1fr)]">
          <div className={cn("min-h-0", isChatRoute ? "hidden lg:block" : "block")}>
          <ChatSidebar />
          </div>

          <div className={cn("min-h-0 min-w-0", isChatRoute ? "block" : "hidden lg:block")}>{children}</div>
        </div>
      </div>
    </div>
  );
}
